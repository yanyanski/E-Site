import YanexCustomModal from "../../packages/widgets/yanexWidgetPackages/yanexCustomModal";
import { YanexDiv, YanexHeading, YanexInput } from "../../packages/widgets/yanexWidgets";


export class LoginRef {
    public static initialized: boolean = false;

    public static loginModal: YanexCustomModal | null = null;

    public static loginFields: Record<string, YanexInput> = {};

    public static showPasswordCheck: YanexInput;

    public static statusContainer: YanexDiv;

    public static statusLabel: YanexHeading;
}