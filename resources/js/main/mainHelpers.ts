import { ScrollUtility } from "../packages/utilities";
import YanexImageSlider from "../packages/widgets/yanexWidgetPackages/yanexImageSlider";
import { YanexButton, YanexDiv, YanexHeading, YanexInput } from "../packages/widgets/yanexWidgets";
import { YanexAnimate } from "../packages/widgets/yanexWidgetUtilities";
import { PublicStringValues } from "../public";
import { MainBundleEvents } from "./mainBundle";
import { MainRecords } from "./mainRecords";
import { MainRef } from "./mainRef";


export class MainHelpers{

    /**
     * Remove the created loading products
     */
    public static removeLoadingProducts(): void {
        for(const div of MainRef.loadingProductCards) {
            div.hide(true)
        }
    }
}

export class MainHelpersFactory{
    /**
     * Create a wrapper that wraps on the whole body
     */
    public static createWrapper(): void {
        MainRef.wrapperContainer = new YanexDiv(document.body as HTMLBodyElement, {
            className: "w-screen h-screen flex flex-col",
        })
    }

    public static createUpperLinks(): void {
        const upperContainer = new YanexDiv(MainRef.wrapperContainer, {
            className: "flex place-content-between",
            bg: "extraBg"
        })
        MainRef.upperContainer = upperContainer;

        const otherLinksContainer = new YanexDiv(upperContainer, {
            className: 'flex ',
            bg:null
        })
        for(const link of MainRecords.otherUpperLinks) {
            const button = new YanexButton(otherLinksContainer, {
                className: "px-3 py-1 text-sm",
                bg: null,
                hoverFg: "specialColorFg",
                fg: "lighterFg",
                text: link
            })
            button.addEventListener("click", (e) => {MainBundleEvents.upperLinksClicked(e)});
            MainRef.otherUpperLinkButtons[link] = button
        }

                
        const mainLinksContainer = new YanexDiv(MainRef.upperContainer, {
            className: "flex justify-end self-end",
            bg: null
        })
        for(const link of MainRecords.mainUpperLinks) {
            const button = new YanexButton(mainLinksContainer, {
                className: "px-3 py-1 text-sm",
                bg: null,
                hoverFg: "extraSpecialColorFg",
                fg: "lighterFg",
                text: link
            })
            button.addEventListener("click", (e) => {MainBundleEvents.upperLinksClicked(e)})
        }
    }

    public static createDecor(): void {
        const decor1 = new YanexDiv(MainRef.wrapperContainer, {
            className: "flex p-3"
        })
        const greet = new YanexHeading(decor1, "h1", {
            className: "font-bold text-2xl ",
            text: "Welcome"
        })
    }
    public static createSearchBar():void {
        // Get the upper container height
        const upperContainerRect = MainRef.upperContainer!.widget.getBoundingClientRect();
        const height = upperContainerRect.height;

        const searchContainer = new YanexDiv(MainRef.wrapperContainer, {
            className: "flex p-3 gap-2 absolute w-full z-[9999]"
        })
        searchContainer.widget.style.top = `${height}px`;
        MainRef.searchContainer = searchContainer;

        const backSearch = new YanexButton(searchContainer, {
            className: "px-1 text-xl hidden",
            text: "<-",
            bg:null,
            hoverFg: "specialColorFg"
        })
        MainRef.backSearch = backSearch

        backSearch.addEventListener("click", (e) => MainBundleEvents.backSearchButtonClicked(e));

        const searchbar = new YanexInput(searchContainer, {
            className: "w-full flex rounded-md ",
            placeholder: "Search",
            bg: "lighterBg"
        })
        MainRef.searchBar = searchbar;

        const searchButton = new YanexButton(searchContainer, {
            className: "flex rounded-md",
            text: "Search",
            bg: "lighterSpecialColorBg",
            hoverBg: "specialColorBg"
        })  
        searchButton.addDataset(PublicStringValues.widgetIconDataSetTitle, MainRecords.mainIcons["search"]);
        searchButton.addEventListener("click", (e) => MainBundleEvents.searchButtonClicked(e));
    }
    public static createProductListContainer(): void {
        const productContainer = new YanexDiv(MainRef.wrapperContainer, {
            className: "flex flex-wrap w-full p-1 gap-2 justify-center overflow-y-auto scroll-modern items-start",
            smClasses: "sm:gap-5 ",
            bg: "lighterBg"
        })

        MainRef.productListContainer = productContainer

        // Events
        ScrollUtility.onScrollReachPercent(productContainer.widget, 
            [15, 95], 
            [   
                (e) => MainBundleEvents.productListScrolledDown(),
                (e) => MainBundleEvents.addProducts()
            ], 
            "down",
            100,
            true,
            true
        )

        ScrollUtility.onScrollReachPercent(productContainer.widget,
            10,
            (e) => MainBundleEvents.productListScrolledUp(),
            "up",
            100,
            false,
            true
        );
            
    }

