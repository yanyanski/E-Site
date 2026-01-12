import { YanexTreeviewColumnStructure } from "../../../packages/widgets/yanexWidgetPackages/yanexTreeview";


export type CategoryNavButtons = "Update Category"

export type CategoryUpdateFormButtons = "Update Category" | "Clear Field"
export class CategoryListRecord{

    public static yanexTreeviewColumns: Array<YanexTreeviewColumnStructure> = [
        {
            columnName: "Id",
            columnWidth:"w-fit"
        },
        {
            columnName: "Category Name"
        }   
    ]
    

    public static categoryNavButtons: Array<CategoryNavButtons> = [
        "Update Category",
    ];

    public static categoryNavButtonsIcons: Record<CategoryNavButtons, string> = {
        "Update Category": "update.png"
    }

    public static updateCategoryFieldButtons: Set<string> = new Set([
        "Update Category",
        "Clear Field"
    ]);

    public static updateCategoryIntro: Record<string, string> = {
        "title": "Categories",
        "message": "Showing existing lists of created categories"
    }
}

export class CategoryListLinks {
    public static updateCategoryLink: string = "/admin/products/categories/update";
}