import { YanexDiv, YanexForm, YanexInput } from "../../../packages/widgets/yanexWidgets";


export class AddCategoryRef{

    public static initialized: boolean = false;

    public static addCategoryParent: YanexDiv | null = null;

    public static addCategoryFields: Record<string, YanexInput> = {};
    
    public static addCategoryForm: YanexForm | null = null;

    public static loadingStatusContainer: YanexDiv | null= null;
}