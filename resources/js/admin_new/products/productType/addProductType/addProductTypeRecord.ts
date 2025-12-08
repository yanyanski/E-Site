
export type AddProductTypeFieldButtons = "Add Product Type" | "Clear Field"

export class AddProductTypeRecords{

    public static addProductTypeFieldButtons: Set<string> = new Set([
        "Add Product Type",
        "Clear Field"
    ]);

    public static productTypeFields: Record<string, string> = {
        "productTypeName": "Product Type Name"
    }

}

export class AddProductTypeLinks {
    public static addProductTypeLink: string = "/admin/products/product-types/add";

}