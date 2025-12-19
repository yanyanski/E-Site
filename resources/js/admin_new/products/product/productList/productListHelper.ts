import YanexCustomModal from "../../../../packages/widgets/yanexWidgetPackages/yanexCustomModal";
import YanexImageSlider from "../../../../packages/widgets/yanexWidgetPackages/yanexImageSlider";
import YanexImageView from "../../../../packages/widgets/yanexWidgetPackages/yanexImageViewer";
import YanexListBox from "../../../../packages/widgets/yanexWidgetPackages/yanexListBox";
import { YanexButton, YanexDiv, YanexElement, YanexForm, YanexHeading, YanexInput, YanexTextArea } from "../../../../packages/widgets/yanexWidgets";
import { AdminRefs } from "../../../adminRef";
import { ProductListBundle, ProductListEvents } from "./productListBundle";
import { ProductListRecord } from "./productListRecord";
import { ProductListRef, ProductListStorage } from "./productListRef";
import YanexGroupedButtons from "../../../../packages/widgets/yanexWidgetPackages/yanexGroupedButtons";
import { PublicStringValues } from "../../../../public";
import { DataStatusReturnType, StatusReturnType } from "../../../../packages/interfaces";
import { Strings } from "../../../../packages/datatypeHelpers";
import { DatetimeUtility, ScrollUtility } from "../../../../packages/utilities";
import { CategoryListBundle } from "../../../category/categoryLists/categoryListBundle";
import { CategoryListStorage } from "../../../category/categoryLists/categoryListRef";
import { VariantListBundle } from "../../../variants/variantList/variantListBundle";
import { VariantListStorage } from "../../../variants/variantList/variantListRef";
import { ProductTypeListBundle } from "../../productType/productTypeList/productTypeListBundle";
import { ProductTypeListStorage } from "../../productType/productTypeList/productTypeListRef";


export class ProductListHelper {
    public static setDefaultProductData(productData: Record<string, any>): void {
        for(const [keyName, input] of Object.entries(ProductListRef.basicProductFields)) {
            switch(keyName){
                case "product-name":
                    (input as YanexInput).value = productData["name"]
                    break;
                
                case "product-price":
                    (input as YanexInput).value = productData["info"]["prod_info_price"]
                    break;
                case "product-description":
                    (input as YanexTextArea).value = productData["info"]["prod_info_desc"]
                    break;
                case "is-active":
                    const activeValue = productData["info"]["prod_info_active"];
                    
                    (input as YanexGroupedButtons).setActiveButton = activeValue === 1? "Yes" : "No";
                    break;
                case "product-link":
                    (input as YanexInput).value = productData["info"]["prod_info_link"]
            }
        }

        // Product Variant
        const variants = productData["variations"]
        for(const variant of variants) {
            const vName = variant["prod_var_title"];
            const vId = variant["prod_var_big_int"];
            if(ProductListRef.productVariantListBox) {
                ProductListRef.productVariantListBox.addValue(vName)
            }
            ProductListStorage.productVariants[vName] = vId

        }

        // Product categories
        const categories = productData["categories"]
        for(const category of categories) {
            const cName = category["prod_cat_name"];
            const cId = category["prod_cat_big_int"]
            if(ProductListRef.productCategoryListBox) {
                ProductListRef.productCategoryListBox.addValue(cName)
            }
            ProductListStorage.productCategory[cName] = cId
        }

        // Product Type
        const type = productData["type"]["prod_type_name"];
        ProductListRef.productTypeLabel!.text = type || "No specified type";
        ProductListStorage.productType = productData["type"]["prod_type_big_int"];

        // Product Id
        ProductListRef.productId = productData['id']
        console.log(productData)
    }

