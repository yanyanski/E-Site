import { Strings } from "../../../../../packages/datatypeHelpers";
import { DatetimeUtility } from "../../../../../packages/utilities";
import YanexMessageModal from "../../../../../packages/widgets/yanexWidgetPackages/yanexMesssageModal";
import YanexTreeview from "../../../../../packages/widgets/yanexWidgetPackages/yanexTreeview";
import { ProductTypeListHelper } from "../../../productType/productTypeList/productTypeListHelper";
import { AddProductContentAliases } from "../addProductRecord";
import { AddProductRef } from "../addProductRef";
import { ProductCategorySectionHelper } from "../productCategorySection/productCategorySectionHelper";
import { ProductCategorySectionRef } from "../productCategorySection/productCategorySectionRef";
import { ProductImagesSectionHelper } from "../productImagesSection/productImagesSectionHelper";
import { ProductImagesSectionRef } from "../productImagesSection/productImagesSectionRef";
import { ProductInfoSectionHelper } from "../productInfoSection/productInfoSectionHelper";
import { ProductInfoSectionRef } from "../productInfoSection/productInfoSectionRef";
import { ProductNameSectionHelper } from "../productNameSection/productNameSectionHelper";
import { ProductNameSectionRef } from "../productNameSection/productNameSectionRef";
import { ProductTypeSectionHelper } from "../productTypeSection/productTypeSectionHelper";
import { ProductTypeSectionRef } from "../productTypeSection/productTypeSectionRef";
import { ProductVariantSectionHelper } from "../productVariantSection/productVariantSectionHelper";
import { ProductVariantSectionRef } from "../productVariantSection/productVariantSectionRef";
import { FinalizeProductFactory, FinalizeProductHelper, FinalizeProductRequests } from "./finalizeProductHelper";
import { FinalizeProductRef } from "./finalizeProductRef";


export class FinalizeProductBundle {
    
    /**
     * Checks the needed information before submitting the product
     */
    public static checkNeededInformations(): void {
        FinalizeProductHelper.clearShownInfo();

        // Check product name
        const productNameFields = ProductNameSectionHelper.getProductNameData();
        for(const [fieldName, fieldValue] of Object.entries(productNameFields)) {
            if(fieldValue === "") {
                FinalizeProductFactory.addIncompleteInfo(`❌The field "${Strings.convertCase(fieldName, "kebabcase", true, "title")}" is empty.`, "Product Name")
            }
        }

        // Check product info
        const productInfoFields = ProductInfoSectionHelper.getProductInfoSectionData();
        for(const [pInfoName, pInfoValue] of Object.entries(productInfoFields)) {
            if(pInfoValue === "") {
                FinalizeProductFactory.addIncompleteInfo(`❌The field "${Strings.convertCase(pInfoName, "kebabcase", true, "title")}" is empty.`, "Product Info")
            }
        }

        // Check product images
        const productImages = ProductImagesSectionHelper.getSubmittedImages();
        if(!productImages || productImages.length === 0) {
            FinalizeProductFactory.addIncompleteInfo(`❌Product doesn't have any images submitted. Please submit at least one`, "Product Images")
        }

        // Get product variants
        const productVariants = ProductVariantSectionHelper.getProductVariants();
        if(productVariants.length === 0) {
            FinalizeProductFactory.addIncompleteInfo('❌No variants were selected for this product. Please select at least one', "Product Variants");
        }
        

        // Get product category
        const productCategories = ProductCategorySectionHelper.getProductCategories();
        if(productCategories.length === 0) {
            FinalizeProductFactory.addIncompleteInfo("❌No categories were selected for this product. Please select at least one", "Product Category")

        }

        // Get Product Type
        const productType = ProductTypeSectionHelper.getProductType();
        if(productType.length === 0) {
            FinalizeProductFactory.addIncompleteInfo("❌No \"Product Type\" was selected for this product. Please select at least one", "Product Type")
        }

        if(FinalizeProductRef.finalizationNeededDataContainer){
            FinalizeProductRef.finalizationNeededDataContainer.updateYScrollable();
        }
        
    }

        /**
     * Checks whether the needed data is completed
     */
    public static finalizeShownInfo(): void {
        let allCompleted: boolean = true;

        for(const [title, yanex] of Object.entries(FinalizeProductRef.contentAliasesContainer)) {

            if(title === "Finalize") {
                if(allCompleted) {
                    FinalizeProductFactory.createCompleteInfo("✅Complete", title as AddProductContentAliases)
                    if(FinalizeProductRef.addProductButton) {
                        FinalizeProductRef.addProductButton.setState(true)
                    }
                } else {
                    FinalizeProductFactory.addIncompleteInfo("❌Please complete the requirements above", title as AddProductContentAliases)
                    if(FinalizeProductRef.addProductButton) {
                        FinalizeProductRef.addProductButton.setState(false)
                    }
                }
            } else {
                const infoLabels = yanex.querySelectorAll("yanexH6");
                if(infoLabels.length === 0) {
                    FinalizeProductFactory.createCompleteInfo("✅Complete", title as AddProductContentAliases);
                    
                } else {
                    allCompleted = false
                }
            }
        }
    }

