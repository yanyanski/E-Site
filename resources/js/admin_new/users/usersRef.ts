import { YanexButton, YanexDiv, YanexInput, YanexSelect } from "../../packages/widgets/yanexWidgets";


export class UserRefs{
    
    public static initialized: boolean = false;

    // Add User References
    public static addUserFields: Record<string, YanexInput> = {};

    // Update User references
    public static updateUserFields: Record<string, YanexInput | YanexSelect> = {};
    
    // The root parent of the add user
    public static addUserRootParent: YanexDiv | null = null;

}