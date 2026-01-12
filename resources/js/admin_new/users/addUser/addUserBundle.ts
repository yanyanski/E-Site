import { IconsBundle } from "../../../icons/iconsBundle";
import { IconsHelperRequest } from "../../../icons/iconsHelper";
import { LoadingBorder } from "../../../packages/utilities";
import YanexMessageModal from "../../../packages/widgets/yanexWidgetPackages/yanexMesssageModal";
import { AdminRefs } from "../../adminRef";
import { UsersFactory, UsersHelper } from "../usersHelper";
import { UserListHelper } from "../usersList/usersListHelper";
import { UserRecords } from "../usersRecord";
import { UserRefs } from "../usersRef";
import { AddUserFactory, AddUserHelper, AddUserRequests } from "./addUserHelper";
import { AddUserFieldButtons } from "./addUserRecord";
import { AddUserRef } from "./adduserRef";

export class AddUserBundle{


    public static async initialize(): Promise<void> {
        if(!AddUserRef.initialized) {
            const container = AddUserFactory.createAddUserContainer();
            AddUserRef.addUserParent = container;
            LoadingBorder.addLoadingBorder(container.widget, "top");

            const form = UsersFactory.createUserField(container)
            AddUserRef.addUserForm = form;

            AddUserFactory.addUserButtons(form)
            AddUserFactory.addSubmittingStatus()

            await IconsHelperRequest.getImageIcons(Object.values(UserRecords.fieldsIcons));
            IconsBundle.setElementIcons(AddUserRef.addUserParent)

            AddUserRef.initialized = true

        } else {
            if(AddUserRef.addUserParent){
                AddUserRef.addUserParent.show();
            }
        }
    }
}

export class AddUserEvents {
    public static async addUserButtonFieldsClicked(event: PointerEvent): Promise<void> {
        const button = event.target as HTMLButtonElement;

        const buttonText = button.textContent as AddUserFieldButtons

        switch(buttonText) {
            case "Add User":
                // Disable form elements
                const form = AddUserRef.addUserForm!;

                
                const enteredFields = UsersHelper.getUserFieldData();
                const check = UsersHelper.checkSubmittedUser(enteredFields);

                if(check.status) {

                    form.setElementsState(["YanexButton", "YanexInput"], false);
                    

                    // Add submitting loading
                    AddUserHelper.showHideSubmittingStatus(true)
                    const response = await AddUserRequests.addUser(enteredFields);
                    if(response.responseStatus) {
                        const responseData: Record<string, any> = response.data;
                        if(responseData.status) {

                            // Add User to the treeview
                            UserListHelper.populateUserTreeview([responseData.data])

                            // Save user
                            const userSavedId = responseData.data["user_id"] as number
                            const userdata = responseData.data;
                            UserListHelper.saveUsers({[userSavedId]: userdata})
                            new YanexMessageModal("User added successfully", "okay")

                        } else {
                            new YanexMessageModal(`Something went wrong. ${responseData["message"] || ""}`, "okay")
                        }

                        if(form) {
                            form.setElementsState(["YanexButton", "YanexInput"], true);
                            form.clearFields();
                        }

                    } else {
                        new YanexMessageModal(response.message, "okay");
                    }
                    AddUserHelper.showHideSubmittingStatus(false);
                    form.setElementsState(["YanexButton", "YanexInput"], true);
                } else {
                    new YanexMessageModal(check.message, "okay");
                }
                break;
        }
    }
}