import YanexCustomModal from "../../../../../packages/widgets/yanexWidgetPackages/yanexCustomModal";
import YanexTreeview from "../../../../../packages/widgets/yanexWidgetPackages/yanexTreeview";
import { YanexDiv } from "../../../../../packages/widgets/yanexWidgets";


export class SelectProductTypeRef {
    public static initialized: boolean = false;

    public static modal: YanexCustomModal;
    public static modalContainer: YanexDiv;
    public static treeview: YanexTreeview;
}