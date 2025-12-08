import { AdminRecordsLink } from "../../admin_new/adminRecords";
import { IconsBundle } from "../../icons/iconsBundle";
import { IconsHelperRequest } from "../../icons/iconsHelper";
import { FetchUtility } from "../../packages/utilities";
import { YanexWidgetsHelper } from "../../packages/widgets/yanexWidgetsHelper";
import { LoginFactory, LoginHelper } from "./loginHelper";
import { LoginLinks, LoginRecord } from "./loginRecord";
import { LoginRef } from "./loginRef";

export class LoginBundle {
    public static async initialize(): Promise<void> {
        if(!LoginRef.initialized) {
            LoginFactory.createLoginModal();
            LoginFactory.createLoggingInStatus();
            const icons = [
                ...Object.values(LoginRecord.loginFieldsIcons),
                ...Object.values(LoginRecord.loginButtonsIcons)
            ]
            console.log(icons)
            await IconsHelperRequest.getImageIcons(icons)
            IconsBundle.setElementIcons(LoginRef.loginModal!.modalDialog)
            LoginRef.initialized = true
        } 

        LoginRef.loginModal!.show(null, true);
    }
}

export class LoginEvents {
    public static showPasswordClicked(e: PointerEvent): void {
        const passField = (LoginRef.loginFields["password"].widget as HTMLInputElement);

        if((LoginRef.showPasswordCheck.widget as HTMLInputElement).checked) {
             passField.type= "password"
        } else {
            passField.type = ""
        }
    }

    public static async loginButtonsClicked(e: PointerEvent): Promise<void> {
        const button = e.target as HTMLButtonElement
        const yanex = YanexWidgetsHelper.getYanexReference(button)
        switch(button.textContent) {
            case LoginRecord.loginButtons["login"]:
                const data = LoginHelper.getLoginCredentials();
                const check = LoginHelper.checkCredentialFields(data);

                if(check.status) {
                    LoginRef.statusLabel.hide();
                    LoginRef.statusContainer.show();

                    const fetchUtil = new FetchUtility("POST", "json", data, "json");
                    const start = await fetchUtil.start(LoginLinks.loginLink);
                    const response = await fetchUtil.processResponse(start);
                    console.log(response)
                    if(response.responseStatus) {
                        const responseData = response.data;
                        if(responseData.status)  {
                            window.location.href = AdminRecordsLink.adminLink;
                        } else {
                            LoginRef.statusLabel.text = responseData["message"];
                            LoginRef.statusLabel.show();
                        }

                    } else {
                        LoginRef.statusLabel.text = response.message;
                        LoginRef.statusLabel.show();
                    }
                    console.log(response)

                } else {
                    LoginRef.statusLabel.text = check.message;
                    LoginRef.statusLabel.show();
                }

                LoginRef.statusContainer.hide();
                break;
        }
    }
}