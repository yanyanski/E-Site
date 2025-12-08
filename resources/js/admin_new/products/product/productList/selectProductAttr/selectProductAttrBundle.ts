import { ProductListRef, ProductListStorage } from "../productListRef";
import { SelectProductAttrFactory } from "./selectProductAttrHelper";
import { SelectProductAttrRef } from "./selectProductAttrRef";
import { ScrollUtility } from "../../../../../packages/utilities";
import { YanexCustomModalEvents } from "../../../../../packages/widgets/yanexWidgetPackages/yanexCustomModal";


export class SelectProductAttrBundle{
    
    public static initialize(treeviewValues: Array<Array<string>>, dataType: "category" | "variant" | "type"): void {
        if(!SelectProductAttrRef.initialized) {
            SelectProductAttrFactory.createSelectionModal();

            SelectProductAttrRef.initialized = true;
        }
        SelectProductAttrRef.attrMode = dataType;
        SelectProductAttrRef.attrTreeview!.deleteRow("all");
        if(treeviewValues) {
            let searchStorage: Record<string, number>;
            switch(dataType) {
                case "category":
                    searchStorage = ProductListStorage.productCategory;
                    break;
                case "variant": 
                    searchStorage = ProductListStorage.productVariants;
                    break;
                    
            }

            for(const value of treeviewValues) {
                const valueTitle = value[1];
                if(valueTitle && searchStorage![valueTitle]) continue;
                SelectProductAttrRef.attrTreeview!.addRow(value)
            }
        }

        SelectProductAttrRef.attrModal!.show(null, true);
    }
}

export class SelectProductEvents {
    public static attrModelButtonsClicked(event: PointerEvent): void {
        const el = event.target as HTMLButtonElement;
        const currentMode = SelectProductAttrRef.attrMode
        switch(el.textContent){
            case "Add":
                let listBox;
                const treeview = SelectProductAttrRef.attrTreeview;
                const selected = treeview!.getActivatedRowData();
                console.log(selected, "SELECTED")
                switch(currentMode) {
                    case "category":
                        listBox = ProductListRef.productCategoryListBox;
                        for(const value of selected) {
                            ProductListRef.productCategoryListBox!.addValue(value["Value"]);
                            ProductListStorage.productCategory[value["Value"]] = value["Id"]
                        }
                        break;
                    case "variant":
                        for(const value of selected) {
                            ProductListRef.productVariantListBox!.addValue(value["Value"]);
                            ProductListStorage.productVariants[value["Value"]] = value["Id"]
                        }
                        break;
                }

                break;

        }

        SelectProductAttrRef.attrModal!.close()
        // Show the original product modify modal
        ProductListRef.productShowModal!.show(null, true)
        ScrollUtility.applyScroll(ProductListRef.productFieldMainContainer!.widget);

    }

    public static attrModelClosed(event: YanexCustomModalEvents): void {
        ProductListRef.productShowModal!.show(null, true);
        ScrollUtility.applyScroll(ProductListRef.productFieldMainContainer!.widget);
    }

}