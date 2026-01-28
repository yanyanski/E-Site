import { IconsBundle } from "../icons/iconsBundle";
import { IconsHelperRequest } from "../icons/iconsHelper";
import { AdminFactory } from "./adminHelper";
import { AdminRecords } from "./adminRecords";
import { NavBarBundle } from "./navbar/navBarBundle";


export class AdminBundle{

    public static async initialize(){
        AdminFactory.createAdminWrapper();
        
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