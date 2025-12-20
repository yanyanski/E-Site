import { IconsBundle } from "../icons/iconsBundle";
import { IconsHelperRequest } from "../icons/iconsHelper";
import { YanexDiv } from "../packages/widgets/yanexWidgets";
import { YanexWidgetsHelper } from "../packages/widgets/yanexWidgetsHelper";
import { PublicProductListBundle } from "../productList/productListBundle";
import { PublicProductListHelper } from "../productList/productListHelper";
import { LoginBundle } from "../login/loginBundle";
import { LoginLinks, LoginRecord } from "../login/loginRecord";
import { MainHelpersFactory } from "./mainHelpers";
import { MainRecords } from "./mainRecords";
import { MainRef, MainStorage } from "./mainRef";
import { ProductDetailsBundle } from "./productDetails/productDetailsBundle";
import { SearchProductsRequest } from "../searchProducts/searchProductsHelper";
import { FetchUtilityProcessedResponse } from "../packages/typing";
import YanexMessageModal from "../packages/widgets/yanexWidgetPackages/yanexMesssageModal";
import { PublicProductListStorage } from "../productList/productListRef";


export class MainBundle{

    /**
     * Initializes the home. If initialized, reshows the card of products that were previously fetched instead
     * !(If initialized, it doesn't clear the productListContainer. It only simply appends cards)
     */
    public static async initialize(): Promise<void> {
        if(!MainRef.initialized){
            MainHelpersFactory.createWrapper();
            MainHelpersFactory.createUpperLinks();
            // MainHelpersFactory.createDecor();
            MainHelpersFactory.createSearchBar();
            MainHelpersFactory.createProductListContainer();
            MainHelpersFactory.createLoadingContainer("Loading...");
            MainHelpersFactory.createNoProductsStatus();

            const products = await PublicProductListBundle.getProducts();
            MainRef.loadingContainer.hide(true);
            this.showProducts(products)
            MainRef.initialized = true
            await IconsHelperRequest.getImageIcons(Object.values(MainRecords.mainIcons));
            IconsBundle.setElementIcons(MainRef.wrapperContainer)
        } else {
            // Show Fetched data instead
            this.showProducts(PublicProductListStorage.productStorage);
            await IconsHelperRequest.getImageIcons(Object.values(MainRecords.mainIcons));
            IconsBundle.setElementIcons(MainRef.wrapperContainer)
        }
        
    }
    public static showProducts(productData: Record<string, any>): void {
        if(productData && Object.keys(productData).length !== 0) {
            for(const [keyId, data] of Object.entries(productData)) {
                MainHelpersFactory.createProductCard(data);
            }
            MainRef.productListContainer.show();
            MainRef.noProductContainer.hide();
        } else {
            MainRef.productListContainer.hide();
            MainRef.noProductContainer.show();
        }
    }

    public static async addSearchedResults(): Promise<void> {
        // Return if searchCursor is null because the search results were now exhausted by the user
        if(MainStorage.searchCursor === null) return;

        const searchKeyword = MainRef.searchBar.value || "";

        const products = await SearchProductsRequest.searchProducts(searchKeyword,
            MainStorage.searchCursor
        );

        // Show fetched products
        if(!products.responseStatus) {
            new YanexMessageModal(`Something went wrong: ${products["message"]}`, "okay");
            return
        }
        const productData = products["data"];
        const newSearchedProduct = productData["data"];
        Object.assign(newSearchedProduct, productData["fetchedIds"]);
        const newSearchedProductLenth = Object.keys(newSearchedProduct).length;

        // Assign cursor
        // Check if the product data that were sent is below the pagination limit.
        // means user exhausted all of the search results
        if(productData["cursor"] === null || newSearchedProductLenth === 0) {
            MainStorage.searchCursor = null
        } else {
            MainStorage.searchCursor = productData["cursor"];
        }
        
        if(newSearchedProductLenth === 0) {
            // No search results

        } else {
            // Get then sort keys
            const sortedKeys = Object.keys(newSearchedProduct).toSorted();

            for(const key of sortedKeys) {
                let productData: Record<string, any> = newSearchedProduct[key];
                if(typeof productData === "number") {
                    productData = PublicProductListHelper.getProductData(productData) as Record<string, any>
                }

                console.log(productData)
                if(productData) {
                    MainHelpersFactory.createProductCard(productData);
                    PublicProductListHelper.addSearchedProduct(productData)
                }
            }

            // reinitialize icons
            await IconsHelperRequest.getImageIcons(Object.values(MainRecords.mainIcons));
            IconsBundle.setElementIcons(MainRef.wrapperContainer)
        }
    }
}

export class MainBundleEvents {
    public static cardCLicked(event: PointerEvent, card: null | YanexDiv = null): void {
        let productCard;
        let productYanex = card;

        if(card === null) {
            productCard = event.target as HTMLDivElement;
            productYanex = YanexWidgetsHelper.getYanexReference(productCard);
        }
        

        const productId = productYanex?.dataSet;
        if(productId) {
            const productData = PublicProductListHelper.getProductData(parseInt(productId));
            if(!productData) return;
            ProductDetailsBundle.showProductDetails(productData)
        }
    }
    public static upperLinksClicked(event: PointerEvent): void {
        const target = event.target as HTMLButtonElement;
        switch(target.textContent) {
            case "Log In":
                window.open(LoginLinks.loginLink, "_blank")
                break;
        }
    }

    public static buyButtonClicked(event: PointerEvent): void {
        const button = event.target as HTMLButtonElement;
        const link = button.dataset[MainRecords.buyButtonDataSetAttr];

        window.open(link, "_blank")?.focus();
    }

    public static buyButtonHovered(event: MouseEvent, productCard: YanexDiv): void {
        const eventType = event.type;

        switch(eventType) {
            case "mouseenter":
                productCard.setElementBorder()
                break;
            case "mouseleave":
                productCard.setElementBorder("specialColorBorder");
                break;
        }
    }

    /**
     * Back search button clicked
     * @param event 
     */
    public static async backSearchButtonClicked(event: PointerEvent): Promise<void> {
        // Go back home
        MainRef.backSearch.state = false
        MainRef.searchBar.state = false;
        MainRef.productListContainer.clearChildren();
        MainBundle.initialize();

        await MainBundle.addSearchedResults()
        MainRef.loadingContainer.hide(true)
        
        MainRef.backSearch.hide()
        MainRef.searchBar.state = true
        MainRef.backSearch.state = true
    }

    /**
     * Search products
     * @param event 
     */
    public static async searchButtonClicked(event: PointerEvent): Promise<void> {
        const searchKeyword = MainRef.searchBar.value || "";
        
        if(searchKeyword === "") {
            MainHelpersFactory.createLoadingContainer("Loading...")
            MainRef.backSearch.hide();
            // Bring back to home
            MainRef.productListContainer.clearChildren();
            MainBundle.initialize();

        } else {
            MainHelpersFactory.createLoadingContainer("Searching...")
            // Show the back button
            MainRef.backSearch.show();
        }

        // Reset cursor
        MainStorage.searchCursor = 0;
        MainRef.productListContainer.clearChildren()
        
        await MainBundle.addSearchedResults()
        MainRef.loadingContainer.hide(true)
    }
}