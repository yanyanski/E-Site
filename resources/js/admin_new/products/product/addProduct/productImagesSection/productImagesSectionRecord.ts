import { TitleLabelRecord } from "../../../../../packages/interfaces";


export class ProductImagesSectionRecord{
    public static imageInfo: TitleLabelRecord = {
        "title": "Add Images",
        "message": `Add images for this product. (You can select in bulk) `,
        "footerMessage":  `⚠️ Image size exceeding over 10MB would have a longer compression time 
        and would have a higher image compression size. Please select images under 5MB (2MB for best)`
    }

    public static imageInfoIcons: Partial<TitleLabelRecord> = {
        "title": "image.png"
    }
}