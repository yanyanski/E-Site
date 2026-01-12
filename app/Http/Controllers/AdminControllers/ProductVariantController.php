<?php

namespace App\Http\Controllers\AdminControllers;

use App\Http\Controllers\Controller;
use App\Models\ProductVariations;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductVariantController extends Controller
{
    public function addVariant(Request $request) {
        $variant_name = $request->get("variant-name");

        // Update mode
        if($request->filled("id")) {
            $variant_id = $request->get("id");
            try {

                // Check if the variant name being update is already in the database
                
                $variant = ProductVariations::find($variant_id);

                if ($variant) {
                    $variant->update([
                        "variation_title" => $variant_name
                    ]);
                    return response()->json([
                        "status" => true,
                        "message" => "Variant {$variant_name} was updated successfully.",
                        "data" => [
                            "var_id" => $variant->id,
                            "var_title" => $variant->variation_title,
                            "var_ca" => $variant->created_at
                        ]
                    ]);
                } else {
                    return response() -> json([
                        "status" => false,
                        "message" => "Variant ". $variant_name . " does not exist in the database.",
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
            $add = ProductVariations::create([
                "variation_title" => $variant_name
            ]);

            return response() -> json([
                "status" => true,
                "message" => "Variant " . $variant_name. " was addedd successfully",
                "data" => [
                    "var_id" => $add->id,
                    "var_title" => $add->variation_title,
                    "var_ca" => $add->created_at
                ]
            ]);

        } catch (\Exception $e) {
            return response() -> json([
                "status" => false,
                "message" => "The variant " .$variant_name. " might already have been created. Error message: \n" . $e->getMessage()
            ]);
           
        }
    }
}
