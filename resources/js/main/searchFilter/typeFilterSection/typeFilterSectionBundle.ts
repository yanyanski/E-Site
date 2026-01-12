import { YanexButton } from "../../../packages/widgets/yanexWidgets";
import { TypeFilterSectionFactory } from "./typeFilterSectionHelper";
import { TypeFilterSectionRef, TypeFilterSectionStorage } from "./typeFilterSectionRef";

export class TypeFilterSectionBundle{

    public static initialize(): void{

        if(TypeFilterSectionRef.initialized) {
            console.log("CALLED?")
            TypeFilterSectionRef.typeContainer.show()
            return;
        }
        TypeFilterSectionFactory.createTypeContainer();
        TypeFilterSectionRef.initialized = true;
    }
}

export class TypeFilterSectionEvent{
    public static typeButtonClicked(event: PointerEvent, button: YanexButton, id: number): void {
        if(button.isSelected) {
            button.deselect()
            TypeFilterSectionStorage.selectedTypes.delete(id)

        } else {
            button.select();
            TypeFilterSectionStorage.selectedTypes.add(id);
        }

    }
}