    public static getUpdatedProductData(): Record<string, any> {
        const returnVal: Record<string, any> = {};

        const basicFields = ProductListRef.basicProductFields;
        for(const [fieldName, fieldEntry] of Object.entries(basicFields)) {
            if(fieldEntry instanceof YanexGroupedButtons) {
                const activeButton = fieldEntry.activeButton;
                if(activeButton.length !== 0) {
                    returnVal[fieldName] = fieldEntry.activeButton[0]
                } else {
                    returnVal[fieldName] = 1
                }
            } else {
                returnVal[fieldName] = fieldEntry.value;
            }
        }
        
        // Get new images that were added
        const imageViewer = ProductListRef.productNewImages;
        if(imageViewer!.images) {
            const newImages: Array<Blob> = imageViewer!.images;
            returnVal["newImages[]"] = newImages
        }

        // Get variants
        returnVal["variants[]"] = []
        for(const variantId of Object.values(ProductListStorage.productVariants)) {
            returnVal["variants[]"].push(variantId)
        }

        // get Categories
        returnVal["categories[]"] = [];
        for(const catId of Object.values(ProductListStorage.productCategory)) {
            returnVal["categories[]"].push(catId)
        }

        // get Product Type
        returnVal["type"] = ProductListStorage.productType;

        // Get the current images
        returnVal["currentImages[]"] = ProductListRef.productImageSlider.imageData;

        // Get deleted images
        returnVal["deletedImages[]"] = ProductListRef.productImageSlider.removedImages;

        returnVal["id"] = ProductListRef.productId;
        return returnVal
    }

    /**
     * Check the submitted update data of the product
     */
    public static checkUpdatedProductData(productData: Record<string, any>): StatusReturnType {
        for(const [title, data] of Object.entries(productData)) {
            // Ignore if the current iter is the new/current images. Will be checked after this loop
            if(["newImages[]", "currentImages[]", "deletedImages[]"].includes(title)) continue;

            if(Array.isArray(data)) {
                if(data.length === 0) {
                    return {
                        status: false,
                        message: `The product should have atleast one type of ${Strings.convertCase(title.replace("[]", ""), "camelcase", true, "spacecase")}`
                    }
                }
            } else {
                if(data === "" || 
                    data === null) {
                    return {
                        status: false,
                        message: `The field ${Strings.convertCase(title, "kebabcase", true, "spacecase")} is required`
                    }
                }
            }
        }

        // Check images
        const oldImages = productData["currentImages[]"];
        let totalImages = 0; // The total images for the product
        if(Array.isArray(oldImages)) {
            totalImages += oldImages.length
        }

        const newImages = productData["newImages[]"];

        if(Array.isArray(newImages)) {
            totalImages += newImages.length
        }

        if(totalImages === 0) {
            return {
                status: false,
                message: "The product should atleast contain 1 or more images."
            }
        }

        return {
            status: true,
            message: ""
        }
    }

    public static setProductDataToForm(productData: Record<string, any>): FormData {

        const formData = new FormData();
        const productName = productData["product-name"];

        formData.append("product-name", productName);

        for(const [title, data] of Object.entries(productData)) {
            // Handle blob
            switch (title) {
                case "newImages[]":
                    for(const [index, image] of data.entries()) {
                        formData.append(title, image, `${productName}-${index}-${DatetimeUtility.getDateTime()}.webp`)
                    }
                    break;

                case "currentImages[]":
                    for(const imageData of data) {
                        formData.append(title, imageData["prod_image_big_id"])
                    }
                    break;
                
                case "categories[]":
                case "variants[]":
                    for(const attrId of data) {
                        formData.append(title, attrId)
                    }
                    break;
                case "deletedImages[]":
                    for(const removedImageData of data) {
                        formData.append(title, removedImageData["prod_image_big_id"])
                    }
                    break;
                
                default:
                    formData.append(title, data)
                    break;

            }
        }

        return formData;
    }

