import { YanexButton, YanexDiv, YanexHeading } from "../../packages/widgets/yanexWidgets";
import { AdminCategoriesSubButtons, AdminNavBarButtons, AdminProductSubButtons, AdminUsersSubButtons, AdminVariantsSubButtons } from "./navBarRecords";


export class NavBarRef{

    // A flag whether the nav bar is initialized
    public static initialized: boolean = false;
    
    // The current active content shown.
    public static activeContent: YanexDiv | null = null;

    // Reference of the admin nav bar sub buttons 
    public static navSubButtonContainer: Partial<Record<AdminNavBarButtons, YanexDiv>> = {};
    
    // The current adminNav button that are being shown shown
    public static currentNavButtonsShown: Set<AdminNavBarButtons> = new Set();
    
    // The navbar container
    public static navBarContainer: YanexDiv;

    // The label for showing the time
    public static timeLabel: YanexHeading;

    // All sub button references
    public static navBarSubButtons = {} as Record<
        AdminCategoriesSubButtons |
        AdminProductSubButtons |
        AdminVariantsSubButtons |
        AdminUsersSubButtons
        , YanexButton>;
    
    
}