<?php

namespace App\Http\Controllers\AdminControllers;

use App\Http\Controllers\Controller;
use App\Models\ProductAndCategories;
use App\Models\ProductAndVariation;
use App\Models\ProductImage;
use App\Models\ProductInfo;
use App\Models\Products;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
// use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function getProductIndex(Request $request){
        if ($request -> ajax()){

            return view("admin.products.product-list") -> render();
        } 
        return view("index", [
            "is_admin" => true,
            "content" => "admin_products"
        ]);
    }

    public function addProduct(Request $request)
    {
        
        // 2️⃣ Get specific text inputs
        $productName = $request->input('product_name');
        $productDescrription = $request->input("product_description");
        $productPrice = $request->input("product_price");
        $variationTitle = $request->input("variation_title");
        $is_active = $request->input("is_active");
        $categories = $request->input('categories'); // if sent as categories[]
        $variations = $request->input('variations'); // if sent as variations[]
        $productLink = $request->input("product_link");
        $productType = $request->input("product_type");

        // Add Product name to db
        $product = Products::create([
            "product_name" => $productName
        ]);

        DB::beginTransaction();

        try{
            $product_id = $product->id; 

            // 3️⃣ Get images (as UploadedFile instances)
            $images = $request->file('images');

            $productNameSafe = preg_replace('/[^A-Za-z0-9_\-]/', '_', $productName);
            $timestamp = now()->format("Ymd-His");
            $folder_name = "{$productNameSafe}_{$timestamp}";
            $folder_path = public_path("product-images/{$folder_name}");

            if (!file_exists($folder_path)) {
                mkdir($folder_path, 0775, true);
            }
            
            $imageData = [];
            $now = now();

            // Move images
            foreach ($images as $index => $image) {
                $extension = $image->getClientOriginalExtension() ?: 'jpg';
                $originalName = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
                $safeName = preg_replace('/[^A-Za-z0-9_\-]/', '-', $originalName);

                $filename = "{$safeName}_{$index}.{$extension}";
                

                $imageMimeType = $image->getMimeType();
                $imageSize = $image->getSize();

                // Move the file to the correct folder
                $image->move($folder_path, $filename);

                // Build relative path instead of absolute
                $relative_path = "product-images/{$folder_name}/{$filename}";

                $imageData[] = [
                    "image_path"     => $relative_path,
                    "image_alt"      => "{$productName}_{$index}",
                    "product_id"     => $product_id,
                    "file_extension" => $extension,
                    "mime_type"      => $imageMimeType,
                    "file_size"      => $imageSize,
                    "file_name"      => $safeName,
                    "created_at"     => $now,
                    "updated_at"     => $now,
                ];
            }

            ProductImage::insert($imageData);

            // Insert Product info
            $product_info = ProductInfo::create([
                "product_description" => $productDescrription,
                "product_price" => $productPrice,
                "is_active" => ($is_active) ? (1) : (0),
                "product_id" => $product_id,
                "product_link" => $productLink,
                "product_type_id" => $productType
            ]);

            // Insert product variations
            $variationData = collect($variations)->map(fn($variationId) => [
                'product_id' => $product_id,
                'variation_id' => $variationId,
                "created_at"     => $now,
                "updated_at"     => $now,
            ])->toArray();
            
            ProductAndVariation::insert($variationData);

            // Insert product categories
            $categoryData = collect($categories)->map(fn($categoryId) => [
                'product_id' => $product_id,
                'category_id' => $categoryId,
                "created_at"     => $now,
                "updated_at"     => $now,
            ])->toArray();
            
            ProductAndCategories::insert($categoryData);

            DB::commit();

            return response()->json([
                'status' => true,
                'received' => [
                    'name' => $productName,
                    'categories' => $categories,
                    'variations' => $variations,
                    'images_count' => is_array($images) ? count($images) : 0,
                ]
            ]);

        } catch(QueryException $e) {
            DB::rollBack();
            Products::destroy($product->id);

            return response() -> json([
                "status" => false,
                "message" => 'Something went wrong.' . $e->getMessage()
            ]);
        }

    }

    public function updateProduct(Request $request) {
        sleep(5);
        $prodId = $request->get('id', null);
        $updatedProductVariations = array_map('intval', $request->get("variants", []));
        $updatedProductCategories = array_map('intval', $request->get("categories", []));

        if(!$prodId) {
            return response() -> json([
                "status" => false,
                "message" => "No product has been selected. Please select a product and try again."
            ]);
        }
        // Start update
        try{
            DB::beginTransaction();

            // Get Product Data
            $product = Products::find((int)$prodId);

            if(!$product) {
                return response() -> json([
                    "status" => false,
                    "message" => "Can't find the product. Please try again later."
                ]);
            };

            // A message to be sent if ever something non-crucial went wrong while in product
            // update operation and sending the back a true status
            $successMssg = "";

            // Check if the product name has been changed
            $prodName = $product["product_name"];
            $submittedProdName = $request->get("product-name");
            $now = now();
            $timestamp = $now->format("Ymd-His");

            // -------------------- UPDATING IMAGES ------------
            // Get the path of the first image of the product
            $firstProdImage = ProductImage::where("product_id", ((int)$prodId))->first();

            $prodImagePath = $firstProdImage["image_path"];
            
            // Split the parts together using /
            $pathParts = explode("/", $prodImagePath);
            $folderName = $pathParts[1];
            $safeSubmittedProdname = preg_replace('/[^A-Za-z0-9_\-]/', '-', $submittedProdName);
            $newFoldername = "{$safeSubmittedProdname}_{$timestamp}";

            // Change product name if product name was updated
            if($prodName !== $submittedProdName) {
                // Change product name
                $product->update([
                    "product_name" => $safeSubmittedProdname
                ]);
                

                $oldPath = public_path("product-images/" . $folderName);

                // Check path and permissions
                if (!is_dir($oldPath)) {
                    throw new \Exception("Old image folder does not exist");
                }

                // Reflect changes
                $productImages = ProductImage::where("product_id", (int)$prodId) -> get();

                foreach($productImages as $index => $productImage){
                    $productImagePath = $productImage["image_path"];
                    
                    // split folder parts
                    $folderParts = explode("/", $productImagePath);
                    // $newFileName = $safeSubmittedProdname . "-" . $timestamp . "_" . $index . "." . $ext;
                    $productImage->update([
                        "image_path" => $folderParts[0] . '/' . $newFoldername . '/' . $folderParts[2]
                    ]);
                }

                $newPath = public_path("product-images/" . $newFoldername);
                $folderName = $newFoldername;

                if (!rename($oldPath, $newPath)) {
                    throw new \Exception("Failed to rename image folder");
                }
            }

            // Add new product image if user added new image
            $newImages = $request->file("newImages", []);
            if(count($newImages) !== 0) {
                
                // TODO Get the foldername from the database intead.
                
                $folder_path = public_path("product-images/" . $folderName);

                if (!file_exists($folder_path)) {
                    mkdir($folder_path, 0775, true);
                }
                $now = now();

                // Move images
                foreach ($newImages as $index => $image) {
                    $extension = $image->getClientOriginalExtension() ?: 'jpg';
                    $originalName = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
                    $safeName = preg_replace('/[^A-Za-z0-9_\-]/', '-', $originalName);

                    $filename = "{$safeName}_{$index}.{$extension}";

                    $imageMimeType = $image->getMimeType();
                    $imageSize = $image->getSize();

                    // Move the file to the correct folder
                    $image->move($folder_path, $filename);


                    // Build relative path instead of absolute
                    $relative_path = "product-images/{$folderName}/{$filename}";

                    $imageData[] = [
                        "image_path"     => $relative_path,
                        "image_alt"      => "{$prodName}_{$index}",
                        "product_id"     => $prodId,
                        "file_extension" => $extension,
                        "mime_type"      => $imageMimeType,
                        "file_size"      => $imageSize,
                        "file_name"      => $safeName,
                        "created_at"     => $now,
                        "updated_at"     => $now,
                    ];
                }
                ProductImage::insert($imageData);
            }

            // Check if images were deleted
            $removedImages = $request->get("deletedImages", []);
            if(count($removedImages) !== 0) {
                // Remove images
                $imageIds = array_map('intval', $removedImages);

                // Get image datas
                $removedProductImages = ProductImage::find($imageIds);

                $failedImageDeletion = [];
                

                foreach($removedProductImages as $removedImageData) {
                    // Delete the image
                    try{
                        $absPath = public_path($removedImageData["image_path"]);
                        if(!unlink($absPath)) {
                            array_push($failedImageDeletion, (int)$removedImageData['id']);
                        }
                    } catch (\Exception $e) {
                        array_push($failedImageDeletion, (int)$removedImageData['id']);
                        continue;
                    }
                }
                if(count($failedImageDeletion) !== 0) {
                    $imageIds = array_diff($imageIds, $failedImageDeletion);
                    $successMssg += "Warning: Some images were not deleted";
                }
                ProductImage::destroy($imageIds);
            }


            // ----------------- UPDATING VARIANTS -------
            // Get all product variants
            $existingProdVariationIds = ProductAndVariation::where("product_id", (int)$prodId) 
                                        -> pluck("variation_id")
                                        -> map('intval')
                                        ->toArray();

                                        
            $newProductVariations = array_diff($updatedProductVariations, $existingProdVariationIds);
            $removedProductVariations = array_diff($existingProdVariationIds, $updatedProductVariations);

            if(count($newProductVariations) !== 0) {
                $insertData = array_map(fn($x) => [
                    "product_id" => (int) $prodId,
                    "variation_id" => $x,
                    "created_at" => $now,
                    "updated_at" => $now
                ], $newProductVariations);
                ProductAndVariation::insert($insertData);
            }

            if(count($removedProductVariations) !== 0){
                ProductAndVariation::where('product_id', (int)$prodId)
                    ->whereIn('variation_id', $removedProductVariations)
                    ->delete();
            }

            // --------------------------UPDATING CATEGORIES-------------------
             // Get all product variants
            $existingProdCategoryIds = ProductAndCategories::where("product_id", (int)$prodId) 
                                        -> pluck("category_id")
                                        -> map('intval')
                                        ->toArray();

                                        
            $newProductCategories = array_diff($updatedProductCategories, $existingProdCategoryIds);
            $removedProductCategories = array_diff($existingProdCategoryIds, $updatedProductCategories);

            if(count($newProductCategories) !== 0) {
                $insertData = array_map(fn($x) => [
                    "product_id" => (int) $prodId,
                    "category_id" => $x,
                    "created_at" => $now,
                    "updated_at" => $now
                ], $newProductCategories);
                ProductAndCategories::insert($insertData);
            }

            if(count($removedProductCategories) !== 0){
                ProductAndCategories::where('product_id', $prodId)
                    ->whereIn('category_id', $removedProductCategories)
                    ->delete();
            }
            // ------------------- UPDATING Product Info ---------------
            $productInfo = ProductInfo::where("product_id", (int)$prodId) -> first();
            if($productInfo) {
                // Update product info
                
                $productInfo->product_type_id = (int) $request->get("type", 0);
                $productInfo->product_description = $request->get("product-description", "");
                $productInfo->product_price = (int) $request->get("product-price", 0);
                $productInfo->is_active = (int) $request->get("is-active", 1);
                $productInfo->product_link = $request->get("product-link", "");
                $productInfo->updated_at = $now;
                $productInfo->save();
            }

            Db::commit();
                
            return response() -> json([
                "status" => true,
                "message" => ""
            ]);

        } catch (\Exception $e) {
            Db::rollBack();
            return response() -> json([
                "status" => false,
                "message" => $e->getMessage()
            ]);
        }
      
    }

}
