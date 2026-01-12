
export type AddUserFieldButtons = "Add User" | "Clear Field"

export class AddUserRecords{

    public static addUserFieldButtons: Set<string> = new Set([
        "Add User",
        "Clear Field"
    ]);

    public static userFields: Record<string, string> = {
        "username": "User Name",
        "status": "Status",
        "new-password": "New Password",
        "confirm-new-password": "Confirm New Password"
    }

}

export class AddUserLinks {
    public static addUserLink: string = "/admin/users/add";

}