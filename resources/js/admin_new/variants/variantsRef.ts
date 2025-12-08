import { YanexButton, YanexDiv, YanexInput } from "../../packages/widgets/yanexWidgets";


export class VariantRefs{
    
    public static initialized: boolean = false;

    // Add Variant References
    public static addVariantFields: Record<string, YanexInput> = {};

    // Update Variant references
    public static updateVariantFields: Record<string, YanexButton> = {};
    
    // The root parent of the add variant
    public static addVariantRootParent: YanexDiv | null = null;

}