<?php

namespace App\Http\Controllers;

use App\Models\ProductCategories;
use App\Models\Products;
use App\Models\ProductType;
use App\Models\ProductVariations;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PublicController extends Controller
{   
    private static $columns = [
                "info:product_id,product_description as prod_info_desc,product_price as prod_info_price,is_active as prod_info_active,product_link as prod_info_link",
                'images:id as prod_image_big_id,product_id,image_path as prod_image_url,image_alt as prod_image_alt',
                "variations:id as prod_var_big_int,variation_title as prod_var_title",
                "categories:id as prod_cat_big_int,category_name as prod_cat_name",
                "type:product_types.id as prod_type_big_int,product_types.product_type as prod_type_name"

            ];


    // PRODUCTS
    public function getVariants() {
        $variations =  ProductVariations::all([
            "id as var_id",
            "variation_title as var_title",
            "created_at as var_ca" 
        ]);

        return response() -> json($variations);
    }

    public function getCategories(){
        $categories = ProductCategories::all([
            "id as cat_id",
            "category_name as cat_name",
            "created_at as cat_ca",
        ]);
        return response() -> json($categories);
    }

    
    public function getProductTypes(){
        $types = ProductType::all([
            "id as type_id",
            "product_type as type_name",
            "created_at as type_ca"
        ]);
        return response() -> json($types);
    }

    public function searchProduct(Request $request) {
        try {
           $keyword    = $request->get('keyword', '');
            $fetchedIds = array_map('intval', (array) $request->get('fetchedIds', []));
            $cursor     = $request->get('cursor');

            $query = Products::with(self::$columns)
                ->select('id', 'product_name as name', 'created_at')
                ->where('product_name', 'LIKE', "%{$keyword}%")
                ->orderBy('id');

            if ($cursor) {
                $query->where('id', '>', $cursor);
            }

            $products = $query->limit(10)->get();

            $pastFetchedIds = [];
            $newProducts = $products;

            if (!empty($fetchedIds)) {
                $newProducts = [];
                foreach($products as $index => $product){
                    if(in_array($product->id, $fetchedIds, true)) {
                        $pastFetchedIds[$index] = $product->id;
                    } else {
                        $newProducts[$index] = $product;
                    }
                }
                // $newProducts = $products
                //     ->reject(function ($product) use ($fetchedIds, &$pastFetchedIds) {
                //         if (in_array($product->id, $fetchedIds, true)) {
                //             $pastFetchedIds[] = $product->id;
                //             return true;
                //         }
                //         return false;
                //     });
            }

            return response()->json([
                'status'     => true,
                'data'       => (object) $newProducts,
                'fetchedIds' => (object) $pastFetchedIds,
                'cursor'     => optional($products->last())->id,
            ]);

        } catch(Exception $e) {
            return response() -> json([
                "status" => false,
                "message" => "Something went wrong." . $e->getMessage()
            ]);
        }
    }

    public function getProductList(Request $request) {
        // sleep(5);
        try{
            $page = $request->get("page", 1);
            $paginate = $request->get("paginate", 10);

            
            
            if($page === 1) {
                $products = Products::with(self::$columns)
                    ->select('id', 'product_name as name', 'created_at')
                    ->paginate($paginate, ["*"], "page", $page);
            } else {
                $products = Products::with(self::$columns)
                    ->select('id', 'product_name as name', 'created_at')
                    ->simplePaginate($paginate, ["*"], "page", $page);
            }

            return response() -> json([
                "paginatedData" => $products,
                "status" => true,
            ]);
        } catch(Exception $e) {
            Log::info($e);
            return response() -> json([
                "status" => false,
                "message" => "Something went wrong."
            ]);
        }

    }

    // ICONS
    public function getIcons(Request $request) {
        //
         $icons = $request->input('images', []);

        $result = [];

        foreach ($icons as $icon) {
            $path = public_path("icons/$icon");

            if (file_exists($path)) {
                $mime = mime_content_type($path);
                $data = base64_encode(file_get_contents($path));

                $result[$icon] = "data:$mime;base64,$data";
            } else {
                $result[$icon] = null; // file not found
            }
        }

        return response()->json($result);
    }

}
