import { IconsBundle } from "../../../../icons/iconsBundle";
import { IconsHelperRequest } from "../../../../icons/iconsHelper";
import { YanexDiv } from "../../../../packages/widgets/yanexWidgets";
import { AdminRefs } from "../../../adminRef";
import { AddProductFactory } from "./addProductHelper";
import { AddProductRecord } from "./addProductRecord";
import { AddProductRef } from "./addProductRef";
import { FinalizeProductBundle } from "./finalizeProduct/finalizeProductBundle";
import ProductCategorySectionBundle from "./productCategorySection/productCategorySectionBundle";
import { ProductNameSectionHelper } from "./productNameSection/productNameSectionHelper";
import { ProductNameSectionRecord } from "./productNameSection/productNameSectionRecord";
import ProductTypeSectionBundle from "./productTypeSection/productTypeSectionBundle";
import ProductVariantSectionBundle from "./productVariantSection/productVariantSectionBundle";



export class AddProductBundle {

    public static async initialize(): Promise<void> {


        if(!AddProductRef.initialized) {
            AddProductFactory.createAddProductUi(AdminRefs.adminContentContainer as YanexDiv);

            ProductVariantSectionBundle.initialize();
            ProductCategorySectionBundle.initialize();
            ProductTypeSectionBundle.initialize();
            
            // Get Icons
            await IconsHelperRequest.getImageIcons(AddProductRecord.addProductIcons)
            IconsBundle.setElementIcons(AddProductRef.addProductParentContainer!)
            
            AddProductRef.initialized = true;
        } else {
            if(AddProductRef.addProductParentContainer) {
                AddProductRef.addProductParentContainer.show();

            }
        }
    }

}
export class AddProductEvents{
    
    public static contentChanged(event: Event): void {
        const slider = AddProductRef.addProductSlider;

        if(slider) {
            const activeContent = slider.active;

            if(activeContent === "Finalize") {
                FinalizeProductBundle.checkNeededInformations();
                FinalizeProductBundle.finalizeShownInfo();
            }
        }
    }
}