    public static async addProduct(event: PointerEvent): Promise<void> {

        const slider = AddProductRef.addProductSlider
        if(slider) {
            slider.setSliderElementsState(["YanexInput", "YanexButton"], false);
        }
        
        const loadinginfo = FinalizeProductRef.finalizeStatusContainer;
        if(loadinginfo) {
            loadinginfo.show()
        }

        // Ignore treeview events of the slider
        const treeviews: Array<YanexTreeview | null> = [
            ProductVariantSectionRef.productVariantsTreeview,
            ProductCategorySectionRef.productCategorysTreeview,
            ProductTypeSectionRef.productProductTypesTreeview
        ]

        for(const treeview of treeviews) {
            if(treeview) {
                treeview.setEventsState(false)
            }
        }

        // Set payload. Set as form data
        const formData = new FormData();

        let productName: string = "";
        // Check product name
        const productNameFields = ProductNameSectionHelper.getProductNameData();
        for(const [prName, prValue] of Object.entries(productNameFields)) {
            formData.append(Strings.toSnakeCase(prName, "lowercase"), prValue);
            if(prName === "Product Name") {
                productName = prValue
            }
        }

        // Product Info
        const productInfoFields = ProductInfoSectionHelper.getProductInfoSectionData();
        for(const [prInfoName, prInfoValue] of Object.entries(productInfoFields)) {
            formData.append(Strings.toSnakeCase(prInfoName, "lowercase"), prInfoValue)
        }

        // Product Images
        const productImages = ProductImagesSectionHelper.getSubmittedImages();
        if(productImages) {
            for(const [index, image] of productImages.entries()) {
                formData.append(`images[]`, image, `${productName}-${index}-${DatetimeUtility.getDateTime()}.webp`)
            }
        }

        // Get product variants
        const productVariants = ProductVariantSectionHelper.getProductVariants();
        for(const varId of productVariants) {
            formData.append("variations[]", varId.toString())
        }
        

        // Get product category
        const productCategories = ProductCategorySectionHelper.getProductCategories();
        for (const prodId of productCategories) {
            formData.append("categories[]", prodId.toString())
        }

        // // Get Product Type
        const productType = ProductTypeSectionHelper.getProductType();
        if(productType.length !== 0) {
            formData.append("product_type", productType[0].toString())
        }
        const upload = await FinalizeProductRequests.uploadProduct(formData);
        
        if(upload.responseStatus) {
            const responseData = upload.data;
            if(responseData.status) {
                // Clear product fields

                // Variant section
                const variantTreeview = ProductVariantSectionRef.productVariantsTreeview;
                if(variantTreeview) {
                    variantTreeview.deactivateRow("all")
                }

                // Type section
                const typeTreeview = ProductTypeSectionRef.productProductTypesTreeview;
                if(typeTreeview) {
                    typeTreeview.deactivateRow("all")
                }

                // name section
                ProductNameSectionHelper.clearProductNameFields()

                // info section
                ProductInfoSectionHelper.clearProductInfoSectionFields();

                // Image section
                const imageViewer = ProductImagesSectionRef.productImagesViewer
                if(imageViewer) {
                    imageViewer.clearImages();
                }

                // Category section
                const catTreeview = ProductCategorySectionRef.productCategorysTreeview;
                if(catTreeview) {
                    catTreeview.deactivateRow("all")
                }

                // Refinalize product image data
                this.checkNeededInformations();
                this.finalizeShownInfo();
                new YanexMessageModal("Product added successfully", "okay");
            } else {
                new YanexMessageModal(responseData.message, "okay")
            }
        } else {
            new YanexMessageModal(upload.message, "close")
        }


        if(slider) {
            slider.setSliderElementsState(["YanexButton", "YanexInput"], true)
        }
        if(loadinginfo) {
            loadinginfo.hide();
        }
        for(const treeview of treeviews) {
            if(treeview) {
                treeview.setEventsState(true)
            }
        }


        // Set the default value for the is-active
        const groupedButton = ProductInfoSectionRef.productIsActiveGroupedButton;
        if(groupedButton) {
            groupedButton.setActiveButton = "Yes"
        }
    }
}

export class FinalizeProductEvents{
    public static neededInfoClicked(event: PointerEvent, containerName: string) {
        const slider = AddProductRef.addProductSlider;
        if(slider) {
            slider.setActiveContent(containerName)
        }
        
    }
}
