import YanexCustomModal from "../packages/widgets/yanexWidgetPackages/yanexCustomModal";
import { YanexButton, YanexDiv, YanexInput } from "../packages/widgets/yanexWidgets";
import { MainRecordOtherUpperLinks } from "./mainRecords";


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

    // the container for the search bar
    public static searchContainer: YanexDiv;

    public static upperContainer: YanexDiv;

    // Flag if the search container is hidden or not.
    // The .isHidden getter is unreliable due to user's unpredictable
    // scrolling alonside with async and await nature of hiding/showing the search container
    // 0 if the container is hidden
    // 1 if the container is shown
    // 2 if the container is currently in the process of being shown
    public static searchContainerHidden: 0 | 1 | 2 = 1

    // The reference for the upper link other buttons
    public static otherUpperLinkButtons = {} as Record<MainRecordOtherUpperLinks, YanexButton> ;

    // The loading cards of products
    public static loadingProductCards: Array<YanexDiv> = [];

    // Flag for the fetching state
    public static isFetchingProducts: boolean = false

    // Ticks to true if user exhausted all of the products list
    public static showExhaustedProduct: boolean = false;

    // Ticks to true if the user exhausted all of the searched product list
    public static showSearchedExhaustedProduct: boolean = false;

    // Ticks to true if the user clicked the search button
    // This is because the system checks if the searchbar has a value in it
    // for every bottom scroll where it affects the shown products
    public static searchButtonClicked: boolean = false;

    // Ticks to true if the user is searching
    public static isUserSearching: boolean = false

}

export class MainStorage {
    public static iconsStorage: Record<string, Base64URLString> = {}

    // The search cursor. Resets to 0 when user exits the search function. Turns to null if search
    // results were exhausted
    public static searchCursor: number | null = 0;

    // The previous search value. Turns to null if the user clicked search and its search value is "".
    public static previousSearchValue: string | null = null;
}