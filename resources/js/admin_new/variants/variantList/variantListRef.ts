import { FetchUtilityRawProcessedResponse } from "../../../packages/typing";
import YanexCustomModal from "../../../packages/widgets/yanexWidgetPackages/yanexCustomModal";
import YanexTreeview from "../../../packages/widgets/yanexWidgetPackages/yanexTreeview";
import { YanexButton, YanexDiv, YanexForm } from "../../../packages/widgets/yanexWidgets";
import { VariantNavButtons } from "./variantListRecord";


export class VariantListRef{

    public static initialized: boolean = false;

    public static variantListFormButtons: Record<string, YanexButton> = {};

    public static variantListParent: YanexDiv | null = null;

    public static variantTreeview: YanexTreeview | null = null;

    public static variantNavButtons = {} as Record<VariantNavButtons, YanexButton>;

    public static variantListModal: YanexCustomModal | null = null;

    public static variantListForm: YanexForm | null = null;

    public static loadingContainer: YanexDiv | null = null

    public static variantId: number | null = null;

    public static variantLoadingContainer: YanexDiv;
    
}

export class VariantListStorage{
    // The variants fetched from the database
    public static variants: Record<number, Record<string, any>> = {};

    public static variantRawFetched:  FetchUtilityRawProcessedResponse | null = null;
}