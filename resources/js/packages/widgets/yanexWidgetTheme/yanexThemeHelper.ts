import { YanexThemeTCSS } from "./yanexTCSSTheme";
import { YanexThemeColorsSchema, YanexThemeColorsSchemaReturn, YanexThemeSchemaReturn } from "./yanexThemeInterfaces";
import { YanexThemeRecord } from "./yanexThemeRecord";
import { YanexWidgetBgThemeTypes, YanexWidgetBorderThemeTypes, YanexWidgetFgThemeTypes } from "./yanexThemeTypes";



export class YanexThemeHelper{

    /**
     * Get the next bg color in line based on the group of the color
     * @param yanexThemeKey The color key
     */
    public static getNextBgColorInLine(yanexThemeKey: YanexWidgetBgThemeTypes | null | undefined): 
    YanexWidgetBgThemeTypes {

        if(!yanexThemeKey) return "lighterBg";

        const bgGroup = YanexThemeRecord.yanexBgDefaultGroup;
        const contrastGroup = YanexThemeRecord.yanexContrastBgGroup;
        const specialGroup = YanexThemeRecord.yanexSpecialBgGroup;

        if(bgGroup.includes(yanexThemeKey)) {
            const index = bgGroup.indexOf(yanexThemeKey) ;
            if(index === bgGroup.length -1 ) {
                return bgGroup[0] || "defaultBg"
            } else {
                return bgGroup[index + 1] || "defaultBg"
            }
        } else if (contrastGroup.includes(yanexThemeKey)) {
            const index = contrastGroup.indexOf(yanexThemeKey);
            if(index === contrastGroup.length - 1) {
                return contrastGroup[0] || "contrastBg"
            } else {
                return contrastGroup[index + 1] || "contrastBg"
            }
        } else if(contrastGroup.includes(yanexThemeKey)) {
            const index = specialGroup.indexOf(yanexThemeKey);
            if(index === specialGroup.length -1 ) {
                return specialGroup[0] || "specialColorBg"
            } else {
                return specialGroup[index + 1] || "specialColorBg"
            }
        }
        return YanexThemeRecord.yanexBgThemeColorKeys[YanexThemeRecord.yanexBgThemeColorKeys.length - 1] || "disabledColorBg"
    }

     /**
     * Get the next fg color in line based on the group of the color
     * @param yanexThemeKey The color key
     */
    public static getNextFgColorInLine(yanexThemeKey: YanexWidgetFgThemeTypes): 
    YanexWidgetFgThemeTypes {


        const fgGroup = YanexThemeRecord.yanexFgDefaultGroup;
        const contrastGroup = YanexThemeRecord.yanexContrastFgGroup;
        const specialGroup = YanexThemeRecord.yanexSpecialFgGroup;

        if(fgGroup.includes(yanexThemeKey)) {
            const index = fgGroup.indexOf(yanexThemeKey) ;
            if(index === fgGroup.length -1 ) {
                return fgGroup[0] || "defaultFg"
            } else {
                return fgGroup[index + 1] || "defaultFg"
            }
        } else if (contrastGroup.includes(yanexThemeKey)) {
            const index = contrastGroup.indexOf(yanexThemeKey);
            if(index === contrastGroup.length - 1) {
                return contrastGroup[0] || "contrastFg"
            } else {
                return contrastGroup[index + 1] || "contrastFg"
            }
        } else if(contrastGroup.includes(yanexThemeKey)) {
            const index = specialGroup.indexOf(yanexThemeKey);
            if(index === specialGroup.length -1 ) {
                return specialGroup[0] || "specialColorFg"
            } else {
                return specialGroup[index + 1] || "specialColorFg"
            }
        }
        return YanexThemeRecord.yanexFgThemeColorKeys[YanexThemeRecord.yanexFgThemeColorKeys.length - 1] || "disabledColorFg";

    }

    /**
     * Get the next border color in line based on the group of the color
     * @param yanexThemeKey The color key
     */
    public static getNextBorderColorInLine(yanexThemeKey: YanexWidgetBorderThemeTypes): 
    YanexWidgetBorderThemeTypes {


        const borderGroup = YanexThemeRecord.yanexBorderDefaultGroup;
        const contrastGroup = YanexThemeRecord.yanexContrastBorderGroup;
        const specialGroup = YanexThemeRecord.yanexSpecialBorderGroup;

        if(borderGroup.includes(yanexThemeKey)) {
            const index = borderGroup.indexOf(yanexThemeKey) ;
            if(index === borderGroup.length -1 ) {
                return borderGroup[0] || "defaultBorder"
            } else {
                return borderGroup[index + 1] || "defaultBorder"
            }
        } else if (contrastGroup.includes(yanexThemeKey)) {
            const index = contrastGroup.indexOf(yanexThemeKey);
            if(index === contrastGroup.length - 1) {
                return contrastGroup[0] || "contrastBorder"
            } else {
                return contrastGroup[index + 1] || "contrastBorder"
            }
        } else if(contrastGroup.includes(yanexThemeKey)) {
            const index = specialGroup.indexOf(yanexThemeKey);
            if(index === specialGroup.length -1 ) {
                return specialGroup[0] || "specialColorBorder"
            } else {
                return specialGroup[index + 1] || "specialColorBorder"
            }
        }
        return YanexThemeRecord.yanexBorderThemeColorKeys[YanexThemeRecord.yanexBorderThemeColorKeys.length - 1] || "disabledColorBorder";

    }

    /**
     * Get the current theme colors used by Yanex widgets
     */
    public static getCurrentThemeSchema(): YanexThemeSchemaReturn {
        return {
            bg: YanexThemeTCSS.activeBgThemeSchema,
            fg: YanexThemeTCSS.activeFgThemeSchema,
            border: YanexThemeTCSS.activeBorderThemeSchema
        }
    }
    /**
     * Get the roots of the current theme colors used. For e.g, 
     * bg-red-500 would instead be red-500
     */
    public static getCurrentThemeColorsUsed(): YanexThemeColorsSchemaReturn {
        return YanexThemeTCSS.themeRootColors
    }

}