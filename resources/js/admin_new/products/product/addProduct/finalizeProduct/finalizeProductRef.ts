import { YanexButton, YanexDiv, YanexHeading } from "../../../../../packages/widgets/yanexWidgets";
import { AddProductContentAliases } from "../addProductRecord";


export class FinalizeProductRef {
    public static finalizationMainContainer: YanexDiv | null = null;
    

    public static contentAliasesContainer = {} as Record<AddProductContentAliases, YanexDiv>;

    public static finalizationNeededDataContainer: YanexDiv | null = null;

    public static addProductButton: YanexButton | null = null;

    public static finalizeStatusContainer: YanexDiv | null = null;
}