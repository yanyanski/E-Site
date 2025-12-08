import { IconsBundle } from "../icons/iconsBundle";
import { IconsHelperRequest } from "../icons/iconsHelper";
import { YanexDiv } from "../packages/widgets/yanexWidgets";
import { YanexWidgetsHelper } from "../packages/widgets/yanexWidgetsHelper";
import { PublicProductListBundle } from "../productList/productListBundle";
import { PublicProductListHelper } from "../productList/productListHelper";
import { LoginBundle } from "./login/loginBundle";
import { MainHelpersFactory } from "./mainHelpers";
import { MainRecords } from "./mainRecords";
import { MainRef } from "./mainRef";
import { ProductDetailsBundle } from "./productDetails/productDetailsBundle";


export class MainBundle{

    public static async initialize(): Promise<void> {
        if(!MainRef.initialized){
            MainHelpersFactory.createWrapper();
            MainHelpersFactory.createUpperLinks();
            MainHelpersFactory.createDecor();
            MainHelpersFactory.createSearchBar();
            MainHelpersFactory.createProductListContainer();
            MainHelpersFactory.createLoadingContainer();
            MainHelpersFactory.createNoProductsStatus();

            const products = await PublicProductListBundle.getProducts();
            MainRef.loadingContainer.hide();
            this.showProducts(products)
            MainRef.initialized = true
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
                LoginBundle.initialize();
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
}