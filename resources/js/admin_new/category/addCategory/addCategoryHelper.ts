import { FetchUtilityRawProcessedResponse } from "../../../packages/typing";
import { FetchUtility } from "../../../packages/utilities";
import { YanexButton, YanexDiv, YanexForm, YanexHeading } from "../../../packages/widgets/yanexWidgets";
import { AddCategoryEvents } from "./addCategoryBundle";
import { AddCategoryLinks, AddCategoryRecords } from "./addCategoryRecord";
import { AddCategoryRef } from "./addCategoryRef";



export class AddCategoryHelper{
    public static showHideSubmittingStatus(show: boolean){
        if(AddCategoryRef.loadingStatusContainer) {
            if(show) {
                AddCategoryRef.loadingStatusContainer.show();
            } else {
                AddCategoryRef.loadingStatusContainer.hide();
            }
        }

    }
}

export class AddCategoryFactory{

    public static createAddCategoryContainer(): YanexDiv{
        return new YanexDiv(null, {
            className: "w-full h-full flex items-center justify-center relative py-2 px-3",
        });
    }

    public static addCategoryButtons(form: YanexForm): void {
        for (const button of AddCategoryRecords.addCategoryFieldButtons) {
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
            butt.addEventListener("click", AddCategoryEvents.addCategoryButtonFieldsClicked)
        }
    }

    public static addSubmittingStatus(): void {
        if(AddCategoryRef.addCategoryForm) {
            const container = new YanexDiv(AddCategoryRef.addCategoryForm, {
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
            AddCategoryRef.loadingStatusContainer = container;
        }
    }
}

export class AddCategoryRequests{
    public static async addCategory(payload: Record<string, any>): Promise<FetchUtilityRawProcessedResponse>{
        const fetchUtil = new FetchUtility("POST", "json", payload, "json");
        const response = await fetchUtil.start(AddCategoryLinks.addCategoryLink);
        return fetchUtil.processResponse(response);
    }
}