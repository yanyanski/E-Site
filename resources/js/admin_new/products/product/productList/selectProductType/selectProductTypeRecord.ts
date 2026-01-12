import { TitleLabelRecord } from "../../../../../packages/interfaces";



export class SelectProductTypeRecord {
    public static intro: TitleLabelRecord = {
        title: "Select Product Tpye",
        message: "Select a product type for this product. (Can only select 1)"
    }

    public static modalButtons: Record<string, string> = {
        "cancel": "Cancel",
        "select": "Select",
    }
}