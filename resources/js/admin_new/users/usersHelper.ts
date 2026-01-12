import { Strings } from "../../packages/datatypeHelpers";
import { StatusReturnType } from "../../packages/interfaces";
import { HTMLElementUtilities } from "../../packages/utilities";
import { YanexDiv, YanexElement, YanexForm, YanexHeading, YanexInput, YanexLabel, YanexSelect } from "../../packages/widgets/yanexWidgets";
import { PublicStringValues } from "../../public";
import { NavBarRef } from "../navbar/navBarRef";
import { UsersBundleEvents } from "./usersBundle";
import { UserRecords, UserUpdateDataStructure } from "./usersRecord";
import { UserRefs } from "./usersRef";

export class UsersHelper{
    public static getUserFieldData(): Record<string, string> {
        const returnVal: Record<string, string> = {};
        for(const [keyName, yanexInput] of Object.entries(UserRefs.addUserFields)) {
            returnVal[keyName] = (yanexInput.widget as HTMLInputElement).value
        }
        return returnVal;
    }

    public static checkSubmittedUser(userData: Record<string, string>): StatusReturnType{
        for(const [key, data] of Object.entries(userData)){
            if(data === "") {
                return {
                    "status": false,
                    "message": `The field ${Strings.convertCase(key, "kebabcase", true, "title")} is required.`
                }
            }
        }

        // Check password
        if(userData["password"] !== userData["confirm-password"]) {
            return {
                "status": false,
                "message": "Password mismatch."
            }
        }

        return {
            "status": true,
            "message": ''
        }
    }

    public static updateUserFormField(data: Record<string, any>) {

        for(const [fieldKey, fieldData] of Object.entries(data)) {

            const yanex = UserRefs.updateUserFields[Strings.toKebabCase(fieldKey, "title")]
            if(yanex) {
                if(fieldKey === "Status") {
                    yanex.value = Strings.toKebabCase(fieldData, "title")
                } else {
                    yanex.value = fieldData
                }
            }
        }
    }
}

export class UsersFactory{

    /**
     * Create a user field. Throughout the app, this should only be called twice for add and update modes
     * @param defaultFieldData If the defaultFieldData is not null, it would treat these field as update mode. Else, add mode.
     */
    public static createUserField(
        parent: YanexElement, 
        defaultFieldData: UserUpdateDataStructure | null = null)
        : YanexForm {

        const form = new YanexForm(parent, {
            className:"w-full h-fit p-4 flex flex-col gap-2 overflow-y-auto scroll-modern",
            bg:"extraBg"
        });

        requestAnimationFrame(() => {
            const parentRect= parent.widget.getBoundingClientRect();
            const parentHeight = parentRect.height;
            
            form.widget.style.maxHeight = `${parentHeight}px`
        })

        const titleContainer = new YanexDiv(form, {
            className: "flex w-full p-2 flex-col pb-3",
            bg:null
        })
        new YanexHeading(titleContainer, "h1", {
            text:defaultFieldData ? "Update User" : "Add User",
            className:"font-bold w-full flex justify-center"
        }, {
            textAlignment: "w"
        });

        const messageText = !defaultFieldData ? UserRecords.formLabels.addMessage : UserRecords.formLabels.updateMessage;

        new YanexHeading(titleContainer, "h1", {
            text: messageText,
            fg:"lighterFg",
            className:"text-sm"
        }, {
            textAlignment: "w"
        });

        for(const [fieldKey, fieldTitle] of Object.entries(UserRecords.updateUserFields)){
            const fieldContainer = new YanexDiv(form, {
                className: 'pb-1 flex flex-col gap-1',
                bg: null
            });

            const fieldLabel = new YanexHeading(fieldContainer, "h1", {
                text:fieldTitle,
                bg:"extraBg",
                className: "py-1 font-bold flex"
            }, {
                textAlignment: "w"
            })
            fieldLabel.addDataset(PublicStringValues.widgetIconDataSetTitle, 
                UserRecords.fieldsIcons[fieldKey]
            )

            let entry;
            if(fieldKey !== 'status') {

                entry = new YanexInput(fieldContainer,
                    {
                        placeholder:fieldTitle,
                        className: "rounded w-full p-1 border-opacity-70",
                        name:fieldKey,
                        type:"combobox",
                        emptyValueBorder: 'red'
                    }
                );

                if(["password", "confirm-password"].includes(fieldKey)) {
                    (entry.widget as HTMLInputElement).type = "password"
                }

            } else {

                entry = new YanexSelect(fieldContainer,
                    {
                        placeholder:fieldTitle,
                        className: "rounded w-full p-1",
                        name:fieldKey,
                        options:UserRecords.userStatus,
                        hoverBg: "lighterBg"
                    }
                );

                
            }

            if(defaultFieldData) {
                UserRefs.updateUserFields[fieldKey] = entry;
                
            } else {
                UserRefs.addUserFields[fieldKey] = entry
            }
        }

        
        const showPassContainer = new YanexDiv(form, {
            className: "w-full p-2 flex justify-end",
            bg: null
        })

        const checkbox = new YanexInput(showPassContainer, {
            id: "user-form-show-password",
            type: "checkbox",
            bg: "lighterBg"
        })

        const label = new YanexLabel(showPassContainer, {
            for:checkbox.widget.id,
            text: "Show Password",
            hoverFg: "specialColorFg",
            className: "text-sm"
        })

        label.addEventListener("click", (e) => {
            console.log("HELLIO?")
            UsersBundleEvents.showPasswordClicked(e, checkbox)
        })
        return form;

    }

}