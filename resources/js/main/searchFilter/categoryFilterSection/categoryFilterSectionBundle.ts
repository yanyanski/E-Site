import { YanexButton } from "../../../packages/widgets/yanexWidgets";
import { CategoryFilterSectionFactory } from "./categoryFilterSectionHelper"
import { CategoryFilterSectionRef, CategoryFilterSectionStorage } from "./categoryFilterSectionRef";


export class CategoryFilterSectionBundle{

    public static initialize(): void{

        if(CategoryFilterSectionRef.initialized) {
            CategoryFilterSectionRef.categoryContainer.show()
            return;
        }
        CategoryFilterSectionFactory.createCategoryContainer();
        CategoryFilterSectionRef.initialized = true;
    }
}

export class CategoryFilterSectionEvent{
    public static categoryButtonClicked(event: PointerEvent, button: YanexButton, id: number): void {
        if(button.isSelected) {
            button.deselect()
            CategoryFilterSectionStorage.selectedCategories.delete(id)

        } else {
            button.select();
            CategoryFilterSectionStorage.selectedCategories.add(id);
        }

    }
}