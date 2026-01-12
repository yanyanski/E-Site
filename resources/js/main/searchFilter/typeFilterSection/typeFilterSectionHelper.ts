import { FetchUtilityProcessedResponse, FetchUtilityRawProcessedResponse } from "../../../packages/typing";
import { FetchUtility } from "../../../packages/utilities";
import { YanexButton, YanexDiv, YanexHeading } from "../../../packages/widgets/yanexWidgets";
import { PublicLinks } from "../../../public";
import { SearchFilterRef } from "../searchFilterRef";
import { TypeFilterSectionEvent } from "./typeFilterSectionBundle";
import { TypeFilterSectionRecord } from "./typeFilterSectionRecord";
import { TypeFilterSectionRef, TypeFilterSectionStorage } from "./typeFilterSectionRef";

export class TypeFilterSectionHelper{

    public static saveTypes(dbRes: FetchUtilityRawProcessedResponse): Record<number, Record<string,any>> {
        const data = dbRes["data"];

        if(data) {
            for(const dbData of data) {
                TypeFilterSectionStorage.types[dbData["type_id"]] = dbData
            }

            return TypeFilterSectionStorage.types
        }
        return {};
    }
}

export class TypeFilterSectionFactory{

    public static createTypeButton(buttonText: string, catId: number): void {
        const button = new YanexButton(TypeFilterSectionRef.buttonContainer, {
            className: "rounded-md px-2 border-[1px] text-sm",
            text: buttonText,
            bg: "lighterBg",
            hoverBorder: "lighterSpecialColorBorder",
            selectBorder: "specialColorBorder",
            // selectBg: "lighterSpecialColorBg"
        })
        TypeFilterSectionRef.typeButtons[catId] = button
        button.addEventListener("click", (e) => TypeFilterSectionEvent.typeButtonClicked(e, button, catId))
    }

    public static createTypeContainer(): void {
        const container = new YanexDiv(SearchFilterRef.searchFilterTypesContainer, {
            className:"123 w-full h-full flex flex-col p-2 hidden"
        })
        TypeFilterSectionRef.typeContainer = container;

        new YanexHeading(container, "h6", {
            className:"text-xs w-full px-1 pb-3",
            text:TypeFilterSectionRecord.message,
            fg: "lighterFg"
        }, {
            textAlignment: "w"
        })

        const buttonContainer = new YanexDiv(container, {
            className: "scroll-modern overflow-y-auto flex gap-1 flex-wrap items-start justify-start"
        })
        TypeFilterSectionRef.buttonContainer = buttonContainer;

    }
}


export class TypeFilterSectionRequests{
    public static async getTypes(): FetchUtilityProcessedResponse {
        const fetchUtil = new FetchUtility("GET", "json");
        const res = await fetchUtil.start(PublicLinks.GETPRODUCTYPES, undefined, 5000, false);
        return fetchUtil.processResponse(res);
    }
}