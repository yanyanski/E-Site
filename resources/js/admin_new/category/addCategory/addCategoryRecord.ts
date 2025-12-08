
export type AddCategoryFieldButtons = "Add Category" | "Clear Field"

export class AddCategoryRecords{

    public static addCategoryFieldButtons: Set<string> = new Set([
        "Add Category",
        "Clear Field"
    ]);

    public static categoryFields: Record<string, string> = {
        "categoryName": "Category Name"
    }

}

export class AddCategoryLinks {
    public static addCategoryLink: string = "/admin/products/categories/add";

}