    public static createLoadingContainer(text: string): void {
        const loadingContainer = new YanexDiv(MainRef.wrapperContainer, {
            className: "flex w-full h-full items-center justify-center"
        })
        MainRef.loadingContainer = loadingContainer
            
        new YanexDiv(loadingContainer, {
            className: "animate-spin rounded w-[15px] h-[15px]",
            bg: "specialColorBg"
        })

        new YanexHeading(loadingContainer, "h1", {
            className: "flex animate-pulse",
            text: text
        })
    }

    public static createProductCard(prodData: Record<string, any>): void {
        const images = prodData["images"];
        if(!images || images.length === 0) return;

        const imageList: Array<string> = [];
        const imageData: Array<Record<string, any>> = [];

        for(const imageData of images) {
            imageList.push(imageData["prod_image_url"])
        }

        const productCard = new YanexDiv(MainRef.productListContainer, {
            className: "w-[45%] flex flex-col border-[1px] min-h-[250px] hidden",
            mdClasses: "md:min-w-[300px] md:w-[300px]",
            hoverBorder: "specialColorBorder",
            dataSetName: MainRecords.productCardDataAttrName,
            dataSetValue: prodData["id"]
        }, {
            addHoverEffect: true
        })

        productCard.addEventListener("click", (e) => {MainBundleEvents.cardCLicked(e)})

        const imageListContainer = new YanexDiv(productCard, {
            className: "w-full h-[45%]"
        })

        const imageSlider = new YanexImageSlider(imageListContainer, imageList, {
            hideArrows: true,
            imageData: imageData
        });

        new YanexHeading(productCard, "h1", {
            className: "text-sm pointer-events-none",

            text: prodData["name"],
            hoverFg: "lighterSpecialColorFg",
        }, {
            textAlignment: "w"
        })

        new YanexHeading(productCard, "h6", {
            className: "text-[11px] opacity-80 pointer-events-none",
            fg: "lighterFg",
            text: prodData["type"]["prod_type_name"]
        }, {
            textAlignment: "w"
        })

        const priceBuyContainer = new YanexDiv(productCard, {
            className: "flex place-content-between items-center flex-wrap pb-1 justify-end pointer-events-none",
            smClasses: "sm:justify-end sm:pb-3 sm:flex-nowrap"
        })


        const price = new YanexHeading(priceBuyContainer, "h6", {
            fg: "lighterSpecialColorFg",
            className: "font-bold w-full text-xl px-1 items-end flex justify-start",
            text: `${PublicStringValues.currency}${prodData["info"]["prod_info_price"]}`
        }, {
            textAlignment: "w"
        })

        const buyButton = new YanexButton(priceBuyContainer, {
            className: "flex w-min rounded-xl px-2 mr-2 py-1 text-md whitespace-nowrap pointer-events-auto",
            text: "To Shopify",
            bg: "specialColorBg",
            hoverBg: "lighterSpecialColorBg",
        }, {
            addHoverEffect: true
        })

        buyButton.addDataset(PublicStringValues.widgetIconDataSetTitle, MainRecords.mainIcons["cart"]);
        buyButton.addDataset(MainRecords.buyButtonDataSetAttr, prodData["info"]["prod_info_link"]);
        buyButton.addEventListener("click", (e) => {
            MainBundleEvents.buyButtonClicked(e)
        })
        buyButton.addEventListener("mouseenter", (e) => {
            MainBundleEvents.buyButtonHovered(e, productCard)
        })
        buyButton.addEventListener("mouseleave", (e) => {
            MainBundleEvents.buyButtonHovered(e, productCard)
        })
        const categoryContainer = new YanexDiv(productCard, {
            className: "w-full p-1 flex gap-1 justify-end self-end mt-auto flex-wrap pointer-events-none"
        })

        for(const category of prodData["categories"]){
            new YanexHeading(categoryContainer, "h1", {
                className:"px-1 rounded text-xs",
                text: category["prod_cat_name"],
                fg:"lighterFg",
                bg: "extraBg",
                hoverBg: "specialColorBg",
                hoverFg: "contrastFg"
            })
        }

        const detailsLabel = new YanexHeading(productCard, "h1", {
            className: "flex w-full py-2 opacity-80 justify-center text-sm mt-1",
            text: "Details",
            bg: "extraBg",
            hoverFg: "specialColorFg",
            hoverBg: "lighterBg"
        })
        detailsLabel.addEventListener("click", (e) => {
            MainBundleEvents.cardCLicked(e, productCard)
        })

        YanexAnimate.animateFade(productCard, "in", 500)
    }

