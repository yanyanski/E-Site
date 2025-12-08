import YanexGroupedButtons from "../../../../../packages/widgets/yanexWidgetPackages/yanexGroupedButtons";
import { YanexInput, YanexTextArea } from "../../../../../packages/widgets/yanexWidgets";


export class ProductInfoSectionRef{
    public static productInfoFields: Record<string, YanexInput | YanexTextArea> = {};
    
    public static productIsActiveGroupedButton: YanexGroupedButtons | null = null;
}