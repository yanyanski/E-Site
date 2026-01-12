import { YanexConstantColors, YanexConstantColorsSchemaReturn, YanexThemeColorsSchema, YanexThemeColorsSchemaReturn, YanexThemeSchemaReturn, YanexWidgetBgTheme, YanexWidgetBorderTheme, YanexWidgetFgTheme} from "./yanexThemeInterfaces";
import { YanexThemes, YanexWidgetBgThemeTypes } from "./yanexThemeTypes";



let activeTheme: YanexThemes = "dark";

class YanexThemeTCSSList{

    public static constantColors(): YanexConstantColorsSchemaReturn{
        return {
            bg: {
                red: "bg-red-500",
                green: "bg-green-500",
                yellow: "bg-yellow-500"
            },
            fg: {
                red: "text-red-500",
                green: "text-green-500",
                yellow: "text-yellow-500"
            },
            border: {
                red: "border-red-500",
                green: "border-green-500",
                yellow: "border-yellow-500"
            }
        }
    } 

    public static darkTheme(): YanexThemeSchemaReturn {
        const constantColors = this.constantColors();
        
        return {
            fg: Object.assign(constantColors["fg"], 
                {
                    defaultFg: "text-white",           
                    lighterFg: "text-neutral-200",
                    strongerFg: "text-neutral-400",
                    extraFg: "text-black", 
                    contrastFg: "text-neutral-900",
                    lighterContrastFg: "text-neutral-800",
                    strongerContrastFg: "text-neutral-950", 
                    specialColorFg: "text-green-500",
                    lighterSpecialColorFg: "text-green-400", 
                    extraSpecialColorFg: "text-orange-400",
                    disabledColorFg: "text-red-600", 
                },
            ),
            bg : Object.assign(constantColors["bg"], 
                {
                    defaultBg: "bg-neutral-900",             
                    lighterBg: "bg-neutral-800",
                    strongerBg: "bg-neutral-950",
                    extraBg: "bg-black", 
                    contrastBg: "bg-white",
                    lighterContrastBg: "bg-neutral-200",
                    strongerContrastBg: "bg-neutral-400", 
                    specialColorBg: "bg-green-500",
                    lighterSpecialColorBg: "bg-green-400", 
                    extraSpecialColorBg: "bg-orange-400",
                    disabledColorBg: "bg-neutral-600",
                }
            ),
            border: Object.assign(constantColors["border"], {
                defaultBorder: "border-neutral-900",
                lighterBorder: "border-neutral-800",
                strongerBorder: "border-neutral-950",
                extraBorder: "border-black", 
                contrastBorder: "border-white",
                lighterContrastBorder: "border-neutral-200",
                strongerContrastBorder: "border-neutral-400", 
                specialColorBorder: "border-green-500",
                lighterSpecialColorBorder: "border-green-400", 
                extraSpecialColorBorder: "border-orange-400",
                disabledColorBorder: "border-neutral-600",
            })
        }
    }
    
    public static lightTheme(): YanexThemeSchemaReturn | YanexConstantColorsSchemaReturn {

        const constantColors = this.constantColors();
        return {
            fg: Object.assign(constantColors["fg"],
                    {
                    defaultFg: "text-neutral-900",           
                    lighterFg: "text-neutral-700",
                    strongerFg: "text-neutral-800",
                    extraFg: "text-white", 
                    contrastFg: "text-white",
                    lighterContrastFg: "text-neutral-200",
                    strongerContrastFg: "text-neutral-100", 
                    specialColorFg: "text-green-600",
                    lighterSpecialColorFg: "text-green-500", 
                    extraSpecialColorFg: "text-orange-500",
                    disabledColorFg: "text-red-600", 
                },
            ),
            bg: Object.assign(constantColors["bg"], 
                    {
                    defaultBg: "bg-white",             
                    lighterBg: "bg-neutral-50",
                    strongerBg: "bg-neutral-100",
                    extraBg: "bg-neutral-200", 
                    contrastBg: "bg-neutral-900",
                    lighterContrastBg: "bg-neutral-800",
                    strongerContrastBg: "bg-neutral-700", 
                    specialColorBg: "bg-green-400",
                    lighterSpecialColorBg: "bg-green-300", 
                    extraSpecialColorBg: "bg-orange-400",
                    disabledColorBg: "bg-neutral-300", 
                },
            ),
            border: Object.assign(constantColors["border"], {
                lighterBorder: "border-neutral-50",
                strongerBorder: "border-neutral-100",
                extraBorder: "border-neutral-200", 
                contrastBorder: "border-neutral-900",
                lighterContrastBorder: "border-neutral-800",
                strongerContrastBorder: "border-neutral-700", 
                specialColorBorder: "border-green-500",
                lighterSpecialColorBorder: "border-green-400", 
                extraSpecialColorBorder: "border-orange-400",
                disabledColorBorder: "border-neutral-300", 
            })
        }
    }
}

export class YanexThemeTCSS{

    /**
     * The active bg used 
     */
    protected static activeBgTheme: YanexWidgetBgTheme= {
        defaultBg: "bg-neutral-900",             
        lighterBg: "bg-neutral-800",
        strongerBg: "bg-neutral-950",
        extraBg: "bg-black", 
        contrastBg: "bg-white",
        lighterContrastBg: "bg-neutral-200",
        strongerContrastBg: "bg-neutral-400", 
        specialColorBg: "bg-green-500",
        lighterSpecialColorBg: "bg-green-400", 
        extraSpecialColorBg: "bg-orange-400",
        disabledColorBg: "bg-neutral-600", 
        red: "bg-red-500",
        green: "bg-green-500",
        yellow: "bg-yellow-500"
    }

