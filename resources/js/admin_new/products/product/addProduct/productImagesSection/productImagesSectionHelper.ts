import YanexImageView from "../../../../../packages/widgets/yanexWidgetPackages/yanexImageViewer";
import { YanexButton, YanexDiv, YanexHeading } from "../../../../../packages/widgets/yanexWidgets";
import { PublicStringValues } from "../../../../../public";
import { ProductImagesSectionRecord } from "./productImagesSectionRecord";
import { ProductImagesSectionRef } from "./productImagesSectionRef";

export class ProductImagesSectionFactory{

    public static createImagesGui(): YanexDiv {

        const container = new YanexDiv(null, {
            className: "flex flex-col gap-1 rounded p-2 overflow-y-auto scroll-modern",
            bg:"extraBg"
        })


        const messageContainer = new YanexDiv(container, {
            className: "flex flex-col p-5 w-full",
            bg: "extraBg"
        })

        const noImageInfo = new YanexDiv(messageContainer, {
            className: "w-full",
            bg: "extraBg"
        });
        
        const title = new YanexHeading(noImageInfo, "h1", {
            className: "font-bold w-full h-full flex",
            bg:"extraBg",
            text: ProductImagesSectionRecord.imageInfo.title,
            
        }, {
            textAlignment: "w"
        })

        title.addDataset(PublicStringValues.widgetIconDataSetTitle,
            ProductImagesSectionRecord.imageInfoIcons["title"] as string
        )

        new YanexHeading(noImageInfo, "h1", {
            text: ProductImagesSectionRecord.imageInfo.message,
            bg:"extraBg",
            fg:"lighterFg",
            className: "w-full h-full text-sm"
        }, {
            textAlignment: "w"
        })

        ProductImagesSectionRef.productImagesViewer = new YanexImageView(container, {
            maximumImageKbSize: 300,
            compressionRate: 0.1
        });

        new YanexHeading(container, "h6", {
            text: ProductImagesSectionRecord.imageInfo.footerMessage,
            fg: "red",
            className: "w-full h-full text-sm py-3"
        }, {
            textAlignment: "w"
        })
        return container;
    }

}

export class ProductImagesSectionHelper{
    public static getSubmittedImages(): Array<Blob> | null{
        if(ProductImagesSectionRef.productImagesViewer) {
            return ProductImagesSectionRef.productImagesViewer.images
        }
        return null
    }
}
