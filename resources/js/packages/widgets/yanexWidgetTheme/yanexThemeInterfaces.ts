export interface YanexWidgetBgTheme extends YanexConstantColors{
    defaultBg: string;
    lighterBg: string;
    strongerBg: string;
    extraBg: string;
    contrastBg: string;
    lighterContrastBg: string;
    strongerContrastBg: string;
    specialColorBg: string;
    lighterSpecialColorBg: string;
    extraSpecialColorBg: string;
    disabledColorBg: string;
    
}

export interface YanexWidgetFgTheme extends YanexConstantColors{
    defaultFg: string;
    lighterFg: string;
    strongerFg: string;
    extraFg: string;
    contrastFg: string;
    lighterContrastFg: string;
    strongerContrastFg: string;
    specialColorFg: string;
    lighterSpecialColorFg: string;
    extraSpecialColorFg: string;
    disabledColorFg: string;
}

export interface YanexWidgetBorderTheme extends YanexConstantColors {
    defaultBorder: string,
    lighterBorder: string,
    strongerBorder: string,
    extraBorder: string,
    contrastBorder: string,
    lighterContrastBorder: string,
    strongerContrastBorder: string,
    specialColorBorder: string,
    lighterSpecialColorBorder: string,
    extraSpecialColorBorder: string,
    disabledColorBorder: string
}

export interface YanexConstantColors{
    red: string,
    green: string,
    yellow: string
}

export interface YanexConstantColorsSchemaReturn {
    fg: YanexConstantColors,
    bg: YanexConstantColors,
    border: YanexConstantColors
}

// export interface YanexWidgetHoverBgTheme{
//     defaultHoverBg: string;
//     lighterHoverBg: string;
//     strongerHoverBg: string;
//     extraHoverBg: string;
//     contrastHoverBg: string;
//     lighterContrastHoverBg: string;
//     strongerContrastHoverBg: string;
//     specialColorHoverBg: string;
//     lighterSpecialColorHoverBg: string;
//     extraSpecialColorHoverBg: string;
//     disabledColorHoverBg: string;
// }

export interface YanexThemeSchemaReturn{
    "bg": YanexWidgetBgTheme,
    "fg": YanexWidgetFgTheme,
    "border": YanexWidgetBorderTheme,
}

export interface YanexThemeColorsSchema extends YanexConstantColors {
        default: string;
        lighter: string;
        stronger: string;
        extra: string;
        contrast: string;
        lighterContrast: string;
        strongerContrast: string;
        specialColor: string;
        lighterSpecialColor: string;
        extraSpecialColor: string;
        disabledColor: string;
}


export interface YanexThemeColorsSchemaReturn {
    "bg": YanexThemeColorsSchema,
    "fg": YanexThemeColorsSchema,


}