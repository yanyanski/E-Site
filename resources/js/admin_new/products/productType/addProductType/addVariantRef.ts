import { YanexDiv, YanexForm, YanexInput } from "../../../../packages/widgets/yanexWidgets";


export class AddProductTypeRef{

    public static initialized: boolean = false;

    public static addProductTypeParent: YanexDiv | null = null;

    public static addProductTypeFields: Record<string, YanexInput> = {};
    
    public static addProductTypeForm: YanexForm | null = null;

    public static loadingStatusContainer: YanexDiv | null= null;
}