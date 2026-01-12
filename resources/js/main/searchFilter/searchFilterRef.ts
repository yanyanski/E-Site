import YanexCustomModal from "../../packages/widgets/yanexWidgetPackages/yanexCustomModal";
import { YanexButton, YanexDiv } from "../../packages/widgets/yanexWidgets";


export class SearchFilterRef{

    // Ticks to true if the search filter is initialized
    public static initialized: boolean = false;

    // The search filter modal
    public static searchFilterModal: YanexCustomModal;

    // The wrapper for the modal
    public static searchFilterModaWrapper: YanexDiv;

    // The container for the filter types
    public static searchFilterTypesContainer: YanexDiv;

    // The container for the loading 
    public static searchFilterLoadingContainer: YanexDiv;

    // The buttons of the search filter
    public static searchFilterButtons: Record<string, YanexButton> = {};

    // The selected button in the search filter
    public static selectedFilterHeaderButton: YanexButton;

    // The selected key of the active filter content
    public static activeContentKey: string = ""
}

export class SearchFilterStorage{


    public static variants: Record<string, string> = {};

    public static types: Record<string, string> = {};
}