import { YanexElement } from "./yanexWidgets";
import { YanexWidgetRecords } from "./yanexWidgetsRecords";
import { YanexWidgetRef, YanexWidgetStorage } from "./yanexWidgetsStorage";



export class YanexWidgetsHelper{

    /**
     * Create a unique yanex widget id
     */
    public static createYanexWidgetId(): string {
        const yanexId = `${YanexWidgetRecords.yanexWidgetDataAttrValuePrefix}${YanexWidgetRef.currentYanexId}`;
        YanexWidgetRef.currentYanexId += 1;
        return yanexId;
    }

    /**
     * Get the yanex reference
     */
    public static getYanexWidgetReference(yanexWidgetId: string): YanexElement | null {

        for(const yanexTypeRefs of Object.values(YanexWidgetStorage.yanexWidgetReferences)){
            if(yanexTypeRefs[yanexWidgetId]) {
                return yanexTypeRefs[yanexWidgetId]
            }
        }
        return null
    }

    /**
     * Get the yanex reference from a widget
     * @param element The element reference
     * @retunr null if the yanex reference is not found. Otherwise, the YanexElement
     */
    public static getYanexReference(element: HTMLElement): YanexElement | null {
        const yanexid = YanexWidgetsHelper.getYanexWidgetId(element)
        if(yanexid) return YanexWidgetsHelper.getYanexWidgetReference(yanexid);
        return null
    }

    /**
     * Get the yanex id of this element
     * @param element The element
     * @return The yanex widget id
     */
    public static getYanexWidgetId(element: HTMLElement): string | null {
        return element.dataset[YanexWidgetRecords.yanexWidgetDataAttrName] || null;
    }

    /**
     * Get the yanex by searching for the element's id
     * @param elementId The id of the element
     * @return The yanex reference or null
     */
    public static getYanexById(elementId: string): YanexElement | null {
        const element = document.getElementById(elementId);
        if(element) {
            return YanexWidgetsHelper.getYanexReference(element);
        }
        return null
    }
    
    /**
     * Deletes the yanex element
     * @param yanexElement The yanex reference or the html element
     */
    public static deleteYanexElement(yanexElement: YanexElement | HTMLElement): void {
        if(yanexElement instanceof HTMLElement) {
            yanexElement = YanexWidgetsHelper.getYanexReference(yanexElement) as YanexElement
        }
        if(yanexElement) {
            const constructorClassName = yanexElement.constructor.name;
            const yanexId = yanexElement.yanexId;
            const yanexTarget = YanexWidgetStorage.yanexWidgetReferences[constructorClassName][yanexId];

            // Remove its children
            const children = yanexTarget.widget.children;
            for(const child of children) {
                const yanexTarget = YanexWidgetsHelper.getYanexReference(child as HTMLElement);
                if(yanexTarget) {
                    const constructorName = yanexTarget.constructor.name;
                    delete YanexWidgetStorage.yanexWidgetReferences[constructorName][yanexTarget.yanexId];
                    child.remove();
                }
            }
            // Remove widget in the Weakset in the YanexkeyElements if the yanex element has a key triggerer
            if(yanexElement.keyTriggerer) {
                // Get map of the key
                const keyTriggererMap = YanexWidgetStorage.yanexKeyTriggererMaps[yanexElement.keyTriggerer]

                if(keyTriggererMap) {
                    keyTriggererMap.delete(yanexElement)
                }
            }
            // Delete widget
            yanexElement.widget.remove();
            delete YanexWidgetStorage.yanexWidgetReferences[constructorClassName][yanexId]
        }
    }

    /**
     * Adds an element to a map storage 
     * @param key The key to trigger the callbacks of the yanexElement
     * @param yanexElement The yanexElement
     */
    public static addElementAndKeyTriggerer(key: string, yanexElement: YanexElement): void {
        if(!YanexWidgetStorage.yanexKeyTriggererMaps[key]) {
            YanexWidgetStorage.yanexKeyTriggererMaps[key] = new Set<YanexElement>()
        }
        YanexWidgetStorage.yanexKeyTriggererMaps[key].add(yanexElement)
    }

    /**
     * Get the elements attached to a key triggerer
     * @param key 
     */
    public static getElementsByKeyTrigerrer(key: string): null | Set<YanexElement> {
        const elements = YanexWidgetStorage.yanexKeyTriggererMaps[key];

        if(elements) {
            return elements
        }
        return null;
    }
}