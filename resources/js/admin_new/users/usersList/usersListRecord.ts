import { YanexTreeviewColumnStructure } from "../../../packages/widgets/yanexWidgetPackages/yanexTreeview";


export type UserNavButtons = "Update User"

export type UserUpdateFormButtons = "Update User" | "Clear Field"
export class UserListRecord{

    public static yanexTreeviewColumns: Array<YanexTreeviewColumnStructure> = [
        {
            columnName: "Id",
            columnWidth:"w-fit"
        },
        {
            columnName: "Username"
        },
        {
            columnName: "Status"
        }, 
        
    ]
    

    public static userNavButtons: Array<UserNavButtons> = [
        "Update User",
    ];
    public static userNavButtonsIcons: Record<UserNavButtons, string> = {
        "Update User": "update.png"
    }

    public static updateUserFieldButtons: Set<string> = new Set([
        "Update User",
        "Clear Field"
    ]);

    public static updateUserIntro: Record<string, string> = {
        "title": "Users",
        "message": "Showing existing lists of created users"
    }
}

export class UserListLinks {
    public static updateUserLink: string = "/admin/users/update";
    public static getUsersLink: string = "/admin/users"
}