import { IconsBundle } from "../../../icons/iconsBundle";
import { IconsHelperRequest } from "../../../icons/iconsHelper";
import { Strings } from "../../../packages/datatypeHelpers";
import { FetchUtilityProcessedResponse } from "../../../packages/typing";
import YanexCustomModal from "../../../packages/widgets/yanexWidgetPackages/yanexCustomModal";
import YanexMessageModal from "../../../packages/widgets/yanexWidgetPackages/yanexMesssageModal";
import { YanexTreeviewEvent } from "../../../packages/widgets/yanexWidgetPackages/yanexTreeview";
import { UsersFactory, UsersHelper } from "../usersHelper";
import { UserListFactory, UserListHelper, UserListRequests } from "./usersListHelper";
import { UserListRecord, UserNavButtons, UserUpdateFormButtons } from "./usersListRecord";
import { UserListRef } from "./usersListRef";


export class UserListBundle {

    public static async initialize(): Promise<void> {

        if(!UserListRef.initialized) {
            UserListFactory.createUsersList();
            UserListHelper.addUserButtonsEventListener();
            UserListHelper.addUserTreeviewSelectedEvent();
            UserListRef.userTreeview!.show(UserListRef.userListParent)
            UserListRef.userTreeview!.addLoadingRow()
            
            UserListRef.initialized = true;
            const user = await this.getUsers();
            UserListRef.userTreeview!.hideLoadingRow()
            if(user.responseStatus) {
                UserListHelper.populateUserTreeview(user.data);
            } else {
                new YanexMessageModal(user.message, "okay")
            }

            await IconsHelperRequest.getImageIcons(Object.values(UserListRecord.userNavButtonsIcons));
            IconsBundle.setElementIcons(UserListRef.userListParent!)
        }

        if(UserListRef.userTreeview) {
            UserListRef.userTreeview.show(UserListRef.userListParent)
        }

    }

    public static async getUsers(): FetchUtilityProcessedResponse {

        const users = await UserListRequests.getProductUsers();
        if(users.responseStatus) {
            UserListHelper.saveUsers(users.data);
        }
        return users;
    }
}

export class UserListEvents{

    /**
     * Handle events from user nav buttons
     */
    public static userListNavButtonListener(event: PointerEvent): void {
        const button = event.target as HTMLButtonElement;
        const buttonText = button.textContent as UserNavButtons

        switch(buttonText) {
            case "Update User":
                if(UserListRef.userListModal === null) {
                    UserListRef.userListModal = new YanexCustomModal(null, 
                        600, 550, {
                            title: "Update User"
                        }
                    )
                    const form = UsersFactory.createUserField(
                        UserListRef.userListModal.modalDialog,
                        {
                            "userName": ""
                        }
                    ) 
                    UserListRef.userListForm = form;

                    UserListFactory.addUserListButtons(form)
                    UserListFactory.addSubmittingStatus()

                }
                if(UserListRef.userListModal) {
                    UserListRef.userListModal.show(document.body as HTMLBodyElement, true)
                    const data = UserListHelper.getSelectedUserData()

                    if(data && data.length > 0) {
                        UsersHelper.updateUserFormField(data[0])
                    }
                }

                break;
        }
        
    }

    public static async userListFormButtonListener(event: PointerEvent): Promise<void> {
        const button = event.target as HTMLButtonElement
        const buttonText = button.textContent

        switch (buttonText as UserUpdateFormButtons){
            case "Update User":
                const check = UserListHelper.checkSubmittedUser();
                if(check.status) {
                    // Show submitting status
                    if(UserListRef.loadingContainer) {
                        UserListRef.loadingContainer.show();
                    }

                    // Data submitted is ok
                    if(check.data) {
                        // Disable elements temporarily
                        if(UserListRef.userListForm) {
                            UserListRef.userListForm.setElementsState(["YanexButton", "YanexInput"], false)
                        }

                        const payload: Record<string, any>= {}
                        for(const [key, data] of Object.entries(check.data)) {
                            payload[Strings.toKebabCase(key, "lowercase")] = data
                        }

                        const response = await UserListRequests.updateUser(payload)

                        // Remove submittin status
                        if(UserListRef.loadingContainer) {
                            UserListRef.loadingContainer.hide();
                        }

                        if(response.responseStatus) {

                            // The response data from the server
                            const responseData = response.data;

                            if(responseData.status) {

                                // Update the treeview too
                                if(UserListRef.userTreeview) {
                                    const selectedRow = UserListRef.userTreeview.getActivatedRowIds();
                                    if(selectedRow.length > 0) {
                                        const rowId = selectedRow[0];
                                        UserListRef.userTreeview.updateRow(rowId, Array.from(Object.values(payload)))
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

                        if(UserListRef.userListForm) {
                            UserListRef.userListForm.setElementsState(["YanexButton", "YanexInput"], true)
                        }
                    }
                } else {
                    new YanexMessageModal(check.message, "okay")
                }

                // Close modal
                if(UserListRef.userListModal) {              
                    UserListRef.userListModal.close();
                }

            break;

            case "Clear Field":
                UserListHelper.clearUserFields()
            break;
        }
    }

    /**
     * handle if a row is seleceted
     * @param event Pointer Event
     */
    public static userTreeviewRowSelected(event: YanexTreeviewEvent): void {
        const treeview = event.treeview;

        if(treeview.selectedRowCount > 0) {
            UserListHelper.setNavButtonsState(true)
        }
    }

    public static userTreeviewRowDeselected(event: YanexTreeviewEvent): void {
        const treeview = event.treeview;
        UserListHelper.setNavButtonsState(treeview.selectedRowCount === 0? false : true)
    }
}