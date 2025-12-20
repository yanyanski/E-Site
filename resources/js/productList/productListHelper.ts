import { FetchUtilityRawProcessedResponse } from "../packages/typing";
import { FetchUtility } from "../packages/utilities";
import { PublicLinks, PublicNumberValues } from "../public";
import { PublicProductListRef, PublicProductListStorage } from "./productListRef";


export class PublicProductListHelper {
    
    /**
     * Save the paginated data from the server
     * @param paginatedData The paginated data (from lvl)
     */
    public static saveFetchedData(paginatedData: Record<string, any>, pageNumber: number): void {
        const dataInformation = paginatedData.paginatedData;
        if(dataInformation) {
            const data = dataInformation.data;
            PublicProductListStorage.productListStorage[pageNumber] = data;
            for(const d of data) {
                PublicProductListStorage.productStorage[d["id"]] = d;
            }
        }
    }

    /**
     * Get the data of the product
     * @param productId The product id of the product
     * @returns A record of the product or null if product doesn't exist in local storage
     */
    public static getProductData(productId: number): Record<string, any> | null {

        const product = PublicProductListStorage.productStorage[productId];

        if(product){
            return product
        }

        // Search the product data in the searched product data storage
        const searchedProduct = PublicProductListStorage.searchedProductStorage[productId];

        return searchedProduct? searchedProduct : null;

    }

    public static addProductData(productData: Record<string, any>) {
        PublicProductListStorage.productStorage[productData["id"]] = productData;
    }
    public static addSearchedProduct(productData: Record<string, any>) {
        PublicProductListStorage.searchedProductStorage[productData["id"]] = productData
    }

    public static updateProductdata(productId: number, productData: Record<string, any>): void {
        const product = PublicProductListStorage.productStorage[productId];
        if(product) {
            Object.assign(PublicProductListStorage.productStorage[productId], productData)
        }
    }

}

export class PublicProductListRequest{

    public static async getProductList(pageNum: number): Promise<FetchUtilityRawProcessedResponse> {
        const fetchUtil = new FetchUtility("POST", "json", {
            "page": pageNum,
            "paginate": PublicNumberValues.paginationLimit
        }, "json");
        const response = await fetchUtil.start(PublicLinks.GETPRODUCTLISTS)
        return fetchUtil.processResponse(response);
    }

}