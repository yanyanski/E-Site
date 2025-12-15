import { IconsBundle } from "../../../../icons/iconsBundle";
import { IconsHelperRequest } from "../../../../icons/iconsHelper";
import { DelegationUtility, FetchUtility, ScrollUtility} from "../../../../packages/utilities";
import { YanexCustomModalEvents } from "../../../../packages/widgets/yanexWidgetPackages/yanexCustomModal";
import { YanexListBoxEvent } from "../../../../packages/widgets/yanexWidgetPackages/yanexListBox";
import YanexMessageModal from "../../../../packages/widgets/yanexWidgetPackages/yanexMesssageModal";
import { YanexDiv, YanexHeading } from "../../../../packages/widgets/yanexWidgets";
import { YanexWidgetsHelper } from "../../../../packages/widgets/yanexWidgetsHelper";
import { YanexThemeHelper } from "../../../../packages/widgets/yanexWidgetTheme/yanexThemeHelper";
import { YanexAnimate } from "../../../../packages/widgets/yanexWidgetUtilities";
import { PublicProductListBundle } from "../../../../productList/productListBundle";
import { PublicProductListHelper } from "../../../../productList/productListHelper";
import { PublicProductListStorage } from "../../../../productList/productListRef";
import { CategoryListBundle } from "../../../category/categoryLists/categoryListBundle";
import { CategoryListStorage } from "../../../category/categoryLists/categoryListRef";
import { VariantListBundle } from "../../../variants/variantList/variantListBundle";
import { VariantListStorage } from "../../../variants/variantList/variantListRef";
import { ProductListFactory, ProductListHelper } from "./productListHelper";
import { ProductListLinks, ProductListRecord } from "./productListRecord";
import { ProductListRef, ProductListStorage } from "./productListRef";
import { SelectProductAttrBundle } from "./selectProductAttr/selectProductAttrBundle";
import { SelectProductTypeBundle } from "./selectProductType/selectProductTypeBundle";

export class ProductListBundle{

    public static async initialize(): Promise<void>{
      if(!ProductListRef.initialized) {
            ProductListFactory.createProductListContainer();
            ProductListFactory.createNoProduct();
            await this.displayProducts();

            ProductListRef.initialized = true;
      } else {
        if(ProductListRef.productListContainer) ProductListRef.productListContainer.show();
      }

    }
    
    /**
     * Fetches product list from the server and displays them
     * @param page THe page number of products to be displayed.
     */
    public static async displayProducts(page: number | null = null): Promise<void> {
        if(page == null) {
            page = ProductListRef.currentProductPage;
            ProductListRef.currentProductPage += 1;
        }

        const products = await PublicProductListBundle.getProducts(page);

        if(ProductListRef.productListLoadingContainer) {
            ProductListRef.productListLoadingContainer.hide();
        }
        if(products && Object.keys(products).length !== 0) {
            ProductListRef.noProductContainer.hide();
            for(const product of products) {
                ProductListFactory.createAdminProductCard(product)
            }
        } else {
            ProductListRef.noProductContainer.show();
        }

    }

}

export class ProductListEvents {
    public static adminCardMouseEnter(event: MouseEvent, container: YanexDiv): void {
        const theme = YanexThemeHelper.getCurrentThemeSchema();
        const borderTheme = theme.border;


        container.addElementClassName([
            borderTheme.specialColorBorder, "cursor-pointer"
        ])
    }

    public static adminCardMouseLeave(event: MouseEvent, container: YanexDiv): void {
        const theme = YanexThemeHelper.getCurrentThemeSchema();
        const borderTheme = theme.border;


        container.removeElementClassName([
            borderTheme.specialColorBorder
        ])
    }

