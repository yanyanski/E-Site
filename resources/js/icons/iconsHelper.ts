import { Strings } from "../packages/datatypeHelpers";
import { FetchUtilityRawProcessedResponse } from "../packages/typing";
import { FetchUtility } from "../packages/utilities";
import { YanexElement } from "../packages/widgets/yanexWidgets";
import { YanexWidgetsHelper } from "../packages/widgets/yanexWidgetsHelper";
import { PublicLinks, PublicStringValues } from "../public";
import { IconsStorage } from "./iconsRef";


export class IconsHelper{

    /**
     * Sets the element icons that is marked with the yanex icon dataset
     * @param element The element containing the elements that needed to be iconnified
     */
    public static getElementsIconmarked(element: YanexElement | HTMLBodyElement): Array<YanexElement> {
        const queryCode = `[data-${Strings.toKebabCase(PublicStringValues.widgetIconDataSetTitle, "camelcase", true)}]`;
        if(element instanceof HTMLBodyElement) {
            const elements = element.querySelectorAll(queryCode);
            const returnVal: Array<YanexElement> = []
            for(const elem of elements){
                if(!(elem instanceof HTMLElement)) continue;
                const yanex = YanexWidgetsHelper.getYanexReference(elem);
                
                if(!yanex) continue;
                returnVal.push(yanex)
            }
            return returnVal
        }
        return element.querySelectorAll(queryCode, true);
        
    }

    /**
     * Gets the Encoded image (with base64 encoding).
     * @param imageTitle The title of the image
     */
    public static getIconBase64Encoded(imageTitle: string): null | Base64URLString {
        const image = IconsStorage.fetchedIcons[imageTitle];
        if(image) return image;
        return null;
    }
}

export class IconsHelperRequest{
    public static async getImageIcons(iconTitle: string | Array<string>): Promise<Record<string, Base64URLString | null>> {
        if(typeof iconTitle === "string") {
            iconTitle = [iconTitle]
        }
        let imageReturnStorage: Record<string, Base64URLString | null> = {};

        // Remove already prefetched icons
        let icons: Array<string> = [];
        for(const icon of iconTitle) {
            const ic = IconsStorage.fetchedIcons[icon]

            if(ic === undefined) {

                icons.push(icon)
            } else {
                imageReturnStorage[icon] = ic
            }
        }


        if(icons.length !== 0) {
            const payload = {
                images: icons
            }
            const fetchUtil = new FetchUtility("POST", "json", payload, "json");
            const resp = await fetchUtil.start(PublicLinks.GETICONS, undefined, 20000, false);
            const process =await fetchUtil.processResponse(resp);
            
            if(process.responseStatus) {
                const icData = process.data;
                if(icData) {
                    for(const [iconTitle, encodedUri] of Object.entries(icData)) {
                        imageReturnStorage[iconTitle] = encodedUri as Base64URLString | null;
                        IconsStorage.fetchedIcons[iconTitle] = encodedUri as Base64URLString | null
                    }
                }
            }
        }

        return imageReturnStorage
    }
}