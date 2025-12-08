import { Strings } from "../packages/datatypeHelpers";
import {LoginCredentialsData, StatusReturnType } from "../packages/interfaces";
import { FetchUtilityRawProcessedResponse } from "../packages/typing";
import { FetchUtility } from "../packages/utilities";
import { LoginRecords, LoginRecordsLinks } from "./loginRecord";
import LoginRefs from "./loginRef";


export class LoginHelper{

    /**
     * Assigns the needed documents related to the login page
     */
    public static setEssentialDocElements() {
        LoginRefs.loginForm = document.getElementById(LoginRecords.LOGINFORMID) as (null | HTMLFormElement);
        LoginRefs.loginFormWrapper = document.getElementById(LoginRecords.LOGINFORMWRAPPERID) as (null | HTMLDivElement);
        LoginRefs.loginFormErrorLabel = document.getElementById(LoginRecords.LOGINERRORLABEL) as (null | HTMLLabelElement);
    }

    /**
     * Retrieves the entered data in the login form
     * @returns The the retrieved data as Record
     */
    public static getUserEnteredLoginData(): Record<string, unknown>{
        let returnVal = {
            "status": false
        }
         if(LoginRefs.loginForm !== null){
            const loginFormData = new FormData(LoginRefs.loginForm);
            const formData = Object.fromEntries(loginFormData)
            
            returnVal = Object.assign(returnVal, {
                ...formData,
                "status": true
            })
         } else {
            returnVal = Object.assign(returnVal, {
                "message": "Something went wrong. Please refresh the page"
            })
         }
         return returnVal
    }

    /**
     * Checks if the entered credentials in the login form are not empty.
     * @param getData If true, it'll include the entered credentials from the 
     * login form on its return value
     * @returns Returns the result of the check
     */
    public static checkUserEnteredCredentials(): StatusReturnType{
        let returnVal = {
            'status': true,
            'message': ""
        };
        const loginData = this.getUserEnteredLoginData();
        if(loginData.status){
            for (const [key, value] of Object.entries(loginData)){
                if (value === "") {
                    const message = `The field ${Strings.toTitleCase(key)} is required.`;
                    returnVal = Object.assign(returnVal, {
                        "message": message,
                        "status": false
                    })
                    break
                } 

            }
        } else{
            returnVal = Object.assign(returnVal, {
                "status": false,
                "message": loginData.message
            })
        }
        return returnVal
    }

    public static updateErrorLabel(value: string): void {
        if (LoginRefs.loginFormErrorLabel !== null){
            LoginRefs.loginFormErrorLabel.textContent = value
        }
    }


}

export class LoginHelperRequests{

    public static async checkUserCredentials(): Promise<FetchUtilityRawProcessedResponse>{

        const fetchUtil = new FetchUtility("POST", 
            "json", 
            LoginRefs.loginForm, 
            "json");
        const result = await fetchUtil.start(LoginRecordsLinks.LOGIN)
        return fetchUtil.processResponse(result)
    }
}