    /**
     * Serialize data that of the updated product
     * @param productData The raw product data that was sent to the server/
     * @param serverDataResponse The server from the response for additional data
     * @returns Serialized data used to record locally
     */
    public static async serializeSavedData(productData: Record<string, any>, 
        serverDataResponse: Record<string,any>): Promise<Record<string, any>> {

            console.log(productData);
        const returnVal: Record<string, any> = {};
        const productName = productData["product-name"];
        const productId = productData["id"]
        returnVal["id"] = productId

        // ----------------- Set images ----------------
        returnVal["images"] = productData["currentImages[]"]

        // Add new images if new images were added
        if(productData["newImages[]"] && productData["newImages[]"].length !== 0) {
            let currentImageLength = returnVal["images"].length;
            const newImageids = serverDataResponse["newSavedImages"];
            for(const [index, blob] of (productData["newImages[]"] as Array<Blob>).entries()) {
                
                returnVal["images"][currentImageLength] = {
                    "prod_image_alt": productName,
                    "prod_image_url": URL.createObjectURL(blob),
                    "product_id": productId,
                    "prod_image_big_id": newImageids[index]
                }
                currentImageLength += 1;
            }
        }

        // --------------- Set Info ---------------------
        returnVal["info"] = {};
        const prodInfo = returnVal["info"];

        prodInfo["prod_info_active"] = productData["is-active"];
        prodInfo["prod_info_desc"] = productData["product-description"];
        prodInfo["prod_info_link"] = productData["product-link"];
        prodInfo["prod_info_price"] = Number(productData["product-price"]).toFixed(2).toString();
        prodInfo["product_id"] = productId

        // --------------- Set Product Name -----------
        returnVal["name"] = productData["product-name"];

        // ----------------- Set product categories ---------------------
        returnVal["categories"] = []
        const prodCategories = returnVal["categories"]
        
        // Get categories if user haven't fetched it yet
        if(CategoryListStorage.categoryRawFetched === null) await CategoryListBundle.getCategorys();

        for(const prodCat of (productData["categories[]"] as Array<number>)) {
            const categoryData = CategoryListStorage.categorys[prodCat];
            if(categoryData) {
                prodCategories.push({
                    "prod_cat_big_int": prodCat,
                    "prod_cat_name": categoryData["cat_name"]
                })
            }
        }

        // ------------------ Set product Variants -------------------------
        returnVal["variations"] = [];
        const prodVariations = returnVal["variations"];

        // get Variations if user haven't fetched it yet
        if (VariantListStorage.variantRawFetched === null) await VariantListBundle.getVariants();

        for(const prodVariant of (productData["variants[]"] as Array<number>)) {
            const variantData = VariantListStorage.variants[prodVariant];
            if(variantData) {
                prodVariations.push({
                    "prod_var_big_int": prodVariant,
                    "prod_var_title": variantData["var_title"]
                })
            }
        }

        // ---------------------Set Product type---------------
        returnVal["type"] = {};
        const prodtype = returnVal["type"];
        
        // Get product types if user haven't fetched it yet
        if(ProductTypeListStorage.productTypesRawFetched === null) await ProductTypeListBundle.getProductTypes();
        const productTypeData = ProductTypeListStorage.productTypes[productData["type"]];
        if(productTypeData) {
            prodtype["prod_type_big_int"] = productData["type"];
            prodtype["prod_type_name"] = productTypeData["type_name"]
        }
        return returnVal;
    }

    /**
     * Update the data that was displayed in the card
     * @param productData The product data. Some can be passed as null (will be ignored)
     */
    public static updateProductCard(productData: Record<string, any>): void {
        console.log(productData);
        const productId = productData["id"];
        if(!productId) return;

        const productCardParts = ProductListStorage.productCards[productId]!;
        
        // update name
        if(productData["name"]) {
            productCardParts["productName"]!.text = productData["name"]
        }

        // Update product type
        if(productData["type"]) {
            productCardParts["productType"]!.text = productData["type"]["prod_type_name"]
        }

        // Update product price
        const prodInfo = productData["info"]
        if(prodInfo) {
            const price = prodInfo["prod_info_price"];
            if(price) {
                productCardParts["productPrice"]!.text = `${PublicStringValues.currency}${price}`
            }
        }

        // Update product variants
        if(productData["variations"]) {
            productCardParts["variationContainer"]?.clearChildren();
            ProductListFactory.addVariations(productCardParts["variationContainer"]!,
                (productData["variations"] as Array<Record<string, any>>).map(v => v["prod_var_title"])
            )
        }
        
        // Update product categories
        if(productData["categories"]) {
            productCardParts["categoryContainer"]?.clearChildren()
            ProductListFactory.addCategory(productCardParts["categoryContainer"]!,
                (productData["categories"] as Array<Record<string, any>>).map(c => c["prod_cat_name"])
            )
        }
    }

