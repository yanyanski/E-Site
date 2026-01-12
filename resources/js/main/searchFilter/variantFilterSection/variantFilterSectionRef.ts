import { YanexButton, YanexDiv } from "../../../packages/widgets/yanexWidgets";


export class VariantFilterSectionRef{

    public static initialized: boolean = false;

    // The container for the variants
    public static variantContainer: YanexDiv;

    // Storage for the craeted variants with its id as the key and value as the variant value
    public static variantButtons: Record<number, YanexButton> = {}

    // The container for the filter buttons
    public static buttonContainer: YanexDiv;
}

export class VariantFilterSectionStorage{
    public static variants: Record<number, Record<string, any>> = {};

    // The storage for the selected filter of variant button
    public static selectedVariants: Set<number>= new Set();

}