import { YanexButton, YanexDiv, YanexElement } from "../yanexWidgets";
import { YanexWidgetsHelper } from "../yanexWidgetsHelper";
import { YanexWidgetBgThemeTypes, YanexWidgetBorderThemeTypes, YanexWidgetFgThemeTypes } from "../yanexWidgetTheme/yanexThemeTypes";

type YanexGroupButtonSelectMode = "browse" | "multi";
type YanexGroupButtonOrientation = "horizontal" | "vertical"


interface YanexGroupedButtonsOptions {
    bg?: YanexWidgetBgThemeTypes | null,
    selectBg?: YanexWidgetBgThemeTypes | null,
    fg?: YanexWidgetFgThemeTypes | null,
    selectFg?: YanexWidgetFgThemeTypes | null,
    border?: YanexWidgetBorderThemeTypes | null,
    selectBorder?: YanexWidgetBorderThemeTypes | null,
    hoverBg?: YanexWidgetBgThemeTypes | null,
    hoverFg?: YanexWidgetFgThemeTypes | null,
    hoverBorder?: YanexWidgetBorderThemeTypes | null,
    buttonTexts?: Array<string>,
    buttons?: Array<YanexButton>,
    buttonValues?: Array<string | number | boolean>
    defaultIndexSelected?: number | Array<number>,
    defaultSelected?: string | Array<string>,
    selectMode?: YanexGroupButtonSelectMode,
    reselectable?: boolean,
    rounded?: boolean,
    orientation?: YanexGroupButtonOrientation
}

interface YanexGroupedButtonParts {
    container?: YanexDiv,
    buttons: Record<string, YanexButton>,
}

export default class YanexGroupedButtons {

    private parent?: YanexElement;

    private options!: YanexGroupedButtonsOptions;

    private groupedButtonsParts: YanexGroupedButtonParts = {
        buttons: {}
    };

    private activeButtons: Record<string, YanexButton> = {};
    /**
     * Create a new group of buttons
     * @param parent Yanex Parent. If parent is null, it won't create a ui.
     * @param options Additional options for the grouped buttons
     */
    constructor(parent?: YanexElement | null, options?: YanexGroupedButtonsOptions) {
        this.parent = parent || undefined;
        if(options) {
            this.options = options;
        } else {
            this.options = {};
        }

        this.setDefaultOptions();

        // Ignore if parent is null
        if(parent) {
            this.buildUi();
        }

        this.setButtons();

        this.setDefaultBehaviour();
    }

    /**
     * Sets a button to be selected
     * @param button The button's exact text
     */
    public selectButton(buttonText: string): void {
        // Check if the button is already selected
        if(this.activeButtons[buttonText]) return;
        const but = this.groupedButtonsParts.buttons[buttonText];
        but.select()
        this.activeButtons[buttonText] = but;
    }

    /**
     * Unselects an active button. Skips if it's already unselected
     * @param buttonText The button to be deactivated. If null, unselects all. 
     */
    public unselectButton(buttonText: string | null = null): void {
        if(buttonText) {
            const but = this.activeButtons[buttonText];
            if(but) {
                but.deselect()
                delete this.activeButtons[buttonText]
            }
        } else {
            for (const [buttonTxt, button] of Object.entries(this.activeButtons)) {
                button.deselect()
                delete this.activeButtons[buttonTxt]
            }
        }

    }

    private buttonClicked(event: PointerEvent): void {

        const button = event.target as HTMLButtonElement;
        const yanex = YanexWidgetsHelper.getYanexReference(button);

        if(yanex) {
            // Handle browse mode
            if(this.options.selectMode === "browse") {
                const activeButton = this.activeButtons[button.textContent];

                // The button is selected
                if(activeButton){
                    if(this.options.reselectable) {
                        // Unselect the button if reselectable is true
                        this.unselectButton(activeButton.text)
                    }
                    
                } else {
                    // Unselect active buttons
                    for(const buttonTxt of Object.keys(this.activeButtons)) {
                        this.unselectButton(buttonTxt)
                    }
                    this.selectButton(button.textContent)
                }

            } else {
                // Multi mode
                if(this.activeButtons[button.textContent]) {
                    // Unselect if reselectable is true
                    if(this.options.reselectable) this.unselectButton(button.textContent);
                } else {
                    this.selectButton(button.textContent)
                }
            }
        }
    }


