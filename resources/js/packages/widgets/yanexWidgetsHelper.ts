import { YanexElement } from "./yanexWidgets";
import { YanexWidgetRecords } from "./yanexWidgetsRecords";
import { YanexWidgetRef, YanexWidgetStorage } from "./yanexWidgetsStorage";
import { YanexThemeTCSS } from "./yanexWidgetTheme/yanexTCSSTheme";
import { YanexThemeHelper } from "./yanexWidgetTheme/yanexThemeHelper";
import { YanexThemeSchemaReturn } from "./yanexWidgetTheme/yanexThemeInterfaces";
import { YanexThemes, YanexWidgetBgThemeTypes, YanexWidgetBorderThemeTypes, YanexWidgetFgThemeTypes } from "./yanexWidgetTheme/yanexThemeTypes";



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
    /**
     * Change the theme of the yanex widgets used
     * @param theme The theme to be used
     */
    public static changeTheme(theme: YanexThemes): void {

        function changeTheme(removeOnly: boolean): void {
            const transitions: Record<"color" | "dur" | "ease", string> = {
                "color": "transition-colors",
                "ease": "ease-in-out",
                "dur": "duration-200"
            }
            
            // Iterate through all yanex widgets
            for(const yanexWidgets of Object.values(YanexWidgetStorage.yanexWidgetReferences)) {
                for(const yanexWidget of Object.values(yanexWidgets)) {

                    // Flags if the widget has initially the same class attr.
                    // If true, doesn't remove the added effect transition after checking
                    // If false, removes it after applying the theme change
                    let transitionColors: boolean = false
                    let transitionDuration: boolean = false;
                    let transitionEase: boolean = false;

                    if(removeOnly === false) {
                        // This is where the widgets changes their theme. 
                        // Temporary add a transition effect on the widgets for smoother
                        // theme widget transition

                        if(yanexWidget.widget.classList.contains(transitions["color"])) {
                            transitionColors = true
                        } else {
                            yanexWidget.widget.classList.add(transitions["color"])
                        }

                        if(yanexWidget.widget.classList.contains(transitions["dur"])) {
                            transitionDuration = true
                        } else {
                            yanexWidget.widget.classList.add(transitions["dur"])
                        }

                        if(yanexWidget.widget.classList.contains(transitions["ease"])) {
                            transitionEase = true
                        } else {
                            yanexWidget.widget.classList.add(transitions["ease"])
                        }
                    }
                    // Change bg
                    if(yanexWidget.bg) { // Skip if the assigned bg is null
                        yanexWidget.setElementBg(yanexWidget.bg, removeOnly)
                    }

                    // Change fg
                    if(yanexWidget.fg) {
                        yanexWidget.setElementFg(yanexWidget.fg, removeOnly)
                    }

                    // Change border
                    if(yanexWidget.border) {
                        yanexWidget.setElementBorder(yanexWidget.border, removeOnly)
                    }

                    // Remove added temporary classes
                    if(removeOnly === false) {
                        if(transitionDuration) yanexWidget.removeElementClassName(transitions["dur"]);
                        if(transitionColors) yanexWidget.removeElementClassName(transitions["color"]);
                        if(transitionEase) yanexWidget.removeElementClassName(transitions["ease"]);
                    }
                }
            }
        }   

        // Remove the current theme applied to every widget
        changeTheme(true)

        // Update theme internally
        YanexThemeTCSS.updateTheme(theme)
        changeTheme(false)

    }
}