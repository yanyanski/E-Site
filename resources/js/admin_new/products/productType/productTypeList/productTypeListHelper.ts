import { Strings } from "../../../../packages/datatypeHelpers";
import { DataStatusReturnType } from "../../../../packages/interfaces";
import { FetchUtilityRawProcessedResponse } from "../../../../packages/typing";
import { FetchUtility } from "../../../../packages/utilities";
import YanexTreeview from "../../../../packages/widgets/yanexWidgetPackages/yanexTreeview";
import { YanexButton, YanexDiv, YanexForm, YanexHeading } from "../../../../packages/widgets/yanexWidgets";
import { PublicLinks, PublicStringValues } from "../../../../public";
import { AdminRefs } from "../../../adminRef";
import { ProductListRecord } from "../../product/productList/productListRecord";
import { ProductTypesRefs } from "../productTypeRef";
import { ProductTypeListEvents } from "./productTypeListBundle";
import { ProductTypeListLinks, ProductTypeListRecord, ProductTypeNavButtons } from "./productTypeListRecord";
import { ProductTypeListRef, ProductTypeListStorage } from "./productTypeListRef";



export class ProductTypeListFactory{

    public static createProductTypesList(): void{
        const yanexContainer = new YanexDiv(AdminRefs.adminContentContainer, {
            bg:"lighterBg",
            className: "w-full h-full overflow-y-auto scroll-modern"
        })
        ProductTypeListRef.productTypeListParent = yanexContainer;
        // Create intro
        new YanexHeading(yanexContainer, "h1", {
            text:ProductTypeListRecord.updateProductTypeIntro.title,
            className:"font-bold text-lg pt-2 pl-2",
            
        }, {
            textAlignment: "w"
        })

        // Create intro
        new YanexHeading(yanexContainer, "h6", {
            text:ProductTypeListRecord.updateProductTypeIntro.message,
            className:"pl-2 text-sm",
            fg:"lighterFg",
            
        }, {
            textAlignment: "w"
        })

        // Create nav bar
        const productTypeListNav = new YanexDiv(yanexContainer, {
            bg:"lighterBg",
            className: "w-full flex gap-2 items-center justify-end py-2 px-2"
        })

        for(const productTypeNavButton of ProductTypeListRecord.productTypeNavButtons) {
            const button = new YanexButton(productTypeListNav, {
                className: "rounded px-3 py-1 flex",
                text:productTypeNavButton,
                hoverBg:"extraBg"
            })
            button.addDataset(PublicStringValues.widgetIconDataSetTitle, ProductTypeListRecord.productTypeNavButtonsIcons[productTypeNavButton]);
            
            ProductTypeListRef.productTypeNavButtons[productTypeNavButton] = button;
        }


        const yanexTreeview = new YanexTreeview(null, 
            ProductTypeListRecord.yanexTreeviewColumns, {
                selectMode: "browse",
                noRowText: "No Product Types Were Created. Create one by clicking \"Add Product Type\""
            });
        ProductTypeListRef.productTypeTreeview = yanexTreeview;
    }

        public static addProductTypeListButtons(form: YanexForm): void {
            for (const button of ProductTypeListRecord.updateProductTypeFieldButtons) {
                const butt = new YanexButton(form, {
                    text:button,
                    className:"py-2 rounded",
                });
                (butt.widget as HTMLButtonElement).type = "button";
                butt.addEventListener("click", (e) => {ProductTypeListEvents.productTypeListFormButtonListener(e)})
            }
        }

            public static addSubmittingStatus(): void {
                if(ProductTypeListRef.productTypeListForm) {
                    const container = new YanexDiv(ProductTypeListRef.productTypeListForm, {
                        className: "flex gap-1 hidden",
                        bg:'extraBg'
                    })
        
                    new YanexDiv(container, {
                        className: "animate-spin w-[20px] h-[20px] rounded-sm",
                        bg:"specialColorBg"
                    })
        
                     new YanexHeading(container, "h1", {
                        text: "Updating",
                        fg:"lighterFg"
                    })
                    ProductTypeListRef.loadingContainer = container;
                }
            }
    
}

