import { FetchUtility } from "../packages/utilities";


export class PublicProductListRef{

    public static currentPageNumber: number = 1;
    
    // The reference of the fetch utility 
    public static productListFetchUtil: FetchUtility | null = null;
    
}

export class PublicProductListStorage {
    // Storage for the product list
    // where key is the pagination page and the data of the product
    public static productListStorage: Record<number, Array<Record<string, any>>> = {};


    // Storage for the individual products where key is its big id and value is its data
    public static productStorage: Record<number, any> = {};

    // The pagination data of the product lists
    public static productPaginationData: Record<any, any> | null = null;

    // Storage for individual products that were searched
    public static searchedProductStorage: Record<number, any> = {};

}