import { FetchUtility } from "../packages/utilities";


export class SearchProductRef{

    // The fetch util reference of the search product
    public static searchProductFetchUtil: FetchUtility | null = null;
}

export class SearchProductsLink {
    public static searchProduct: string = "/public/products/search";
    
}