<?php

namespace App\Http\Controllers\AdminControllers;

use App\Http\Controllers\Controller;
use App\Models\ProductCategories;
use Illuminate\Http\Request;

class ProductCategoryController extends Controller
{
    public function addCategory(Request $request) {
        $category_name = $request->get("category-name");

        // Update mode
        if($request->filled("id")) {
            $category_id = $request->get("id");
            try {
                $category = ProductCategories::find($category_id);

                if ($category) {
                    $category->update([
                        "category_name" => $category_name
                    ]);
                    return response()->json([
                        "status" => true,
                        "message" => "Category {$category_name} was updated successfully.",
                        "data" => [
                            "cat_id" => $category->id,
                            "cat_name" => $category->category_name,
                            "cat_ca" => $category->created_at
                        ]
                    ]);
                } else {
                    return response() -> json([
                        "status" => false,
                        "message" => "Category ". $category_name . " does not exist in the database.",
                        "data" => null
                    ]);
                }
            } catch (\Exception $e) {
                return response() -> json([
                    "status" => false,
                    "message" => "Something went wrong while updating the category. Error message: \n" . $e->getMessage()
                ]);
            }
        } 
        
        // Insert mode
        try {
            if($request->filled("category-name")) {

                $add = ProductCategories::create([
                    "category_name" => $category_name
                ]);

                return response() -> json([
                    "status" => true,
                    "message" => "Category " . $category_name. " was addedd successfully",
                    "data" => [
                        "cat_id" => $add->id,
                        "cat_name" => $add->category_name,
                        "cat_ca" => $add->created_at
                    ]
                ]);
            } else {
                return response() -> json([
                    "status" => false,
                    "message" => "Please provide a category name"
                ]);
            }

        } catch (\Exception $e) {
            return response() -> json([
                "status" => false,
                "message" => "The category " .$category_name. " might already have been created. Error message: \n" . $e->getMessage()
            ]);
           
        }
    }
}
