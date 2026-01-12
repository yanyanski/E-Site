import { YanexInput } from "../../packages/widgets/yanexWidgets";
import { AddUserRef } from "./addUser/adduserRef";
import { UserRefs } from "./usersRef";


export class UsersBundleEvents {
    public static showPasswordClicked(event: PointerEvent, checkbox: YanexInput): void {
        const passFields: Array<string> = ["password", "confirm-password"];
        for(const passField of passFields) {
            const input = UserRefs.addUserFields[passField];
            if(input) {
                if((checkbox.widget as HTMLInputElement).checked) {
                    (input.widget as HTMLInputElement).type = "password"
                } else {
                    (input.widget as HTMLInputElement).type = ""
                }
                
            } 
        }
        
    }
}