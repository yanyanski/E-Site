import YanexCustomModal from "../../../../packages/widgets/yanexWidgetPackages/yanexCustomModal";
import YanexGroupedButtons from "../../../../packages/widgets/yanexWidgetPackages/yanexGroupedButtons";
import YanexImageSlider from "../../../../packages/widgets/yanexWidgetPackages/yanexImageSlider";
import YanexImageView from "../../../../packages/widgets/yanexWidgetPackages/yanexImageViewer";
import YanexListBox from "../../../../packages/widgets/yanexWidgetPackages/yanexListBox";
import { YanexButton, YanexDiv, YanexHeading, YanexInput, YanexTextArea } from "../../../../packages/widgets/yanexWidgets";


export class ProductListRef{
    public static initialized: boolean = false;

    public static productListContainer: YanexDiv | null = null;

    public static productListLoadingContainer: YanexDiv | null = null;

    public static currentProductPage: number = 1;

    public static productContentContainer: YanexDiv | null = null;

    public static productShowModal: YanexCustomModal | null = null;

    // Reference for the field basic inputs
    public static basicProductFields: Record<string, YanexInput | YanexTextArea | YanexGroupedButtons> = {};
    
    // The list of variants for the product
    public static productVariantListBox: YanexListBox | null = null

    // THe List of category of the product
    public static productCategoryListBox: YanexListBox | null = null

    // The image for the product
    public static productNewImages: YanexImageView | null = null

    // The label for the product type
    public static productTypeLabel: YanexHeading | null = null;

    // The main container for the product fields when modifying
    public static productFieldMainContainer: YanexDiv | null = null;

    // Flag when user clicked the Advanced Settings
    public static advancedDropDownClicked: boolean = false;

    // The advanced container for the advanced settings
    public static productModifyAdvancedContainer: YanexDiv | null = null;

    // The button for the modal modifying products
    public static productModifyButtons: Record<string, YanexButton> = {}

    // The container for the no product label
    public static noProductContainer: YanexDiv;

    public static productImageSlider: YanexImageSlider;

        // The id of the product that is currently being updated
    public static productId: number = 0;
}

export class ProductListStorage {
    // The product's saved variants
    public static productVariants: Record<string, number> = {};
    
    // The product's saved categories
    public static productCategory: Record<string, number> = {};

    // The id of the product type displayed
    public static productType: number = 0;
    
    // The default data of the product that is being updated
    public static productDefaultData: Record<string, any> = {}



}