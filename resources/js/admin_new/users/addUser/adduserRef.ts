import { YanexDiv, YanexForm, YanexInput } from "../../../packages/widgets/yanexWidgets";


export class AddUserRef{

    public static initialized: boolean = false;

    public static addUserParent: YanexDiv | null = null;
    
    public static addUserForm: YanexForm | null = null;

    public static loadingStatusContainer: YanexDiv | null= null;
}