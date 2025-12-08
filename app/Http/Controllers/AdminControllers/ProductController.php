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
use Illuminate\Support\Facades\Log;

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
            
            Log::info($imageData);

            // Insert Product info
            $product_info = ProductInfo::create([
                "product_description" => $productDescrription,
                "product_price" => $productPrice,
                "is_active" => ($is_active) ? (1) : (0),
                "product_id" => $product_id,
                "product_link" => $productLink,
                "product_type_id" => $productType
            ]);
            Log::info($product_info);

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
            Log::info("WENTWRONG {$e}");
            DB::rollBack();
            Products::destroy($product->id);

            return response() -> json([
                "status" => false,
                "message" => 'Something went wrong.' . $e
            ]);
        }
        // TODO: Figure out how to delete the product name saved in the db after rollback.
        // TODO: Send back only the error message from the db if something went wrong while
        // updating database
    }

}
