import { FetchUtilityRawProcessedResponse } from "../../../packages/typing";
import { FetchUtility } from "../../../packages/utilities";
import { YanexButton, YanexDiv, YanexForm, YanexHeading } from "../../../packages/widgets/yanexWidgets";
import { AdminRefs } from "../../adminRef";

import { AddUserEvents } from "./addUserBundle";
import { AddUserLinks, AddUserRecords } from "./addUserRecord";
import { AddUserRef } from "./adduserRef";



export class AddUserHelper{
    public static showHideSubmittingStatus(show: boolean){
        if(AddUserRef.loadingStatusContainer) {
            if(show) {
                AddUserRef.loadingStatusContainer.show();
            } else {
                AddUserRef.loadingStatusContainer.hide();
            }
        }

    }
}

export class AddUserFactory{

    public static createAddUserContainer(): YanexDiv{       
        const container = new YanexDiv(AdminRefs.adminContentContainer, {
            className: "w-full flex-1 flex items-center justify-center relative py-2 px-3",
        });
        
        return container
    }

    public static addUserButtons(form: YanexForm): void {
        for (const button of AddUserRecords.addUserFieldButtons) {
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
            butt.addEventListener("click", AddUserEvents.addUserButtonFieldsClicked)
        }
    }

    public static addSubmittingStatus(): void {
        if(AddUserRef.addUserForm) {
            const container = new YanexDiv(AddUserRef.addUserForm, {
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
            AddUserRef.loadingStatusContainer = container;
        }
    }
}

export class AddUserRequests{
    public static async addUser(payload: Record<string, any>): Promise<FetchUtilityRawProcessedResponse>{
        const fetchUtil = new FetchUtility("POST", "json", payload, "json");
        const response = await fetchUtil.start(AddUserLinks.addUserLink);
        return fetchUtil.processResponse(response);
    }
}