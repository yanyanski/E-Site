import { YanexDiv, YanexHeading, YanexImage } from "../packages/widgets/yanexWidgets";
import { AdminRecordsLink } from "./adminRecords";
import { AdminRefs } from "./adminRef";


export class AdminFactory{

    public static createAdminWrapper(): void {
        AdminRefs.adminWrapper = new YanexDiv(document.body as HTMLBodyElement, {
            className: "abcd w-screen h-screen flex flex-col overflow-auto scroll-modern",
            mdClasses: "md:flex-row"
        })
    }
    public static createContentContainer(){
        AdminRefs.adminContentContainer = new YanexDiv(AdminRefs.adminWrapper, {
            className: "w-full h-full flex items-center justify-center"
        })
        
        const noShownContainer = new YanexDiv(AdminRefs.adminContentContainer, {
            className: "w-full h-full flex flex-col items-center justify-center gap-1"
        })
        AdminRefs.noShownContentContainer = noShownContainer
        new YanexImage(noShownContainer, {
            className: "w-[100px] h-[100px] opacity-30",
            src: AdminRecordsLink.noRecordImageLink
        })

        const textContainer = new YanexDiv(noShownContainer, {
            className: "flex flex-col gap-2",
            bg: null
        })
        new YanexHeading(textContainer, "h1", {
            className: "font-bold text-2xl",
            text: "Select Items To Start",
            fg: "lighterFg"
        })

        new YanexHeading(textContainer, "h6", {
            className: "text-sm ",
            fg: "lighterFg",
            text: "Select any buttons on the navigation bar to start."
        })
    }

    
}