import { FetchUtilityProcessedResponse } from "../packages/typing";
import { FetchUtility } from "../packages/utilities";
import { PublicProductListStorage } from "../productList/productListRef";
import { SearchProductsLink } from "./searchProductsRef";


export class SearchProductsRequest{

    /**
     * Search a product
     * @param keyword The product to be searched
     * @returns Processed Response from the server
     */
    public static async searchProducts(keyword: string, cursor: number): FetchUtilityProcessedResponse {
        // Get Ids of already fetched products
        const fetchedIds = Object.keys(PublicProductListStorage.productStorage);

        const payload = {
            "keyword": keyword,
            "fetchedIds": fetchedIds,
            "cursor": cursor
        }
        const fetchUtil = new FetchUtility("POST", "json", payload, "json");
        const result = await fetchUtil.start(SearchProductsLink.searchProduct);
        return await fetchUtil.processResponse(result);
    }
}