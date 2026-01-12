import { YanexButton } from "../../../packages/widgets/yanexWidgets";
import { PriceFilterSectionFactory, PriceFilterSectionHelper } from "./priceFilterSectionHelper";
import { PriceFilterSectionRecord } from "./priceFilterSectionRecord";
import { PriceFilterSectionRef } from "./priceFilterSectionRef";


export class PriceFilterSectionBundle {
    public static initialize(): void {
        if(PriceFilterSectionRef.initialized) {
            PriceFilterSectionRef.priceContainer.show();
            return
        }
        PriceFilterSectionFactory.createContainer();
        PriceFilterSectionFactory.createMessage();
        PriceFilterSectionFactory.createPriceSectionConditions();
    }

    private static disableButtons2(disable: Array<string>): void {

        const currentButton2 = PriceFilterSectionRef.activeExpressionButton2;
        if(currentButton2 && 
            currentButton2.isSelected &&
            disable.includes(currentButton2.text)
            ) {

            currentButton2.deselect();
            const nextButton = PriceFilterSectionHelper.expressionButtonNext(currentButton2.text,
                    PriceFilterSectionRef.expressionButtons2,
                disable);
            PriceFilterSectionRef.activeExpressionButton2 = nextButton;
            nextButton.select();
        } 

        // Disable < and = expression button on group 2
        PriceFilterSectionHelper.disableButtonExpressions2(disable)
    }

    public static disableSecondButtonGroup(includeBetweenConditionals: boolean): void {
        const container = PriceFilterSectionRef.conditionContainer[2];
        if(container) {
            container.addElementClassName("opacity-50");
            container.setElementsState(["YanexButton", "YanexInput"], false);

        }

        if(includeBetweenConditionals) {
            PriceFilterSectionRef.conditionalButtonContainer.addElementClassName("opacity-50")
            PriceFilterSectionRef.conditionalButtonContainer.setElementsState("YanexButton", false)
        }
    }

    public static enableSecondButtonGroup(includeBetweenConditionals: boolean): void {
        const container2 = PriceFilterSectionRef.conditionContainer[2]
        container2.widget.classList.remove("opacity-50")
        container2.setElementsState(["YanexButton", "YanexInput"], true)

        if(includeBetweenConditionals) {
            PriceFilterSectionRef.conditionalButtonContainer.removeElementClassName("opacity-50")
            PriceFilterSectionRef.conditionalButtonContainer.setElementsState("YanexButton", true)
        }
    }
    public static checkPricingConditions(): void {
        const getActiveExpression1 = PriceFilterSectionRef.activeExpressionButton1;
        const expression1 = getActiveExpression1.text;

        // Enable all buttons 2
        for(const button of Object.values(PriceFilterSectionRef.expressionButtons2)) {
            button.state = true;
        }
        let disable: Array<string> | null = null;
        const container2 = PriceFilterSectionRef.conditionContainer[2]


        switch(expression1) {
            case "<":
                // Deselect button if the active button state are in the disable array
                disable = ["=", "<"];
                
                break;
            case ">":
                // Deselect/disable > and = expression
                disable = ["=", ">"];
                break;
            
            case "=":
                this.disableSecondButtonGroup(true);
                break;
        }
        console.log(!container2.widget.classList.contains("opacity-50"))
        if(disable &&
            !container2.widget.classList.contains("opacity-50")
        ){
            // Check if the whole condition 2 is disabled
            if(container2 && container2.widget.classList.contains("opacity-50")) {
                this.enableSecondButtonGroup(true)
            }
            this.disableButtons2(disable)
        }
    }
}

export class PriceFilterSectionEvents {
    public static conditionBetweenClicked(button: YanexButton){
        if(button.isSelected) {
            button.deselect();
            PriceFilterSectionRef.betweenButtonSelected = null;

            // Disable whole condition 2
            PriceFilterSectionBundle.disableSecondButtonGroup(false)
            return;
        }
        PriceFilterSectionBundle.enableSecondButtonGroup(false)
        PriceFilterSectionBundle.checkPricingConditions()
        button.select();

        if(PriceFilterSectionRef.betweenButtonSelected) {
            PriceFilterSectionRef.betweenButtonSelected.deselect();
        }
        PriceFilterSectionRef.betweenButtonSelected = button

    }

    public static conditionalExpressionsClicked(button: YanexButton, buttonGroup: 1 | 2): void {
        if(button.isSelected) return;

        // Get button expression meaning
        const expressionMeaning = PriceFilterSectionRecord.priceConditionExpressions[button.text]

        button.select()
        if(buttonGroup === 1){
            if(PriceFilterSectionRef.activeExpressionButton1) {
                PriceFilterSectionRef.activeExpressionButton1.deselect();
            }
            PriceFilterSectionRef.activeExpressionButton1 = button

            PriceFilterSectionRef.expressionMeaningHeader1.text = expressionMeaning
            PriceFilterSectionBundle.checkPricingConditions();
        } else {
             if(PriceFilterSectionRef.activeExpressionButton2) {
                PriceFilterSectionRef.activeExpressionButton2.deselect();
            }
            PriceFilterSectionRef.activeExpressionButton2 = button

            PriceFilterSectionRef.expressionMeaningHeader2.text = expressionMeaning
        }
        
    }
}