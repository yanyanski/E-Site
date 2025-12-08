
import { LoadingBorder } from "../../../../packages/utilities";
import YanexMessageModal from "../../../../packages/widgets/yanexWidgetPackages/yanexMesssageModal";
import { AdminRefs } from "../../../adminRef";
import { ProductTypesFactory, ProductTypesHelper } from "../productTypeHelper";
import { ProductTypeListHelper } from "../productTypeList/productTypeListHelper";
import { AddProductTypeFactory, AddProductTypeHelper, AddProductTypeRequests } from "./addProductTypeHelper";
import { AddProductTypeFieldButtons } from "./addProductTypeRecord";
import { AddProductTypeRef } from "./addVariantRef";



export class AddProductTypeBundle{


    public static initialize(): void {
        if(!AddProductTypeRef.initialized) {
            const container = AddProductTypeFactory.createAddProductTypeContainer();
            AddProductTypeRef.addProductTypeParent = container;
            LoadingBorder.addLoadingBorder(container.widget, "top");

            const form = ProductTypesFactory.createProductTypeField(container)
            AddProductTypeRef.addProductTypeForm = form;

            AddProductTypeFactory.addProductTypeButtons(form)
            AddProductTypeFactory.addSubmittingStatus()

            if(AdminRefs.adminContentContainer) {
                AdminRefs.adminContentContainer.appendChild(container)
            }
            AddProductTypeRef.initialized = true
        } else {
            if(AddProductTypeRef.addProductTypeParent){
                AddProductTypeRef.addProductTypeParent.show();
            }
        }
    }
}

export class AddProductTypeEvents {
    public static async addProductTypeButtonFieldsClicked(event: PointerEvent): Promise<void> {
        const button = event.target as HTMLButtonElement;

        const buttonText = button.textContent as AddProductTypeFieldButtons

        switch(buttonText) {
            case "Add Product Type":
                // Disable form elements
                const form = AddProductTypeRef.addProductTypeForm;

                
                const enteredFields = ProductTypesHelper.getProductTypeFieldData();
                const check = ProductTypesHelper.checkSubmittedProductType(enteredFields);

                if(check.status) {
                    if(form) {
                        form.setElementsState(["YanexButton", "YanexInput"], false);
                    }

                    // Add submitting loading
                    AddProductTypeHelper.showHideSubmittingStatus(true)
                    const response = await AddProductTypeRequests.addProductType(enteredFields);
                    if(response.responseStatus) {
                        const responseData: Record<string, any> = response.data;
                        if(responseData.status) {

                            // Add ProductType to the treeview
                            ProductTypeListHelper.populateProductTypeTreeview([responseData.data])

                            // Save productType
                            const productTypeSavedId = responseData.data["var_id"] as number
                            const productTypedata = responseData.data;
                            ProductTypeListHelper.saveProductTypes({[productTypeSavedId]: productTypedata})
                            new YanexMessageModal("ProductType added successfully", "okay")

                        } else {
                            new YanexMessageModal("ProductType added successfully", "okay")
                        }
                        AddProductTypeHelper.showHideSubmittingStatus(false);


                        if(form) {
                            form.setElementsState(["YanexButton", "YanexInput"], true);
                            form.clearFields();
                        }
                        
                        
                        

                    } else {
                        new YanexMessageModal(response.message, "okay");
                    }
                } else {
                    new YanexMessageModal(check.message, "okay");
                }
                break;
        }
    }
}