import { FetchUtilityRawProcessedResponse } from "../../../packages/typing";
import { FetchUtility } from "../../../packages/utilities";
import { YanexButton, YanexDiv, YanexForm, YanexHeading } from "../../../packages/widgets/yanexWidgets";
import { AdminRefs } from "../../adminRef";
import { AddVariantEvents } from "./addVariantBundle";
import { AddVariantLinks, AddVariantRecords } from "./addVariantRecord";
import { AddVariantRef } from "./addVariantRef";


export class AddVariantHelper{
    public static showHideSubmittingStatus(show: boolean){
        if(AddVariantRef.loadingStatusContainer) {
            if(show) {
                AddVariantRef.loadingStatusContainer.show();
            } else {
                AddVariantRef.loadingStatusContainer.hide();
            }
        }

    }
}

export class AddVariantFactory{

    public static createAddVariantContainer(): YanexDiv{
        return new YanexDiv(null, {
            className: "w-full h-full flex items-center justify-center relative py-2 px-3",
        });
    }

    public static addVariantButtons(form: YanexForm): void {
        for (const button of AddVariantRecords.addVariantFieldButtons) {
            const butt = new YanexButton(form, {
                text:button,
                className:"py-2 rounded",
                hoverBg: "specialColorBg"
            });

            if(button === "Clear Field") {
                butt.hoverFg = "disabledColorFg"
                butt.hoverBg = "disabledColorBg"
            } 
            (butt.widget as HTMLButtonElement).type = "button";
            butt.addEventListener("click", AddVariantEvents.addVariantButtonFieldsClicked)
        }
    }

    public static addSubmittingStatus(): void {
        if(AddVariantRef.addVariantForm) {
            const container = new YanexDiv(AddVariantRef.addVariantForm, {
                className: "flex gap-1 hidden",
                bg:'extraBg'
            })

            new YanexDiv(container, {
                className: "animate-spin w-[20px] h-[20px] rounded-sm",
                bg:"specialColorBg"
            })

             new YanexHeading(container, "h1", {
                text: "Submitting",
                fg:"lighterFg"
            })
            AddVariantRef.loadingStatusContainer = container;
        }
    }
}

export class AddVariantRequests{
    public static async addVariant(payload: Record<string, any>): Promise<FetchUtilityRawProcessedResponse>{
        const fetchUtil = new FetchUtility("POST", "json", payload, "json");
        const response = await fetchUtil.start(AddVariantLinks.addVariantLink);
        return fetchUtil.processResponse(response);
    }
}