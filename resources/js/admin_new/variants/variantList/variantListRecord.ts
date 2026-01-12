import { YanexTreeviewColumnStructure } from "../../../packages/widgets/yanexWidgetPackages/yanexTreeview";


export type VariantNavButtons = "Update Variant"

export type VariantUpdateFormButtons = "Update Variant" | "Clear Field"
export class VariantListRecord{

    public static yanexTreeviewColumns: Array<YanexTreeviewColumnStructure> = [
        {
            columnName: "Id",
            columnWidth:"w-fit"
        },
        {
            columnName: "Variant Name"
        }   
    ]
    

    public static variantNavButtons: Array<VariantNavButtons> = [
        "Update Variant",
    ];
    public static variantNavButtonsIcons: Record<VariantNavButtons, string> = {
        "Update Variant": "update.png"
    }

    public static updateVariantFieldButtons: Set<string> = new Set([
        "Update Variant",
        "Clear Field"
    ]);

    public static updateVariantIntro: Record<string, string> = {
        "title": "Variants",
        "message": "Showing existing lists of created variants"
    }
}

export class VariantListLinks {
    public static updateVariantLink: string = "/admin/products/variants/update";
}