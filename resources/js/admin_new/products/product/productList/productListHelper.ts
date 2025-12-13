import YanexCustomModal from "../../../../packages/widgets/yanexWidgetPackages/yanexCustomModal";
import YanexImageSlider from "../../../../packages/widgets/yanexWidgetPackages/yanexImageSlider";
import YanexImageView from "../../../../packages/widgets/yanexWidgetPackages/yanexImageViewer";
import YanexListBox from "../../../../packages/widgets/yanexWidgetPackages/yanexListBox";
import { YanexButton, YanexDiv, YanexForm, YanexHeading, YanexInput, YanexTextArea } from "../../../../packages/widgets/yanexWidgets";
import { AdminRefs } from "../../../adminRef";
import { ProductListBundle, ProductListEvents } from "./productListBundle";
import { ProductListRecord } from "./productListRecord";
import { ProductListRef, ProductListStorage } from "./productListRef";
import YanexGroupedButtons from "../../../../packages/widgets/yanexWidgetPackages/yanexGroupedButtons";
import { PublicStringValues } from "../../../../public";

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
        return returnVal
    }
}

export class ProductListFactory{
    /**
     * Create a container for the product list
     */
    public static createProductListContainer(): void {
        const container = new YanexDiv(AdminRefs.adminContentContainer, {
            className: "flex gap-5 flex-wrap overflow-y-auto h-full w-full p-5 items-center justify-center scroll-modern",
        });
        ProductListRef.productListContainer = container


        const messageContainer = new YanexDiv(container, {
            className: "asd flex flex-col w-full p-2 self-start",
            bg: "extraBg"
        })

        new YanexHeading(messageContainer, "h6", {
            className: "font-bold",
            text: ProductListRecord.productListIntro.title
        })

        new YanexHeading(messageContainer, "h6", {
            text: ProductListRecord.productListIntro.message
        })


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
        const container = new YanexDiv(ProductListRef.productListContainer, {
            className: "w-full h-full items-center justify-center"
        })

        new YanexHeading(container, "h6", {
            className: 'text-sm opacity-80',
            text: "No products were created yet. Select \"Add Product\" to create one."
        })
        ProductListRef.noProductContainer = container
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
        new YanexHeading(productInfoContainer, "h1", {
            className: "w-full flex px-2 pt-1",
            hoverFg: "specialColorFg",
            text: productData["name"] || "Product",
        }, {
            addHoverEffect: true,
            textAlignment: 'w'
        })

        // Product type
        new YanexHeading(productInfoContainer, "h1", {
            className: "w-full flex px-2 pb-3 text-xs opacity-80",
            hoverFg: "specialColorFg",
            text: productData["type"]["prod_type_name"] || "None",
        }, {
            addHoverEffect: true,
            textAlignment: 'w'
        })

        // Show product price
        new YanexHeading(productInfoContainer, "h2", {
            className: "w-full flex px-2 font-bold",
            text: `${PublicStringValues.currency}${productData["info"]["prod_info_price"] || "0"}`,
            fg: "specialColorFg"
        }, {
            textAlignment: "w"
        })

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



        // Create variations
        for(const variation of productData["variations"] || []) {
            new YanexHeading(variationContainer, "h1", {
                className: "px-3 py-1 text-sm",
                bg: "lighterBg",
                fg: "lighterSpecialColorFg",
                text: variation["prod_var_title"]
            })
        }

        // Create Category Section
        const categoryContainer = new YanexDiv(productInfoContainer, {
            className: "w-full h-full flex w-full gap-2 flex-wrap rounded-md px-2 py-1 justify-end",

        })
        for(const category of productData["categories"] || []){
            new YanexHeading(categoryContainer, "h6", {
                className: "py-[1px] font-[2px] px-[5px] text-xs rounded-md",
                text: category["prod_cat_name"],
                bg: "lighterBg"
            })
        }
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
                    bg: "extraBg"

                })
            } else {
                
                basicField = new YanexInput(fieldContainer, {
                    placeholder: basicInfoValue,
                    className: "w-full p-1 rounded p-2",
                    bg: "extraBg"

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
                className: "rounded w-full p-1",
                bg: special ? "specialColorBg" : "extraBg",
                hoverBg: special? "lighterSpecialColorBg" : "lighterBg",
                text: buttonText
            })
            ProductListRef.productModifyButtons[buttonKey] = button
            button.addEventListener("click", (e) => { ProductListEvents.productUpdateModalClicked(e)})
        }
    }
}