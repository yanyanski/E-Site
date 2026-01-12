import { ScrollUtility } from "../../../../../packages/utilities";
import { YanexCustomModalEvents } from "../../../../../packages/widgets/yanexWidgetPackages/yanexCustomModal";
import { ProductTypeListBundle } from "../../../productType/productTypeList/productTypeListBundle";
import { ProductTypeListRef, ProductTypeListStorage } from "../../../productType/productTypeList/productTypeListRef";
import { ProductListRef, ProductListStorage } from "../productListRef";
import { SelectProductAttrFactory } from "../selectProductAttr/selectProductAttrHelper";
import { SelectProductTypeFactory } from "./selectProductTypeHelper";
import { SelectProductTypeRecord } from "./selectProductTypeRecord";
import { SelectProductTypeRef } from "./selectProductTypeRef";


export class SelectProductTypeBundle {

    public static async initialize(selectedType: number): Promise<void> {
        if(!SelectProductTypeRef.initialized) {

            SelectProductTypeRef.initialized = true;
            SelectProductTypeFactory.createModal();

            // Fetch product types if it was still not yet fetched
            if(!ProductTypeListRef.initialized &&
                Object.keys(ProductTypeListStorage.productTypes).length === 0 ) {
                SelectProductTypeRef.treeview.addLoadingRow();
                await ProductTypeListBundle.getProductTypes();
                SelectProductTypeRef.treeview.hideLoadingRow();
            }
            for(const productType of Object.values(ProductTypeListStorage.productTypes)) {
                console.log(productType)
                SelectProductTypeRef.treeview.addRow([
                    productType["type_id"],
                    productType["type_name"]
                ])
            }
        }
        
        SelectProductTypeRef.modal.show();
    }
}

export class SelectProductTypeEvents {
    public static modalClose(event: YanexCustomModalEvents | null = null): void {
        ProductListRef.productShowModal!.show(null, true);
        ScrollUtility.applyScroll(ProductListRef.productFieldMainContainer!.widget);

    }
    public static modalButtonsClicked(event: PointerEvent): void {
        const target = event.target as HTMLButtonElement;
        switch(target.textContent) {
            case SelectProductTypeRecord.modalButtons["select"]:
                const typeData = SelectProductTypeRef.treeview.getActivatedRowData();
                console.log(typeData)
                // Update shown product type
                ProductListRef.productTypeLabel!.text = typeData[0]["Type"] || "None"

                // Update selected product type id 
                ProductListStorage.productType = parseInt(typeData[0]["Id"] || 0)
                
                SelectProductTypeRef.modal.close()
                SelectProductTypeEvents.modalClose()
                break;
            case SelectProductTypeRecord.modalButtons["cancel"]:
                SelectProductTypeRef.modal.close()
                SelectProductTypeEvents.modalClose()
                break;
        }
    }
}