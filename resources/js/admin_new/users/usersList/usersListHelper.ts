import { Strings } from "../../../packages/datatypeHelpers";
import { DataStatusReturnType } from "../../../packages/interfaces";
import { FetchUtilityRawProcessedResponse } from "../../../packages/typing";
import { FetchUtility } from "../../../packages/utilities";
import YanexTreeview from "../../../packages/widgets/yanexWidgetPackages/yanexTreeview";
import { YanexButton, YanexDiv, YanexForm, YanexHeading } from "../../../packages/widgets/yanexWidgets";
import { PublicLinks, PublicStringValues } from "../../../public";
import { AdminRefs } from "../../adminRef";
import { UserRefs } from "../usersRef";
import { UserListEvents } from "./usersListBundle";
import { UserListLinks, UserListRecord, UserNavButtons } from "./usersListRecord";
import { UserListRef, UserListStorage } from "./usersListRef";


export class UserListFactory{

    public static createUsersList(): void{
        const yanexContainer = new YanexDiv(AdminRefs.adminContentContainer, {
            bg:"lighterBg",
            className: "w-full h-screen max-h-screen"
        })
        UserListRef.userListParent = yanexContainer;
        // Create intro
        new YanexHeading(yanexContainer, "h1", {
            text:UserListRecord.updateUserIntro.title,
            className:"font-bold text-lg pt-2 pl-2"
        }, {
            textAlignment: "w"
        })

        // Create intro
        new YanexHeading(yanexContainer, "h6", {
            text:UserListRecord.updateUserIntro.message,
            className:"pl-2 text-sm",
            fg:"lighterFg",
            
        }, {
            textAlignment: "w"
        })

        // Create nav bar
        const userListNav = new YanexDiv(yanexContainer, {
            bg:"lighterBg",
            className: "w-full flex gap-2 items-center justify-end py-2 px-2"
        })

        for(const userNavButton of UserListRecord.userNavButtons) {
            const button = new YanexButton(userListNav, {
                className: "rounded px-3 py-1 flex",
                text:userNavButton,
                hoverBg:"extraBg"
            }, {
                state: false
            })
            button.addDataset(PublicStringValues.widgetIconDataSetTitle, UserListRecord.userNavButtonsIcons[userNavButton]);

            UserListRef.userNavButtons[userNavButton] = button;
        }


        const yanexTreeview = new YanexTreeview(null, 
            UserListRecord.yanexTreeviewColumns, {
                selectMode: "browse",
                noRowText: "No Users Were Created. Create one by clicking \"Add User\""
            });
        UserListRef.userTreeview = yanexTreeview;
    }

        public static addUserListButtons(form: YanexForm): void {
            for (const button of UserListRecord.updateUserFieldButtons) {
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
                butt.addEventListener("click", (e) => {UserListEvents.userListFormButtonListener(e)})
            }
        }

            public static addSubmittingStatus(): void {
                if(UserListRef.userListForm) {
                    const container = new YanexDiv(UserListRef.userListForm, {
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
                    UserListRef.loadingContainer = container;
                }
            }
    
}

export class UserListHelper {
    /**
     * Save the users that was fetched from the database
     */
    public static saveUsers(usersData: Record<number, Record<string, any>>): void {
        for(const userData of Object.values(usersData)) {
            UserListStorage.users[userData.var_id] = userData;
        }
    }
    public static clearUserFields(): void {
        for(const yanex of Object.values(UserRefs.updateUserFields)){
            yanex.value = ""
        }
    }


    /**
    * Populate the user list treeview
     */
    public static populateUserTreeview(users: Array<Record<string, any>>): void {
        console.log(users, "USERs");
        if(UserListRef.userTreeview) {
            for(const userData of users) {
                UserListRef.userTreeview.addRow([
                    userData.user_id,
                    userData.user_username,
                    Strings.toTitleCase(userData.user_status)
                ])
            }
        }
    }

    /**
     * Add event listener to the users buttons
     */
    public static addUserButtonsEventListener(): void {
        for (const [userButtonText, yanexButton] of Object.entries(UserListRef.userNavButtons)) {
            switch(userButtonText as UserNavButtons) {
                case "Update User":
                    yanexButton.addEventListener("click", (e) => {UserListEvents.userListNavButtonListener(e)});
                    break;
            }
        }
    }

    /**
     * Get the user selected
     */
    public static getSelectedUserData(): Array<Record<string, any>> | null{
        const treeview = UserListRef.userTreeview;
        if(treeview) {
            const data = treeview.getActivatedRowData();
            return data;
        }
        return null
    }

    /**
     * Get the submitted user data
     */
    public static getSubmittedUserData(): Record<string, any> | null {
        if(UserListRef.userTreeview) {
            const rowData = UserListRef.userTreeview.getActivatedRowData("kebabcase");
            if(rowData.length > 0) {
                return rowData[0]
            }
        }

        return null
    }

    /**
     * Check submitted user
     */
    public static checkSubmittedUser(): DataStatusReturnType {
        const submittedData = UserListHelper.getSubmittedUserData();
        if(submittedData) {
            // Get the data written by user
            if(UserListRef.userListForm) {
                const formData = new FormData(UserListRef.userListForm.widget as HTMLFormElement);

                Object.assign(submittedData, Object.fromEntries(formData))

                for (const [dataKey, dataValue] of Object.entries(submittedData)) {
                    if(dataValue === "" && !["password", "confirm-password"].includes(dataKey) || (
                        ["password", "confirm-password"].includes(dataKey) &&
                        (
                            (dataKey === "password" && dataValue === "" && submittedData["confirm-password"] !== "") ||
                            (dataKey === "confirm-password" && dataValue === "" && submittedData["password"] !== "") 
                        )
                    )) {

                        return {
                            data: submittedData,
                            status: false,
                            message: `The field ${Strings.convertCase(dataKey, "kebabcase", true, "title")} is required.`
                        }
                    }
                }

                if((submittedData["password"] !== "" ||
                     submittedData["confirm-password"] !== "") &&
                    submittedData["password"] !== submittedData["confirm-password"]) {
                    return {
                        "data": submittedData,
                        "status": false,
                        "message": "Password mismatch."
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
            message: "Please select a user to be updated in the treeview"
        }
    }

    /**
     * Add a listener to the treeview rows
     */
    public static addUserTreeviewSelectedEvent(): void{

        const treeview = UserListRef.userTreeview;
        if(treeview){
            treeview.addEventListener("rowSelect", UserListEvents.userTreeviewRowSelected);
            treeview.addEventListener("rowDeselect", UserListEvents.userTreeviewRowDeselected)
        }
    }

    /**
     * Disable/Enable nav buttons state
     * @param state If true, enable the nav buttons. Otherwise, disable.
     */
    public static setNavButtonsState(state: boolean){

        for(const [buttonKey, button] of Object.entries(UserListRef.userNavButtons)) {
            button.setState(state)
        }
    }
}

export class UserListRequests{
    public static async getProductUsers(): Promise<FetchUtilityRawProcessedResponse> {
        const fetchUtil = new FetchUtility("GET", "json");
        const response = await fetchUtil.start(UserListLinks.getUsersLink);
        return fetchUtil.processResponse(response);
    }

    public static async updateUser(payload: Record<string, any>): Promise<FetchUtilityRawProcessedResponse>{
        const fetchUtil = new FetchUtility("POST", "json", payload, "json");
        const response = await fetchUtil.start(UserListLinks.updateUserLink);
        return fetchUtil.processResponse(response);
    
    }
}