    /**
     * The active fg used 
     */
    protected static activeFgTheme: YanexWidgetFgTheme= {
        defaultFg: "text-white",           
        lighterFg: "text-neutral-200",
        strongerFg: "text-neutral-400",
        extraFg: "text-black", 
        contrastFg: "text-neutral-900",
        lighterContrastFg: "text-neutral-800",
        strongerContrastFg: "text-neutral-950", 
        specialColorFg: "text-green-500",
        lighterSpecialColorFg: "text-green-400", 
        extraSpecialColorFg: "text-orange-400",
        disabledColorFg: "text-red-600", 
        red: "text-red-500",
        yellow: "text-yellow-500",
        green: "text-green-500"
    }

    protected static activeBorderTheme: YanexWidgetBorderTheme = {
        defaultBorder: "border-neutral-900",
        lighterBorder: "border-neutral-800",
        strongerBorder: "border-neutral-950",
        extraBorder: "border-black", 
        contrastBorder: "border-white",
        lighterContrastBorder: "border-neutral-200",
        strongerContrastBorder: "border-neutral-400", 
        specialColorBorder: "border-green-500",
        lighterSpecialColorBorder: "border-green-400", 
        extraSpecialColorBorder: "border-orange-400",
        disabledColorBorder: "border-neutral-600",
        red: "border-red-500",
        yellow: "border-yellow-500",
        green: "border-green-500"
    }
    
    protected static rootColors: YanexThemeColorsSchemaReturn = {
        bg: {
            default: "neutral-900",             
            lighter: "neutral-800",
            stronger: "neutral-950",
            extra: "black", 
            contrast: "white",
            lighterContrast: "neutral-200",
            strongerContrast: "neutral-400", 
            specialColor: "green-500",
            lighterSpecialColor: "green-400", 
            extraSpecialColor: "orange-400",
            disabledColor: "neutral-600", 
            red: "red-500",
            green: "green-500",
            yellow: "yellow-500"
        }, 
        fg: {
            default: "white",           
            lighter: "neutral-200",
            stronger: "neutral-400",
            extra: "black", 
            contrast: "neutral-900",
            lighterContrast: "neutral-800",
            strongerContrast: "neutral-950", 
            specialColor: "green-500",
            lighterSpecialColor: "green-400", 
            extraSpecialColor: "orange-400",
            disabledColor: "red-600", 
            red: "red-500",
            yellow: "yellow-500",
            green: "green-500"
        }
    }


    /**
     * Initializes the theme to be used throughout the widgets
     * @param setTheme The theme to be used throughout the YanexWidgets
     */
    public static initialize(setTheme: YanexThemes = "light"): void{
        this.updateTheme(setTheme);
        this.updateRootColors()
    }

    /**
     * Update the theme used by yanex widgets
     * @param theme  The theme to be used throughout
     */
    public static updateTheme(theme: YanexThemes): void {
        const bgThemeSchema = YanexThemeTCSS.getBgThemeSchematics(theme);
        Object.assign(YanexThemeTCSS.activeBgTheme, bgThemeSchema.bg);
        Object.assign(YanexThemeTCSS.activeFgTheme, bgThemeSchema.fg);

        activeTheme = theme;
        console.log(YanexThemeTCSS.activeBgTheme)
    }

    /**
     * Update the root colors used throughout the theme
     */
    private static updateRootColors(): void {
        const currentBg = YanexThemeTCSS.activeBgThemeSchema;
        const currentFg = YanexThemeTCSS.activeFgThemeSchema;

        const bgColors = {} as YanexThemeColorsSchema;
        
        for(const [themeKey, themeBgColor] of Object.entries(structuredClone(currentBg))) {
            bgColors[(themeKey.replace("Bg", "")) as keyof YanexThemeColorsSchema] = themeBgColor.replace("bg-", "")
        }
        
        const fgColors = {} as YanexThemeColorsSchema;
        for(const [themeKey, themeFgColor] of Object.entries(currentFg)) {
            fgColors[(themeKey.replace("Fg", "")) as keyof YanexThemeColorsSchema] = themeFgColor.replace("text-", "") 
        }
        Object.assign(this.rootColors["bg"], bgColors);
        Object.assign(this.rootColors["fg"], fgColors)
    }

    /**
     * Get the theme colors
     * @param theme The theme color
     * @returns YanexWidgetTheme
     */
    public static getBgThemeSchematics(theme: YanexThemes): YanexThemeSchemaReturn | YanexConstantColorsSchemaReturn {
        console.log("LIGHT", YanexThemeTCSSList.darkTheme())
        switch(theme) {
            case "dark":
                return YanexThemeTCSSList.darkTheme();
            case "light":
                console.log("LIGHT", YanexThemeTCSSList.lightTheme())
                return YanexThemeTCSSList.lightTheme();
        }
    }


    /**
     * Get  the active bg theme schema
     */
    public static get activeBgThemeSchema(): YanexWidgetBgTheme{
        return YanexThemeTCSS.activeBgTheme;
    }

    /**
     * Get the active bg theme schema
     */
    public static get activeFgThemeSchema(): YanexWidgetFgTheme{
        return YanexThemeTCSS.activeFgTheme
    }
    /**
     * Get the active border theme schema
     */
    public static get activeBorderThemeSchema(): YanexWidgetBorderTheme {
        return YanexThemeTCSS.activeBorderTheme
    }

    public static get constantColors(): YanexConstantColorsSchemaReturn {
        return YanexThemeTCSSList.constantColors()
    }

    /**
     * Get the root colors used
     */
    public static get themeRootColors(): YanexThemeColorsSchemaReturn {
        return this.rootColors
    }
} 

