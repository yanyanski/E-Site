import { Strings } from "../../packages/datatypeHelpers";
import { StatusReturnType } from "../../packages/interfaces";
import { YanexDiv, YanexElement, YanexForm, YanexHeading, YanexInput } from "../../packages/widgets/yanexWidgets";
import { YanexWidgetBgThemeTypes } from "../../packages/widgets/yanexWidgetTheme/yanexThemeTypes";
import { CategoryRecords, CategoryUpdateDataStructure } from "./categoryRecord";

import { CategoryRefs } from "./categoryRef";



export class CategoryHelper{
    public static getCategoryFieldData(): Record<string, string> {
        const returnVal: Record<string, string> = {};
        for(const [keyName, yanexInput] of Object.entries(CategoryRefs.addCategoryFields)) {
            returnVal[keyName] = (yanexInput.widget as HTMLInputElement).value
        }
        return returnVal;
    }

    public static checkSubmittedCategory(categoryData: Record<string, string>): StatusReturnType{
        for(const [key, data] of Object.entries(categoryData)){
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

    public static updateCategoryFormField(data: Record<string, any>) {
        for(const [fieldKey, fieldYanex] of Object.entries(CategoryRefs.updateCategoryFields)) {

            const fieldData = data[Strings.convertCase(fieldKey, "kebabcase", true, "title")]
            if(fieldData) {
                fieldYanex.value = fieldData
            }
        }
    }
}

export class CategoryFactory{

    /**
     * Create a category field. Throughout the app, this should only be called twice for add and update modes
     * @param defaultFieldData If the defaultFieldData is not null, it would treat these field as update mode. Else, add mode.
     */
    public static createCategoryField(
        parent: YanexElement, 
        defaultFieldData: CategoryUpdateDataStructure | null = null)
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
            text:defaultFieldData ? "Update Category" : "Add Category",
            className:"font-bold w-full flex justify-center"
        }, {
            textAlignment: "w"
        });

        const messageText = !defaultFieldData ? CategoryRecords.formLabels.addMessage : CategoryRecords.formLabels.updateMessage;

        new YanexHeading(titleContainer, "h1", {
            text: messageText,
            fg:"lighterFg",
            className:"text-sm"
        }, {
            textAlignment: "w"
        });

        for(const [fieldKey, fieldTitle] of Object.entries(CategoryRecords.categoryFields)){
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
                    className: "rounded w-full px-1 py-1 border-opacity-70",
                    name:fieldKey,
                    emptyValueBorder: "red"
                }
            );
            if(defaultFieldData) {
                CategoryRefs.updateCategoryFields[fieldKey] = entry;
                
            } else {
                CategoryRefs.addCategoryFields[fieldKey] = entry
            }
        }
        return form;

    }

}