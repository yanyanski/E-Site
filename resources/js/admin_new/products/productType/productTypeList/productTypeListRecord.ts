import { YanexTreeviewColumnStructure } from "../../../../packages/widgets/yanexWidgetPackages/yanexTreeview";


export type ProductTypeNavButtons = "Update Product Type"

export type ProductTypeUpdateFormButtons = "Update Product Type" | "Clear Field"
export class ProductTypeListRecord{

    public static yanexTreeviewColumns: Array<YanexTreeviewColumnStructure> = [
        {
            columnName: "Id",
            columnWidth:"w-fit"
        },
        {
            columnName: "Product Type Name"
        }   
    ]
    

    public static productTypeNavButtons: Array<ProductTypeNavButtons> = [
        "Update Product Type",
    ];

    public static productTypeNavButtonsIcons: Record<ProductTypeNavButtons, string> = {
        "Update Product Type": 'update.png'
    }

    public static updateProductTypeFieldButtons: Set<string> = new Set([
        "Update Product Type",
        "Clear Field"
    ]);

    public static updateProductTypeIntro: Record<string, string> = {
        "title": "Product Types",
        "message": "Showing existing lists of created product types"
    }
}

export class ProductTypeListLinks {
    public static updateProductTypeLink: string = "/admin/products/product-types/update";
}