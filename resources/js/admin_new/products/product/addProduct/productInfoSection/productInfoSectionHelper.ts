import YanexGroupedButtons from "../../../../../packages/widgets/yanexWidgetPackages/yanexGroupedButtons";
import { YanexButton, YanexDiv, YanexHeading, YanexInput, YanexTextArea } from "../../../../../packages/widgets/yanexWidgets";
import { PublicStringValues } from "../../../../../public";
import { ProductInfoFields, ProductInfoSectionRecord } from "./productInfoSectionRecord";
import { ProductInfoSectionRef } from "./productInfoSectionRef";


export class ProductInfoSectionFactory{

    public static createProductInfoSection(): YanexDiv {
        const mainContainer = new YanexDiv(null, {
            className: "w-full h-full flex flex-col items-center justify-center rounded p-10",
            bg: "extraBg"
        })

        const titleContainer = new YanexDiv(mainContainer, {
            className: "w-full flex flex-col gap-1 items-center justify-center px-2 py-3",
            bg:"extraBg"
        })

        new YanexHeading(titleContainer, "h6", {
            text: ProductInfoSectionRecord.productInfoTitle.title,
            className: "font-bold w-full",
            bg: null
        }, {
            textAlignment: "w"
        })

        new YanexHeading(titleContainer, "h6", {
            text: ProductInfoSectionRecord.productInfoTitle.message,
            fg: "lighterFg",
            bg: null,
            className: "w-full text-sm"
        }, {
            textAlignment: "w"
        })
        const subContainer = new YanexDiv(mainContainer, {
            className: "flex gap-2 w-full",
            bg: null
        })

        const mainSubContainers: Array<YanexDiv> = [];

        for (let i = 0; i < 2; i++) {
            mainSubContainers.push(new YanexDiv(subContainer, {
                className: "flex flex-col gap-3 w-full",
                bg: null
            }))
        }

        let containerIndex: number = 0;

        const entries = Object.entries(ProductInfoSectionRecord.productInfoSectionFields) as [ProductInfoFields, string][]

        for(const [fieldName, fieldTitle] of entries) {
            // Product description will be appended to the main container instead and will be a textarea
            if(fieldName === "product-description") {
                const desContainer = new YanexDiv(mainContainer, {
                    className: "flex flex-col gap-1 w-full pt-9 px-3",
                    bg: null
                })
                const heading = new YanexHeading(desContainer, "h1", {
                    className: "flex w-full",
                    text: fieldTitle,
                    bg: null
                }, {
                    textAlignment: "w"
                })

                heading.addDataset(PublicStringValues.widgetIconDataSetTitle, 
                    ProductInfoSectionRecord.productInfoSectionFieldsIcons[fieldName])

                const descriptArea = new YanexTextArea(desContainer, {
                    placeholder: fieldTitle,
                    className: "rounded",
                })
                ProductInfoSectionRef.productInfoFields[fieldName] = descriptArea;
                continue
            }

            const fieldContainer = new YanexDiv(mainSubContainers[containerIndex], {
                className: "flex flex-col gap-1 px-3",
                bg: null
            })

            const fieldLabel: YanexHeading = new YanexHeading(fieldContainer, "h1", {
                className: "flex w-full",
                text: fieldTitle,
                bg: null
            }, {
            textAlignment: "w"
            })
            fieldLabel.addDataset(PublicStringValues.widgetIconDataSetTitle,
                ProductInfoSectionRecord.productInfoSectionFieldsIcons[fieldName as ProductInfoFields]
            )

            let fieldEntry;


            if(fieldName === "is-active") {
                const buttonContainer = new YanexDiv(fieldContainer, {
                    bg: "lighterBg",
                    className: "flex",
                })

                const isActive = new YanexGroupedButtons(buttonContainer, {
                    buttonTexts: ["Yes", "No"],
                    buttonValues: [1, 0],
                    hoverBg: "lighterSpecialColorBg",
                    reselectable: false,
                    selectMode: "browse",
                    defaultSelected: "Yes",
                    selectFg: "contrastFg"
                })
                ProductInfoSectionRef.productIsActiveGroupedButton = isActive;


            } else if (fieldName === "product-price") {
                fieldEntry = new YanexInput(fieldContainer, {
                    className: "p-1 rounded",
                    placeholder: fieldTitle,
                    name: fieldName,
                    
                }, {
                    allowed: "digits",
                    exceptions: "."
                })
            } else {
                fieldEntry = new YanexInput(fieldContainer, {
                    className: "p-1 rounded",
                    placeholder: fieldTitle,
                    name: fieldName,
                    
                })
            }

            if(fieldEntry) {
                ProductInfoSectionRef.productInfoFields[fieldName] = fieldEntry;
            }

            if(containerIndex === mainSubContainers.length - 1) {
                containerIndex = 0;
                continue;
            }
            containerIndex += 1;
        }



        return mainContainer;
    }
}

export class ProductInfoSectionHelper{
    /**
     * Get all the field data of the Product Info fields
     * @returns Record
     */
    public static getProductInfoSectionData(): Record<string, string> {
        const returnVal: Record<string, string> = {};

        for(const [fieldName, fieldEntry] of Object.entries(ProductInfoSectionRef.productInfoFields)) {
            console.log(fieldName, "FIELD NAME", fieldEntry.value)
            returnVal[fieldName] = fieldEntry.value || "";
        }

        // Get the is active value
        const isActiveGroup = ProductInfoSectionRef.productIsActiveGroupedButton;
        if(isActiveGroup) {
            const activeButton = isActiveGroup.activeButton;
            if(activeButton.length !== 0) {
                returnVal['is-active'] = activeButton[0].toString()
            }
        }
        if(!returnVal['is-active']) {
            returnVal['is-active'] = ''
        }

        return returnVal
    }

    /**
     * Clears all the product info fields
     */
    public static clearProductInfoSectionFields(): void {
        for(const inp of Object.values(ProductInfoSectionRef.productInfoFields)) {
            inp.value = ""
        }
    }
}