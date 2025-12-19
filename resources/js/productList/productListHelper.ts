import { FetchUtilityRawProcessedResponse } from "../packages/typing";
import { FetchUtility } from "../packages/utilities";
import { PublicLinks } from "../public";
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

    public static getProductData(productId: number): Record<string, any> | null {

        const product = PublicProductListStorage.productStorage[productId];
        return product ? product : null;
   
    }

    public static addProductData(productData: Record<string, any>) {
        PublicProductListStorage.productStorage[productData["id"]] = productData;
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
            "paginate": 10
        }, "json");
        const response = await fetchUtil.start(PublicLinks.GETPRODUCTLISTS)
        return fetchUtil.processResponse(response);
    }

}