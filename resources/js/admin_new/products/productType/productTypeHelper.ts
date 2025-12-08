import { Strings } from "../../../packages/datatypeHelpers";
import { StatusReturnType } from "../../../packages/interfaces";
import { YanexDiv, YanexElement, YanexForm, YanexHeading, YanexInput } from "../../../packages/widgets/yanexWidgets";
import { ProductTypesRecords, ProductTypesUpdateDataStructure } from "./productTypeRecords";
import { ProductTypesRefs } from "./productTypeRef";


export class ProductTypesHelper{
    public static getProductTypeFieldData(): Record<string, string> {
        const returnVal: Record<string, string> = {};
        for(const [keyName, yanexInput] of Object.entries(ProductTypesRefs.addProductTypesFields)) {
            returnVal[keyName] = (yanexInput.widget as HTMLInputElement).value
        }
        return returnVal;
    }

    public static checkSubmittedProductType(productTypeData: Record<string, string>): StatusReturnType{
        for(const [key, data] of Object.entries(productTypeData)){
            if(data === "") {
                return {
                    "status": false,
                    "message": `The field ${Strings.convertCase(key, "kebabcase", true, "title")} is required.`
                }
            }
        }

        return {
            "status": true,
            "message": ''
        }
    }

    public static updateProductTypeFormField(data: Record<string, any>) {
        for(const [fieldKey, fieldYanex] of Object.entries(ProductTypesRefs.updateProductTypesFields)) {

            const fieldData = data[Strings.convertCase(fieldKey, "kebabcase", true, "title")]
            if(fieldData) {
                fieldYanex.value = fieldData
            }
        }
    }
}

export class ProductTypesFactory{

    /**
     * Create a productType field. Throughout the app, this should only be called twice for add and update modes
     * @param defaultFieldData If the defaultFieldData is not null, it would treat these field as update mode. Else, add mode.
     */
    public static createProductTypeField(
        parent: YanexElement, 
        defaultFieldData: ProductTypesUpdateDataStructure | null = null)
        : YanexForm {

        const form = new YanexForm(parent, {
            className:"w-full h-fit p-4 flex flex-col gap-2 max-w-[800px]",
            bg:"extraBg"
        });

        const titleContainer = new YanexDiv(form, {
            className: "flex w-full p-2 flex-col pb-3",
            bg:null
        })

        new YanexHeading(titleContainer, "h1", {
            text:defaultFieldData ? "Update ProductType" : "Add Product Type",
            className:"bold w-full flex justify-center"
        }, {
            textAlignment: "w"
        });

        const messageText = !defaultFieldData ? ProductTypesRecords.formLabels.addMessage : ProductTypesRecords.formLabels.updateMessage;

        new YanexHeading(titleContainer, "h1", {
            text: messageText,
            fg:"lighterFg",
            className:"font-sm"
        }, {
            textAlignment: "w"
        });

        for(const [fieldKey, fieldTitle] of Object.entries(ProductTypesRecords.productTypesFields)){
            const fieldContainer = new YanexDiv(form, {
                className: 'pb-4 flex flex-col gap-1',
                bg: null
            });

            new YanexHeading(fieldContainer, "h1", {
                text:fieldTitle,
                bg:"extraBg",
                className: "py-1 font-bold"
            }, {
                textAlignment: "w"
            })

            const entry = new YanexInput(fieldContainer,
                {
                    placeholder:fieldTitle,
                    className: "rounded w-full px-1 py-1",
                    name:fieldKey
                }
            );
            if(defaultFieldData) {
                ProductTypesRefs.updateProductTypesFields[fieldKey] = entry;
                
            } else {
                ProductTypesRefs.addProductTypesFields[fieldKey] = entry
            }
        }
        return form;

    }

}