    /**
     * Remove the loading cards
     */
    public static removeAdminLoadingCards(): void {
        for(const container of ProductListStorage.adminLoadingProductCards) {
            container.hide(true)
        }
    }
}

export class ProductListFactory{
    /**
     * Create a container for the product list
     */
    public static createProductListContainer(): void {
        const container = new YanexDiv(AdminRefs.adminContentContainer, {
            className: 'flex w-full h-full pb-2 mb-2 flex-col gap-1 scroll-modern overflow-y-auto'
        });
        ProductListRef.mainContainer = container;


        const messageContainer = new YanexDiv(container, {
            className: "asd flex flex-col w-full p-2",
            bg: "extraBg"
        })

        new YanexHeading(messageContainer, "h6", {
            className: "font-bold",
            text: ProductListRecord.productListIntro.title
        })

        new YanexHeading(messageContainer, "h6", {
            text: ProductListRecord.productListIntro.message
        })

        const productListContainer = new YanexDiv(container, {
            className: "flex gap-5 flex-wrap w-full p-5 items-center justify-center h-full",
        })
        ProductListRef.productListContainer = productListContainer 


        // Loading div
        const loadingDiv = new YanexDiv(container, {
            className: "flex gap-2 w-full items-center justify-center h-full"
        })

        new YanexDiv(loadingDiv, {
            className: "flex flex-col animate-spin rounded w-[25px] h-[25px]",
            bg: "specialColorBg"
        })
        new YanexHeading(loadingDiv, "h1", {
            text: "Getting Products. Please wait...",
            fg: "specialColorFg"
        })

        ProductListRef.productListLoadingContainer = loadingDiv;
    }

    public static createNoProduct(): void {
        const container = new YanexDiv(ProductListRef.mainContainer, {
            className: "w-full h-full items-center justify-center hidden"
        })

        new YanexHeading(container, "h6", {
            className: 'text-sm opacity-80',
            text: "No products were created yet. Select \"Add Product\" to create one."
        })
        ProductListRef.noProductContainer = container
    }

    public static addVariations(parent: YanexElement, variations: Array<string>): void {
        // Create variations
        for(const variation of variations) {
            new YanexHeading(parent, "h1", {
                className: "px-3 py-1 text-sm",
                bg: "lighterBg",
                fg: "lighterSpecialColorFg",
                text: variation
            })
        }
    }

    public static addCategory(parent: YanexDiv, categories: Array<string>): void {
          for(const category of categories){
            new YanexHeading(parent, "h6", {
                className: "py-[1px] font-[2px] px-[5px] text-xs rounded-md",
                text: category,
                bg: "lighterBg"
            })
        }
    }

    /**
     * Adds a loading admin product card
     */
    public static createAdminLoadingProductCard(cardCount: number = 3): void {
        for(let i = 0; i <= 3; i++) {
            const container = new YanexDiv(ProductListRef.productListContainer, {
            className: `${ProductListRecord.adminProductCardClassName} p-2 w-[45%] gap-2 flex flex-col border-[1px] h-[250px] events-none animate-pulse`,
                        mdClasses: "md:min-w-[300px] md:w-[300px]",
                        hoverBorder: "specialColorBorder",

            })

            new YanexDiv(container, {
                className: 'w-full h-[50%]',
                bg:"lighterBg"
            })

            // Title
            const titleContainer = new YanexDiv(container, {
                className: "w-full gap-1 flex flex-col"
            })
            new YanexDiv(titleContainer, {
                className: "w-[20%] h-[20px] rounded-md",
                bg: "lighterBg"
            })

             new YanexDiv(titleContainer, {
                className: "w-[40%] h-[10px] rounded-md",
                bg: "lighterBg"
            })


            // Price
            new YanexDiv(titleContainer, {
                className: "w-[25%] h-[15px] rounded-md my-1",
                bg: "lighterBg"
            })

            new YanexDiv(titleContainer, {
                className: "w-[25%] h-[15px] ",
                bg: "lighterBg"
            })

            const variantsContainer = new YanexDiv(container, {
                className: 'flex gap-2 w-full flex-wrap'
            })

            // 3 Variants
            for(let i = 0; i <= 3; i++) {
                new YanexDiv(variantsContainer, {
                    className: 'w-[10%] h-[15px]',
                    bg: "lighterBg"
                })
            }

            const catContainer = new YanexDiv(container, {
                className: 'flex gap-2 w-full flex-wrap items-end justify-end'
            })

            // Category
            for(let i = 0; i <= 2; i++) {
                new YanexDiv(catContainer, {
                    className: 'w-[15%] h-[8px] rounded-md',
                    bg: "lighterBg"
                })
            }
        
            ProductListStorage.adminLoadingProductCards.push(container)
        }
    }

