import { IconsBundle } from "../../../icons/iconsBundle";
import { IconsHelperRequest } from "../../../icons/iconsHelper";
import { Strings } from "../../../packages/datatypeHelpers";
import { FetchUtilityProcessedResponse } from "../../../packages/typing";
import YanexCustomModal from "../../../packages/widgets/yanexWidgetPackages/yanexCustomModal";
import YanexMessageModal from "../../../packages/widgets/yanexWidgetPackages/yanexMesssageModal";
import { YanexTreeviewEvent } from "../../../packages/widgets/yanexWidgetPackages/yanexTreeview";
import { CategoryFactory, CategoryHelper } from "../categoryHelper";
import { CategoryListFactory, CategoryListHelper, CategoryListRequests } from "./categoryListHelper";
import { CategoryListRecord, CategoryNavButtons, CategoryUpdateFormButtons } from "./categoryListRecord";
import { CategoryListRef, CategoryListStorage } from "./categoryListRef";



export class CategoryListBundle {

    public static async initialize(): Promise<void> {

        if(!CategoryListRef.initialized) {
            CategoryListFactory.createCategoriesList();
            CategoryListHelper.addCategoryButtonsEventListener();
            CategoryListHelper.addCategoryTreeviewSelectedEvent();
            CategoryListRef.categoryTreeview!.show(CategoryListRef.categoryListParent)
            CategoryListRef.categoryTreeview!.addLoadingRow()

            CategoryListRef.initialized = true;
            const category = await this.getCategorys();
            CategoryListRef.categoryTreeview!.hideLoadingRow()

            if(category.responseStatus) {
                CategoryListHelper.populateCategoryTreeview(category.data);

            } else {
                new YanexMessageModal(category.message, "okay")
            }

            await IconsHelperRequest.getImageIcons(Object.values(CategoryListRecord.categoryNavButtonsIcons));
            IconsBundle.setElementIcons(CategoryListRef.categoryListParent!)
        }


        if(CategoryListRef.categoryTreeview) {
            CategoryListRef.categoryTreeview.show(CategoryListRef.categoryListParent)
        }

    }

    public static async getCategorys(): FetchUtilityProcessedResponse {
        if(CategoryListStorage.categoryRawFetched !== null) {
            return CategoryListStorage.categoryRawFetched;
        }
        
        const categories = await CategoryListRequests.getProductCategories();
        if(categories.responseStatus) {
            CategoryListHelper.saveCategories(categories.data);
            CategoryListStorage.categoryRawFetched = categories;
        }
        
        return categories;
    }
}

export class CategoryListEvents{

    /**
     * Handle events from category nav buttons
     */
    public static categoryListNavButtonListener(event: PointerEvent): void {
        const button = event.target as HTMLButtonElement;
        const buttonText = button.textContent as CategoryNavButtons

        switch(buttonText) {
            case "Update Category":
                if(CategoryListRef.categoryListModal === null) {
                    CategoryListRef.categoryListModal = new YanexCustomModal(null, 
                        600, 450, {
                            title: "Update Category"
                        }
                    )
                    const form = CategoryFactory.createCategoryField(
                        CategoryListRef.categoryListModal.modalDialog,
                        {
                            "categoryName": ""
                        }
                    ) 
                    CategoryListRef.categoryListForm = form;

                    CategoryListFactory.addCategoryListButtons(form)
                    CategoryListFactory.addSubmittingStatus()

                }
                if(CategoryListRef.categoryListModal) {
                    CategoryListRef.categoryListModal.show(document.body as HTMLBodyElement, true)
                    const data = CategoryListHelper.getSelectedCategoryData()
                    if(data && data.length > 0) {
                        
                        CategoryHelper.updateCategoryFormField(data[0])
                    }
                }

                break;
        }
        
    }

    public static async categoryListFormButtonListener(event: PointerEvent): Promise<void> {
        const button = event.target as HTMLButtonElement
        const buttonText = button.textContent

        switch (buttonText as CategoryUpdateFormButtons){
            case "Update Category":
                const check = CategoryListHelper.checkSubmittedCategory();
                if(check.status) {
                    // Show submitting status
                    if(CategoryListRef.loadingContainer) {
                        CategoryListRef.loadingContainer.show();
                    }

                    // Data submitted is ok
                    if(check.data) {
                        // Disable elements temporarily
                        if(CategoryListRef.categoryListForm) {
                            CategoryListRef.categoryListForm.setElementsState(["YanexButton", "YanexInput"], false)
                        }

                        const payload: Record<string, any>= {}
                        for(const [key, data] of Object.entries(check.data)) {
                            payload[Strings.toKebabCase(key, "lowercase")] = data
                        }

                        const response = await CategoryListRequests.updateCategory(payload)

                        // Remove submittin status
                        if(CategoryListRef.loadingContainer) {
                            CategoryListRef.loadingContainer.hide();
                        }

                        if(response.responseStatus) {

                            // The response data from the server
                            const responseData = response.data;

                            if(responseData.status) {

                                // Update the treeview too
                                if(CategoryListRef.categoryTreeview) {
                                    const selectedRow = CategoryListRef.categoryTreeview.getActivatedRowIds();
                                    if(selectedRow.length > 0) {
                                        const rowId = selectedRow[0];
                                        CategoryListRef.categoryTreeview.updateRow(rowId, Array.from(Object.values(payload)))
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

                        if(CategoryListRef.categoryListForm) {
                            CategoryListRef.categoryListForm.setElementsState(["YanexButton", "YanexInput"], true)
                        }
                    }
                } else {
                    new YanexMessageModal(check.message, "okay")
                }

                // Close modal
                if(CategoryListRef.categoryListModal) {              
                    CategoryListRef.categoryListModal.close();
                }

            break;

            case "Clear Field":
                CategoryListHelper.clearCategoryFields()
            break;
        }
    }

    /**
     * handle if a row is seleceted
     * @param event Pointer Event
     */
    public static categoryTreeviewRowSelected(event: YanexTreeviewEvent): void {
        const treeview = event.treeview;

        if(treeview.selectedRowCount > 0) {
            CategoryListHelper.setNavButtonsState(true)
        }
    }

    public static categoryTreeviewRowDeselected(event: YanexTreeviewEvent): void {
        const treeview = event.treeview;
        CategoryListHelper.setNavButtonsState(treeview.selectedRowCount === 0? false : true)
        console.log("DESELCTED")
    }
}