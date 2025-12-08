import { YanexDiv, YanexElement } from "../packages/widgets/yanexWidgets";
import { AdminSubButtons } from "./navbar/navBarRecords";



export class AdminRefs{
    // The content container of the admin
    public static adminContentContainer: YanexDiv | null = null;

    // The current active content in the admin. The reference to the parent container for easy hiding 
    public static currentActiveContent: YanexElement | null = null;

    // The container shown when no contents are selected
    public static noShownContentContainer: YanexDiv | null = null;
}