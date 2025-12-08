

export interface UserUpdateDataStructure{
    userName: string
}

export class UserRecords{

    public static userFields: Record<string, string> = {
        "username": "User Name",
        "status": "Status",
        "password": "Password",
        "confirm-password": "Confirm Password"
    }

    public static updateUserFields: Record<string, string> = {
        "username": "User Name",
        "status": "Status",
        "password": "New Password",
        "confirm-password": "Confirm New Password"
    }

    public static fieldsIcons: Record<string, string> = {
        "username": "users.png",
        "status": "status.png",
        "password": "lock.png",
        "confirm-password": "lock.png"
    }
    
    public static formLabels: Record<string, string> = {
        "addMessage": "Enter a new user for the products.",
        "updateMessage": "Update the selected user name"
    }

    public static userStatus: Record<string, string> = {
        "admin": "Admin",
        "user": "User",
        "blocked": "Blocked"
    }
}