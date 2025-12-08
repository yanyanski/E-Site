

export interface VariantUpdateDataStructure{
    variantName: string
}

export class VariantRecords{

    public static variantFields: Record<string, string> = {
        "variant-name": "Variant Name"
    }

    public static formLabels: Record<string, string> = {
        "addMessage": "Enter a new variant for the products.",
        "updateMessage": "Update the selected variant name"
    }

}