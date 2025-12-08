import YanexCustomModal from "../../../../../packages/widgets/yanexWidgetPackages/yanexCustomModal";
import YanexTreeview from "../../../../../packages/widgets/yanexWidgetPackages/yanexTreeview";


export class SelectProductAttrRef {
    public static initialized: boolean = false;

    public static attrModal: YanexCustomModal | null = null;
    public static attrTreeview: YanexTreeview | null = null;
    public static attrMode: "category" | "variant" | "type";

}