import YanexCustomModal, { YanexCustomModalEvents } from "../../../../../packages/widgets/yanexWidgetPackages/yanexCustomModal";
import YanexTreeview from "../../../../../packages/widgets/yanexWidgetPackages/yanexTreeview";
import { YanexButton, YanexDiv, YanexHeading } from "../../../../../packages/widgets/yanexWidgets";
import { SelectProductAttrRef } from "../selectProductAttr/selectProductAttrRef";
import { SelectProductTypeEvents } from "./selectProductTypeBundle";
import { SelectProductTypeRecord } from "./selectProductTypeRecord";
import { SelectProductTypeRef } from "./selectProductTypeRef";


export class SelectProductTypeFactory{

    public static createModal(): void {
        const modal = new YanexCustomModal(document.body as HTMLBodyElement, 
             null, null, {
                title: "Select Product Type",
                addClass: "w-full h-full"
            }
        );
        modal.addEventListener("close", (e: YanexCustomModalEvents) => {SelectProductTypeEvents.modalClose(e)})
        SelectProductTypeRef.modal = modal;
        const modalContainer = new YanexDiv(null, {
            className: "flex flex-col w-full h-full"
        })

        const messageContainer = new YanexDiv(modalContainer, {
            className: "flex w-full p-2 flex-col"
        })

            new YanexHeading(messageContainer, "h6", {
            className: "font-bold",
            fg: "specialColorFg",
            text: SelectProductTypeRecord.intro.title
        })

                
        new YanexHeading(messageContainer, "h6", {
            text: SelectProductTypeRecord.intro.message,
            className: "text-sm"

        })

        const treeview = new YanexTreeview(modalContainer, [
            {
                "columnName": "Id",
                columnWidth: "w-fit"
            },
            {
                columnName: "Type",
                columnWidth: "w-full"
            }
        ], {
            noRowText: "No product type added yet. Please add one by going at \"Add Product Type\"",
            selectMode: "browse",
            reselectable: false
        }, )

        SelectProductTypeRef.treeview = treeview

        const buttonContainer = new YanexDiv(modalContainer, {
            className: "flex gap-2 self-end justify-self-end w-full mt-auto p-4"
        })
        for(const button of Object.values(SelectProductTypeRecord.modalButtons)){
            const but = new YanexButton(buttonContainer, {
                className: "w-full rounded py-2",
                bg: button === SelectProductTypeRecord.modalButtons["select"] ? "lighterSpecialColorBg" : "defaultBg",
                text: button,
                hoverBg: button === SelectProductTypeRecord.modalButtons["select"] ? "specialColorBg" : "lighterBg",

            })

            but.addEventListener("click", (e) => {SelectProductTypeEvents.modalButtonsClicked(e)})
        }
        modal.addContent(modalContainer)
    }
}