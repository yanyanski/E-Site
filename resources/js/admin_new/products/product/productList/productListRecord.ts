import { Dict } from "../../../../packages/datatypeHelpers";
import { TitleLabelRecord } from "../../../../packages/interfaces";
import { YanexDiv, YanexHeading } from "../../../../packages/widgets/yanexWidgets";
import { ProductInfoSectionRecord } from "../addProduct/productInfoSection/productInfoSectionRecord";
import { ProductNameSectionRecord } from "../addProduct/productNameSection/productNameSectionRecord";

export interface ProductListCardAttr {
    productName?: YanexHeading,
    productType?: YanexHeading,
    productPrice?: YanexHeading,
    variationContainer?: YanexDiv,
    categoryContainer?: YanexDiv

}

export class ProductListRecord {

    public static productListIntro: TitleLabelRecord = {
        title: "Product Lists",
        message: "Showing the lists of products created"
    }

    public static productFields: Record<string, string> = Dict.stitch([
        ProductNameSectionRecord.productNameFields,
        ProductInfoSectionRecord.productInfoSectionFields
    ])

    public static productFieldIcons: Record<string, string> = Dict.stitch([
        ProductNameSectionRecord.productNameFieldsIcons,
        ProductInfoSectionRecord.productInfoSectionFieldsIcons
    ])

    public static advancedProductFields: Record<string, string> = {}

    public static newImagesTitles: TitleLabelRecord = {
        title: "Add New Images",
        message: "Add new images for this product"
    }

    
    public static productVariantTitles: TitleLabelRecord = {
        title: "Modify Product Variants",
        message: "You can remove/add a variant to this product"
    }

    public static productCategoryTitles: TitleLabelRecord = {
        title: "Modify Product Category",
        message: "You can remove/add a category to this product"
    }

    public static modalButtons: Record<string, string> = {
        "cancel": "Cancel",
        "update": "Update Product",
    }

    public static productListIcons: Array<string> = [
        "product.png",
        "price.png",
        "network.png",
        "status.png",
        "details.png",
        "image.png",
        "check.png",
        "info.png",
        "expand.png",
        "edit.png"
    ]

    public static productListIconsMap: Record<string, string> = {
        "product": "product.png",
        "price": "price.png",
        "network": "network.png",
        "status": "status.png",
        "details": "details.png",
        "image": "image.png",
        "check": "check.png",
        "info": "info.png",
        "expand": "expand.png",
        "edit": "edit.png"
    }

    public static adminProductCardAttrName: string = "adminProductCardId"
    public static adminProductCardClassName: string = "admin-product-card"
}

export class ProductListLinks {
    public static productUpdateLink = "/admin/products/update"
}