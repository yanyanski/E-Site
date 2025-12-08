import { LoadingBorder } from "../../../packages/utilities";
import YanexMessageModal from "../../../packages/widgets/yanexWidgetPackages/yanexMesssageModal";
import { AdminRefs } from "../../adminRef";
import { VariantListHelper } from "../variantList/variantListHelper";
import { VariantsFactory, VariantsHelper } from "../variantsHelper";
import { AddVariantFactory, AddVariantHelper, AddVariantRequests } from "./addVariantHelper";
import { AddVariantFieldButtons, AddVariantRecords } from "./addVariantRecord";
import { AddVariantRef } from "./addVariantRef";


export class AddVariantBundle{


    public static initialize(): void {
        if(!AddVariantRef.initialized) {
            const container = AddVariantFactory.createAddVariantContainer();
            AddVariantRef.addVariantParent = container;
            LoadingBorder.addLoadingBorder(container.widget, "top");

            const form = VariantsFactory.createVariantField(container)
            AddVariantRef.addVariantForm = form;

            AddVariantFactory.addVariantButtons(form)
            AddVariantFactory.addSubmittingStatus()

            if(AdminRefs.adminContentContainer) {
                AdminRefs.adminContentContainer.appendChild(container)
            }
            AddVariantRef.initialized = true
        } else {
            if(AddVariantRef.addVariantParent){
                AddVariantRef.addVariantParent.show();
            }
        }
    }
}

export class AddVariantEvents {
    public static async addVariantButtonFieldsClicked(event: PointerEvent): Promise<void> {
        const button = event.target as HTMLButtonElement;

        const buttonText = button.textContent as AddVariantFieldButtons

        switch(buttonText) {
            case "Add Variant":
                // Disable form elements
                const form = AddVariantRef.addVariantForm;

                
                const enteredFields = VariantsHelper.getVariantFieldData();
                const check = VariantsHelper.checkSubmittedVariant(enteredFields);

                if(check.status) {
                    if(form) {
                        form.setElementsState(["YanexButton", "YanexInput"], false);
                    }

                    // Add submitting loading
                    AddVariantHelper.showHideSubmittingStatus(true)
                    const response = await AddVariantRequests.addVariant(enteredFields);
                    if(response.responseStatus) {
                        const responseData: Record<string, any> = response.data;
                        if(responseData.status) {

                            // Add Variant to the treeview
                            VariantListHelper.populateVariantTreeview([responseData.data])

                            // Save variant
                            const variantSavedId = responseData.data["var_id"] as number
                            const variantdata = responseData.data;
                            VariantListHelper.saveVariants({[variantSavedId]: variantdata})
                            new YanexMessageModal("Variant added successfully", "okay")

                        } else {
                            new YanexMessageModal("Variant added successfully", "okay")
                        }
                        AddVariantHelper.showHideSubmittingStatus(false);


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