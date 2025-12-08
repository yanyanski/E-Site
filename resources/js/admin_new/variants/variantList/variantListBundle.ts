import { IconsBundle } from "../../../icons/iconsBundle";
import { IconsHelperRequest } from "../../../icons/iconsHelper";
import { Dict, Strings } from "../../../packages/datatypeHelpers";
import { DataStatusReturnType, StatusReturnType } from "../../../packages/interfaces";
import { FetchUtilityProcessedResponse, FetchUtilityRawProcessedResponse } from "../../../packages/typing";
import YanexCustomModal from "../../../packages/widgets/yanexWidgetPackages/yanexCustomModal";
import YanexMessageModal from "../../../packages/widgets/yanexWidgetPackages/yanexMesssageModal";
import { YanexTreeviewEvent, YanexTreeviewEvents } from "../../../packages/widgets/yanexWidgetPackages/yanexTreeview";
import { YanexWidgetsHelper } from "../../../packages/widgets/yanexWidgetsHelper";
import { VariantsFactory, VariantsHelper } from "../variantsHelper";
import { VariantListFactory, VariantListHelper, VariantListRequests } from "./variantListHelper";
import { VariantListRecord, VariantNavButtons, VariantUpdateFormButtons } from "./variantListRecord";
import { VariantListRef, VariantListStorage } from "./variantListRef";


export class VariantListBundle {

    public static async initialize(): Promise<void> {

        if(!VariantListRef.initialized) {
            VariantListFactory.createVariantsList();
            VariantListHelper.addVariantButtonsEventListener();
            VariantListHelper.addVariantTreeviewSelectedEvent();
            VariantListRef.variantTreeview!.show(VariantListRef.variantListParent)
            VariantListRef.variantTreeview!.addLoadingRow()
            
            VariantListRef.initialized = true;
            const variant = await this.getVariants();
            VariantListRef.variantTreeview!.hideLoadingRow()
            if(variant.responseStatus) {
                VariantListHelper.populateVariantTreeview(variant.data);
            } else {
                new YanexMessageModal(variant.message, "okay")
            }

            await IconsHelperRequest.getImageIcons(Object.values(VariantListRecord.variantNavButtonsIcons));
            IconsBundle.setElementIcons(VariantListRef.variantListParent!)
        }

        if(VariantListRef.variantTreeview) {
            VariantListRef.variantTreeview.show(VariantListRef.variantListParent)
        }

    }

    public static async getVariants(): FetchUtilityProcessedResponse {

        const variants = await VariantListRequests.getProductVariants();
        if(variants.responseStatus) {
            VariantListHelper.saveVariants(variants.data);
        }
        
        return variants;
    }
}

export class VariantListEvents{

    /**
     * Handle events from variant nav buttons
     */
    public static variantListNavButtonListener(event: PointerEvent): void {
        const button = event.target as HTMLButtonElement;
        const buttonText = button.textContent as VariantNavButtons

        switch(buttonText) {
            case "Update Variant":
                if(VariantListRef.variantListModal === null) {
                    VariantListRef.variantListModal = new YanexCustomModal(null, 
                        600, 450, {
                            title: "Update Variant"
                        }
                    )
                    const form = VariantsFactory.createVariantField(
                        VariantListRef.variantListModal.modalDialog,
                        {
                            "variantName": ""
                        }
                    ) 
                    VariantListRef.variantListForm = form;

                    VariantListFactory.addVariantListButtons(form)
                    VariantListFactory.addSubmittingStatus()

                }
                if(VariantListRef.variantListModal) {
                    VariantListRef.variantListModal.show(document.body as HTMLBodyElement, true)
                    const data = VariantListHelper.getSelectedVariantData()
                    if(data && data.length > 0) {
                        
                        VariantsHelper.updateVariantFormField(data[0])
                    }
                }

                break;
        }
        
    }

    public static async variantListFormButtonListener(event: PointerEvent): Promise<void> {
        const button = event.target as HTMLButtonElement
        const buttonText = button.textContent

        switch (buttonText as VariantUpdateFormButtons){
            case "Update Variant":
                const check = VariantListHelper.checkSubmittedVariant();
                if(check.status) {
                    // Show submitting status
                    if(VariantListRef.loadingContainer) {
                        VariantListRef.loadingContainer.show();
                    }

                    // Data submitted is ok
                    if(check.data) {
                        // Disable elements temporarily
                        if(VariantListRef.variantListForm) {
                            VariantListRef.variantListForm.setElementsState(["YanexButton", "YanexInput"], false)
                        }

                        const payload: Record<string, any>= {}
                        for(const [key, data] of Object.entries(check.data)) {
                            payload[Strings.toKebabCase(key, "lowercase")] = data
                        }

                        const response = await VariantListRequests.updateVariant(payload)

                        // Remove submittin status
                        if(VariantListRef.loadingContainer) {
                            VariantListRef.loadingContainer.hide();
                        }

                        if(response.responseStatus) {

                            // The response data from the server
                            const responseData = response.data;

                            if(responseData.status) {

                                // Update the treeview too
                                if(VariantListRef.variantTreeview) {
                                    const selectedRow = VariantListRef.variantTreeview.getActivatedRowIds();
                                    if(selectedRow.length > 0) {
                                        const rowId = selectedRow[0];
                                        VariantListRef.variantTreeview.updateRow(rowId, Array.from(Object.values(payload)))
                                    }
                                }
                                new YanexMessageModal(responseData.message, "okay")
                                
                                
                            } else {
                                // Something went wrong while updating in the server side
                                new YanexMessageModal(responseData.message, "okay")
                            }
                        } else {
                            new YanexMessageModal(response.message, "okay")
                        }

                        if(VariantListRef.variantListForm) {
                            VariantListRef.variantListForm.setElementsState(["YanexButton", "YanexInput"], true)
                        }
                    }
                } else {
                    new YanexMessageModal(check.message, "okay")
                }

                // Close modal
                if(VariantListRef.variantListModal) {              
                    VariantListRef.variantListModal.close();
                }

            break;

            case "Clear Field":
                VariantListHelper.clearVariantFields()
            break;
        }
    }

    /**
     * handle if a row is seleceted
     * @param event Pointer Event
     */
    public static variantTreeviewRowSelected(event: YanexTreeviewEvent): void {
        const treeview = event.treeview;

        if(treeview.selectedRowCount > 0) {
            VariantListHelper.setNavButtonsState(true)
        }
    }

    public static variantTreeviewRowDeselected(event: YanexTreeviewEvent): void {
        const treeview = event.treeview;
        VariantListHelper.setNavButtonsState(treeview.selectedRowCount === 0? false : true)
    }
}