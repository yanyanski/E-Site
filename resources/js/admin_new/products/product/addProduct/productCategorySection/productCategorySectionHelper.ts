import YanexTreeview from "../../../../../packages/widgets/yanexWidgetPackages/yanexTreeview"
import { YanexDiv, YanexHeading } from "../../../../../packages/widgets/yanexWidgets"
import { CategoryListRecord } from "../../../../category/categoryLists/categoryListRecord"
import { ProductCategorySectionRecord } from "./productCategorySectionRecord"
import { ProductCategorySectionRef } from "./productCategorySectionRef"



export default class ProductCategorySectionFactory{

    public static createProductCategorySection(): YanexDiv{
        const container = new YanexDiv(null, {
            className: "w-full h-screen flex gap-1 flex-col items-start p-3"
        })

        const titleContainer = new YanexDiv(container, {
            className: "flex flex-col w-full p-2",
            bg: "extraBg"
        })

        new YanexHeading(titleContainer, "h6", {
            className: "flex font-bold ",
            text: ProductCategorySectionRecord.categorySelectTitle.title
        }, {
            textAlignment: "w"
        })

        new YanexHeading(titleContainer, "h6", {
            className: "flex text-sm",
            text: ProductCategorySectionRecord.categorySelectTitle.message,
            fg: "lighterFg"
        }, {
            textAlignment: "w"
        })

        const treeview = new YanexTreeview(container, CategoryListRecord.yanexTreeviewColumns, {
            selectMode: "multi"
        })

        ProductCategorySectionRef.productCategorysTreeview = treeview;

        return container;
    }
}

export class ProductCategorySectionHelper{
    public static getProductCategories(): Array<Number> {
        const treeview = ProductCategorySectionRef.productCategorysTreeview;
        const returnVal: Array<Number> = [];

        if(treeview) {
            const selection = treeview.getActivatedRowData();

            for (const selected of selection) {
                if(selected["Id"]) {
                    returnVal.push(selected["Id"] as Number);
                }
            }
        }
        
        return returnVal
    }
}