    public static createAdminProductCard(productData: Record<string, any>): void {
        const imagesData = productData["images"];
        const imageLinks = [];

        for(const imageData of imagesData) {
            imageLinks.push(imageData["prod_image_url"]);
        } 

        // Ignore if product has no images
        if(imageLinks.length === 0) {
            return
        }

        const container = new YanexDiv(ProductListRef.productListContainer, {
           className: `${ProductListRecord.adminProductCardClassName} w-[45%] flex flex-col border-[1px] min-h-[250px] events-none`,
                       mdClasses: "md:min-w-[300px] md:w-[300px]",
                       hoverBorder: "specialColorBorder",

            dataSetName: ProductListRecord.adminProductCardAttrName,
            dataSetValue: productData["id"].toString()
        })
        ProductListStorage.productCards[parseInt(productData["id"])] = {};
        const productCardData = ProductListStorage.productCards[parseInt(productData["id"])];

        // Add hover effect for the container
        container.addEventListener("mouseenter", (e) => {
            ProductListEvents.adminCardMouseEnter(e, container)
        });
        container.addEventListener("mouseleave", (e) => {
            ProductListEvents.adminCardMouseLeave(e, container);
        });

 
        const imageSliderContainer = new YanexDiv(container, {
            className: "flex w-full h-[50%] border-none events-auto"
        })

        new YanexImageSlider(imageSliderContainer, imageLinks, {
            hideArrows: true,
            imageData: imagesData
        });

        // The product information container
        const productInfoContainer = new YanexDiv(container, {
            className: "w-full h-full flex flex-col cursor-pointer"
        })

        productInfoContainer.addEventListener("click", (e) => {
            ProductListEvents.adminCardMouseClicked(e, container)
        })

        // Show product name
        productCardData["productName"] = new YanexHeading(productInfoContainer, "h1", {
            className: "w-full flex px-2 pt-1",
            hoverFg: "specialColorFg",
            text: productData["name"] || "Product",
        }, {
            addHoverEffect: true,
            textAlignment: 'w'
        })

        // Product type
        productCardData["productType"] = new YanexHeading(productInfoContainer, "h1", {
            className: "w-full flex px-2 pb-3 text-xs opacity-80",
            hoverFg: "specialColorFg",
            text: productData["type"]["prod_type_name"] || "None",
        }, {
            addHoverEffect: true,
            textAlignment: 'w'
        })

        // Show product price
        productCardData["productPrice"] = new YanexHeading(productInfoContainer, "h2", {
            className: "w-full flex px-2 font-bold",
            text: `${PublicStringValues.currency}${productData["info"]["prod_info_price"] || "0"}`,
            fg: "specialColorFg"
        }, {
            textAlignment: "w"
        })
        console.log(ProductListStorage.productCards[parseInt(productData["id"])]);

        new YanexHeading(productInfoContainer, "h1", {
            className: "w-full px-1 font-md font-bold pt-2",
            text: "Includes: ",
            fg: "extraSpecialColorFg"
        }, {
            textAlignment: "w"
        })

        const variationContainer = new YanexDiv(productInfoContainer, {
            className: "flex gap-2 flex-wrap p-2"
        })
        productCardData["variationContainer"] = variationContainer
        console.log(productData)
        this.addVariations(variationContainer, 
            (productData["variations"] as Array<Record<string, any>>).map(v => v["prod_var_title"]))

        // Create Category Section
        const categoryContainer = new YanexDiv(productInfoContainer, {
            className: "w-full h-full flex w-full gap-2 flex-wrap rounded-md px-2 py-1 justify-end",

        })
        productCardData["categoryContainer"] = categoryContainer

        this.addCategory(categoryContainer, 
            (productData["categories"] as Array<Record<string, any>>).map(c => c["prod_cat_name"])
        )
    }

