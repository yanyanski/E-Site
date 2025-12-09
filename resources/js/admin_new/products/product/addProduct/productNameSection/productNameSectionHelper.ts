import { YanexDiv, YanexElement, YanexHeading, YanexInput } from "../../../../../packages/widgets/yanexWidgets";
import { PublicStringValues } from "../../../../../public";
import { AddProductRecord } from "../addProductRecord";
import { ProductNameSectionRecord } from "./productNameSectionRecord";
import { ProductNameSectionRef } from "./productNameSectionRef";


export class ProductNameSectionFactory{
        public static createProductNameSection(): YanexDiv {
            const mainContainer = new YanexDiv(null, {
                className: "w-full h-full flex items-center justify-center",
                bg: "extraBg"
            })
            const container = new YanexDiv(mainContainer, {
                className: "p-5 flex flex-col gap-1 rounded-lg items-center justify-center w-fit min-w-[80%]",
                bg: null
            });

            const titleContainer = new YanexDiv(container, {
                className: "w-full flex flex-col p-2",
                bg: null
            })
    
            new YanexHeading(titleContainer, "h1", {
                text:AddProductRecord.addProductNameLabels.title,
                className: "font-bold w-full flex"
                
            }, {
                textAlignment: "w"
            })
    
            new YanexHeading(titleContainer, "h1", {
                text: AddProductRecord.addProductNameLabels.message,
                fg:"lighterFg",
                className: "w-full text-sm"
            }, {
                textAlignment: "w"
            })
    
            for(const [fieldKey, fieldValue] of Object.entries(ProductNameSectionRecord.productNameFields)) {
                const fieldContainer = new YanexDiv(container, {
                    className: "flex flex-col gap-1 w-full pt-3 gap-1 px-5",
                    bg: null
                })
                const label = new YanexHeading(fieldContainer, "h1", {
                    text: fieldValue,
                    className: "font-bold w-full flex",
                
                }, {
                    textAlignment: "w"
                })

                label.addDataset(PublicStringValues.widgetIconDataSetTitle, 
                    ProductNameSectionRecord.productNameFieldsIcons[fieldKey])

                const input = new YanexInput(fieldContainer, {
                    className: "px-2 py-1 rounded w-full",
                    placeholder: fieldValue,
                })
                ProductNameSectionRef.productNameFields[fieldKey] = input
            }

            return mainContainer
        }
    
}

export class ProductNameSectionHelper {
    /**
     * Gets all the field data in the the product name fields
     * @returns Record
     */
    public static getProductNameData(): Record<string, string> {
        const returnVal: Record<string, string> = {};

        for (const [fieldName, field] of Object.entries(ProductNameSectionRef.productNameFields)){
            returnVal[fieldName] = field.value || ""
        }

        return returnVal
    }

    /**
     * Clears all the product field input's value
     */
    public static clearProductNameFields(): void {
        for(const inp of Object.values(ProductNameSectionRef.productNameFields)) {
            inp.value = ""
        }
    }

    /**
     * Sets the default values for the product name fields
     * @param fieldData The field's data
     */
    public static setProductFieldDefaultValues(fieldData: Record<string, string>): void {

    }
}