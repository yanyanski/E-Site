import { NavBarRef } from "../admin_new/navbar/navBarRef";
import { YanexElement } from "../packages/widgets/yanexWidgets";
import { PublicStringValues } from "../public";
import { IconsHelper, IconsHelperRequest } from "./iconsHelper";
import { IconsRecords } from "./iconsRecords";
import { IconsStorage } from "./iconsRef";


export class IconsBundle{

    /**
     * Sets the icons of the elements marked with the icon dataset title.
     * @param element The main parent element of the elements to be added with the icons
     */
    public static setElementIcons(element: YanexElement | HTMLBodyElement): void {
        const elements = IconsHelper.getElementsIconmarked(element);
        for(const elem of elements) {
            const imageIconTitle = elem.getDataset(PublicStringValues.widgetIconDataSetTitle);
            if(!imageIconTitle) continue;

            const image = IconsHelper.getIconBase64Encoded(imageIconTitle);

            elem.setIcon(image)
        }
    }
}
