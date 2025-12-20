/**
 * Handles the main events on the main elements (Navigation Bar, Footer, etc)
 * The <main> element is handled in the content folder
 */
import { YanexWidgetBundle } from "../packages/widgets/yanexWidgetBundle"
import { YanexWidgetsHelper } from "../packages/widgets/yanexWidgetsHelper"
import { YanexThemeTCSS } from "../packages/widgets/yanexWidgetTheme/yanexTCSSTheme"
import { PublicStringValues } from "../public"
import { MainBundle } from "./mainBundle"

document.addEventListener("DOMContentLoaded", function(e) {
    YanexWidgetBundle.initialize({
            imageDatasetIconTitle: PublicStringValues.widgetIconDataSetTitle
        })
    YanexThemeTCSS.initialize()
    MainBundle.initialize()
})
