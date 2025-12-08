import YanexTreeview from "../../../../../packages/widgets/yanexWidgetPackages/yanexTreeview";
import { YanexDiv, YanexHeading } from "../../../../../packages/widgets/yanexWidgets";
import { VariantListRecord } from "../../../../variants/variantList/variantListRecord";
import { ProductvariantSectionRecord } from "./productVariantSectionRecord";
import { ProductVariantSectionRef } from "./productVariantSectionRef";


export default class ProductVariantSectionFactory{

    public static createProductVariantSection(): YanexDiv{
        const container = new YanexDiv(null, {
            className: "w-full overflow-y-auto flex gap-1 flex-col items-start p-3"
        })

        const titleContainer = new YanexDiv(container, {
            className: "flex flex-col w-full p-2",
            bg: "extraBg"
        })

        new YanexHeading(titleContainer, "h6", {
            className: "flex font-bold",
            text: ProductvariantSectionRecord.variantSelectTitle.title
        }, {
          textAlignment: "w"  
        })

        new YanexHeading(titleContainer, "h6", {
            className: "flex text-sm",
            text: ProductvariantSectionRecord.variantSelectTitle.message,
            fg: "lighterFg"
        }, {
          textAlignment: "w"  
        })

        const treeview = new YanexTreeview(container, VariantListRecord.yanexTreeviewColumns, {
            selectMode: "multi"
        })

        ProductVariantSectionRef.productVariantsTreeview = treeview;

        return container;
    }
}

export class ProductVariantSectionHelper{
    /**
     * Returns the id of variants via Array of numbers
     */
    public static getProductVariants(): Array<number> {
        const treeview = ProductVariantSectionRef.productVariantsTreeview
        const returnVal: Array<number> = [];
        if(treeview) {
            const selections = treeview.getActivatedRowData();
            for(const selected of selections) {
                if(selected["Id"]) {
                    returnVal.push(selected["Id"] as number)
                }
            }
        }
        return returnVal
    }
}