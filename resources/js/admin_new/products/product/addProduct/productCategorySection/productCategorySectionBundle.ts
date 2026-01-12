import { MessageModals } from "../../../../../packages/factories";
import { CategoryListBundle } from "../../../../category/categoryLists/categoryListBundle";
import { CategoryListStorage } from "../../../../category/categoryLists/categoryListRef";
import { ProductCategorySectionRef } from "./productCategorySectionRef";



export default class ProductCategorySectionBundle {
    
    public static async initialize(): Promise<void> {
        // Check if the user has not yet fetched the categories from the categories list
        if(
            Object.keys(CategoryListStorage.categorys).length === 0 &&
            ProductCategorySectionRef.initialized === false
        ) {     
            if(ProductCategorySectionRef.productCategorysTreeview) {
                ProductCategorySectionRef.productCategorysTreeview.addLoadingRow();
            }

            // Get the categories if user has not yet fetched it from db
            const category = await CategoryListBundle.getCategorys()

            if(category.responseStatus) {
                ProductCategorySectionRef.initialized = true;

            } else {
                new MessageModals(`Error: ${category.message}`)
            }
            
            if(ProductCategorySectionRef.productCategorysTreeview) {
                ProductCategorySectionRef.productCategorysTreeview.hideLoadingRow();
            }
        }
        for(const varData of Object.values(CategoryListStorage.categorys)) {
            ProductCategorySectionRef.productCategorysTreeview!.addRow([
                varData.cat_id, varData.cat_name
            ])
        }
    }
}