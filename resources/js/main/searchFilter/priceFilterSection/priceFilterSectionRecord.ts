

export class PriceFilterSectionRecord{
    public static message: string = "Set filter price for the search results";

    public static priceConditionMessage: string = "Pricing Filter Condition";

    public static filterOnly: string = "Filter ";

    public static conditionalPriceButtons: Record<string, string> = {
        "and": "And",
        "or": "Or"
    }

    public static priceConditionExpressions: Record<string, string> = {
        "<": "below",
        ">": "above",
        "=": "equals to",
    }
}