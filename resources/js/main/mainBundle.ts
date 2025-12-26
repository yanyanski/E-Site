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
import { DocInfoUtility, ScrollUtility } from "../packages/utilities";


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


            const products = await PublicProductListBundle.getProducts();
            MainRef.loadingContainer.hide(true);

            if(MainRef.isUserSearching === false) {
                // Show the products only if the user is not searching
                this.showProducts(products)
            }
            
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
                    // Empty the search bar
                    MainRef.searchBar.value = "";
                    MainRef.searchButtonClicked = false;
                    MainStorage.previousSearchValue = null;

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
        console.log("IS FETCHING", MainRef.isFetchingProducts)
        if(MainRef.isFetchingProducts) return;
        
        // User is searching/fetching products
        MainRef.isFetchingProducts = true;
        const loadingCardCount = DocInfoUtility.isDocSizeSmall() ? 2 : 5;
        const searchKeyword = MainRef.searchBar.value || "";

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
                MainRef.isFetchingProducts = false;
                return;
            };

            MainHelpersFactory.createLoadingCards(loadingCardCount);

            requestAnimationFrame(async () => {
                widget.scrollHeight;
                ScrollUtility.animateScroll(
                    widget,
                    widget.scrollHeight,
                    1000
                )

                const products = await PublicProductListBundle.getProducts();

                // Show the products if the user is not searching
                if(MainRef.isUserSearching === false) {
                    MainBundle.showProducts(products);
                }
                MainHelpers.removeLoadingProducts();
                MainRef.isFetchingProducts = false;
            })
            return;
        }

        function setEndResult(): boolean {
            // Check if the search cursor is null
            if(MainStorage.searchCursor === null &&
                MainRef.showSearchedExhaustedProduct === false
            ) {
                MainHelpersFactory.createEndResult("End of search results.");
                MainRef.showSearchedExhaustedProduct = true;
                return true
            }
            return false
        }

        const end = setEndResult();

        if(end) return; // User exhausted search results. 

        console.log("USER SEARCHING PRODUCT")
        // User is searching for a product
        MainHelpersFactory.createLoadingCards(loadingCardCount);

        await MainBundle.addSearchedResults();
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
        
        if(searchKeyword === "") {
            MainHelpersFactory.createLoadingContainer("Loading...")
            MainRef.backSearch.hide();
            // Bring back to home
            MainRef.productListContainer.clearChildren();
            MainBundle.initialize();
            MainRef.searchButtonClicked = false;
            MainStorage.previousSearchValue = null
            MainRef.showSearchedExhaustedProduct = false;
        } else {
            // Deny searching product if user is already searching
            // and its search the same
            if(MainStorage.previousSearchValue !== null &&
                MainStorage.previousSearchValue === searchKeyword.trim()
            ) return;

            MainStorage.previousSearchValue = searchKeyword.trim();

            MainRef.loadingContainer.hide(true);
            MainRef.isUserSearching = true;
            MainRef.searchButtonClicked = true;
            MainHelpersFactory.createLoadingContainer("Searching...")
            // Show the back button
            MainRef.backSearch.show();

            // Set the show product exhausted message to false to reshow
            // it again when user goes back to homepage
            MainRef.isUserSearching = false;
            MainHelpers.resetFlagReferences()
        }

        // Reset cursor
        MainStorage.searchCursor = 0;
        MainRef.productListContainer.clearChildren()
        
        await MainBundle.addSearchedResults()
        MainRef.loadingContainer.hide(true)
    }
}