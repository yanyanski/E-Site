import { MessageModals } from "../../../../../packages/factories";
import { ProductTypeListBundle } from "../../../productType/productTypeList/productTypeListBundle";
import { ProductTypeListStorage } from "../../../productType/productTypeList/productTypeListRef";
import { ProductTypeSectionRef } from "./productTypeSectionRef";



export default class ProductTypeSectionBundle {
    
    public static async initialize(): Promise<void> {
        // Check if the user has not yet fetched the productTypes from the productTypes list
        if(
            Object.keys(ProductTypeListStorage.productTypes).length === 0 &&
            ProductTypeSectionRef.initialized === false
        ) {     
            if(ProductTypeSectionRef.productProductTypesTreeview) {
                ProductTypeSectionRef.productProductTypesTreeview.addLoadingRow();
            }

            // Get the productTypes if user has not yet fetched it from db
            const productType = await ProductTypeListBundle.getProductTypes()

            if(productType.responseStatus) {
                ProductTypeSectionRef.initialized = true;

            } else {
                new MessageModals(`Error: ${productType.message}`)
            }
            
            if(ProductTypeSectionRef.productProductTypesTreeview) {
                ProductTypeSectionRef.productProductTypesTreeview.hideLoadingRow();
            }
        }
        console.log(Object.values(ProductTypeListStorage.productTypes), ProductTypeListStorage.productTypes)
        for(const varData of Object.values(ProductTypeListStorage.productTypes)) {
            console.log(varData)
            ProductTypeSectionRef.productProductTypesTreeview!.addRow([
                varData.type_id, varData.type_name
            ])
        }
    }
}