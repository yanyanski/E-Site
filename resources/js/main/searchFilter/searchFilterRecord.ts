import { TitleLabelRecord } from "../../packages/interfaces";


export class SearchFilterRecord {
    public static filterMessage: TitleLabelRecord = {
        title: "Filter Search",
        message: "Apply filter to your search"
    }

    public static filterButtons: Record<string, string> = {
        "clear": "Clear",
        "clearAll": "Clear All",
        "okay": "Okay",
        
    }

    public static filterSections: Record<string, string> = {
        "category": "Category",
        "variant": "Variant",
        "type": "Type",
        "price": "Price"
    }
}