    /**
     * Create a new modal for modifying the product.
     * @param productData The product data
     */
    public static createAdminProductModal(title: string): void {
        const modal = new YanexCustomModal(AdminRefs.adminContentContainer, 
            null, null, {
                addClass: "w-full h-full flex md:p-10",
                hideHeader:true
            }
        )
        modal.show(null,
            true
        )
        ProductListRef.productShowModal = modal;
        const contentContainer = new YanexDiv(null, {
            className: "flex w-full h-full p-1 gap-2 flex flex-col overflow-y-auto scroll-modern",
            mdClasses: "md:flex-row md:overflow-y-none md:p-4"
        })
        ProductListRef.productContentContainer = contentContainer;

        modal.addContent(contentContainer)
        modal.addEventListener("close", (e) => {ProductListEvents.modalCloseEvent(e)})
    }

    public static createModalImageSide(imageData: Array<Record<string, any>>): void {
        // Image side
        const imageSideContainer = new YanexDiv(ProductListRef.productContentContainer, {
            className: "w-full h-full flex flex-col pb-5",
            mdClasses: "md:w-[350px] md:pb-1"
        })

        new YanexHeading(imageSideContainer, "h1", {
            text: "Product Images",
            className: "flex flex-col px-1"
        })
        const images = [];
        for(const image of Object.values(imageData)) {
            images.push(image["prod_image_url"])
        }

        ProductListRef.productImageSlider = new YanexImageSlider(imageSideContainer, images, {
            imageData: imageData
        });
        const removeButtonContainer = new YanexDiv(imageSideContainer, {
            className: "p-3 w-full min-h-[20px]"
        })
        const removeButton = new YanexButton(removeButtonContainer, {
            text: "Remove Image", 
            bg: "extraSpecialColorBg",
            className: "flex w-full rounded p-2 items-center justify-center",
            hoverFg: "defaultFg"
        }, {
            addHoverEffect: true
        })

        removeButton.addEventListener("click", (e) => {
            ProductListEvents.productImageRemoved(e)
        })
    }

