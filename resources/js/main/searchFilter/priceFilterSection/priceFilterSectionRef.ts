import { YanexButton, YanexDiv, YanexHeading } from "../../../packages/widgets/yanexWidgets";


export class PriceFilterSectionRef{

    // Ticks to true if this section is initialized
    public static initialized: boolean = false;

    // The container for the price filter
    public static priceContainer: YanexDiv;

    // The buttons in between price conditions
    public static betweenButtonConditions: Record<string, YanexButton> = {};
    
    // The selected between conditions button
    public static betweenButtonSelected:YanexButton | null;

    // The expression buttons
    public static expressionButtons1: Record<string, YanexButton> = {};

    // The expression buttons in condition 2
    public static expressionButtons2: Record<string, YanexButton> = {};

    // The active expression button in condition 1
    public static activeExpressionButton1: YanexButton;

    // The active expression button in condition 2
    public static activeExpressionButton2: YanexButton;

    // The expression meaning label in condition 1
    public static expressionMeaningHeader1: YanexHeading;

    // The expression meaning label in condition 2
    public static expressionMeaningHeader2: YanexHeading;

    // Container for the whole condition
    public static conditionContainer: Record<number, YanexDiv> = {};

    // Container for the conditional buttons in between the conditional containers
    public static conditionalButtonContainer: YanexDiv;
}