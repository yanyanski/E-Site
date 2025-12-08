
import { AdminRecordsLink } from "../admin_new/adminRecords";
import { LoadingBorder} from "../packages/utilities";
import YanexMessageModal from "../packages/widgets/yanexWidgetPackages/yanexMesssageModal";
import { LoginHelper, LoginHelperRequests } from "./loginHelper";
import LoginRefs from "./loginRef";


export class LoginBundle{

    public static initialize(): void {
        LoginHelper.setEssentialDocElements();

        // Add event listeners
        // -> Login Form
        if(LoginRefs.loginForm !== null){
            LoginRefs.loginForm.addEventListener("submit", this.login);
        }

    }

    public static async login(e: Event): Promise<void> {
        e.preventDefault();
        console.log("CHECKING?")

        // Check the user's entered credentials
        const check = LoginHelper.checkUserEnteredCredentials();
        if (check.status === false){
            LoginHelper.updateErrorLabel(check.message)
            return
        }

        if(LoginRefs.loginFormWrapper !== null){
            LoadingBorder.addLoadingBorder(LoginRefs.loginFormWrapper, "top");
        }
        const loginResult = await LoginHelperRequests.checkUserCredentials();
        if(loginResult.responseStatus){
            const serverRes = loginResult.data;
            if(serverRes["status"] === false){
                if (LoginRefs.loginFormWrapper !== null){
                    LoadingBorder.removeLoadingBorder(LoginRefs.loginFormWrapper);
                }

                LoginHelper.updateErrorLabel(serverRes['message'])

            } else {
                // Proceed user login
                window.location.href = AdminRecordsLink.adminLink; 
            }
        } else {
            // Server error
             if (LoginRefs.loginFormWrapper !== null){
                    LoadingBorder.removeLoadingBorder(LoginRefs.loginFormWrapper);
                }

            new YanexMessageModal(loginResult.message, "okay")

        }
    }
}