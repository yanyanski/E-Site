import { FetchUtilityProcessedResponse, FetchUtilityRawProcessedResponse } from "../../../packages/typing";
import { FetchUtility } from "../../../packages/utilities";
import { YanexButton, YanexDiv, YanexHeading } from "../../../packages/widgets/yanexWidgets";
import { PublicLinks } from "../../../public";
import { SearchFilterRef } from "../searchFilterRef";
import { CategoryFilterSectionEvent } from "./categoryFilterSectionBundle";
import { CategoryFilterSectionRecord } from "./categoryFilterSectionRecord";
import { CategoryFilterSectionRef, CategoryFilterSectionStorage } from "./categoryFilterSectionRef";

export class CategoryFilterSectionHelper{

    public static saveCategories(dbRes: FetchUtilityRawProcessedResponse): Record<number, Record<string,any>> {
        const data = dbRes["data"];

        if(data) {
            for(const dbData of data) {
                CategoryFilterSectionStorage.categories[dbData["cat_id"]] = dbData
            }

            return CategoryFilterSectionStorage.categories
        }
        return {};
    }
}

export class CategoryFilterSectionFactory{

    public static createCategoryButton(buttonText: string, catId: number): void {
        const button = new YanexButton(CategoryFilterSectionRef.buttonContainer, {
            className: "rounded-md px-2 border-[1px] text-sm",
            text: buttonText,
            bg: "lighterBg",
            hoverBorder: "lighterSpecialColorBorder",
            selectBorder: "specialColorBorder",
            // selectBg: "lighterSpecialColorBg"
        })
        CategoryFilterSectionRef.categoryButtons[catId] = button
        button.addEventListener("click", (e) => CategoryFilterSectionEvent.categoryButtonClicked(e, button, catId))
    }

    public static createCategoryContainer(): void {
        const container = new YanexDiv(SearchFilterRef.searchFilterTypesContainer, {
            className:"123 w-full h-full flex flex-col p-2 hidden"
        })
        CategoryFilterSectionRef.categoryContainer = container;

        new YanexHeading(container, "h6", {
            className:"text-xs w-full px-1 pb-3",
            text:CategoryFilterSectionRecord.message,
            fg: "lighterFg"
        }, {
            textAlignment: "w"
        })

        const buttonContainer = new YanexDiv(container, {
            className: "scroll-modern overflow-y-auto flex gap-1 flex-wrap items-start justify-start"
        })
        CategoryFilterSectionRef.buttonContainer = buttonContainer;

    }
}


export class CategoryFilterSectionRequests{
    public static async getCategories(): FetchUtilityProcessedResponse {
        const fetchUtil = new FetchUtility("GET", "json");
        const res = await fetchUtil.start(PublicLinks.GETPRODUCTCATEGORIES, undefined, 5000, false);
        return fetchUtil.processResponse(res);
    }
}