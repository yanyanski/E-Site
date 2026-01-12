
export type AddVariantFieldButtons = "Add Variant" | "Clear Field"

export class AddVariantRecords{

    public static addVariantFieldButtons: Set<string> = new Set([
        "Add Variant",
        "Clear Field"
    ]);

    public static variantFields: Record<string, string> = {
        "variantName": "Variant Name"
    }

}

export class AddVariantLinks {
    public static addVariantLink: string = "/admin/products/variants/add";

}