    public static createProductFields(): void {
        const motherContainer = new YanexDiv(ProductListRef.productContentContainer, {
            className: "w-full h-full rounded-md flex flex-col pt-3",
            mdClasses: "md:pt-0"
        })
       
        const mainContainer = new YanexDiv(motherContainer, {
            className: "w-full rounded-md flex flex-col scroll-modern",
            mdClasses: "md:overflow-y-auto "
        })
        ProductListRef.productFieldMainContainer = mainContainer

        const basicTitle = new YanexHeading(mainContainer, "h6", {
            className: "w-full font-bold flex",
            bg: null,
            text: "Basic Product Data"
        }, {
            textAlignment: "w"
        })

        basicTitle.addDataset(PublicStringValues.widgetIconDataSetTitle, 
            ProductListRecord.productListIconsMap["info"]
        )
        
        const basicContainer = new YanexDiv(mainContainer, {
            className: 'w-full h-full flex flex-col pb-2 rounded pl-3',
        })

        for(const [basicInfoKey, basicInfoValue] of Object.entries(ProductListRecord.productFields)) {
            const bContainer = new YanexDiv(basicContainer, {
                className: 'flex flex-col gap-1 w-full h-full p-1',
                bg:null
            })

            const title = new YanexHeading(bContainer, "h1", {
                className: "w-full text-sm flex ",
                text: basicInfoValue,
                bg: null,
            }, {
                textAlignment: "w"
            })
            title.addDataset(PublicStringValues.widgetIconDataSetTitle,
                ProductListRecord.productFieldIcons[basicInfoKey]
            )
            const fieldContainer = new YanexDiv(bContainer, {
                className: "w-full flex gap-1 pl-3"
            })
            
            let basicField;
            if(basicInfoKey === "is-active") {
                basicField = new YanexGroupedButtons(fieldContainer, {
                    buttonValues: [1, 0],
                    buttonTexts: ["Yes", "No"],
                    selectMode: "browse",
                    reselectable: false,
                    hoverBg: "lighterSpecialColorBg",
                    bg: "extraBg",
                    selectFg: "contrastFg",
                })
            } else if(basicInfoKey === "product-description") {
                basicField = new YanexTextArea(fieldContainer, {
                    placeholder: basicInfoValue,
                    className: "w-full p-1 rounded p-2",
                    bg: "extraBg",
                    emptyValueBorder: 'red'
                })
            } else {
                
                basicField = new YanexInput(fieldContainer, {
                    placeholder: basicInfoValue,
                    className: "w-full p-1 rounded p-2",
                    bg: "extraBg",
                    emptyValueBorder: "red"

                })
            }
            if(basicField) {
                ProductListRef.basicProductFields[basicInfoKey] = basicField;
            }
        }

        // See advanced setings
        const advancedSettingsContainer = new YanexDiv(basicContainer, {
            className: "flex gap-1 w-full py-2"
        }, {
            addHoverEffect: true
        })

        const advancedTitle = new YanexHeading(advancedSettingsContainer, "h2", {
            className: "text-sm pl-3 pointer-events-none flex",
            text: "Advanced Settings",
            fg: "lighterFg",
        }, {
            textAlignment: "w"
        })

        advancedTitle.addDataset(PublicStringValues.widgetIconDataSetTitle, 
            ProductListRecord.productListIconsMap["expand"]
        )

        const dropDownArrow = new YanexHeading(advancedSettingsContainer, "h1", {
            fg: "lighterFg",
            text: "▸",
            className: "font-sm pointer-events-none rounded-md"
        })
        advancedSettingsContainer.addEventListener("click", (e) => {ProductListEvents.advancedSettingsClicked(e, dropDownArrow)});
        advancedSettingsContainer.addEventListener("mouseenter", (e) => {ProductListEvents.advancedSettingsMouseEvent(e, dropDownArrow)});
        advancedSettingsContainer.addEventListener("mouseleave", (e) => {ProductListEvents.advancedSettingsMouseEvent(e, dropDownArrow)})


        const advancedContainer = new YanexDiv(basicContainer, {
            className: 'flex flex-col gap-1 w-full h-full pl-3 py-1 my-3 hidden',
            bg:null
        })

        ProductListRef.productModifyAdvancedContainer = advancedContainer;
        
        const advancedTextTitle = new YanexHeading(advancedContainer, "h6", {
            className: "w-full font-bold flex",
            bg: null,
            text: "Advanced Product Data",
            fg: "specialColorFg"
        }, {
            textAlignment: "w"
        })
        advancedTextTitle.addDataset(PublicStringValues.widgetIconDataSetTitle, 
            ProductListRecord.productListIconsMap["info"]
        )

        const newImageContainer = new YanexDiv(advancedContainer, {
            className: "w-full rounded flex flex-col p-1",
            bg: "extraBg"
        })


        const addImageTitle = new YanexHeading (newImageContainer, "h6", {
            className:"w-full font-bold flex",
            text: ProductListRecord.newImagesTitles.title,
            bg: null
        }, {
            textAlignment: "w"
        })
        addImageTitle.addDataset(PublicStringValues.widgetIconDataSetTitle, 
            ProductListRecord.productListIconsMap["image"]
        )

        new YanexHeading(newImageContainer, "h6", {
            className: "w-full text-sm",
            text: ProductListRecord.newImagesTitles.message,
            fg: "lighterFg",
        }, {
            textAlignment: "w"
        })

        const imageViewer = new YanexImageView(newImageContainer, {
            maximumImageKbSize: 500,
            compressionRate: 0.7,
            noImageMessage: "Insert a new image for this product"
        })
        ProductListRef.productNewImages = imageViewer;
        
        function createProdInfoList(listType: "category" | "variant"): void {
            //Product Variants
            const variantsContainer = new YanexDiv(advancedContainer, {
                className: "flex flex-col w-full p-2",
                bg: "extraBg"
            });

            const title = listType === "category" ? ProductListRecord.productCategoryTitles.title : ProductListRecord.productVariantTitles.title
            const message = listType === "category" ? ProductListRecord.productCategoryTitles.message : ProductListRecord.productVariantTitles.message
            new YanexHeading (variantsContainer, "h6", {
                className:"w-full font-bold",
                text: title,
                bg: null
            }, {
            textAlignment: "w"
            })

            new YanexHeading(variantsContainer, "h6", {
                className: "w-full text-sm",
                text: message,
                fg: "lighterFg",
            }, {
            textAlignment: "w"
            })
            const variantListContainer = new YanexDiv(variantsContainer, {
                className: "flex w-full h-[180px] rounded p-2"
            })
            const listBox = new YanexListBox(variantListContainer);

            let button;
            if(listType === "variant") {
                ProductListRef.productVariantListBox = listBox;
                listBox.addEventListener("listRemoved", (e) => {ProductListEvents.listAttrValueRemoved(e, listType)})
                button = new YanexButton(variantsContainer, {
                    className: "w-full p-1 rounded",
                    text: "Add Variant",
                    bg: "lighterSpecialColorBg",
                    hoverBg: "specialColorBg",
                    fg: "contrastFg"
                }, {
                    addHoverEffect:true
                })

            } else {
                ProductListRef.productCategoryListBox = listBox;
                listBox.addEventListener("listRemoved", (e) => {ProductListEvents.listAttrValueRemoved(e, listType)})

                button = new YanexButton(variantsContainer, {
                    className: "w-full p-1 rounded",
                    text: "Add Category",
                    bg: "lighterSpecialColorBg",
                    hoverBg: "specialColorBg",
                    fg: "contrastFg"
                }, {
                    addHoverEffect:true
                })
            }

            button.addEventListener("click", (e) => {ProductListEvents.addProductAttrClicked(e)})

        }
        createProdInfoList("variant")
        createProdInfoList("category")
        
        // Product Type
        const productTypeContainer = new YanexDiv(advancedContainer, {
            className:"w-full p-2 flex gap-1 rounded justify-between flex-col",
            mdClasses: "md:flex-row",
            bg: "extraBg"
        })

        const productLabelContainer = new YanexDiv(productTypeContainer, {
            className: 'flex px-2 gap-1',
            bg: null
        })
        new YanexHeading(productLabelContainer, "h1", {
            text: "Product Type:",
        })

        const prodTypeLabel = new YanexHeading(productLabelContainer, "h1", {
            text: "?",
            className: "font-bold"
        })
        ProductListRef.productTypeLabel = prodTypeLabel;

        // Product Type edit button
        const editProductType = new YanexButton(productTypeContainer, {
            className: "px-3 rounded py-1 flex",
            text: "Change Product Type",
            hoverBg: "specialColorBg",
            bg: "lighterSpecialColorBg"
        })

        editProductType.addDataset(PublicStringValues.widgetIconDataSetTitle, ProductListRecord.productListIconsMap["edit"]);
        editProductType.addEventListener("click", (e) => {
            ProductListEvents.editProductType(e)
        })
         // The modal buttons
        const modalButtonsContainer = new YanexDiv(ProductListRef.productShowModal!.modalDialog, {
            className: "flex gap-1 w-full p-2 h-min"
        });

        for(const [buttonKey, buttonText] of Object.entries(ProductListRecord.modalButtons)) {
            let special = false;
            if(buttonText === ProductListRecord.modalButtons["update"]) special = true;

            const button = new YanexButton(modalButtonsContainer, {
                className: "rounded w-full p-1 flex items-center justify-center",
                bg: special ? "specialColorBg" : "extraBg",
                hoverBg: special? "lighterSpecialColorBg" : "lighterBg",
                text: buttonText
            }, {
                textAlignment: "center",
                
            })
            ProductListRef.productModifyButtons[buttonKey] = button
            button.addEventListener("click", (e) => { ProductListEvents.productUpdateModalClicked(e)})
        }
    }
}