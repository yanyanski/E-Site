
import YanexCustomModal from "../../../../packages/widgets/yanexWidgetPackages/yanexCustomModal";
import YanexTreeview from "../../../../packages/widgets/yanexWidgetPackages/yanexTreeview";
import { YanexButton, YanexDiv, YanexForm } from "../../../../packages/widgets/yanexWidgets";
import { ProductTypeNavButtons } from "./productTypeListRecord";


export class ProductTypeListRef{

    public static initialized: boolean = false;

    public static productTypeListFormButtons: Record<string, YanexButton> = {};

    public static productTypeListParent: YanexDiv | null = null;

    public static productTypeTreeview: YanexTreeview | null = null;

    public static productTypeNavButtons = {} as Record<ProductTypeNavButtons, YanexButton>;

    public static productTypeListModal: YanexCustomModal | null = null;

    public static productTypeListForm: YanexForm | null = null;

    public static loadingContainer: YanexDiv | null = null

    public static productTypeId: number | null = null;
    
}

export class ProductTypeListStorage{
    // The productTypes fetched from the database
    public static productTypes: Record<number, Record<string, any>> = {};

}