    public static createNoProductsStatus(): void {
        const container = new YanexDiv(MainRef.wrapperContainer, {
            className: "flex flex-col w-full h-full items-center justify-center",

        })
        new YanexHeading(container, "h1", {
            className: "text-sm opacity-80",
            text: MainRecords.noProductMessage
        })
        MainRef.noProductContainer = container
    }
    
    /**
     * Creates a loading container
     * @param containerCount The count of the loading container
     */
    public static createLoadingCards(containerCount: number = 5): void {

        for(let i = 1; i <= containerCount; i++) {
            const container = new YanexDiv(MainRef.productListContainer, {
                className: "w-[45%] flex animate-pulse p-1 flex-col gap-2 hidden",
                mdClasses: "md:min-w-[300px] md:w-[300px]"
            })

            MainRef.loadingProductCards.push(container);

            // Image
            new YanexDiv(container, {
                className: "w-full h-[150px]",
                bg: "lighterBg"
            })

            // title
            new YanexDiv(container, {
                className: "w-[30%] rounded-md h-[15px]",
                bg: "lighterBg"
            })

            // type
            new YanexDiv(container, {
                className: "w-[20%] rounded-md h-[10px]",
                bg:"lighterBg"
            })

            // Price and buy button container
            const priceBuyContainer = new YanexDiv(container, {
                className: "flex w-full place-content-between h-[30px] items-center"
            })

            new YanexDiv(priceBuyContainer, {
                className: "w-[30%] h-[20px] rounded-md ml-2",
                bg: "specialColorBg"
            })

            new YanexDiv(priceBuyContainer, {
                className: "w-[40%] h-full rounded-xl",
                bg:"specialColorBg"
            })

            // Category container
            const catContainer = new YanexDiv(container, {
                className: "flex items-end justify-end gap-2 w-full"
            })

            for(let i = 1; i <=2; i++){
                new YanexDiv(catContainer, {
                    className: "rounded-md h-[10px] px-2 w-[25%]",
                    bg:"extraBg"
                })   
            }

            //details
            new YanexHeading(container, "h1", {
                className: "w-full h-[30px] opacity-50 justify-center items-center flex",
                bg: "extraBg",
                text: "Loading...",
                fg: "lighterFg"
            })
            YanexAnimate.animateFade(container, "in", 1000)
        }
    }
}
