
export type MainRecordUpperLinks = "Log In"
export class MainRecords{
    public static mainUpperLinks: Array< MainRecordUpperLinks> = [
        "Log In"
    ]

    public static productCardDataAttrName: string = "productCardId"

    public static mainIcons: Record<string, string> = {
        "cart": "cart.png",
        "search": "search.png"
    }

    public static noProductMessage: string = "No Products";

    public static buyButtonDataSetAttr: string = "buyButtonUrl"
}
