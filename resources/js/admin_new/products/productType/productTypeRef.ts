import { YanexButton, YanexDiv, YanexInput } from "../../../packages/widgets/yanexWidgets";


export class ProductTypesRefs{
    
    public static initialized: boolean = false;

    // Add ProductTypes References
    public static addProductTypesFields: Record<string, YanexInput> = {};

    // Update ProductTypes references
    public static updateProductTypesFields: Record<string, YanexButton> = {};
    
    // The root parent of the add productTypes
    public static addProductTypesRootParent: YanexDiv | null = null;


}