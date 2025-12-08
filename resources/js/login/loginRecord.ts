import { TitleLabelRecord } from "../packages/interfaces";


export class LoginRecord {
    public static loginTitle: TitleLabelRecord = {
        title: "Login",
        message: "Login using your username and password"
    }

    public static loginFields: Record<string, string> = {
        "username": "Username",
        "password": "Password"
    }

    public static loginFieldsIcons: Record<string, string> = {
        "username": "users.png",
        "password": "lock.png"
    }

    public static loginButtons: Record<string, string> = {
        "login": "Log In"
    }

    public static loginButtonsIcons: Record<string, string> = {
        "login": 'login.png'
    }
}

export class LoginLinks {
    public static loginLink: string = "/login"
    public static loginAuthLink: string = "/login/auth"
}