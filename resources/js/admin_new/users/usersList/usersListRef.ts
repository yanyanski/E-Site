import YanexCustomModal from "../../../packages/widgets/yanexWidgetPackages/yanexCustomModal";
import YanexTreeview from "../../../packages/widgets/yanexWidgetPackages/yanexTreeview";
import { YanexButton, YanexDiv, YanexForm } from "../../../packages/widgets/yanexWidgets";
import { UserNavButtons } from "./usersListRecord";


export class UserListRef{

    public static initialized: boolean = false;

    public static userListFormButtons: Record<string, YanexButton> = {};

    public static userListParent: YanexDiv | null = null;

    public static userTreeview: YanexTreeview | null = null;

    public static userNavButtons = {} as Record<UserNavButtons, YanexButton>;

    public static userListModal: YanexCustomModal | null = null;

    public static userListForm: YanexForm | null = null;

    public static loadingContainer: YanexDiv | null = null

    public static userId: number | null = null;

    public static userLoadingContainer: YanexDiv;
    
}

export class UserListStorage{
    // The users fetched from the database
    public static users: Record<number, Record<string, any>> = {};

}