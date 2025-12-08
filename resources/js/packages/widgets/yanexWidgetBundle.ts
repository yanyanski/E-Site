import { YanexWidgetInitData } from "./yanexWidgetsRecords";
import { YanexWidgetStorage } from "./yanexWidgetsStorage";


export class YanexWidgetBundle{
    
    /**
     * Initialize the yanex widgets. (No need to call this if no data is passed in the parameters)
     * @param initData The init data for the yanex widget
     */
    public static initialize(initData: YanexWidgetInitData): void {
        if(initData) {
            YanexWidgetStorage.yanexInitData = initData
        }
    }
}