import { Strings } from "../../../packages/datatypeHelpers";
import { DataStatusReturnType, StatusReturnType } from "../../../packages/interfaces";
import { FetchUtilityRawProcessedResponse } from "../../../packages/typing";
import { FetchUtility } from "../../../packages/utilities";
import YanexTreeview from "../../../packages/widgets/yanexWidgetPackages/yanexTreeview";
import { YanexButton, YanexDiv, YanexForm, YanexHeading } from "../../../packages/widgets/yanexWidgets";
import { PublicLinks, PublicStringValues } from "../../../public";
import { AdminRefs } from "../../adminRef";
import { VariantRefs } from "../variantsRef";

import { VariantListEvents } from "./variantListBundle";
import { VariantListLinks, VariantListRecord, VariantNavButtons } from "./variantListRecord";
import { VariantListRef, VariantListStorage } from "./variantListRef";


export class VariantListFactory{

    public static createVariantsList(): void{
        const yanexContainer = new YanexDiv(AdminRefs.adminContentContainer, {
            bg:"lighterBg",
            className: "w-full overflow-y-auto scroll-modern h-full"
        })
        VariantListRef.variantListParent = yanexContainer;
        // Create intro
        new YanexHeading(yanexContainer, "h1", {
            text:VariantListRecord.updateVariantIntro.title,
            className:"font-bold text-lg pt-2 pl-2"
        }, {
            textAlignment: "w"
        })

        // Create intro
        new YanexHeading(yanexContainer, "h6", {
            text:VariantListRecord.updateVariantIntro.message,
            className:"pl-2 text-sm",
            fg:"lighterFg",
            
        }, {
            textAlignment: "w"
        })

        // Create nav bar
        const variantListNav = new YanexDiv(yanexContainer, {
            bg:"lighterBg",
            className: "w-full flex gap-2 items-center justify-end py-2 px-2"
        })

        for(const variantNavButton of VariantListRecord.variantNavButtons) {
            const button = new YanexButton(variantListNav, {
                className: "rounded px-3 py-1 flex",
                text:variantNavButton,
                hoverBg:"extraBg"
            }, {
                state: false
            })
            button.addDataset(PublicStringValues.widgetIconDataSetTitle, VariantListRecord.variantNavButtonsIcons[variantNavButton]);

            VariantListRef.variantNavButtons[variantNavButton] = button;
        }


        const yanexTreeview = new YanexTreeview(null, 
            VariantListRecord.yanexTreeviewColumns, {
                selectMode: "browse",
                noRowText: "No Variants Were Created. Create one by clicking \"Add Variant\""
            });
        VariantListRef.variantTreeview = yanexTreeview;
    }

        public static addVariantListButtons(form: YanexForm): void {
            for (const button of VariantListRecord.updateVariantFieldButtons) {
                const butt = new YanexButton(form, {
                    text:button,
                    className:"py-2 rounded",
                });
                (butt.widget as HTMLButtonElement).type = "button";
                butt.addEventListener("click", (e) => {VariantListEvents.variantListFormButtonListener(e)})
            }
        }

            public static addSubmittingStatus(): void {
                if(VariantListRef.variantListForm) {
                    const container = new YanexDiv(VariantListRef.variantListForm, {
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
                    VariantListRef.loadingContainer = container;
                }
            }
    
}

export class VariantListHelper {
    /**
     * Save the variants that was fetched from the database
     */
    public static saveVariants(variantsData: Record<number, Record<string, any>>): void {
        for(const variantData of Object.values(variantsData)) {
            VariantListStorage.variants[variantData.var_id] = variantData;
        }
    }
    public static clearVariantFields(): void {
        for(const yanex of Object.values(VariantRefs.updateVariantFields)){
            yanex.value = ""
        }
    }


    /**
    * Populate the variant list treeview
     */
    public static populateVariantTreeview(variants: Array<Record<string, any>>): void {

        if(VariantListRef.variantTreeview) {
            for(const variantData of variants) {
                VariantListRef.variantTreeview.addRow([
                    variantData.var_id,
                    variantData.var_title
                ])
            }
        }
    }

    /**
     * Add event listener to the variants buttons
     */
    public static addVariantButtonsEventListener(): void {
        for (const [variantButtonText, yanexButton] of Object.entries(VariantListRef.variantNavButtons)) {
            switch(variantButtonText as VariantNavButtons) {
                case "Update Variant":
                    yanexButton.addEventListener("click", (e) => {VariantListEvents.variantListNavButtonListener(e)})
            }
        }
    }

    /**
     * Get the variant selected
     */
    public static getSelectedVariantData(): Array<Record<string, any>> | null{
        const treeview = VariantListRef.variantTreeview;
        if(treeview) {
            const data = treeview.getActivatedRowData();
            return data;
        }
        return null
    }

    /**
     * Get the submitted variant data
     */
    public static getSubmittedVariantData(): Record<string, any> | null {
        if(VariantListRef.variantTreeview) {
            const rowData = VariantListRef.variantTreeview.getActivatedRowData("kebabcase");
            if(rowData.length > 0) {
                return rowData[0]
            }
        }

        return null
    }

    /**
     * Check submitted variant
     */
    public static checkSubmittedVariant(): DataStatusReturnType {
        const submittedData = VariantListHelper.getSubmittedVariantData();
        if(submittedData) {
            // Get the data written by user
            if(VariantListRef.variantListForm) {
                const formData = new FormData(VariantListRef.variantListForm.widget as HTMLFormElement);

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
            message: "Please select a variant to be updated in the treeview"
        }
    }

    /**
     * Add a listener to the treeview rows
     */
    public static addVariantTreeviewSelectedEvent(): void{

        const treeview = VariantListRef.variantTreeview;
        if(treeview){
            treeview.addEventListener("rowSelect", VariantListEvents.variantTreeviewRowSelected);
            treeview.addEventListener("rowDeselect", VariantListEvents.variantTreeviewRowDeselected)
        }
    }

    /**
     * Disable/Enable nav buttons state
     * @param state If true, enable the nav buttons. Otherwise, disable.
     */
    public static setNavButtonsState(state: boolean){

        for(const [buttonKey, button] of Object.entries(VariantListRef.variantNavButtons)) {
            button.setState(state)
        }
    }
}

export class VariantListRequests{
    public static async getProductVariants(): Promise<FetchUtilityRawProcessedResponse> {
        const fetchUtil = new FetchUtility("GET", "json");
        const response = await fetchUtil.start(PublicLinks.GETPRODUCTVARIANTS);
        return fetchUtil.processResponse(response);
    }

    public static async updateVariant(payload: Record<string, any>): Promise<FetchUtilityRawProcessedResponse>{
        const fetchUtil = new FetchUtility("POST", "json", payload, "json");
        const response = await fetchUtil.start(VariantListLinks.updateVariantLink);
        return fetchUtil.processResponse(response);
    
    }
}