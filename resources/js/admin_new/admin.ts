import { IconsBundle } from "../icons/iconsBundle";
import { YanexWidgetBundle } from "../packages/widgets/yanexWidgetBundle";
import { YanexThemeTCSS } from "../packages/widgets/yanexWidgetTheme/yanexTCSSTheme";
import { PublicStringValues } from "../public";
import { AdminBundle } from "./adminBundle";


document.addEventListener("DOMContentLoaded", () => {
    YanexWidgetBundle.initialize({
        imageDatasetIconTitle: PublicStringValues.widgetIconDataSetTitle
    })
    YanexThemeTCSS.initialize("dark")
    AdminBundle.initialize()
})