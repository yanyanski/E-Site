import { YanexButton } from "../../../packages/widgets/yanexWidgets";
import { VariantFilterSectionFactory } from "./variantFilterSectionHelper";
import { VariantFilterSectionRef, VariantFilterSectionStorage } from "./variantFilterSectionRef";


export class VariantFilterSectionBundle{

    public static initialize(): void{

        if(VariantFilterSectionRef.initialized) {
            VariantFilterSectionRef.variantContainer.show();
            return;
        }
        VariantFilterSectionFactory.createVariantContainer();
        VariantFilterSectionRef.initialized = true;
    }
}

export class VariantFilterSectionEvent{
    public static variantButtonClicked(event: PointerEvent, button: YanexButton, id: number): void {
        if(button.isSelected) {
            button.deselect()
            VariantFilterSectionStorage.selectedVariants.delete(id)

        } else {
            button.select();
            VariantFilterSectionStorage.selectedVariants.add(id);
        }

    }
}