    public static async adminCardMouseClicked(event: PointerEvent, container: YanexDiv): Promise<void> {

        const adminProductCard = DelegationUtility.delegateUntilClassnameIsFound(event.target as HTMLElement,
            ProductListRecord.adminProductCardClassName
        )

        if(adminProductCard) {
            const adminCardYanex = YanexWidgetsHelper.getYanexReference(adminProductCard);
            if(adminCardYanex) {
                const prodId = adminCardYanex.dataSet;

                // Check if the product's data was saved;
                if(prodId) {
                    const productData = PublicProductListStorage.productStorage[parseInt(prodId)];

                    if(productData) {
                        ProductListFactory.createAdminProductModal(productData["name"]);

                        ProductListFactory.createModalImageSide(productData["images"])
                        ProductListFactory.createProductFields()

                        ProductListHelper.setDefaultProductData(productData)

                        Object.assign(ProductListStorage.productDefaultData, productData);

                        await IconsHelperRequest.getImageIcons(ProductListRecord.productListIcons);
                        IconsBundle.setElementIcons(ProductListRef.productFieldMainContainer!)
                    } else {
                        new YanexMessageModal("Something went wrong. Please refresh the page", "okay")
                    }
                }
            }
        }
    }

    public static advancedSettingsClicked(event: PointerEvent, arrow: YanexHeading): void {
        const dropDownContainer = event.target as HTMLDivElement;
        const yanex = YanexWidgetsHelper.getYanexReference(dropDownContainer);

        if(ProductListRef.advancedDropDownClicked) {
            ProductListRef.productModifyAdvancedContainer!.hide()

            YanexAnimate.animateRotate(arrow, 90, 0, 100);
            if(yanex) yanex.setStatus("none", 'deep', true, true);
        } else {
            if (yanex) yanex.setStatus("selected", 'deep', true, true);
            ProductListRef.productModifyAdvancedContainer!.show()

            YanexAnimate.animateRotate(arrow, 0, 90, 100);
        }

        if(ProductListRef.productFieldMainContainer) {
            ProductListRef.productFieldMainContainer.updateYScrollable();
        }
        ProductListRef.advancedDropDownClicked = !ProductListRef.advancedDropDownClicked;

    }
    public static advancedSettingsMouseEvent(event: MouseEvent, arrow: YanexHeading): void {
        if(ProductListRef.advancedDropDownClicked) return;

        const dropDownContainer = event.target as HTMLDivElement;
        const yanex = YanexWidgetsHelper.getYanexReference(dropDownContainer);

        switch(event.type) {
            case "mouseenter":
                
                YanexAnimate.animateRotate(arrow, 0, 90, 100);
                if(yanex) {
                    yanex.setStatus("selected", 'deep', true, true)
                }
                break;
            case "mouseleave":
                YanexAnimate.animateRotate(arrow, 90, 0, 100);
                if(yanex) {
                    yanex.setStatus("none", 'deep', true, true)
                }

                break;
        }
    }
    public static async addProductAttrClicked(event: Event): Promise<void> {
        const target = event.target as HTMLButtonElement;
        // Save current scroll position of the modal container
        ScrollUtility.saveScroll(ProductListRef.productFieldMainContainer!.widget);

        switch(target.textContent) {
            case "Add Variant": 


                let variant: Array<Record<string, any>> = [];

                if(Object.keys(VariantListStorage.variants).length !== 0) {
                    const savedVariants = VariantListStorage.variants as Record<number, Record<string, any>>;
                    for(const variantData of Object.values(savedVariants)) {
                        variant.push(variantData) 
                    }
                } else {
                    const variantsData = await VariantListBundle.getVariants();
                    if(variantsData.responseStatus) {
                        const varData = variantsData["data"] as Array<Record<string, any>>;
                        if(varData) {
                            variant = varData
                        }
                    }
                }

                const displayingVariants: Array<Array<string>> = [];
                for(const v of variant){
                    displayingVariants.push([v["var_id"], v["var_title"]])
                }

                
                SelectProductAttrBundle.initialize(displayingVariants, "variant")
                ProductListRef.productShowModal!.close()
                break;
            case "Add Category":
                let category: Array<Record<string, any>> = [];

                if(Object.keys(CategoryListStorage.categorys).length !== 0) {
                    const savedCategories = CategoryListStorage.categorys as Record<number, Record<string, any>>;
                    for(const categoryData of Object.values(savedCategories)) {
                        category.push(categoryData) 
                    }
                } else {
                    const categoryData = await CategoryListBundle.getCategorys();
                    if(categoryData.responseStatus) {
                        const cat = categoryData["data"] as Array<Record<string, any>>;
                        if(categoryData) {
                            category = cat
                        }
                    }
                }

                const displayingCategories: Array<Array<string>> = [];
                for(const c of category){
                    displayingCategories.push([c["cat_id"], c["cat_name"]])
                }

                
                SelectProductAttrBundle.initialize(displayingCategories, "category")
                ProductListRef.productShowModal!.close()
                
                break;
        }
    }

