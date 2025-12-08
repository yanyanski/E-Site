import { IconsBundle } from "../../icons/iconsBundle";
import { IconsHelperRequest } from "../../icons/iconsHelper";
import { YanexCustomModalEvents } from "../../packages/widgets/yanexWidgetPackages/yanexCustomModal";
import { YanexWidgetsHelper } from "../../packages/widgets/yanexWidgetsHelper";
import { ProductDetailsFactory } from "./productDetailsHelper";
import { ProductDetailsRef } from "./productDetailsRef";


export class ProductDetailsBundle{
    public static showProductDetails(productData: Record<string, any>): void {
        ProductDetailsFactory.createProductModal(productData);
        IconsBundle.setElementIcons(ProductDetailsRef.productDetailsModal!.modalDialog)
    }
}

export class ProductDetailsEvents{
    public static modalClosed(event: YanexCustomModalEvents): void {
        const modal = event.modal;
        if(modal) {
            YanexWidgetsHelper.deleteYanexElement(modal.modalDialog)
        }
    }
}