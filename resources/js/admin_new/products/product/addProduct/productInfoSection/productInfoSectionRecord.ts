import { TitleLabelRecord } from "../../../../../packages/interfaces"

export type ProductInfoFields = "product-description" | "product-price" | "is-active" | "product-link";


export class ProductInfoSectionRecord{

    public static productInfoSectionFields: Record<ProductInfoFields, string> = {
        "product-description": "Product Description",
        "product-price": "Product Price",
        "is-active": "Is Active",
        "product-link": "Product Link", 
    }

    public static productInfoSectionFieldsIcons: Record<ProductInfoFields, string> = {
        "product-description": "details.png",
        "product-price": "price.png",
        "is-active": "status.png",
        "product-link": "network.png"
    }

    public static productInfoTitle: TitleLabelRecord = {
        title: "Product Info",
        message: "Enter additional information about the product"
    }
}