    public static listAttrValueRemoved(event: YanexListBoxEvent, type: "category" | "variant" | "type"): void {
        switch(type){
            case "category":
                const cat = ProductListStorage.productCategory[event.removedValue]
                if(cat) {
                    delete ProductListStorage.productCategory[event.removedValue]
                }
                break;
            case "variant":
                const variant = ProductListStorage.productVariants[event.removedValue]
                if(variant) {
                    delete ProductListStorage.productVariants[event.removedValue]
                }
                break;
        }
    }

    public static modalCloseEvent(event: YanexCustomModalEvents | null = null): void {
        ProductListStorage.productCategory = {};
        ProductListStorage.productVariants = {};
        ProductListRef.advancedDropDownClicked = false;
    }

    public static productUpdateMessageClose(event: PointerEvent): void {
        // Record last scroll of the ProductList modal
        ProductListRef.productShowModal!.show()
        ScrollUtility.applyScroll(ProductListRef.productFieldMainContainer!.widget);
    }

    public static async productUpdateModalClicked(event: PointerEvent): Promise<void>{
        const textContent = (event.target as HTMLButtonElement).textContent;
        switch(textContent){
            case ProductListRecord.modalButtons["update"]:
                const data = ProductListHelper.getUpdatedProductData();
                // Check newly submitted product
                const check = ProductListHelper.checkUpdatedProductData(data);

                if(check.status) {
                    // Add the data to a form
                    const formData = ProductListHelper.setProductDataToForm(data);

                    ProductListRef.productModifyButtons["update"].showLoadingStatus(true, "specialColorBg")

                    // Disable all inputs
                    ProductListRef.productShowModal!.modalDialog.setElementsState(["YanexButton", "YanexTextArea", "YanexInput"], false);
                    const fetchUtil = new FetchUtility("POST", "json", formData, "auto");
                    const resp = await fetchUtil.start(ProductListLinks.productUpdateLink);
                    const result = await fetchUtil.processResponse(resp);
                    console.log(result.data);
                    if(result.data["status"]) {
                        ProductListRef.productModifyButtons["update"].showLoadingStatus(false, "specialColorBg")
                        
                        // Modify the locally saved data of the product
                        console.log(result.data["data"])
                        const serializedData = await ProductListHelper.serializeSavedData(data, result.data["data"]);
                        PublicProductListHelper.updateProductdata(data["id"], serializedData);

                        // Update the product card
                        ProductListHelper.updateProductCard(serializedData)
                        
                    } else {
                        new YanexMessageModal(`Something went wrong: ${result.data["message"]}`)
                    }
                    ProductListRef.productShowModal!.modalDialog.setElementsState(["YanexButton", "YanexTextArea", "YanexInput"], true);
                    
                } else {
                    ScrollUtility.saveScroll(ProductListRef.productFieldMainContainer!.widget)
                    ProductListRef.productShowModal!.close()
                    const message = new YanexMessageModal(check.message, "okay");
                    message.addEventListener("close", ProductListEvents.productUpdateMessageClose);
                    
                }

                break;
            case ProductListRecord.modalButtons["cancel"]:
                ProductListRef.productShowModal!.close()
                ProductListEvents.modalCloseEvent()
                break;
        }
    }

    public static editProductType(event: PointerEvent): void {
        ScrollUtility.saveScroll(ProductListRef.productFieldMainContainer!.widget)
        ProductListRef.productShowModal!.close()
        SelectProductTypeBundle.initialize(1);
    }

    public static productImageRemoved(event: PointerEvent): void {
        ProductListRef.productImageSlider.removeImage()
    }
}