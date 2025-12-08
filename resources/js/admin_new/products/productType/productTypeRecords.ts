

export interface ProductTypesUpdateDataStructure{
    productTypesName: string
}

export class ProductTypesRecords{

    public static productTypesFields: Record<string, string> = {
        "product-type-name": "Product Type Name"
    }

    public static formLabels: Record<string, string> = {
        "addMessage": "Enter a new Product Type for the products.",
        "updateMessage": "Update the selected Product Type name"
    }

}