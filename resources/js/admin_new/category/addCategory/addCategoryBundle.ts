import { LoadingBorder } from "../../../packages/utilities";
import YanexMessageModal from "../../../packages/widgets/yanexWidgetPackages/yanexMesssageModal";
import { AdminRefs } from "../../adminRef";
import { CategoryFactory, CategoryHelper } from "../categoryHelper";
import { CategoryListHelper } from "../categoryLists/categoryListHelper";

import { AddCategoryFactory, AddCategoryHelper, AddCategoryRequests } from "./addCategoryHelper";
import { AddCategoryFieldButtons, AddCategoryRecords } from "./addCategoryRecord";
import { AddCategoryRef } from "./addCategoryRef";


export class AddCategoryBundle{


    public static initialize(): void {
        if(!AddCategoryRef.initialized) {
            const container = AddCategoryFactory.createAddCategoryContainer();
            AddCategoryRef.addCategoryParent = container;
            LoadingBorder.addLoadingBorder(container.widget, "top");

            const form = CategoryFactory.createCategoryField(container)
            AddCategoryRef.addCategoryForm = form;

            AddCategoryFactory.addCategoryButtons(form)
            AddCategoryFactory.addSubmittingStatus()

            if(AdminRefs.adminContentContainer) {
                AdminRefs.adminContentContainer.appendChild(container)
            }
            AddCategoryRef.initialized = true
        } else {
            if(AddCategoryRef.addCategoryParent){
                AddCategoryRef.addCategoryParent.show();
            }
        }
    }
}

export class AddCategoryEvents {
    public static async addCategoryButtonFieldsClicked(event: PointerEvent): Promise<void> {
        const button = event.target as HTMLButtonElement;

        const buttonText = button.textContent as AddCategoryFieldButtons

        switch(buttonText) {
            case "Add Category":
                // Disable form elements
                const form = AddCategoryRef.addCategoryForm;

                
                const enteredFields = CategoryHelper.getCategoryFieldData();
                const check = CategoryHelper.checkSubmittedCategory(enteredFields);

                if(check.status) {
                    if(form) {
                        form.setElementsState(["YanexButton", "YanexInput"], false);
                    }

                    // Add submitting loading
                    AddCategoryHelper.showHideSubmittingStatus(true)
                    const response = await AddCategoryRequests.addCategory(enteredFields);
                    if(response.responseStatus) {
                        const responseData = response.data;
                        if(responseData.status) {
                            // Add Variant to the treeview
                            CategoryListHelper.populateCategoryTreeview([responseData.data])

                            // Save variant
                            const categorySavedId = responseData.data["cat_id"] as number
                            const categorydata = responseData.data;
                            CategoryListHelper.saveCategories({[categorySavedId]: categorydata})
                            new YanexMessageModal("Category added successfully", "okay")
                        } else {
                            new YanexMessageModal(`Something Went Wrong. Error:\n${responseData.message}`, "okay")
                        }
                       
                    } else {
                        new YanexMessageModal(response.message, "okay");
                    }

                    AddCategoryHelper.showHideSubmittingStatus(false);
                    if(form) {
                        form.setElementsState(["YanexButton", "YanexInput"], true);
                        form.clearFields();
                    }
                } else {
                    new YanexMessageModal(check.message, "okay");
                }
                break;
        }
    }
}