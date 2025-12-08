import YanexCustomModal from "../../../packages/widgets/yanexWidgetPackages/yanexCustomModal";
import YanexTreeview from "../../../packages/widgets/yanexWidgetPackages/yanexTreeview";
import { YanexButton, YanexDiv, YanexForm } from "../../../packages/widgets/yanexWidgets";
import { CategoryNavButtons } from "./categoryListRecord";


export class CategoryListRef{

    public static initialized: boolean = false;

    public static categoryListFormButtons: Record<string, YanexButton> = {};

    public static categoryListParent: YanexDiv | null = null;

    public static categoryTreeview: YanexTreeview | null = null;

    public static categoryNavButtons = {} as Record<CategoryNavButtons, YanexButton>;

    public static categoryListModal: YanexCustomModal | null = null;

    public static categoryListForm: YanexForm | null = null;

    public static loadingContainer: YanexDiv | null = null

    public static categoryId: number | null = null;
    
}

export class CategoryListStorage{
    // The categorys fetched from the database
    public static categorys: Record<number, Record<string, any>> = {};

}