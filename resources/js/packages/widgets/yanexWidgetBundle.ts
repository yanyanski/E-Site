import { YanexWidgetsHelper } from "./yanexWidgetsHelper";
import { YanexWidgetInitData } from "./yanexWidgetsRecords";
import { YanexWidgetStorage } from "./yanexWidgetsStorage";


export class YanexWidgetBundle{
    
    /**
     * Initialize the yanex widgets. 
     * @param initData The init data for the yanex widget
     */
    public static initialize(initData: YanexWidgetInitData): void {
        if(initData) {
            YanexWidgetStorage.yanexInitData = initData
        }

        // Add an event listener to the document for key trigerrers
        document.addEventListener("keydown", (e) => {

            // Check if the focused element is entry widget
            if(document.activeElement instanceof HTMLTextAreaElement) {
                return
            }

            if(e.shiftKey) {
                this.triggerEventClicks(`Shift+${e.key}`);
                return
            }

            if(e.ctrlKey) {
                this.triggerEventClicks(`Control+${e.key}`)
                return
            }

            this.triggerEventClicks(e.key)}
        )
    }

    /**
     * Trigger the function attached to a yanex element
     */
    private static triggerEventClicks(e: string): void {

        const attachedElements = YanexWidgetsHelper.getElementsByKeyTrigerrer(e);

        if(attachedElements) {
            // Check elements if it's visible in the DOM
            for(const element of attachedElements) {
                    if(!element.isHidden || element.isVisible) {

                        element.widget.click()
                        // continue
                        // const callbacks = element.publicReferenceData;
                        // console.log(callbacks)
                        // if(callbacks["event"] &&
                        //     callbacks["callbackFn"]
                        // ) {
                        //     try{
                        //         callbacks["callbackFn"](callbacks["event"])
                        //     } catch(e) {
                        //         console.error("Error while executing triggerer. Err: ", e)
                        //     }
                        // }
                    }
            }
        }

        console.log(attachedElements)
    }

}