import { MessageModals } from "../../../../../packages/factories";
import { VariantListBundle } from "../../../../variants/variantList/variantListBundle";
import { VariantListStorage } from "../../../../variants/variantList/variantListRef";
import { ProductVariantSectionRef } from "./productVariantSectionRef";


export default class ProductVariantSectionBundle {
    
    public static async initialize(): Promise<void> {
        // Check if the user has not yet fetched the variants from the variants list
        if(
            Object.keys(VariantListStorage.variants).length === 0 &&
            ProductVariantSectionRef.initialized === false
        ) {     
            if(ProductVariantSectionRef.productVariantsTreeview) {
                ProductVariantSectionRef.productVariantsTreeview.addLoadingRow();
            }

            // Get the variants if user has not yet fetched it from db
            const variant = await VariantListBundle.getVariants()

            if(variant.responseStatus) {
                const variantData = variant.data;
                if(variantData && ProductVariantSectionRef.productVariantsTreeview) {
                    for(const varData of variantData) {
                        ProductVariantSectionRef.productVariantsTreeview.addRow([
                            varData.var_id, varData.var_title
                        ])
                    }
                }
                ProductVariantSectionRef.initialized = true;

            } else {
                new MessageModals(`Error: ${variant.message}`)
            }
            
            if(ProductVariantSectionRef.productVariantsTreeview) {
                ProductVariantSectionRef.productVariantsTreeview.hideLoadingRow();
            }

        }
       
    }
}