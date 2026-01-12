import { FetchUtilityProcessedResponse, FetchUtilityRawProcessedResponse } from "../../../packages/typing";
import { FetchUtility } from "../../../packages/utilities";
import { YanexButton, YanexDiv, YanexHeading } from "../../../packages/widgets/yanexWidgets";
import { PublicLinks } from "../../../public";
import { SearchFilterRef } from "../searchFilterRef";
import { VariantFilterSectionEvent } from "./variantFilterSectionBundle";
import { VariantFilterSectionRecord } from "./variantFilterSectionRecord";
import { VariantFilterSectionRef, VariantFilterSectionStorage } from "./variantFilterSectionRef";


export class VariantFilterSectionHelper{

    public static saveVariants(dbRes: FetchUtilityRawProcessedResponse): Record<number, Record<string,any>> {
        const data = dbRes["data"];

        if(data) {
            for(const dbData of data) {
                VariantFilterSectionStorage.variants[dbData["var_id"]] = dbData
            }

            return VariantFilterSectionStorage.variants
        }
        return {};
    }
}

export class VariantFilterSectionFactory{

    public static createVariantButton(buttonText: string, catId: number): void {
        const button = new YanexButton(VariantFilterSectionRef.buttonContainer, {
            className: "rounded-md px-2 border-[1px] text-sm",
            text: buttonText,
            bg: "lighterBg",
            hoverBorder: "lighterSpecialColorBorder",
            selectBorder: "specialColorBorder",
            // selectBg: "lighterSpecialColorBg"
        })
        VariantFilterSectionRef.variantButtons[catId] = button
        button.addEventListener("click", (e) => VariantFilterSectionEvent.variantButtonClicked(e, button, catId))
    }

    public static createVariantContainer(): void {
        const container = new YanexDiv(SearchFilterRef.searchFilterTypesContainer, {
            className:"w-full h-full flex flex-col p-2 hidden"
        })
        VariantFilterSectionRef.variantContainer = container;

        new YanexHeading(container, "h6", {
            className:"text-xs w-full px-1 pb-3",
            text:VariantFilterSectionRecord.message,
            fg: "lighterFg"
        }, {
            textAlignment: "w"
        })

        const buttonContainer = new YanexDiv(container, {
            className: "scroll-modern overflow-y-auto flex gap-1 flex-wrap items-start justify-start"
        })
        VariantFilterSectionRef.buttonContainer = buttonContainer;

    }
}


export class VariantFilterSectionRequests{
    public static async getVariants(): FetchUtilityProcessedResponse {
        const fetchUtil = new FetchUtility("GET", "json");
        const res = await fetchUtil.start(PublicLinks.GETPRODUCTVARIANTS, undefined, 5000, false);
        return fetchUtil.processResponse(res);
    }
}