export class ProductTypeListHelper {
    /**
     * Save the productTypes that was fetched from the database
     */
    public static saveProductTypes(productTypesData: Record<number, Record<string, any>> | null): void {
        console.log("SAVE", productTypesData)
        if(productTypesData) {
            for(const productTypeData of Object.values(productTypesData)) {
                ProductTypeListStorage.productTypes[productTypeData.type_id] = productTypeData;
            }
        }

    }
    public static clearProductTypeFields(): void {
        for(const yanex of Object.values(ProductTypesRefs.updateProductTypesFields)){
            yanex.value = ""
        }
    }


    /**
    * Populate the productType list treeview
     */
    public static populateProductTypeTreeview(productTypes: Array<Record<string, any>>): void {
        console.log("PROD DTPY", productTypes)
        if(productTypes) {
            if(ProductTypeListRef.productTypeTreeview) {
                for(const productTypeData of productTypes) {
                    ProductTypeListRef.productTypeTreeview.addRow([
                        productTypeData.type_id,
                        productTypeData.type_name
                    ])
                }
            }
        }

    }

    /**
     * Add event listener to the productTypes buttons
     */
    public static addProductTypeButtonsEventListener(): void {
        for (const [productTypeButtonText, yanexButton] of Object.entries(ProductTypeListRef.productTypeNavButtons)) {
            switch(productTypeButtonText as ProductTypeNavButtons) {
                case "Update Product Type":
                    yanexButton.addEventListener("click", (e: PointerEvent) => {ProductTypeListEvents.productTypeListNavButtonListener(e)})
            }
        }
    }

    /**
     * Get the productType selected
     */
    public static getSelectedProductTypeData(): Array<Record<string, any>> | null{
        const treeview = ProductTypeListRef.productTypeTreeview;
        if(treeview) {
            const data = treeview.getActivatedRowData();
            return data;
        }
        return null
    }

    /**
     * Get the submitted productType data
     */
    public static getSubmittedProductTypeData(): Record<string, any> | null {
        if(ProductTypeListRef.productTypeTreeview) {
            const rowData = ProductTypeListRef.productTypeTreeview.getActivatedRowData("kebabcase");
            if(rowData.length > 0) {
                return rowData[0]
            }
        }

        return null
    }

    /**
     * Check submitted productType
     */
    public static checkSubmittedProductType(): DataStatusReturnType {
        const submittedData = ProductTypeListHelper.getSubmittedProductTypeData();
        if(submittedData) {
            // Get the data written by user
            if(ProductTypeListRef.productTypeListForm) {
                const formData = new FormData(ProductTypeListRef.productTypeListForm.widget as HTMLFormElement);

                Object.assign(submittedData, Object.fromEntries(formData))

                for (const [dataKey, dataValue] of Object.entries(submittedData)) {
                    if(dataValue === "") {
                        return {
                            data: submittedData,
                            status: false,
                            message: `The field ${Strings.convertCase(dataKey, "kebabcase", true, "title")} is required.`
                        }
                    }
                }

                return {
                    data: submittedData,
                    status: true,
                    message: ""
                }
            }

        }
        return {
            data:null,
            status: false,
            message: "Please select a productType to be updated in the treeview"
        }
    }

    /**
     * Add a listener to the treeview rows
     */
    public static addProductTypeTreeviewSelectedEvent(): void{

        const treeview = ProductTypeListRef.productTypeTreeview;
        if(treeview){
            treeview.addEventListener("rowSelect", ProductTypeListEvents.productTypeTreeviewRowSelected);
            treeview.addEventListener("rowDeselect", ProductTypeListEvents.productTypeTreeviewRowDeselected)
        }
    }

    /**
     * Disable/Enable nav buttons state
     * @param state If true, enable the nav buttons. Otherwise, disable.
     */
    public static setNavButtonsState(state: boolean){

        for(const [buttonKey, button] of Object.entries(ProductTypeListRef.productTypeNavButtons)) {
            button.setState(state)
        }
    }
}

export class ProductTypeListRequests{
    public static async getProductProductTypes(): Promise<FetchUtilityRawProcessedResponse> {
        const fetchUtil = new FetchUtility("GET", "json");
        const response = await fetchUtil.start(PublicLinks.GETPRODUCTYPES);
        return fetchUtil.processResponse(response);
    }

    public static async updateProductType(payload: Record<string, any>): Promise<FetchUtilityRawProcessedResponse>{
        const fetchUtil = new FetchUtility("POST", "json", payload, "json");
        const response = await fetchUtil.start(ProductTypeListLinks.updateProductTypeLink);
        return fetchUtil.processResponse(response);
    
    }
}