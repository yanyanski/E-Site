<?php

namespace App\Http\Controllers\AdminControllers;
use App\Http\Controllers\Controller;
use App\Models\ProductType;
use App\Models\ProductVariations;
use Illuminate\Http\Request;

class ProductTypeController extends Controller
{
    public function addProductType(Request $request) {
         $productTypeName = $request->get("product-type-name");

         // Update mode
        if($request->filled("id")) {
            $productTypeId = $request->get("id");
            try {

                // Check if the variant name being update is already in the database
                
                $productType = ProductVariations::find($productTypeId);

                if ($productType) {
                    $productType->update([
                        "product_type" => $productTypeName
                    ]);
                    return response()->json([
                        "status" => true,
                        "message" => "Variant {$productTypeName} was updated successfully.",
                        "data" => [
                            "type_id" => $productType->id,
                            "type_name" => $productType->product_type,
                            "type_ca" => $productType->created_at
                        ]
                    ]);
                } else {
                    return response() -> json([
                        "status" => false,
                        "message" => "Product Type ". $productTypeName . " does not exist in the database.",
                        "data" => null
                    ]);
                }
            } catch (\Exception $e) {
                return response() -> json([
                    "status" => false,
                    "message" => "Something went wrong while updating the variant. Error message: \n" . $e->getMessage()
                ]);
            }
        }


        // Insert mode
        try {
            $add = ProductType::create([
                "product_type" => $productTypeName
            ]);

            return response() -> json([
                "status" => true,
                "message" => "Variant " . $productTypeName. " was addedd successfully",
                "data" => [
                    "type_id" => $add->id,
                    "type_name" => $add->product_type,
                    "type_ca" => $add->created_at
                ]
            ]);

        } catch (\Exception $e) {
            return response() -> json([
                "status" => false,
                "message" => "The variant " .$productTypeName. " might already have been created. Error message: \n" . $e->getMessage()
            ]);
           
        }
    }
}
