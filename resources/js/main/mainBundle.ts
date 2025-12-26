import { IconsBundle } from "../icons/iconsBundle";
import { IconsHelperRequest } from "../icons/iconsHelper";
import { YanexDiv } from "../packages/widgets/yanexWidgets";
import { YanexWidgetsHelper } from "../packages/widgets/yanexWidgetsHelper";
import { PublicProductListBundle } from "../productList/productListBundle";
import { PublicProductListHelper } from "../productList/productListHelper";
import { LoginBundle } from "../login/loginBundle";
import { LoginLinks, LoginRecord } from "../login/loginRecord";
import { MainHelpers, MainHelpersFactory } from "./mainHelpers";
import { MainRecordOtherUpperLinks, MainRecords, MainRecordUpperLinks } from "./mainRecords";
import { MainRef, MainStorage } from "./mainRef";
import { ProductDetailsBundle } from "./productDetails/productDetailsBundle";
import { SearchProductsRequest } from "../searchProducts/searchProductsHelper";
import { FetchUtilityProcessedResponse } from "../packages/typing";
import YanexMessageModal from "../packages/widgets/yanexWidgetPackages/yanexMesssageModal";
import { PublicProductListRef, PublicProductListStorage } from "../productList/productListRef";
import { YanexAnimate } from "../packages/widgets/yanexWidgetUtilities";
import { DocInfoUtility, FetchUtility, ScrollUtility } from "../packages/utilities";
import { SearchProductRef } from "../searchProducts/searchProductsRef";


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
            MainHelpersFactory.createNoProductsStatus()
            MainHelpers.setLoadingCardCounts();
            
            const products = await PublicProductListBundle.getProducts();
            MainRef.loadingContainer.hide(true);
            console.log(PublicProductListRef.productListFetchUtil?.instanceFetchId,
                FetchUtility.latestGlobalCurrentFetchId,
                PublicProductListRef.productListFetchUtil!.isFetchLatest
            )

            if(MainRef.isUserSearching === false && 
                // Check if the one currently being fetched is the product list
                (
                    PublicProductListRef.productListFetchUtil &&
                    PublicProductListRef.productListFetchUtil.isFetchLatest
                )
            ) {
                // Show the products only if the user is not searching
                this.showProducts(products)
            }
            // MainHelpersFactory.createLoadingCards(MainStorage.loadingCardsCount);
            
            MainRef.initialized = true
        } else {
            // Show Fetched data instead
            this.showProducts(PublicProductListStorage.productStorage);

        }
    }
    public static async showProducts(productData: Record<string, any>): Promise<void> {
        if(productData && Object.keys(productData).length !== 0) {

            for(const data of Object.values(productData)) {
                MainHelpersFactory.createProductCard(data);
            }
            MainRef.productListContainer.show();
            MainRef.noProductContainer.hide();

        } else {
            MainRef.productListContainer.hide();
            MainRef.noProductContainer.show();
        }

        await IconsHelperRequest.getImageIcons(Object.values(MainRecords.mainIcons));
        IconsBundle.setElementIcons(MainRef.wrapperContainer)
    }


    public static async addSearchedResults(): Promise<void> {
        console.log("SEARCHED")
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
        console.log(productData)
        // Assign cursor
        // Check if the product data that were sent is below the pagination limit.
        // means user exhausted all of the search results
        if(productData["cursor"] === null || newSearchedProductLenth === 0) {
            MainStorage.searchCursor = null
        } else {
            MainStorage.searchCursor = productData["cursor"];
        }
        const searchedKeyword = productData["keyword"];

        function checkUserPageIntegrity(): boolean | null {
            return MainRef.isUserInHomePage === false && 
                    SearchProductRef.searchProductFetchUtil &&
                    SearchProductRef.searchProductFetchUtil.isFetchLatest &&
                    searchedKeyword === MainRef.searchBar.value // Check if the user searched different keyword
        }
        
        if(newSearchedProductLenth === 0) {
            console.log(checkUserPageIntegrity(), "NO RESULTS")
            if(checkUserPageIntegrity()) {
                MainRef.loadingContainer.hide(true)
                // No search results
                if(MainRef.noSearchResultsContainer === null) {
                    MainHelpersFactory.createNoSearchResults();
                } else {
                    MainRef.noSearchResultsContainer.show();
                }
            }
            
        } else {
            MainRef.noSearchResultsContainer?.hide();
            // Get then sort keys
            const sortedKeys = Object.keys(newSearchedProduct).toSorted();
            

            // Do this if user is still in the search area
            if(checkUserPageIntegrity()) {
                for(const key of sortedKeys) {
                    let productData: Record<string, any> = newSearchedProduct[key];
                    if(typeof productData === "number") {
                        productData = PublicProductListHelper.getProductData(productData) as Record<string, any>
                    }

                    if(productData) {
                        MainHelpersFactory.createProductCard(productData);
                        PublicProductListHelper.addSearchedProduct(productData)
                    }
                }

                MainRef.loadingContainer.hide(true)

                // reinitialize icons
                await IconsHelperRequest.getImageIcons(Object.values(MainRecords.mainIcons));
                IconsBundle.setElementIcons(MainRef.wrapperContainer)
            }

        }
    }

    /**
     * Shows the search container
     */
    public static async showSearch(force: boolean = false): Promise<void> {
        
        if(force === false && [1, 2].includes(MainRef.searchContainerHidden)) return;
        MainRef.searchContainerHidden = 2;

        YanexAnimate.animateSlide(MainRef.searchContainer, "down", 500);
        await YanexAnimate.animateFade(MainRef.searchContainer, "in", 500);

        MainRef.searchContainer.show();
        MainRef.searchContainerHidden = 1;

        // Light the search upper link button
        MainRef.otherUpperLinkButtons["Search"].fg = "specialColorFg"
    }

    /**
     * Hides the search container
     */
    public static async hideSearch(force: boolean = false): Promise<void> {
         if(force === false && [0, 2].includes(MainRef.searchContainerHidden)) return;
        MainRef.searchContainerHidden = 2;

        YanexAnimate.animateSlide(MainRef.searchContainer, "up", 1500);
        await YanexAnimate.animateFade(MainRef.searchContainer, "out", 500);
        MainRef.searchContainer.hide();
        MainRef.searchContainerHidden = 0;

         // Light the search upper link button
        MainRef.otherUpperLinkButtons["Search"].fg = "defaultFg"
    }

    public static goHome(): void { 
        // Empty the search bar
        MainRef.searchBar.value = "";
        MainRef.searchButtonClicked = false;
        MainStorage.previousSearchValue = null;

        if(MainRef.isUserInHomePage === false) {
            // Hide searching container
            MainRef.loadingContainer.hide()


        }

                    // Hide no search results
            MainRef.noSearchResultsContainer?.hide()

        MainHelpersFactory.createLoadingContainer("Loading...")
        MainRef.backSearch.hide();
        // Bring back to home
        MainRef.productListContainer.clearChildren();
        MainBundle.initialize();

        // Set the show product exhausted message to false to reshow
        // it again when user goes back to homepage
        MainHelpers.resetFlagReferences()

        // Reset cursor
        MainStorage.searchCursor = 0;

        MainRef.loadingContainer.hide(true)

        MainRef.isUserInHomePage = true
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
        switch(target.textContent as MainRecordOtherUpperLinks | MainRecordUpperLinks) {
            case "Log In":
                window.open(LoginLinks.loginLink, "_blank")
                break;
            case "Home":
                // Check if the searchbar is empty
                if(MainRef.searchBar.value === "") {
                    // Scroll to the top instead
                    ScrollUtility.animateScroll(MainRef.productListContainer.widget!, 0, 300)
                } else {
                    MainBundle.goHome()
                }
               MainBundle.hideSearch()
               break;
            case "Search":
                if(MainRef.searchContainer.isHidden) {
                    MainBundle.showSearch(true);
                } else {
                    MainBundle.hideSearch(true);
                }
                
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

    public static async addProducts(): Promise<void> {
        if(MainRef.isFetchingProducts) return;
        
        // User is searching/fetching products
        MainRef.isFetchingProducts = true;
        
        const searchKeyword = MainRef.searchBar.value || "";
        const loadingCardCount = MainStorage.loadingCardsCount;

        // Perform different operations if the search bar is empty or not.
        if(searchKeyword === "" || 
            MainRef.searchButtonClicked === false
        ) {// User is at the homepage

            // Check if the user haven't exhausted the pagination data
            const paginationData = PublicProductListStorage.productPaginationData?.paginatedData;
            if(paginationData === undefined || paginationData === null) {
                const mess = new YanexMessageModal("Something went wrong. Please refresh the page", 'okay');
                mess.addEventListener("close", (e) => location.reload());
            }
            const lastPaginationPage = paginationData["last_page"];
            const widget = MainRef.productListContainer.widget!

            // User exhausted all of the products from the db
            if(PublicProductListRef.currentPageNumber > lastPaginationPage) {
                MainRef.isFetchingProducts = false;
                if(MainRef.showExhaustedProduct) return;
                // Append end result here
                MainHelpersFactory.createEndResult("Products Exhausted");
                requestAnimationFrame(() => {
                    ScrollUtility.animateScroll(
                        widget,
                        widget.scrollHeight,
                        1000
                    )
                })
                MainRef.showExhaustedProduct = true;
                return;
            };

            MainHelpersFactory.createLoadingCards(loadingCardCount);

            const products = await PublicProductListBundle.getProducts();

            // Show the products if the user is not searching
            if(MainRef.isUserSearching === false && (
                PublicProductListRef.productListFetchUtil &&
                PublicProductListRef.productListFetchUtil.isFetchLatest
            )) {
                MainBundle.showProducts(products);
            }
            MainHelpers.removeLoadingProducts();
            
            MainRef.isFetchingProducts = false;
          
            return;
        }

        function setEndResult(): boolean {
            // Check if the search cursor is null
            console.log(MainStorage.searchCursor)
            if(MainStorage.searchCursor === null &&
                MainRef.showSearchedExhaustedProduct === false &&
                MainRef.isUserInHomePage === false
            ) {
                MainHelpersFactory.createEndResult("End of search results.");
                MainRef.showSearchedExhaustedProduct = true;
                return true
            }
            return false
        }

        const end = setEndResult();
        console.log("END?", end)

        if(end) {
            // User exhausted search results.
            MainRef.isFetchingProducts = false;
            return  
        }

        console.log("USER SEARCHING PRODUCT")
        console.log(
            MainRef.isUserInHomePage, // Show product if user is still in search page
             ( PublicProductListRef.productListFetchUtil &&
                PublicProductListRef.productListFetchUtil.isFetchLatest)
        )
        // User is searching for a product
        MainHelpersFactory.createLoadingCards(loadingCardCount);

        if(MainRef.isUserInHomePage === false && // Show product if user is still in search page
             ( PublicProductListRef.productListFetchUtil &&
                PublicProductListRef.productListFetchUtil.isFetchLatest)) {
                    await MainBundle.addSearchedResults();
                }
        
        MainHelpers.removeLoadingProducts();

        // Check whether user has exhausted search results after fetching search results
        setEndResult();
        MainRef.isFetchingProducts = false;
    }

    /**
     * User scroll down on the product list
     */
    public static async productListScrolledDown(): Promise<void> {

        if(MainRef.searchContainer.isHidden) return;
        
        MainBundle.hideSearch()

        // Recalculate the max height of the product list
        // MainRef.productListContainer.updateYScrollable()
    }

    /**
     * User scrolls up on the product list
     */
    public static async productListScrolledUp(): Promise<void> {
        if(MainRef.searchContainer.isHidden === false) return;
        
        MainBundle.showSearch()
    }

    /**
     * Back search button clicked
     * @param event 
     */
    public static async backSearchButtonClicked(event: PointerEvent): Promise<void> {
        MainBundle.goHome()
        return
        if(MainRef.isUserInHomePage === false) {
            MainRef.loadingContainer.hide();
        }

        MainRef.isUserInHomePage = true
        // Go back home
        MainRef.backSearch.state = false
        MainRef.searchBar.state = false;
        MainRef.productListContainer.clearChildren();
        MainBundle.initialize();

        await MainBundle.addSearchedResults()
        MainRef.loadingContainer.hide(true)
        MainRef.searchBar.value = ""
        MainRef.backSearch.hide()
        MainRef.searchBar.state = true
        MainRef.backSearch.state = true

        // Set the show product exhausted message to false to reshow
        // it again when user goes back to homepage
        MainHelpers.resetFlagReferences()
        MainRef.searchButtonClicked = false

    }

    /**
     * Search products
     * @param event 
     */
    public static async searchButtonClicked(event: PointerEvent): Promise<void> {
        const searchKeyword = MainRef.searchBar.value || "";
        console.log("SEACHHHH!")
        if(searchKeyword === "") {
            MainBundle.goHome();
            return
            MainHelpersFactory.createLoadingContainer("Loading...")
            MainRef.backSearch.hide();

            // Bring back to home
            MainRef.productListContainer.clearChildren();
            MainBundle.initialize();
            MainRef.searchButtonClicked = false;
            MainStorage.previousSearchValue = null
            MainRef.showSearchedExhaustedProduct = false;
            MainRef.isUserInHomePage = true;
        } else {
            // Deny searching product if user is already searching
            // search the keyword
            if(MainStorage.previousSearchValue !== null &&
                MainStorage.previousSearchValue === searchKeyword.trim()
            ) return;

            MainRef.isUserInHomePage = false;
            MainStorage.previousSearchValue = searchKeyword.trim();

            // MainRef.loadingContainer.hide(true);
            MainRef.isUserSearching = true;
            MainRef.searchButtonClicked = true;
            MainRef.loadingContainer.hide(true);
            MainHelpersFactory.createLoadingContainer("Searching...")
            // Show the back button
            MainRef.backSearch.show();

            // Reset cursor
            MainStorage.searchCursor = 0;
            
            MainRef.productListContainer.clearChildren()

            await MainBundle.addSearchedResults()

            // Set the show product exhausted message to false to reshow
            // it again when user goes back to homepage
            MainRef.isUserSearching = false;
            MainHelpers.resetFlagReferences()
        }

    }
}