import { TitleLabelRecord } from "../../../../../packages/interfaces";


export class FinalizeProductRecord {

    public static finalizeTitle: TitleLabelRecord = {
        title: "Finalize",
        message: "Finalize product details before adding."
    }

    public static finalizeTitleIcons: Partial<TitleLabelRecord> = {
        "title": "check.png"
    }
    
}

export class FinalizeProductLinks {
    public static ADDPRODUCTLINK: string = "/admin/products/add"
}