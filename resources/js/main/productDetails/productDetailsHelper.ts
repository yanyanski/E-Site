import YanexCustomModal from "../../packages/widgets/yanexWidgetPackages/yanexCustomModal";
import YanexImageSlider from "../../packages/widgets/yanexWidgetPackages/yanexImageSlider";
import { YanexButton, YanexDiv, YanexHeading } from "../../packages/widgets/yanexWidgets";
import { PublicStringValues } from "../../public";
import { MainBundleEvents } from "../mainBundle";
import { MainRecords } from "../mainRecords";
import { ProductDetailsEvents } from "./productDetailsBundle";
import { ProductDetailsRef } from "./productDetailsRef";

export class ProductDetailsFactory{
    public static createProductModal(productData: Record<string, any>): void {
        const modal = new YanexCustomModal(document.body as HTMLBodyElement, "screen", "screen", {
            reduceHeight: 150,
            reduceWidth: 50,
            title: productData["name"]
        })
        ProductDetailsRef.productDetailsModal = modal;

        const modalWrapper = new YanexDiv(modal.modalDialog, {
            className: "flex flex-col w-full h-full overflow-y-auto scroll-modern py-3 gap-2",
            smClasses: "sm:flex-row sm:overflow-y-hidden"
        })

        const images = [];
        for(const img of productData["images"] || []) {
            images.push(img["prod_image_url"])
        }

        const imageSliderContainer = new YanexDiv(modalWrapper, {
            className: "w-full h-[50%] flex",
            smClasses: "sm:h-full"
        })

        const imageSlider = new YanexImageSlider(imageSliderContainer, images);

        const detailsContainer = new YanexDiv(modalWrapper, {
            className: "w-full h-full scroll-modern",
            smClasses: "sm:overflow-y-auto "
        })

        const priceAndButContainer = new YanexDiv(detailsContainer, {
            className: "flex w-full py-2"
        })
        const price = new YanexHeading(priceAndButContainer, "h1", {
            className: "text-xl p-2 w-full",
            fg: "specialColorFg",
            text: `${PublicStringValues.currency}${productData["info"]["prod_info_price"]}`
        }, {
            textAlignment: "w"
        })

        const buyButton = new YanexButton(priceAndButContainer, {
            className: "flex px-3 py-1 rounded-xl whitespace-nowrap mx-3",
            text: "To Shopify",
            bg: "specialColorBg",
            hoverBg: "lighterSpecialColorBg"
        })

        buyButton.addDataset(PublicStringValues.widgetIconDataSetTitle, MainRecords.mainIcons["cart"])
        buyButton.addDataset(MainRecords.buyButtonDataSetAttr, productData["info"]["prod_info_link"]);
        buyButton.addEventListener("click", (e) => {
            MainBundleEvents.buyButtonClicked(e)
        })

        const imageTitle = new YanexHeading(detailsContainer, "h1", {
            className: "text-2xl px-3 pt-4",
            text: productData["name"]
        }, {
            textAlignment:"w"
        })

        const prodType = new YanexHeading(detailsContainer, "h1", {
            className: "opacity-80 text-sm px-3 pb-3",
            fg:"lighterFg",
            text: productData["type"]["prod_type_name"]
        }, {
            textAlignment: "w"
        })

        const categoryContainer = new YanexDiv(detailsContainer, {
            className: "w-full flex flex-wrap gap-2 py-2 px-2"
        })

        for(const cat of productData["categories"] || []) {
            new YanexHeading(categoryContainer, "h1", {
                text: cat["prod_cat_name"],
                className: "text-sm rounded-lg px-2 py-1",
                bg: "lighterBg"
            })
        }

        new YanexHeading(detailsContainer, "h2", {
            className: "text-md w-min px-3 py-1 mt-4",
            bg: "extraBg",
            fg: "lighterSpecialColorFg",
            text: "Includes: "
        })

        const variationContainer = new YanexDiv(detailsContainer, {
            className: "flex gap-2 flex-wrap",
        })

        for (const vars of productData["variations"] || []) {
            new YanexHeading(variationContainer, "h1", {
                className: "px-3 py-1",
                text: vars["prod_var_title"]
            })
        }

        new YanexHeading(detailsContainer, "h1", {
            className: "text-lg w-min px-2 py-1 py-5",
            text: "Description"
        })

        const description = new YanexHeading(detailsContainer, "h6", {
            className: "text-sm opacity-80 px-2",
            fg: "lighterFg",
            text: productData["info"]["prod_info_desc"]
        }, {
            textAlignment: "w"
        })



        modal.show(null, true)
        modal.addEventListener("close", (e) => {ProductDetailsEvents.modalClosed(e)})
    }
}