    private setDefaultBehaviour() {
        let indexSelected = this.options.defaultIndexSelected;
        if(indexSelected || indexSelected === 0) {
            if(typeof indexSelected === "number") {
                indexSelected = [indexSelected]
            }

            if(this.options.buttonTexts) {
                for(const selectedIndexes of indexSelected) {
                    this.selectButton(this.options.buttonTexts[selectedIndexes])
                }
            }
        }

        let selectedButton = this.options.defaultSelected;
        if(selectedButton) {
            if(typeof selectedButton === "string") {
                selectedButton = [selectedButton]
            }

            for(const button of selectedButton) {
                this.selectButton(button);
            }
        }
        
    }

    private setDefaultOptions(): void {
        const defaultOptions: YanexGroupedButtonsOptions = {
            selectMode: "multi",
            bg: "defaultBg",
            fg: "defaultFg",
            border: null,
            selectBg: "specialColorBg",
            selectFg: null,
            selectBorder: null,
            hoverBg: null,
            reselectable: true,
            rounded: true,
            orientation: "horizontal"
        }

        if(this.options) {
            Object.assign(defaultOptions, this.options);
        }

        this.options = defaultOptions
    }

    private buildUi(): void {
        
        const container = new YanexDiv(this.parent, {
            bg: null,
            className: `w-full flex
            ${this.options.orientation === "horizontal" ? "flex-row" : "flex-col"}
            `
        });
        this.groupedButtonsParts.container = container;
    }

    private setButtons(): void {
        // Create buttons
        if(this.parent &&
            this.options.buttonTexts && 
            this.groupedButtonsParts.container) {

            // Classnames for the buttons
            const buttonClassname: Array<string> = [];

            if(this.options.rounded){
                buttonClassname.push("rounded")
            }

            for(const buttonText of this.options.buttonTexts) {
                const elOptions: Partial<YanexGroupedButtonsOptions> = {};
                if(this.options){
                    elOptions["bg"] = this.options.bg
                    elOptions['fg'] = this.options.fg
                    elOptions["border"] = this.options.border
                    elOptions["selectBg"] = this.options.selectBg
                    elOptions["selectFg"] = this.options.selectFg
                    elOptions["selectBorder"] = this.options.selectBorder
                    elOptions["hoverBg"] = this.options.hoverBg
                    elOptions["hoverFg"] = this.options.hoverFg
                    elOptions["hoverBorder"] = this.options.hoverBorder
                }
                const button = new YanexButton(this.groupedButtonsParts.container, Object.assign(elOptions, {
                    className: `${buttonClassname.join(", ")} flex w-full items-center justify-center p-1`,
                    text: buttonText,
                }),
                {
                    addHoverEffect: true
                })
                this.setButton(button)

            }
        } else if (this.options.buttons) { // Uses a created buttons instead
            for(const button of this.options.buttons) {
                this.configureButton(button)
                this.setButton(button)
            }
        }
    }

    // Adds a button to the group
    public addButton(button: YanexButton): void {
        this.configureButton(button)
        this.setButton(button)
    }

    private configureButton(button: YanexButton): void {
        // button.configure({
        //             bg: this.options.defaultBg,
        //             fg: this.options.defaultFg,
        //             border: this.options.defaultBorder,
        //             hoverBg: this.options.hoverBg,
        //             hoverFg: this.options.hoverFg,
        //             hoverBorder: this.options.hoverBorder,
        //             selectBg: this.options.selectBg,
        //             selectFg: this.options.selectFg,
        //             selectBorder: this.options.selectBorder
        //         }
        //     )
    }

    private setButton(button: YanexButton): void {

        this.groupedButtonsParts.buttons[button.text] = button;
        button.addEventListener("click", (e) => {this.buttonClicked(e)});
    }

    // ----------------------------------------GETTERS -------------------------------
    /**
     * Get the active button in the group.
     * Returns the values of the buttonValues if provided. Else, the buttonText.
     */
    public get activeButton(): Array<string | number | boolean> {
        if(this.options.buttonTexts) {
            const returnVal = [];
            for(const [index, buttonText] of this.options.buttonTexts.entries()) {
                if(this.activeButtons[buttonText]) {
                    if(this.options.buttonValues) {
                        returnVal.push(this.options.buttonValues[index]);
                    } else {
                        returnVal.push(buttonText)
                    }

                    if(this.options.selectMode === "browse") {
                        return returnVal
                    }
                }
            }
            return returnVal
        }
        return [];
    }

    // --------------------------------------------------SETTERS ---------------------------
    /**
     * Set the active button by its button's text.
     */
    public set setActiveButton(value: string) {
        this.selectButton(value)
    }
}