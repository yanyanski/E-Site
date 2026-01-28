
import { CookieUtility } from "../packages/utilities";
import { YanexWidgetBundle } from "../packages/widgets/yanexWidgetBundle";
import { YanexThemeTCSS } from "../packages/widgets/yanexWidgetTheme/yanexTCSSTheme";
import { YanexThemes } from "../packages/widgets/yanexWidgetTheme/yanexThemeTypes";
import { PublicStringValues } from "../public";
import { AdminBundle } from "./adminBundle";


document.addEventListener("DOMContentLoaded", () => {
    YanexWidgetBundle.initialize({
        imageDatasetIconTitle: PublicStringValues.widgetIconDataSetTitle
    })
    let theme = CookieUtility.getCookie("theme");

    if(theme == null) {
        CookieUtility.setCookie("theme", "light", 365)
        theme = "light"
    }
    YanexThemeTCSS.initialize(theme as YanexThemes);
    AdminBundle.initialize()
})