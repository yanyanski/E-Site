
export type AddProductContentAliases = "Product Name" | "Product Info" |
                "Product Images" | "Product Variants" | 
                "Product Category" | "Product Type" | "Finalize";


export class AddProductRecord{
    public static addProductNameLabels: Record<string, string> = {
        "title": "Add Product Name",
        "message": "Specify the product's name"
    }

    public static addProductIcons: Array<string> = [
        "product.png",
        "price.png",
        "network.png",
        "status.png",
        "details.png",
        "image.png",
        "check.png"
    ]

}