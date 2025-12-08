import { IconsBundle } from "../../../../icons/iconsBundle";
import { IconsHelperRequest } from "../../../../icons/iconsHelper";
import { Strings } from "../../../../packages/datatypeHelpers";
import { FetchUtilityProcessedResponse } from "../../../../packages/typing";
import YanexCustomModal from "../../../../packages/widgets/yanexWidgetPackages/yanexCustomModal";
import YanexMessageModal from "../../../../packages/widgets/yanexWidgetPackages/yanexMesssageModal";
import { YanexTreeviewEvent } from "../../../../packages/widgets/yanexWidgetPackages/yanexTreeview";
import { ProductTypesFactory, ProductTypesHelper } from "../productTypeHelper";
import { ProductTypeListFactory, ProductTypeListHelper, ProductTypeListRequests } from "./productTypeListHelper";
import { ProductTypeListRecord, ProductTypeNavButtons, ProductTypeUpdateFormButtons } from "./productTypeListRecord";
import { ProductTypeListRef } from "./productTypeListRef";


export class ProductTypeListBundle {

    public static async initialize(): Promise<void> {

        if(!ProductTypeListRef.initialized) {
            
            ProductTypeListFactory.createProductTypesList();
            ProductTypeListHelper.addProductTypeButtonsEventListener();
            ProductTypeListHelper.addProductTypeTreeviewSelectedEvent();
            ProductTypeListRef.productTypeTreeview!.show(ProductTypeListRef.productTypeListParent)
            ProductTypeListRef.productTypeTreeview!.addLoadingRow();

            ProductTypeListRef.initialized = true;
            const productType = await this.getProductTypes();
            ProductTypeListRef.productTypeTreeview!.hideLoadingRow()

            if(productType.responseStatus) {
                ProductTypeListHelper.populateProductTypeTreeview(productType.data);

            } else {
                new YanexMessageModal(productType.message, "okay")
            }
            await IconsHelperRequest.getImageIcons(Object.values(ProductTypeListRecord.productTypeNavButtonsIcons));
            IconsBundle.setElementIcons(ProductTypeListRef.productTypeListParent!);
        }

        if(ProductTypeListRef.productTypeTreeview) {
            ProductTypeListRef.productTypeTreeview.show(ProductTypeListRef.productTypeListParent)
        }

    }

    public static async getProductTypes(): FetchUtilityProcessedResponse {
        const productTypes = await ProductTypeListRequests.getProductProductTypes();
        if(productTypes.responseStatus) {
            ProductTypeListHelper.saveProductTypes(productTypes.data);
        }
        
        return productTypes;
    }
}

export class ProductTypeListEvents{

    /**
     * Handle events from productType nav buttons
     */
    public static productTypeListNavButtonListener(event: PointerEvent): void {
        const button = event.target as HTMLButtonElement;
        const buttonText = button.textContent as ProductTypeNavButtons

        switch(buttonText) {
            case "Update Product Type":
                if(ProductTypeListRef.productTypeListModal === null) {
                    ProductTypeListRef.productTypeListModal = new YanexCustomModal(null, 
                        600, 450, {
                            title: "Update ProductType"
                        }
                    )
                    const form = ProductTypesFactory.createProductTypeField(
                        ProductTypeListRef.productTypeListModal.modalDialog,
                        {
                            productTypesName: ""
                        }
                    ) 
                    ProductTypeListRef.productTypeListForm = form;

                    ProductTypeListFactory.addProductTypeListButtons(form)
                    ProductTypeListFactory.addSubmittingStatus()

                }
                if(ProductTypeListRef.productTypeListModal) {
                    ProductTypeListRef.productTypeListModal.show(document.body as HTMLBodyElement, true)
                    const data = ProductTypeListHelper.getSelectedProductTypeData()
                    console.log("DATA", data)
                    if(data && data.length > 0) {
                        
                        ProductTypesHelper.updateProductTypeFormField(data[0])
                    }
                }

                break;
        }
        
    }

    public static async productTypeListFormButtonListener(event: PointerEvent): Promise<void> {
        const button = event.target as HTMLButtonElement
        const buttonText = button.textContent

        switch (buttonText as ProductTypeUpdateFormButtons){
            case "Update Product Type":
                const check = ProductTypeListHelper.checkSubmittedProductType();
                if(check.status) {
                    // Show submitting status
                    if(ProductTypeListRef.loadingContainer) {
                        ProductTypeListRef.loadingContainer.show();
                    }

                    // Data submitted is ok
                    if(check.data) {
                        // Disable elements temporarily
                        if(ProductTypeListRef.productTypeListForm) {
                            ProductTypeListRef.productTypeListForm.setElementsState(["YanexButton", "YanexInput"], false)
                        }

                        const payload: Record<string, any>= {}
                        for(const [key, data] of Object.entries(check.data)) {
                            payload[Strings.toKebabCase(key, "lowercase")] = data
                        }

                        const response = await ProductTypeListRequests.updateProductType(payload)

                        // Remove submittin status
                        if(ProductTypeListRef.loadingContainer) {
                            ProductTypeListRef.loadingContainer.hide();
                        }

                        if(response.responseStatus) {

                            // The response data from the server
                            const responseData = response.data;

                            if(responseData.status) {

                                // Update the treeview too
                                if(ProductTypeListRef.productTypeTreeview) {
                                    const selectedRow = ProductTypeListRef.productTypeTreeview.getActivatedRowIds();
                                    if(selectedRow.length > 0) {
                                        const rowId = selectedRow[0];
                                        ProductTypeListRef.productTypeTreeview.updateRow(rowId, Array.from(Object.values(payload)))
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

                        if(ProductTypeListRef.productTypeListForm) {
                            ProductTypeListRef.productTypeListForm.setElementsState(["YanexButton", "YanexInput"], true)
                        }
                    }
                } else {
                    new YanexMessageModal(check.message, "okay")
                }

                // Close modal
                if(ProductTypeListRef.productTypeListModal) {              
                    ProductTypeListRef.productTypeListModal.close();
                }

            break;

            case "Clear Field":
                ProductTypeListHelper.clearProductTypeFields()
            break;
        }
    }

    /**
     * handle if a row is seleceted
     * @param event Pointer Event
     */
    public static productTypeTreeviewRowSelected(event: YanexTreeviewEvent): void {
        const treeview = event.treeview;

        if(treeview.selectedRowCount > 0) {
            ProductTypeListHelper.setNavButtonsState(true)
        }
    }

    public static productTypeTreeviewRowDeselected(event: YanexTreeviewEvent): void {
        const treeview = event.treeview;
        ProductTypeListHelper.setNavButtonsState(treeview.selectedRowCount === 0? false : true)
    }
}