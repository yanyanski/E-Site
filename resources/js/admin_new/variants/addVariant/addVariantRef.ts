import { YanexDiv, YanexForm, YanexInput } from "../../../packages/widgets/yanexWidgets";


export class AddVariantRef{

    public static initialized: boolean = false;

    public static addVariantParent: YanexDiv | null = null;

    public static addVariantFields: Record<string, YanexInput> = {};
    
    public static addVariantForm: YanexForm | null = null;

    public static loadingStatusContainer: YanexDiv | null= null;
}