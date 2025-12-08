import { YanexButton, YanexDiv, YanexInput } from "../../packages/widgets/yanexWidgets";


export class CategoryRefs{
    
    public static initialized: boolean = false;

    // Add Category References
    public static addCategoryFields: Record<string, YanexInput> = {};

    // Update Category references
    public static updateCategoryFields: Record<string, YanexButton> = {};
    
    // The root parent of the add category
    public static addCategoryRootParent: YanexDiv | null = null;


}