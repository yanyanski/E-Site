import { YanexDialog, YanexDiv, YanexElement, YanexForm, YanexHeading } from "./yanexWidgets";
import { YanexWidgetInitData } from "./yanexWidgetsRecords";


export class YanexWidgetRef{
    public static currentYanexId: number = 0;

}

export class YanexWidgetStorage{
    // Storage for the created yanex widgets where the key is the yanex widget type (e.g. YanexDiv, YanexHeading, etc) and the 
    // key again is the id of that yanex widget with its value as the yanex reference.
    public static yanexWidgetReferences: Record<string, Record<string, YanexElement>> = {};

    // The data saved from initializing the yanex widget
    public static yanexInitData: YanexWidgetInitData = {}
}
