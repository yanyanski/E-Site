import { YanexButton, YanexDiv } from "../../../packages/widgets/yanexWidgets";


export class CategoryFilterSectionRef{

    public static initialized: boolean = false;

    // The container for the categories
    public static categoryContainer: YanexDiv;

    // Storage for the craeted categories with its id as the key and value as the category value
    public static categoryButtons: Record<number, YanexButton> = {}

    // The container for the filter buttons
    public static buttonContainer: YanexDiv;
}

export class CategoryFilterSectionStorage{
    public static categories: Record<number, Record<string, any>> = {};

    // The storage for the selected filter of category button
    public static selectedCategories: Set<number>= new Set();

}