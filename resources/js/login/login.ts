import { YanexWidgetBundle } from "../packages/widgets/yanexWidgetBundle";
import { YanexThemeTCSS } from "../packages/widgets/yanexWidgetTheme/yanexTCSSTheme";
import { PublicStringValues } from "../public";
import { LoginBundle } from "./loginBundle";


document.addEventListener("DOMContentLoaded", e => {
    YanexWidgetBundle.initialize({
            imageDatasetIconTitle: PublicStringValues.widgetIconDataSetTitle
        })
    YanexThemeTCSS.initialize("dark")

    LoginBundle.initialize()

})