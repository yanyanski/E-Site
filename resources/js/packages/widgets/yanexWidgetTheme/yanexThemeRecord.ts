import { YanexConstantColors, YanexWidgetBgTheme } from "./yanexThemeInterfaces";
import { YanexWidgetBgThemeTypes, YanexWidgetBorderThemeTypes, YanexWidgetFgThemeTypes } from "./yanexThemeTypes";


export class YanexThemeRecord {
    public static yanexBgThemeColorKeys: Array<YanexWidgetBgThemeTypes> = [
        "defaultBg",
        "lighterBg",
        "strongerBg",
        "extraBg" , 
        "contrastBg" , 
        "lighterContrastBg" ,
        "strongerContrastBg" ,
        "specialColorBg" , 
        "lighterSpecialColorBg" ,
        "extraSpecialColorBg" , 
        "disabledColorBg"
    ]


    public static yanexBgDefaultGroup: Partial<Array<YanexWidgetBgThemeTypes>> = [
        "defaultBg",
        "lighterBg",
        "strongerBg",
        "extraBg" , 
    ]

    public static yanexContrastBgGroup: Partial<Array<YanexWidgetBgThemeTypes>> = [
        "contrastBg" , 
        "lighterContrastBg" ,
        "strongerContrastBg" ,
    ]

    public static yanexSpecialBgGroup: Partial<Array<YanexWidgetBgThemeTypes>> = [
        "specialColorBg" , 
        "lighterSpecialColorBg" ,
        "extraSpecialColorBg" , 
    ]

    public static yanexFgThemeColorKeys: Partial<Array<YanexWidgetFgThemeTypes>> = [
        "defaultFg",
        "lighterFg",
        "strongerFg",
        "extraFg" , 
        "contrastFg" , 
        "lighterContrastFg" ,
        "strongerContrastFg" ,
        "specialColorFg" , 
        "lighterSpecialColorFg" ,
        "extraSpecialColorFg" , 
        "disabledColorFg"
    ]

    public static yanexFgDefaultGroup: Partial<Array<YanexWidgetFgThemeTypes>> = [
        "defaultFg",
        "lighterFg",
        "strongerFg",
        "extraFg" , 
    ]

     public static yanexContrastFgGroup: Partial<Array<YanexWidgetFgThemeTypes>> = [
        "contrastFg" , 
        "lighterContrastFg" ,
        "strongerContrastFg" ,
    ]

    public static yanexSpecialFgGroup: Partial<Array<YanexWidgetFgThemeTypes>> = [
        "specialColorFg" , 
        "lighterSpecialColorFg" ,
        "extraSpecialColorFg" , 
    ]

    public static yanexBorderThemeColorKeys: Partial<Array<YanexWidgetBorderThemeTypes>> = [
        "defaultBorder",
        "lighterBorder",
        "strongerBorder",
        "extraBorder" , 
        "contrastBorder" , 
        "lighterContrastBorder" ,
        "strongerContrastBorder" ,
        "specialColorBorder" , 
        "lighterSpecialColorBorder" ,
        "extraSpecialColorBorder" , 
        "disabledColorBorder"
    ]

    public static yanexBorderDefaultGroup: Partial<Array<YanexWidgetBorderThemeTypes>> = [
        "defaultBorder",
        "lighterBorder",
        "strongerBorder",
        "extraBorder" , 
    ]

     public static yanexContrastBorderGroup: Partial<Array<YanexWidgetBorderThemeTypes>> = [
        "contrastBorder" , 
        "lighterContrastBorder" ,
        "strongerContrastBorder" ,
    ]

    public static yanexSpecialBorderGroup: Partial<Array<YanexWidgetBorderThemeTypes>> = [
        "specialColorBorder" , 
        "lighterSpecialColorBorder" ,
        "extraSpecialColorBorder" , 
    ]
}