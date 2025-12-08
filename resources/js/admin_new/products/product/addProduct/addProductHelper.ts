import YanexContentSlider from "../../../../packages/widgets/yanexWidgetPackages/yanexContentSlider";
import { YanexDiv, YanexElement } from "../../../../packages/widgets/yanexWidgets";
import { AdminRefs } from "../../../adminRef";
import { AddProductBundle, AddProductEvents } from "./addProductBundle";
import { AddProductRef } from "./addProductRef";
import { FinalizeProductFactory } from "./finalizeProduct/finalizeProductHelper";
import ProductCategorySectionFactory from "./productCategorySection/productCategorySectionHelper";
import { ProductInfoSectionFactory } from "./productInfoSection/productInfoSectionHelper";
import { ProductNameSectionFactory, ProductNameSectionHelper } from "./productNameSection/productNameSectionHelper";
import ProductTypeSectionFactory from "./productTypeSection/productTypeSectionHelper";
import ProductVariantSectionFactory from "./productVariantSection/productVariantSectionHelper";
import { ProductImagesSectionFactory } from "./productImagesSection/productImagesSectionHelper";


export class AddProductFactory{


    public static createAddProductUi(parent: YanexDiv): void {

        const container = new YanexDiv(parent, {
            className: "w-full h-full flex items-center justify-center overflow-auto"
        });
        AddProductRef.addProductParentContainer = container;

        const productNameContainer = ProductNameSectionFactory.createProductNameSection();
        const productInfoContainer = ProductInfoSectionFactory.createProductInfoSection();
        const imageContainer = ProductImagesSectionFactory.createImagesGui();
        const variantContainer = ProductVariantSectionFactory.createProductVariantSection();
        const categoryContainer = ProductCategorySectionFactory.createProductCategorySection();
        const productTypeContainer = ProductTypeSectionFactory.createProductTypeSection();
        const finalizeProduct = FinalizeProductFactory.createFinalizeUi();

        const slider = new YanexContentSlider(container, {
            contents: [productNameContainer, productInfoContainer,
                 imageContainer, 
                variantContainer, categoryContainer,
                productTypeContainer, finalizeProduct
            ],
            contentsAlias: ["Product Name", "Product Info",
                "Product Images", "Product Variants", 
                "Product Category", "Product Type", "Finalize"],
            defaultActiveContentIndex:0
        });
        AddProductRef.addProductSlider = slider;
        
        slider.addEventListener("contentChange", AddProductEvents.contentChanged);

        // Set additional gui for the finalize gui
        FinalizeProductFactory.createIncompleteAreaInfoTabs();
    }


}