
/**
 * @var defaultSelected The default selected button in the selection of buttons
 * @var limitSelection Limits the selection to nth number. If null, no limitations. If undefined, defaults to 1.
 * @var reselectable If true, the button will be reselectable. Defaults to false 
 */
interface ButtonSelectionInitialData {
    defaultSelected?: string | null,
    limitSelection?: number | null,
    reselectable?: boolean,
    enforceLIFOSelection?: boolean
}
/**
 * Creates a new instance of button selection.
 */
export class ButtonSelection {

    private buttons: Record<string, HTMLButtonElement> = {};
    private initialData?: ButtonSelectionInitialData;

    private selectedButtons: Record<string, HTMLButtonElement> = {};


    /**
     * Creates a ButtonSelection instance. This limits the selection of a button within a group with
     * certain controls.
     * @param buttons The buttons to be applied with button selection
     * @param initialData Initial configuration:
    *  - `defaultSelected` — sets which button is selected initially.
    *  - `limitSelection` — limits how many buttons can be selected.
    *  - `reselectable` — allows toggling an already selected button.
     * @see ButtonSelectionInitialData for available options
     */
    constructor(buttons: Array<HTMLButtonElement>,
        initialData?: ButtonSelectionInitialData
    ){
        for(const button of buttons){
            this.buttons[button.textContent] = button
        }
        this.initialData = initialData;
        this.setInitialData()
        this.setFunctionality()
    }

    private setInitialData(): void{
        const defaultData: ButtonSelectionInitialData = {
            defaultSelected: null,
            limitSelection: 1,
            reselectable: false,
            enforceLIFOSelection: true,
        }
        if(!this.initialData) this.initialData = {};

        Object.assign(defaultData, this.initialData)
        this.initialData = defaultData;
    }

    /**
     * Deselect button using its text. Skips if button doesn't exist or is not selected
     * @param buttonText The textContent of the button
     */
    public deselectButton(buttonText: string) {
        const button = this.selectedButtons[buttonText]
        console.log(button, "BUTTON")
        if(button) {
            button.classList.remove(
                "bg-green-700", "text-white", "hover:bg-green-600"
            )

            button.classList.add("bg-slate-200", "hover:bg-slate-100")
            delete this.selectedButtons[buttonText]
        }
    }

    /**
     * Selects a button. Ignores if it is already selected
     * @param buttonText  The textContent of the button to be selected
     */
    public selectButton(buttonText: string): void {
        const button = this.buttons[buttonText];
        if(button && !this.selectedButtons[buttonText]){
            button.classList.remove("bg-slate-200", "hover:bg-slate-100")
            button.classList.add("bg-green-700", "hover:bg-green-600", "text-white")
            this.selectedButtons[buttonText] = button
        }
    }

    private setButtonOnclick(e: PointerEvent) {
        const button = e.target as HTMLButtonElement;
        const buttonText = button.textContent;

        const enforceLIFOSelectionBehaviour = () =>{
            // Deselects the last selected button
            const buttons = Object.values(this.selectedButtons);
            const desButton = buttons[0];
            if(desButton) {
                this.deselectButton(desButton.textContent)
            }
        }

        // Check if the selection limit is reached
        let limitReached: boolean = false;
        // Check if the selection limit has been reached
        if(this.initialData?.limitSelection && this.initialData.limitSelection !== null) {
            if(Object.keys(this.selectedButtons).length === this.initialData.limitSelection) {
                limitReached = true;
            }
        }

        // Set reselectable behaviour
        if(this.initialData?.reselectable) {
            // Buttons are reselectable
            if(this.selectedButtons[buttonText]) {
                    this.deselectButton(buttonText)
            } else {
                if(this.initialData?.enforceLIFOSelection) {
                    // Separate logic for LIFO Selecting behaviour
                    if(limitReached) {
                       enforceLIFOSelectionBehaviour()
                    }
                    this.selectButton(buttonText)

                } else {
                    if(limitReached === false) {
                        this.selectButton(buttonText)
                    }
                }
            }
        } else {
            // Set non reselectable behaviour
            if(!this.selectedButtons[buttonText]) {
                if(this.initialData?.enforceLIFOSelection) {
                    // Separate logic for LIFO Select behaviour
                    if(limitReached) {
                        enforceLIFOSelectionBehaviour();
                    }
                    this.selectButton(buttonText)
                } else {
                    if(limitReached === false) {
                        this.selectButton(buttonText)
                    }
                }
            }
        }
    }   


    private setFunctionality(): void {

        for(const [buttonKey, button] of Object.entries(this.buttons)) {
            button.addEventListener("click", this.setButtonOnclick.bind(this))

        }
        // Set default selected button
        if(this.initialData?.defaultSelected) {
            this.selectButton(this.initialData.defaultSelected)
        }
    }

    /**
     * Get the currently active buttons in the selection
     * @returns An array of string with its values as the textContent of the button
     */
    public getActiveButtons(): Array<string>{
        const returnVal = [];
        for(const button of Object.values(this.selectedButtons)) {
            returnVal.push(button.textContent);
        }
        return returnVal
    }
}