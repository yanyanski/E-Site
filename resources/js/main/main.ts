/**
 * Handles the main events on the main elements (Navigation Bar, Footer, etc)
 * The <main> element is handled in the content folder
 */
import { CookieUtility } from "../packages/utilities"
import { YanexWidgetBundle } from "../packages/widgets/yanexWidgetBundle"
import { YanexWidgetsHelper } from "../packages/widgets/yanexWidgetsHelper"
import { YanexThemeTCSS } from "../packages/widgets/yanexWidgetTheme/yanexTCSSTheme"
import { YanexThemes } from "../packages/widgets/yanexWidgetTheme/yanexThemeTypes"
import { PublicStringValues } from "../public"
import { MainBundle } from "./mainBundle"

document.addEventListener("DOMContentLoaded", function(e) {

    // Get the theme saved settings saved in the cookie. Defaults to light if no cookie is acquired.
    let theme = CookieUtility.getCookie("theme");
    console.log(theme)

    if(theme === null) {
        CookieUtility.setCookie("theme", "light", 365)
        theme = "light"
    }
    YanexWidgetBundle.initialize({
        imageDatasetIconTitle: PublicStringValues.widgetIconDataSetTitle
    })
    
    YanexThemeTCSS.initialize(theme as YanexThemes)
    MainBundle.initialize()
})