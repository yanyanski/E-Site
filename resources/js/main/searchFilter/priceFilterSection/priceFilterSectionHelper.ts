import { YanexButton, YanexDiv, YanexHeading, YanexInput } from "../../../packages/widgets/yanexWidgets";
import { PublicStringValues } from "../../../public";
import { SearchFilterRef } from "../searchFilterRef";
import { PriceFilterSectionBundle, PriceFilterSectionEvents } from "./priceFilterSectionBundle";
import { PriceFilterSectionRecord } from "./priceFilterSectionRecord";
import { PriceFilterSectionRef } from "./priceFilterSectionRef";


export class PriceFilterSectionHelper {
    public static expressionButtonNext(expression: string, buttonGroup: Record<string, YanexButton>,
        disabledExpressions: Array<string>
    ): YanexButton {

        const butGroupArray = Object.keys(buttonGroup)
        let expressionIndex = butGroupArray.indexOf(expression);

        let nextButton;
        let continueLoop = true;

        while(continueLoop) {
            if(expressionIndex === butGroupArray.length - 1) {
                nextButton = buttonGroup[butGroupArray[0]]
            } else {
                nextButton = buttonGroup[butGroupArray[expressionIndex + 1]];
            }
            
            // Check if the nextButton's text is in the disabledExpressions
            if(disabledExpressions.includes(nextButton.text)) {
                expression = nextButton.text;
                expressionIndex = butGroupArray.indexOf(expression);
            } else {
                continueLoop = false
            }
        }
        return nextButton!
    }

    public static disableButtonExpressions2(disable: Array<string>): void {
        for(const expression of disable) {
            const disBut = PriceFilterSectionRef.expressionButtons2[expression]
            if(disBut) disBut.state = false;
        }
    }
}
export class PriceFilterSectionFactory{

    public static createContainer(): void {
        const container = new YanexDiv(SearchFilterRef.searchFilterTypesContainer, {
            className: "w-full h-full flex flex-col gap-1 p-2 hidden"
        })
        PriceFilterSectionRef.priceContainer = container;
    }

    public static createMessage(): void {
        new YanexHeading(PriceFilterSectionRef.priceContainer, "h6", {
            className: "w-full text-xs p-2",
            fg: "lighterFg",
            text: PriceFilterSectionRecord.message
        }, {
            textAlignment: "w"
        })
    }

    public static createPriceSectionConditions(): void {
        for(let i = 1; i <= 2; i++) {
            const conditionContainer = new YanexDiv(PriceFilterSectionRef.priceContainer, {
                className: "w-full p-2 rounded-md h-full flex flex-col",
                bg: "strongerBg"
            })
            PriceFilterSectionRef.conditionContainer[i] = conditionContainer;

            const message = `${i === 1 ? "First" : "Second"} ${PriceFilterSectionRecord.priceConditionMessage}`;
            new YanexHeading(conditionContainer, "h6", {
                className: "w-full p-1 text-sm",
                text: message,
                fg:"lighterFg"
            }, {
                textAlignment:"w"
            })

            const container1 = new YanexDiv(conditionContainer, {
                className: "flex gap-1 px-2",
                bg: null
            })
            const message2 = `${i === 1 ? 
                "Filter products that is: " :
                "products that is: "}`

            new YanexHeading(container1, "h6", {
                text: message2,
                className: "text-nowrap p-1 text-md "
            }, {
                textAlignment: "w"
            })

            // Expressions
            const expressionContainer = new YanexDiv(container1, {
                className: "flex gap-1 w-full py-1 px-2 justify-start items-center",
                bg: null
            })

            for(const keyExpression of Object.keys(PriceFilterSectionRecord.priceConditionExpressions)) {
                const exButton = new YanexButton(expressionContainer, {
                    className: "px-5 rounded-md",
                    text: keyExpression,
                    hoverBg: "lighterSpecialColorBg",
                    selectBg: "specialColorBg",
                    bg: "lighterBg"
                })

                if(i === 1){
                    PriceFilterSectionRef.expressionButtons1[keyExpression] = exButton;
                    exButton.addEventListener("click", (e) => PriceFilterSectionEvents.conditionalExpressionsClicked(exButton, 1));
                } else {
                    PriceFilterSectionRef.expressionButtons2[keyExpression] = exButton;
                    exButton.addEventListener("click", (e) => PriceFilterSectionEvents.conditionalExpressionsClicked(exButton, 2));
                }
                
            }

            const priceContainer = new YanexDiv(
                conditionContainer, {
                    className:"w-full flex gap-1 px-2",
                    bg: null
                }
            )
            const expressionLabel = new YanexHeading(priceContainer, "h1", {
                className: "px-2 text-nowrap",
                text: "",
                fg:"lighterFg"
            })
            if(i == 1) {
                PriceFilterSectionRef.expressionMeaningHeader1 = expressionLabel
            } else {
                PriceFilterSectionRef.expressionMeaningHeader2 = expressionLabel
            }

            new YanexHeading(priceContainer, "h1", {
                className: "font-bold",
                fg:"lighterFg",
                text: PublicStringValues.currency
            })

            const priceInput = new YanexInput(priceContainer, {
                className: "w-full rounded-md",
                bg: "lighterBg",
                placeholder: "0.00"
            })

            if(i === 1) {
                // Create conditional in between
                const conditionalContainner = new YanexDiv(PriceFilterSectionRef.priceContainer, {
                    className: "w-full flex p-2 gap-2"
                })
                PriceFilterSectionRef.conditionalButtonContainer = conditionalContainner

                let firstIter = true;
                for(const [key, conditionText] of Object.entries(PriceFilterSectionRecord.conditionalPriceButtons)) {
                    const condButton = new YanexButton(conditionalContainner, {
                        className: "w-full rounded-md",
                        text: conditionText,
                        hoverBg: "lighterSpecialColorBg",
                        selectBg: "specialColorBg",
                        bg: "lighterBg"
                    })

                    if(firstIter) {
                        condButton.select();
                        firstIter = false;
                        PriceFilterSectionRef.betweenButtonSelected = condButton
                    }
                    condButton.addEventListener("click", (e) => PriceFilterSectionEvents.conditionBetweenClicked(condButton))
                }
            }
        }

        // Activate default expression buttons 1
        const firstButton = PriceFilterSectionRef.expressionButtons1[
            Object.keys(PriceFilterSectionRef.expressionButtons1)[0]
        ];
        firstButton.select()

        PriceFilterSectionRef.activeExpressionButton1 = firstButton;

        // Set expression meaning
        PriceFilterSectionRef.expressionMeaningHeader1.text = PriceFilterSectionRecord.priceConditionExpressions[firstButton.text]

        // Activate default expression buttons 2
        const secondButton = PriceFilterSectionRef.expressionButtons2[
            Object.keys(PriceFilterSectionRef.expressionButtons2)[0]
        ];
        secondButton.select()

        PriceFilterSectionRef.activeExpressionButton2 = secondButton;

        // Set expression meaning
        PriceFilterSectionRef.expressionMeaningHeader2.text = PriceFilterSectionRecord.priceConditionExpressions[secondButton.text]

        // Check expression states
        PriceFilterSectionBundle.checkPricingConditions()
    }
}