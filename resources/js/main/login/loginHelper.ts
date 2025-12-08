import { Strings } from "../../packages/datatypeHelpers";
import { StatusReturnType } from "../../packages/interfaces";
import YanexCustomModal from "../../packages/widgets/yanexWidgetPackages/yanexCustomModal";
import { YanexButton, YanexDiv, YanexForm, YanexHeading, YanexInput, YanexLabel } from "../../packages/widgets/yanexWidgets";
import { PublicStringValues } from "../../public";
import { LoginEvents } from "./loginBundle";
import { LoginRecord } from "./loginRecord";
import { LoginRef } from "./loginRef";

export class LoginHelper {
    /**
     * Get the entered credential fields
     * @returns 
     */
    public static getLoginCredentials(): Record<string, string> {
        const returnVal: Record<string, string> = {};
        for(const [fieldName, fieldInput] of Object.entries(LoginRef.loginFields)) {
            returnVal[fieldName] = fieldInput.value || ""
        }
        return returnVal;
    }

    public static checkCredentialFields(credentials: Record<string, string>): StatusReturnType {
        for(const [fieldName, fieldValue] of Object.entries(credentials)) {
            if(!fieldValue || fieldValue === "") {
                return {
                    status: false,
                    message: `The field ${Strings.toTitleCase(fieldName)} is required.`
                }
            }
        }
        return {
            status: true,
            message: ""
        }
    }


}

export class LoginFactory {

    public static createLoginModal(): void {
        const modal = new YanexCustomModal(document.body as HTMLBodyElement, 
            500, 400, {
        })
        LoginRef.loginModal = modal;
        
        const titleContainer = new YanexDiv(modal.modalDialog, {
            className: "flex flex-col w-full py-2 px-3",
            bg: null
        })

        new YanexHeading(titleContainer, "h1", {
            className: "font-bold",
            fg: "specialColorFg",
            text: LoginRecord.loginTitle.title,
            bg:null
        }, {
            textAlignment: "w"
        })
        new YanexHeading(titleContainer, "h6", {
            className: "text-sm opacity-80",
            fg: "lighterFg",
            text: LoginRecord.loginTitle.message,
            bg:null
        }, {
            textAlignment: "w"
        })

        const fieldForm = new YanexForm(modal.modalDialog, {
            className: "w-full h-full flex flex-col gap-1",
            bg: null
        })

        for(const [fieldName, fieldTitle] of Object.entries(LoginRecord.loginFields)) {
            const fieldContainer = new YanexDiv(fieldForm, {
                className: "flex flex-col gap-2 w-full py-2 px-5",
                bg: null
            })

            const label = new YanexHeading(fieldContainer, "h1", {
                className: "w-full flex",
                text: fieldTitle,
                bg: null
            }, {
                textAlignment: "w"
            })

            label.addDataset(PublicStringValues.widgetIconDataSetTitle, 
                LoginRecord.loginFieldsIcons[fieldName]
            )

            const inp = new YanexInput(fieldContainer, {
                className: "w-full rounded-lg p-1 px-3",
                placeholder:  fieldTitle,
                bg: "lighterBg",
                name: fieldName,
                type: fieldName === "password"? "password" : undefined,

            })

            LoginRef.loginFields[fieldName] = inp
        }
        const checkBoxContainer = new YanexDiv(fieldForm, {
            className: "flex justify-end w-full",
            bg: null
        })

        const showPass = new YanexInput(checkBoxContainer, {
            type: "checkbox",
            id: "show-password"
        })

        const label = new YanexLabel(checkBoxContainer, {
            className: "flex text-sm opacity-80",
            text: "Show Password",
            for: "show-password",
            hoverFg: "specialColorFg"
        })
        LoginRef.showPasswordCheck = showPass
        label.addEventListener("click", (e) => {LoginEvents.showPasswordClicked(e)})

        for(const [loginButtonName, loginButton] of Object.entries(LoginRecord.loginButtons)) {
            const buttonContainer = new YanexDiv(fieldForm, {
                className: 'w-full flex flex-col px-3 py-3',
                bg: null
            })
            const button = new YanexButton(buttonContainer, {
                text: loginButton,
                className: "w-full flex rounded-lg px-2 py-2 justify-center max-h-[50px]",
                type: "button",
                bg: "specialColorBg",
                hoverBg: "lighterSpecialColorBg"
            })  
            button.addEventListener("click", (e) => {
                LoginEvents.loginButtonsClicked(e);
            })
            button.addDataset(PublicStringValues.widgetIconDataSetTitle, 
                LoginRecord.loginButtonsIcons[loginButtonName]
            )
        }
    }

    public static createLoggingInStatus(): void {
        const statusContainer = new YanexDiv(null, {
            className: "flex gap-1 px-3 py-2 hidden",
            bg: null
        })
        new YanexDiv(statusContainer, {
            className: "w-[20px] h-[20px] rounded animate-spin",
            bg: "specialColorBg"
        })

        new YanexHeading(statusContainer, "h1", {
            className: "text-md ",
            text: "Logging in..."
        })
        LoginRef.statusContainer = statusContainer;
        LoginRef.loginModal!.addContent(statusContainer)

        const statusLabel = new YanexHeading(null, "h1", {
            className: "flex text-sm p-1 hidden",
            fg: 'red',
            text: "Error"
        }, {
            textAlignment: "w"
        })
        LoginRef.statusLabel = statusLabel;
        LoginRef.loginModal!.addContent(statusLabel)
    }
}