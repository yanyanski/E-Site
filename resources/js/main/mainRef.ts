import YanexCustomModal from "../packages/widgets/yanexWidgetPackages/yanexCustomModal";
import { YanexDiv } from "../packages/widgets/yanexWidgets";


export class MainRef{
    public static wrapperContainer: YanexDiv;

    public static initialized: boolean = false;
    
    public static loadingContainer: YanexDiv;
    
    public static productListContainer: YanexDiv;

    public static loginModal: YanexCustomModal;

    public static noProductContainer: YanexDiv;
}

export class MainStorage {
    public static iconsStorage: Record<string, Base64URLString> = {}
}