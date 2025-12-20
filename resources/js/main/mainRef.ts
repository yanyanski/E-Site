import YanexCustomModal from "../packages/widgets/yanexWidgetPackages/yanexCustomModal";
import { YanexButton, YanexDiv, YanexInput } from "../packages/widgets/yanexWidgets";


export class MainRef{
    public static wrapperContainer: YanexDiv;

    public static initialized: boolean = false;
    
    public static loadingContainer: YanexDiv;
    
    public static productListContainer: YanexDiv;

    public static loginModal: YanexCustomModal;

    public static noProductContainer: YanexDiv;

    // The searchbar of the product list
    public static searchBar: YanexInput;

    // The back button when user searched
    public static backSearch: YanexButton;
}

export class MainStorage {
    public static iconsStorage: Record<string, Base64URLString> = {}

    // The search cursor. Resets to 0 when user exits the search function. Turns to null if search
    // results were exhausted
    public static searchCursor: number | null = 0;
}