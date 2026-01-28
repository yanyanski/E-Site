import { CookieUtility } from "../packages/utilities";
import { YanexWidgetBundle } from "../packages/widgets/yanexWidgetBundle";
import { YanexThemeTCSS } from "../packages/widgets/yanexWidgetTheme/yanexTCSSTheme";
import { YanexThemes } from "../packages/widgets/yanexWidgetTheme/yanexThemeTypes";
import { PublicStringValues } from "../public";
import { LoginBundle } from "./loginBundle";


document.addEventListener("DOMContentLoaded", e => {

    let theme = CookieUtility.getCookie("theme");

    if(theme === null) {
        CookieUtility.setCookie("theme", "light", 365);
        theme = 'light'
    } 
    YanexWidgetBundle.initialize({
            imageDatasetIconTitle: PublicStringValues.widgetIconDataSetTitle
        })
    YanexThemeTCSS.initialize(theme as YanexThemes)

    LoginBundle.initialize()

})