import YanexCustomModal from "../../../../../packages/widgets/yanexWidgetPackages/yanexCustomModal";
import YanexTreeview from "../../../../../packages/widgets/yanexWidgetPackages/yanexTreeview";
import { YanexButton, YanexDiv, YanexHeading } from "../../../../../packages/widgets/yanexWidgets";
import { SelectProductEvents } from "./selectProductAttrBundle";
import { SelectProductAttrRecord } from "./selectProductAttrRecord";
import { SelectProductAttrRef } from "./selectProductAttrRef";


export class SelectProductAttrFactory{

    public static createSelectionModal(): void {
        const modal = new YanexCustomModal(document.body as HTMLBodyElement, 
            "screen", "screen", {
                reduceHeight: 300,
                reduceWidth: 300,
                title: "Add Attribute"
            }
        )
        modal.addEventListener("close", (e) => {SelectProductEvents.attrModelClosed(e)})
        SelectProductAttrRef.attrModal = modal;
        const modalContainer = new YanexDiv(null, {
            className: "flex flex-col w-full h-full"
        })

        const messageContainer = new YanexDiv(modalContainer, {
            className: "flex w-full p-2 flex-col"
        })

         new YanexHeading(messageContainer, "h6", {
            className: "font-bold",
            fg: "specialColorFg",
            text: SelectProductAttrRecord.title.title
        })

                
        new YanexHeading(messageContainer, "h6", {
            text: SelectProductAttrRecord.title.message,
            className: "text-sm"

        })

        const treeview = new YanexTreeview(modalContainer, [
            {
                "columnName": "Id",
                columnWidth: "w-fit"
            },
            {
                columnName: "Value",
                columnWidth: "w-full"
            }
        ], {
            selectMode: "multi"
        })
        SelectProductAttrRef.attrTreeview = treeview;

        const buttonContainer = new YanexDiv(modalContainer, {
            className: "flex gap-2 justify-self-end"
        })
        for(const button of ["Add", "Cancel"]){
            const but = new YanexButton(buttonContainer, {
                className: "w-full rounded py-2",
                bg: button === "Add"? "lighterSpecialColorBg" : "defaultBg",
                text: button,
                hoverBg: button === "Add" ? "specialColorBg" : "lighterBg",

            })

            but.addEventListener("click", (e) => {SelectProductEvents.attrModelButtonsClicked(e)})
        }
        modal.addContent(modalContainer)
    }
}