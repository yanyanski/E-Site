

export interface CategoryUpdateDataStructure{
    categoryName: string
}

export class CategoryRecords{

    public static categoryFields: Record<string, string> = {
        "category-name": "Category Name"
    }

    public static formLabels: Record<string, string> = {
        "addMessage": "Enter a new category for the products.",
        "updateMessage": "Update the selected category name"
    }

}