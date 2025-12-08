import { FetchUtilityRawProcessedResponse } from "../packages/typing";
import { FetchUtility } from "../packages/utilities";
import YanexMessageModal from "../packages/widgets/yanexWidgetPackages/yanexMesssageModal";
import { PublicLinks } from "../public";
import { PublicProductListHelper, PublicProductListRequest } from "./productListHelper";
import { PublicProductListRef, PublicProductListStorage } from "./productListRef";


export class PublicProductListBundle {

    /**
     * Gets the paginated products based on the page number given.
     * @param pageNum The number for the pagination
     */
    public static async getProducts(pageNum: number | null = null): Promise<Array<Record<string, any>>> {
        // Check if product pagination data was already saved
        if(pageNum === null) {
            pageNum = PublicProductListRef.currentPageNumber
            PublicProductListRef.currentPageNumber += 1;
        }

        const pageData = PublicProductListStorage.productListStorage[pageNum];

        if(pageData) {
            return new Promise((res) => {
                return res(pageData)
            }, )
        } else {
           const response = await PublicProductListRequest.getProductList(pageNum);
           if(response.responseStatus) {
                const data = response.data;
                if(data.status) {
                    PublicProductListHelper.saveFetchedData(data, pageNum);
                    return new Promise((res) => {
                        return res(data.paginatedData.data)
                    })
                } else {
                    new YanexMessageModal(`Something went wrong. ${data.message}`, "okay");
                }
           } else {
                new YanexMessageModal(response.message, "close")
           }
           return [{}];
        }
    }
}