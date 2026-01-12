import YanexTreeview from "../../../../../packages/widgets/yanexWidgetPackages/yanexTreeview"
import { YanexDiv, YanexHeading } from "../../../../../packages/widgets/yanexWidgets"
import { ProductTypeListRecord } from "../../../productType/productTypeList/productTypeListRecord"
import { ProductTypeSectionRecord } from "./productTypeSectionRecord"
import { ProductTypeSectionRef } from "./productTypeSectionRef"




export default class ProductTypeSectionFactory{

    public static createProductTypeSection(): YanexDiv{
        const container = new YanexDiv(null, {
            className: "w-full h-full overflow-y-auto scroll-modern flex gap-1 flex-col items-start p-3"
        })

        const titleContainer = new YanexDiv(container, {
            className: "flex flex-col w-full p-2",
            bg: "extraBg"
        })

        new YanexHeading(titleContainer, "h6", {
            className: "flex font-bold",
            text: ProductTypeSectionRecord.productTypeSelectTitle.title
        }, {
            textAlignment: "w"
        })

        new YanexHeading(titleContainer, "h6", {
            className: "flex text-sm",
            text: ProductTypeSectionRecord.productTypeSelectTitle.message,
            fg: "lighterFg"
        }, {
            textAlignment: "w"
        })

        const treeview = new YanexTreeview(container, ProductTypeListRecord.yanexTreeviewColumns, {
            selectMode: "browse"
        })

        ProductTypeSectionRef.productProductTypesTreeview = treeview;

        return container;
    }
}

export class ProductTypeSectionHelper{
    public static getProductType(): Array<Number> {
        const treeview = ProductTypeSectionRef.productProductTypesTreeview;
        const returnVal: Array<Number> = [];
        if(treeview) {
            const selection = treeview.getActivatedRowData();
            for(const selected of selection) {
                if(selected["Id"]) {
                    returnVal.push(selected["Id"] as Number)
                }
            }
        }
        return returnVal
    }
}