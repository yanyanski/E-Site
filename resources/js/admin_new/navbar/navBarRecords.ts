

export type AdminNavBarButtons = "Products" | "Categories" | "Variants" | "Users";

export type AdminNavBarOtherButtons = "Log Out";

export type AdminProductSubButtons = "Product List" | "Add Product" | "Product Types" | "Add Product Type";

export type AdminCategoriesSubButtons = "Category Lists" | "Add Category";

export type AdminVariantsSubButtons = "Variants Lists" | "Add Variants";

export type AdminUsersSubButtons = "Users Lists" | "Add User";

export type AdminSubButtons = AdminProductSubButtons | AdminCategoriesSubButtons | AdminVariantsSubButtons;

export class NavBarRecords{

    public static navBarButtons: Set<AdminNavBarButtons> = new Set([
        "Products",
        "Categories",
        "Variants",
        "Users",
    ]);

    public static navBarButtonsIcons: Record<AdminNavBarButtons, string> = {
        "Products": "product.png",
        "Categories": "categories.png",
        "Users": "users.png",
        "Variants": "variant.png"
    }

    public static productNavBarSubButtons: Set<AdminProductSubButtons> = new Set([
        "Add Product",
        "Product List",
        "Add Product Type",
        "Product Types"
    ])

    public static productNavBarSubButtonsIcons: Record<AdminProductSubButtons, string> = {
        "Product List": "add.png",
        "Add Product": "add.png",
        "Product Types": "list.png",
        "Add Product Type": "list.png"
    }

    public static categoriesNavBarSubButtons: Set<AdminCategoriesSubButtons> = new Set([
        "Category Lists",
        "Add Category"
    ])

    public static categoriesNavBarSubButtonsIcons: Record<AdminCategoriesSubButtons, string> = {
        "Category Lists": "list.png",
        "Add Category": "add.png"
    }

    public static variantsNavBarSubButtons: Set<AdminVariantsSubButtons> = new Set([
        "Add Variants",
        "Variants Lists"
    ])
    public static variantsNavBarSubButtonsIcons: Record<AdminVariantsSubButtons, string> = {
        "Variants Lists": "list.png",
        "Add Variants": "add.png"
    }

    public static usersNavBarSubButtons: Set<AdminUsersSubButtons> = new Set([
        "Add User", "Users Lists"
    ])

    public static otherButtons: Set<AdminNavBarOtherButtons> = new Set([
        "Log Out"
    ])

    public static otherButtonsIcons: Record<AdminNavBarOtherButtons, string> = {
        "Log Out": "exit.png"
    }

}