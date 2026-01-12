
import { FetchUtilityRawProcessedResponse } from "../../../../packages/typing";
import { FetchUtility } from "../../../../packages/utilities";
import { YanexButton, YanexDiv, YanexForm, YanexHeading } from "../../../../packages/widgets/yanexWidgets";
import { AddProductTypeEvents } from "./addProductTypeBundle";
import { AddProductTypeLinks, AddProductTypeRecords } from "./addProductTypeRecord";
import { AddProductTypeRef } from "./addVariantRef";



export class AddProductTypeHelper{
    public static showHideSubmittingStatus(show: boolean){
        if(AddProductTypeRef.loadingStatusContainer) {
            if(show) {
                AddProductTypeRef.loadingStatusContainer.show();
            } else {
                AddProductTypeRef.loadingStatusContainer.hide();
            }
        }

    }
}

export class AddProductTypeFactory{

    public static createAddProductTypeContainer(): YanexDiv{
        return new YanexDiv(null, {
            className: "w-full h-full flex items-center justify-center relative py-2",
        });
    }

    public static addProductTypeButtons(form: YanexForm): void {
        for (const button of AddProductTypeRecords.addProductTypeFieldButtons) {
            const butt = new YanexButton(form, {
                text:button,
                className:"py-2 rounded",
                 hoverBg: "specialColorBg"
            }, {
                addHoverEffect: true
            });
            if(button === "Clear Field") {
                butt.hoverFg = "disabledColorFg"
                butt.hoverBg = "disabledColorBg"
            } 

            (butt.widget as HTMLButtonElement).type = "button";
            butt.addEventListener("click", (e) => {
                AddProductTypeEvents.addProductTypeButtonFieldsClicked(e)})
        }
    }

    public static addSubmittingStatus(): void {
        if(AddProductTypeRef.addProductTypeForm) {
            const container = new YanexDiv(AddProductTypeRef.addProductTypeForm, {
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
            AddProductTypeRef.loadingStatusContainer = container;
        }
    }
}

export class AddProductTypeRequests{
    public static async addProductType(payload: Record<string, any>): Promise<FetchUtilityRawProcessedResponse>{
        const fetchUtil = new FetchUtility("POST", "json", payload, "json");
        const response = await fetchUtil.start(AddProductTypeLinks.addProductTypeLink);
        return fetchUtil.processResponse(response);
    }
}