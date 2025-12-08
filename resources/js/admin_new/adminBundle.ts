import { IconsBundle } from "../icons/iconsBundle";
import { IconsHelperRequest } from "../icons/iconsHelper";
import { IconsStorage } from "../icons/iconsRef";
import { AdminFactory } from "./adminHelper";
import { AdminRecords } from "./adminRecords";
import { AdminRefs } from "./adminRef";
import { NavBarBundle } from "./navbar/navBarBundle";
import { AdminSubButtons } from "./navbar/navBarRecords";
import { NavBarRef } from "./navbar/navBarRef";


export class AdminBundle{

    public static async initialize(){
        // Create Nav bar
        NavBarBundle.initialize();

        // Create content Area
        AdminFactory.createContentContainer();

        // Get the admin icons
        await IconsHelperRequest.getImageIcons(AdminRecords.adminIcons)

        // Assign icons
        IconsBundle.setElementIcons(document.body as HTMLBodyElement)
    }
}