import { Strings } from "../../../packages/datatypeHelpers";
import { DataStatusReturnType } from "../../../packages/interfaces";
import { FetchUtilityRawProcessedResponse } from "../../../packages/typing";
import { FetchUtility } from "../../../packages/utilities";
import YanexTreeview from "../../../packages/widgets/yanexWidgetPackages/yanexTreeview";
import { YanexButton, YanexDiv, YanexForm, YanexHeading } from "../../../packages/widgets/yanexWidgets";
import { PublicLinks, PublicStringValues } from "../../../public";
import { AdminRefs } from "../../adminRef";
import { CategoryRefs } from "../categoryRef";

import { CategoryListEvents } from "./categoryListBundle";
import { CategoryListLinks, CategoryListRecord, CategoryNavButtons } from "./categoryListRecord";
import { CategoryListRef, CategoryListStorage } from "./categoryListRef";


export class CategoryListFactory{

    public static createCategoriesList(): void{
        const yanexContainer = new YanexDiv(AdminRefs.adminContentContainer, {
            bg:"lighterBg",
            className: "w-full h-full overflow-y-auto scroll-modern"
        })
        CategoryListRef.categoryListParent = yanexContainer;
        // Create intro
        new YanexHeading(yanexContainer, "h1", {
            text:CategoryListRecord.updateCategoryIntro.title,
            className:"font-bold text-lg pt-2 pl-2",
            
        }, {
            textAlignment: "w"
        })

        // Create intro
        new YanexHeading(yanexContainer, "h6", {
            text:CategoryListRecord.updateCategoryIntro.message,
            className:"pl-2 text-sm",
            fg:"lighterFg",
            
        }, {
            textAlignment: "w"
        })

        // Create nav bar
        const categoryListNav = new YanexDiv(yanexContainer, {
            bg:"lighterBg",
            className: "w-full flex gap-2 items-center justify-end py-2 px-2"
        }, {
            textAlignment: "w"
        })

        for(const categoryNavButton of CategoryListRecord.categoryNavButtons) {
            const button = new YanexButton(categoryListNav, {
                className: "rounded px-3 py-1 flex",
                text:categoryNavButton,
                hoverBg:"extraBg"
            }, {
                state: false
            })
            button.addDataset(PublicStringValues.widgetIconDataSetTitle, CategoryListRecord.categoryNavButtonsIcons[categoryNavButton])
            CategoryListRef.categoryNavButtons[categoryNavButton] = button;
        }


        const yanexTreeview = new YanexTreeview(null, 
            CategoryListRecord.yanexTreeviewColumns, {
                selectMode: "browse",
                noRowText: "No Categories Were Created. Create one by clicking \"Add Category\""
            });
        CategoryListRef.categoryTreeview = yanexTreeview;
    }

        public static addCategoryListButtons(form: YanexForm): void {
            for (const button of CategoryListRecord.updateCategoryFieldButtons) {
                const butt = new YanexButton(form, {
                    text:button,
                    className:"py-2 rounded",
                });
                (butt.widget as HTMLButtonElement).type = "button";
                butt.addEventListener("click", (e) => {CategoryListEvents.categoryListFormButtonListener(e)})
            }
        }

            public static addSubmittingStatus(): void {
                if(CategoryListRef.categoryListForm) {
                    const container = new YanexDiv(CategoryListRef.categoryListForm, {
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
                    CategoryListRef.loadingContainer = container;
                }
            }
    
}

export class CategoryListHelper {
    /**
     * Save the categorys that was fetched from the database
     */
    public static saveCategories(categorysData: Record<number, Record<string, any>>): void {
        for(const categoryData of Object.values(categorysData)) {
            CategoryListStorage.categorys[categoryData.cat_id] = categoryData;
        }
    }
    public static clearCategoryFields(): void {
        for(const yanex of Object.values(CategoryRefs.updateCategoryFields)){
            yanex.value = ""
        }
    }


    /**
    * Populate the category list treeview
     */
    public static populateCategoryTreeview(categorys: Array<Record<string, any>>): void {

        if(CategoryListRef.categoryTreeview) {
            for(const categoryData of categorys) {
                CategoryListRef.categoryTreeview.addRow([
                    categoryData.cat_id,
                    categoryData.cat_name
                ])
            }
        }
    }

    /**
     * Add event listener to the categorys buttons
     */
    public static addCategoryButtonsEventListener(): void {
        for (const [categoryButtonText, yanexButton] of Object.entries(CategoryListRef.categoryNavButtons)) {
            switch(categoryButtonText as CategoryNavButtons) {
                case "Update Category":
                    yanexButton.addEventListener("click", (e) => {CategoryListEvents.categoryListNavButtonListener(e)})
            }
        }
    }

    /**
     * Get the category selected
     */
    public static getSelectedCategoryData(): Array<Record<string, any>> | null{
        const treeview = CategoryListRef.categoryTreeview;
        if(treeview) {
            const data = treeview.getActivatedRowData();
            return data;
        }
        return null
    }

    /**
     * Get the submitted category data
     */
    public static getSubmittedCategoryData(): Record<string, any> | null {
        if(CategoryListRef.categoryTreeview) {
            const rowData = CategoryListRef.categoryTreeview.getActivatedRowData("kebabcase");
            if(rowData.length > 0) {
                return rowData[0]
            }
        }

        return null
    }

    /**
     * Check submitted category
     */
    public static checkSubmittedCategory(): DataStatusReturnType {
        const submittedData = CategoryListHelper.getSubmittedCategoryData();
        if(submittedData) {
            // Get the data written by user
            if(CategoryListRef.categoryListForm) {
                const formData = new FormData(CategoryListRef.categoryListForm.widget as HTMLFormElement);

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
            message: "Please select a category to be updated in the treeview"
        }
    }

    /**
     * Add a listener to the treeview rows
     */
    public static addCategoryTreeviewSelectedEvent(): void{

        const treeview = CategoryListRef.categoryTreeview;
        if(treeview){
            treeview.addEventListener("rowSelect", CategoryListEvents.categoryTreeviewRowSelected);
            treeview.addEventListener("rowDeselect", CategoryListEvents.categoryTreeviewRowDeselected)
        }
    }

    /**
     * Disable/Enable nav buttons state
     * @param state If true, enable the nav buttons. Otherwise, disable.
     */
    public static setNavButtonsState(state: boolean){

        for(const [buttonKey, button] of Object.entries(CategoryListRef.categoryNavButtons)) {
            button.setState(state)
        }
    }
}

export class CategoryListRequests{
    public static async getProductCategories(): Promise<FetchUtilityRawProcessedResponse> {
        const fetchUtil = new FetchUtility("GET", "json");
        const response = await fetchUtil.start(PublicLinks.GETPRODUCTCATEGORIES);
        return fetchUtil.processResponse(response);
    }

    public static async updateCategory(payload: Record<string, any>): Promise<FetchUtilityRawProcessedResponse>{
        const fetchUtil = new FetchUtility("POST", "json", payload, "json");
        const response = await fetchUtil.start(CategoryListLinks.updateCategoryLink);
        return fetchUtil.processResponse(response);
    
    }
}