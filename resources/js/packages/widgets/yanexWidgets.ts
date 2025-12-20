import { YanexDisableElements, YanexFieldWidgets, YanexInputAllowedDataTypes, YanexWidgetStatus } from "./yanexTypes";
import { YanexWidgetsHelper } from "./yanexWidgetsHelper";
import { YanexWidgetRecords } from "./yanexWidgetsRecords";
import { YanexWidgetStorage } from "./yanexWidgetsStorage";
import { YanexThemeTCSS } from "./yanexWidgetTheme/yanexTCSSTheme";
import { YanexThemeHelper } from "./yanexWidgetTheme/yanexThemeHelper";
import { YanexWidgetBgThemeTypes, YanexWidgetBorderThemeTypes, YanexWidgetFgThemeTypes } from "./yanexWidgetTheme/yanexThemeTypes";
import { YanexWidgetCalculator } from "./yanexWidgetUtilities";

type YanexAdditionalEvents = "scrollBottom" | "scrollTop" | "scrollOver90%" | "scrollUnder10%" | "scrollOn50%" 

type YanexTextAlignments = "n" | "nw" | "ne" | "s" | "se" | "sw" | "w" | "e" | "center"

interface YanexElementsMap {
    "yanexDiv": YanexDiv,
    "yanexH1": YanexHeading,
    "yanexH2": YanexHeading,
    "yanexH3": YanexHeading,
    "yanexH4": YanexHeading,
    "yanexH5": YanexHeading,
    "yanexH6": YanexHeading,
    "yanexButton": YanexButton,
    "yanexDialog": YanexDialog,
    "yanexForm": YanexForm,
    "yanexInput": YanexInput,
    "yanexImg": YanexImage,
    "yanexTextArea": YanexTextArea
    "yanexSpan": YanexSpan,
    "yanexLabel": YanexLabel
}

interface YanexWidgetOptions{
    setDefaultBehaviour?: boolean;
    addHoverEffect?: boolean;
    state?: boolean;
    isClickable?: boolean;
    prepend?: boolean;
    selectFlickerEffect?: boolean,
    isInternal?: number // If value is 1, create the internal element. Else if higher, reject.
    textAlignment?: YanexTextAlignments
    highlight?: boolean,
    disableHoverIfStateIsFalse?: boolean
}

interface YanexWidgetElementData{
    bg?: YanexWidgetBgThemeTypes | null;
    fg?: YanexWidgetFgThemeTypes | null;
    border?: YanexWidgetBorderThemeTypes | null;
    hoverBg?: YanexWidgetBgThemeTypes | null;
    hoverFg?: YanexWidgetFgThemeTypes | null;
    hoverBorder?: YanexWidgetBorderThemeTypes | null;
    selectBg?: YanexWidgetBgThemeTypes | null,
    selectFg?: YanexWidgetFgThemeTypes | null,
    selectBorder?: YanexWidgetBorderThemeTypes | null,
    emptyValueBg?: YanexWidgetBgThemeTypes | null,
    emptyValueBorder?: YanexWidgetBorderThemeTypes | null,
    text?: string;
    className?: string;
    smClasses?: string;
    mdClasses?: string;
    lgClasses?: string;
    placeholder?:string,
    value?: string,
    options?: Record<string, string>
    name?: string,
    status?: YanexWidgetStatus,
    dataSetName?: string,
    dataSetValue?: string,
    accept?: string,
    type?: string,
    src?: string,
    innerHTML?: string,
    id?: string,
    rows?: number,
    for?: string,
    autocomplete?: AutoFill | AutoFillField,
    alt?: string
}

interface YanexInputExclusiveOptions {
    allowed?: Array<YanexInputAllowedDataTypes> | YanexInputAllowedDataTypes,
    exceptions? : string
}

interface YanexWidgetOtherDataStructure {
    hoverBgHandled: boolean,
    hoverFgHandled: boolean,
    elementKeyUpEventHandled: boolean,
    elementKeyDownEventHandled: boolean
}

interface YanexWidgetInnerElements {
    textElem?: YanexSpan,
    loadingElem?: YanexSpan,
    iconElem?: YanexImage
}

const bgTheme = YanexThemeTCSS.activeBgThemeSchema;
const fgTheme = YanexThemeTCSS.activeFgThemeSchema;
const borderTheme = YanexThemeTCSS.activeBorderThemeSchema;

class BaseClass{
    
    /**The element title for identifier purposes */
    protected element: HTMLElement;

    /**Options applied to the widget*/
    protected options: YanexWidgetOptions | null = null;

    /**The data of the states of the element */
    protected elementData: YanexWidgetElementData;
    
    /**The default data of the element */
    private defaultElementData!: YanexWidgetElementData;

    /**Other reference data */
    private otherReferenceData: YanexWidgetOtherDataStructure = {
        hoverBgHandled: false, // If the element's hover effects are already handled
        hoverFgHandled: false, // if the element's fg hover effects are already handled
        elementKeyUpEventHandled: false, // If keyup events for fillable elements are already handled
        elementKeyDownEventHandled: false // If keydown events for fillable elements are alread handled
    }

    private parent: YanexElement | null | HTMLBodyElement= null;

    // Flag for the select effect
    private selected: boolean = false;

    // The list of elements added in the element
    private elementInnerElems: YanexWidgetInnerElements = {};

    constructor(element: HTMLElement, 
        elemData: YanexWidgetElementData,
        options?: YanexWidgetOptions, 
        parent?: YanexElement | null | HTMLBodyElement
    ){
        this.element = element;
        this.options = options || null;
        this.parent = parent || null;

        this.setDefaultOptions();
        this.elementData = elemData;
        this.defaultElementData = structuredClone(elemData);
        
        this.setElementAttr();

        // Set element default behaviour
        if(this.options?.setDefaultBehaviour) {
            this.setDefaultElementBehaviour();
        } 

        // Add the a yanex id on the dataset of this element
        const yanexId = YanexWidgetsHelper.createYanexWidgetId();

        this.element.dataset[YanexWidgetRecords.yanexWidgetDataAttrName] = yanexId;

        // Save instance
        if(!YanexWidgetStorage.yanexWidgetReferences[this.constructor.name]) {
            YanexWidgetStorage.yanexWidgetReferences[this.constructor.name] = {}
        }
        const yanexTypeRefence = YanexWidgetStorage.yanexWidgetReferences[this.constructor.name];

        yanexTypeRefence[yanexId] = this
    }


    /**
     * Set the element's default attr
     */
    private setElementAttr(): void {
        if(this.elementData.text) {

            this.setElementText(this.elementData.text)
        }

        // Set element's class name
        let elemClasses: string = this.elementData.className || "";
        elemClasses += ` ${this.elementData.smClasses || ""}` ;
        elemClasses += ` ${this.elementData.mdClasses || ""}`;
        elemClasses += ` ${this.elementData.lgClasses|| ""}`;

        if(elemClasses !== "") this.element.className = elemClasses.trimEnd();


        if(this.element instanceof HTMLInputElement ||
            this.element instanceof HTMLTextAreaElement ||
            this.element instanceof HTMLSelectElement
            ) {
            if(this.elementData.value) {
                this.element.value = this.elementData.value
            }

            if(this.elementData.name) {
                this.element.name = this.elementData.name
            }

        }
        if(this.element instanceof HTMLInputElement ||
            this.element instanceof HTMLTextAreaElement
        ) {

            if(this.elementData.placeholder) {
                this.element.placeholder = this.elementData.placeholder
            }
        }

        if(this.elementData.type && 
            (this.element instanceof HTMLInputElement ||
            this.element instanceof HTMLButtonElement))
            this.element.type = this.elementData.type;

        // Default attr for button
        const dataSetName = this.elementData.dataSetName
        const dataSetValue = this.elementData.dataSetValue;

        if(dataSetName && dataSetValue) {
            this.element.dataset[dataSetName] = dataSetValue
        }

        // Set Inner HTML
        if(this.elementData.innerHTML){
            this.element.innerHTML = this.elementData.innerHTML
        }

        // Set id
        if(this.elementData.id){
            this.element.id = this.elementData.id
        }

        if(this.elementData.for) {
            (this.element as HTMLLabelElement).htmlFor = this.elementData.for;
            this.addElementClassName("hover:cursor-pointer")
        }

        // Options
        if(this.elementData.options && this.element instanceof HTMLSelectElement) {
            console.log(this.elementData.options)
            for(const [attr, value] of Object.entries(this.elementData.options)) {
                this.createOption(attr, value)
            }
        }

        if(this.elementData.autocomplete && (this.element instanceof HTMLInputElement ||
            this.element instanceof HTMLTextAreaElement ||
            this.element instanceof HTMLSelectElement ||
            this.element instanceof HTMLFormElement)
        ) {
            this.element.autocomplete = this.elementData.autocomplete;
        }
    }

    /**Set default options of the element */
    private setDefaultOptions(): void{
        const defaultOptions: YanexWidgetOptions = {
            setDefaultBehaviour: true,
            addHoverEffect: true,
            state: true,
            isClickable: false,
            textAlignment: "center"
        }
        if(!this.options) {
            this.options = {};
        }
        Object.assign(defaultOptions, this.options);
        this.options = defaultOptions;
    }

    private createOption(valueAttr: string, value: string): void {
        const option = document.createElement("option");
        option.value = valueAttr;
        option.text = value
        option.style.cursor = "pointer"
        option.classList = "cursor-pointer"

        this.element.appendChild(option)
    }
    
    /**
     * Adds a 
     * @param valueAttr The true value of the option.
     * @param value The value to be shown in the option
     */
    public addOptions(valueAttr: string, value: string): void {
        this.createOption(valueAttr, value);
        if(!this.elementData.options) {
            this.elementData.options = {}
        }
        this.elementData.options[valueAttr] = value;
    }

    private getTextAlignmentClasses(joiner: string = " "): string {
        const additionalClassname: Array<string> = [];

        switch (this.options!.textAlignment) {
            case "n":      // top center
                additionalClassname.push("items-start", "justify-center");
                break;

            case "nw":     // top left
                additionalClassname.push("items-start", "justify-start");
                break;

            case "ne":     // top right
                additionalClassname.push("items-start", "justify-end");
                break;

            case "s":      // bottom center
                additionalClassname.push("items-end", "justify-center");
                break;

            case "sw":     // bottom left
                additionalClassname.push("items-end", "justify-start");
                break;

            case "se":     // bottom right
                additionalClassname.push("items-end", "justify-end");
                break;

            case "w":      // middle left
                additionalClassname.push("items-center", "justify-start");
                break;

            case "e":      // middle right
                additionalClassname.push("items-center", "justify-end");
                break;

            case "center": // perfect middle
                additionalClassname.push("items-center", "justify-center");
                break;

            default:
                // fallback if undefined
                additionalClassname.push("items-center", "justify-center");
                break;
        }
        return additionalClassname.join(joiner);
    }

    /**
     * Gets the internal value of a yanex element.
     * If the value is 1, internal element was not yet created. Opposite if
     * the value is higher than 1.
     */
    private getInternavalue(): number {
        let internalValue = 1;
         if(this.options && this.options.isInternal) {
            internalValue = this.options.isInternal += 1;
        }
        return internalValue
    }

    /**
     * Adds a text content element 
     * @param textContent 
     */
    public setElementText(textContent: string): void {
        if(this.elementInnerElems.textElem) {
            this.elementInnerElems.textElem.text = textContent
        } else {
            const internalValue = this.getInternavalue();
            const textAlignment = this.getTextAlignmentClasses();

            if(internalValue === 1) {
                const sp = new YanexSpan(this, {
                    text: textContent,
                    className: `pointer-events-none px-2 ${textAlignment} flex`,
                    bg: null,
                    fg: this.elementData.fg
                }, {
                    isInternal: internalValue
                })
                this.elementInnerElems.textElem = sp;
            } else {
                this.widget.textContent = textContent
            }
        }
    }

    /**
     * Shows a spinning loading status
     * @param show If true, show. Otherwise, hide.
     * @param bg The bg for the spinning container
     */
    public showLoadingStatus(show: boolean = true,
                            bg: YanexWidgetBgThemeTypes = "specialColorBg"): void {
        if(this.elementInnerElems.loadingElem) {
            this.elementInnerElems.loadingElem.show();
        } else {
            const internalValue = this.getInternavalue();

            if(internalValue === 1) {
                const sp = new YanexSpan(this, {
                    className: `pointer-events-none inline-block animate-spin rounded w-[18px] h-[18px]`,
                    bg: bg
                }, {
                    isInternal: internalValue
                })
                this.elementInnerElems.loadingElem = sp;
            }
        }
    }

    private createIconElement(src: Base64URLString): void {
        const internalValue = this.getInternavalue();
        if(internalValue === 1) {

            const sp = new YanexImage(this, {
                className: `pointer-events-none inline-block h-auto w-auto object-contain outline-0 border-0
                min-w-[20px] min-h-[15px] max-h-[25px] max-w-[25px] rounded flex ml-2 animate-pulse items-center justify-center`,
                src: src,
                border: null
            }, {
                isInternal: internalValue,
                prepend: true
            })
            this.elementInnerElems.iconElem = sp;
            const parentRect = this.element.getBoundingClientRect();
            sp.widget.style.maxHeight = `${parentRect.height}px`

        } else {
            (this.element as HTMLImageElement).src = src
            }
    }

    /**
     * Adds an icon to the element. Only works on img elements
     * @param imageBase64 The image encoded in base64. If null, deletes the icon instead
     */
    public setIcon(imageBase64: Base64URLString | null = null): void {

        if(imageBase64) {
            
            if(this.elementInnerElems.iconElem) {
                
                if(this.elementInnerElems.iconElem.bg !== null) {
                    this.elementInnerElems.iconElem.bg = null
                }
                (this.elementInnerElems.iconElem.widget as HTMLImageElement).src = imageBase64;
                this.elementInnerElems.iconElem.removeElementClassName("animate-pulse")
            } else {
                
                this.createIconElement(imageBase64)
            }
        } else {
            if(this.elementInnerElems.iconElem) {
                this.elementInnerElems.iconElem.hide(true);
            }
        }

    }   

    /**
     * Sets the default behaviour of the button by adding tailwind css classes
     */
    public setDefaultElementBehaviour(){

        // Ignore setting the bg of this element if bg is null
        if(this.elementData.bg) {
            this.setElementBg(this.elementData.bg);
        }
        
        if(this.elementData.fg) {
            this.setElementFg(this.elementData.fg);
        }

        if(this.elementData.border) {
            this.setElementBorder(this.elementData.border)
        }

        if(this.options?.addHoverEffect || 
            this.elementData.hoverBg ||
            this.elementData.hoverFg
            
        ) {
            this.setElementHover()
        } 


        if(this.options?.state === false) {
            this.setState(false)
        }

        if(this.options?.isClickable) {
            this.setClickable(true)
        }
        
        if(this.options?.prepend && this.parent) {
            if(this.parent instanceof HTMLBodyElement) {
                this.parent.prepend(this.element)
            } else {
                this.parent.widget.prepend(this.element)
            }
        }
        if(this.element.classList.contains("overflow-y-auto")) {
            this.updateYScrollable()
        }

        if(this.options?.highlight === undefined || this.options.highlight === false){
            this.addElementClassName("no-select")
        }

        // Add keyup events when emptyValueBg or emptyValueBorder is defined
        if((this.element instanceof HTMLInputElement || this.element instanceof HTMLTextAreaElement) &&
             (this.elementData.emptyValueBg || this.elementData.emptyValueBorder)){
            this.initializeElementKeyUpEvents();
            this.setElementEmptyValueBehaviour();
        }

        // Add keydown events for fillable elements
        if(this.element instanceof HTMLInputElement ||
            this.element instanceof HTMLTextAreaElement
        ) {
            this.initializeElementKeyDownEvents()
        }

    }

    /**
     * Updates the scrollable of this element at Y Axis.
     */
    public updateYScrollable(): void {
        // auto calculate the max height for the container if the class list overflow-y-auto is present
        requestAnimationFrame(() => {
            const availableHeight = YanexWidgetCalculator.computeRemainingHeightWithinContainer(this.element)
            this.element.style.maxHeight = `${availableHeight || 0}px`;
            // this.element.style.height = `${availableHeight || 0}px`;
        })
        
    }

    /**
     * Adds a pointer event at the element 
     * @param clickable True if is clickable. False otherwise.
     */
    public setClickable(clickable: boolean): void {
        if(clickable) {
            this.addElementClassName("hover:cursor-pointer")
        } else {
            this.removeElementClassName("hovercursor-pointer")
        }

        if(this.options) {
            this.options.isClickable = clickable
        }
    }

    /**
     * Initialize the keyup events for this element
     * @returns 
     */
    private initializeElementKeyUpEvents(): void {
        if(this.otherReferenceData.elementKeyUpEventHandled) return;
        this.addEventListener("keyup", (event) => {this.addElementKeyEvents(event)})
        this.otherReferenceData.elementKeyUpEventHandled = true;
    }

    /**
     * Initialize the keydown events for this element
     */
    private initializeElementKeyDownEvents(): void {
        if(this.otherReferenceData.elementKeyDownEventHandled) return;
        this.addEventListener("keydown", (event) => {this.addElementKeyEvents(event)})
    }

    private setElementEmptyValueBehaviour(): void {
         const element = this.element as HTMLInputElement | HTMLTextAreaElement;

        // Set element's bg if value is empty
        if(this.elementData.emptyValueBg) {
            if(element.value === "") {
                this.setElementBg(this.elementData.emptyValueBg);
            } else {
                this.setElementBg();
            }
        }

        // Set element's border if value is empty
        if(this.elementData.emptyValueBorder) {
            if(element.value === "") {
                this.addElementClassName("border-[1px]")
                this.setElementBorder(this.elementData.emptyValueBorder)
            } else {
                this.removeElementClassName("border-[1px]");
                this.setElementBorder()
            }
        }
    }

    /**Add Element key events */
    private addElementKeyEvents(e: KeyboardEvent) {

        if(this.state === false) return;

        switch(e.type) {
            case "keyup":
                this.setElementEmptyValueBehaviour()
                break;
        }

       
    }

    /**
     * Handle click events 
     */
    private handleClickEvents(): void {
        if(this.status === "selected"){
            this.setHoveredInEffect()
        } else if (this.status === "none") {
            if(
                this.elementData.selectBg ||
                this.elementData.selectFg ||
                this.elementData.selectBorder
            ) {
                this.setSelectEffect();
            } else {
                this.setHoveredOutEffect()

            }
        }
    }

    /**
     * Set the element's select effects
     */
    private setSelectEffect(): void {
        if(this.options && this.options.selectFlickerEffect) {
            if(this.elementData.selectBg) {
                this.setElementBg(this.defaultElementData.selectBg)
                this.setElementBg(this.defaultElementData.bg)
            }

            
            if(this.elementData.selectFg) {
                this.setElementFg(this.defaultElementData.selectFg)
                this.setElementFg(this.defaultElementData.fg)
            }

            if(this.elementData.selectBorder) {
                this.setElementBorder(this.defaultElementData.selectBorder)
                this.setElementBorder(this.defaultElementData.border)
            }
        } else {
            if(this.selected) {
                this.select()
            } else {
                this.deselect()
            }
        }
    }

    /**
     * Set this element as selected based on the given select states
     * @param force Forces the button to be selected regardless of its current state
     */
    public select(force: boolean = false): void {
        if(this.selected === false || force) {
            this.setElementBg(this.elementData.selectBg)
            this.setElementFg(this.elementData.selectFg)
            this.setElementBorder(this.elementData.selectBorder)
            this.selected = true
        }
    }

    /**
     * Set this element as deselected based on the given default states
    * @param force Forces the button to be selected regardless of its current state
     */
    public deselect(force: boolean = false): void {
        if(this.selected || force) {
            this.setElementBg(this.defaultElementData.bg)
            this.setElementFg(this.defaultElementData.fg)
            this.setElementBorder(this.defaultElementData.border)
            this.selected = false
        }
    }
    

    /**
     * Set the hover state of the element. Works only if its state is true
     * @param event 
     */
    private setHoveredInEffect(): void {
        if (this.selected) return;

        // Handle element bg hover in effect 
        if(this.elementData.hoverBg) {
            // Automatically set the hover effect of this element based on the element's states
            if(this.status === "selected") {
                // Element is selected
                this.setElementBg("lighterSpecialColorBg")
            } else if(this.status === "none") {
                // Hover Bg Effect
                if(this.defaultElementData.hoverBg) {
                    this.setElementBg(this.defaultElementData.hoverBg)
                } else{
                    const nextColor = YanexThemeHelper.getNextBgColorInLine(this.defaultElementData.bg || "defaultBg");
                    this.setElementBg(nextColor)
                }
            }
        }

        // Handle element fg hover in effect
        if(this.elementData.hoverFg) {
            // Automatically set the hover effect of this element based on the element's states
            if(this.status === "selected") {
                // Element is selected
                this.setElementFg("lighterSpecialColorFg")
            } else if(this.status === "none") {
                if(this.defaultElementData.hoverFg) {
                    this.setElementFg(this.defaultElementData.hoverFg)
                } else{
                    const nextColor = YanexThemeHelper.getNextFgColorInLine(this.defaultElementData.fg || "defaultFg");
                    this.setElementFg(nextColor)
                }
            }
        }
         // Handle element border hover in effect
        if(this.elementData.hoverBorder) {
            // Automatically set the hover effect of this element based on the element's states
            if(this.status === "selected") {
                // Element is selected
                this.setElementBorder("lighterSpecialColorBorder")
            } else if(this.status === "none") {
                if(this.defaultElementData.hoverBorder) {
                    this.setElementBorder(this.defaultElementData.hoverBorder)
                } else{
                    const nextColor = YanexThemeHelper.getNextBorderColorInLine(this.defaultElementData.border || "defaultBorder");
                    this.setElementBorder(nextColor)
                }
            }
        }
      
        this.addElementClassName("cursor-pointer")
    }

    /**
     * Set the hover out state of the element. Works only if the element's state is none
     */
    private setHoveredOutEffect(): void {
        if (this.selected) return;
        if(this.elementData.hoverBg) {
            // Automatically set the hover effect of this element based on the element's states
            if(this.status === "selected") {
                // Element is selected
                this.setElementBg("specialColorBg")
                
            } else if (this.status === "none") {
                this.setElementBg(this.defaultElementData.bg || "defaultBg")
            }
        }

        if(this.elementData.hoverFg) {
            // Automatically set the hover effect of this element based on the element's states
            if(this.status === "selected") {
                // Element is selected
                this.setElementFg("specialColorFg")
                
            } else if (this.status === "none") {
                this.setElementFg(this.defaultElementData.fg || "defaultFg")
            } 
        }

        if(this.elementData.hoverBorder) {
            // Automatically set the hover effect of this element based on the element's states
            if(this.status === "selected") {
                // Element is selected
                this.setElementBorder("specialColorBorder")
                
            } else if (this.status === "none") {
                this.setElementBorder(this.defaultElementData.border )
            } 
        }
         this.removeElementClassName("cursor-none")
    }

    /**
     * The handler for the mouse in/out event of this element
     */
    private handleHoverInOut(event: MouseEvent): void{
        if(this.options?.disableHoverIfStateIsFalse) {
            if(this.state === false) return;
        }
        switch(event.type) {
            case "mouseenter":
                this.setHoveredInEffect();
                break;
            case "mouseleave":
                this.setHoveredOutEffect();
                break;
        }

    }
    
    /**
     * Set the element's bg when hovered
     * @param color The color to be applied when hovering. If null, it would apply the default color.
     */
    public setElementHover() {

        // Handle mouse in/out effect
        if(this.otherReferenceData.hoverBgHandled === false) {
            // Add transition if not yet added
            this.addElementClassName("transition")
            this.addEventListener("mouseenter", (e) => {this.handleHoverInOut(e)});
            this.addEventListener("mouseleave", (e) => {this.handleHoverInOut(e)});
            this.otherReferenceData.hoverBgHandled = true
        }
    }

    
    /**
     * Set the element's foreground color
     * @param color The color to be applied. If null, it would apply the original fg
     */
    public setElementFg(color: YanexWidgetFgThemeTypes | null = null){
        let fgColor = color
        if(color === null) {
            fgColor = this.defaultElementData.fg || null
        }
        
        // Set the fg of elements who does not support textContents (e.g input and textarea)
        if(!this.elementInnerElems.textElem) {
            this.addElementClassName(fgTheme[fgColor || "defaultFg"])

            return
        };


        // Remove the current fg color applied to the element
        const currentFg = this.elementData.fg;

        
        if(currentFg) {
            this.elementInnerElems.textElem.removeElementClassName(fgTheme[currentFg])
            // this.element.classList.remove(fgTheme[currentFg]);
        }
        // Remove the default fg too if present
        const defaultFg = this.defaultElementData.fg;
        if(defaultFg) {
            this.elementInnerElems.textElem.removeElementClassName(fgTheme[defaultFg])
            // this.element.classList.remove(fgTheme[defaultFg])
        }

        if(fgColor) {
            // this.element.classList.add(finalFgColor)
            this.elementInnerElems.textElem.addElementClassName(fgTheme[fgColor])
        }
        this.elementData.fg = color;
    }

    /**
     * Sets this element's border color
     * @param color The color to be shown. If null, uses the default border instead. If void, sets the border to transaparent.
     */
    public setElementBorder(color: YanexWidgetBorderThemeTypes | null | "void" = null) {
        let borderColor = color

        if(color === null) {
            borderColor = this.defaultElementData.border || null
        }

        if(borderColor === "void") {
            this.elementData["border"] = null;
            return;
        }


        // Remove the current fg color applied to the element
        const currentBorder = this.elementData.border;
        if(currentBorder) {
            this.element.classList.remove(borderTheme[currentBorder]);
        }

        // Remove the default border too if present
        const defaultBorder = this.defaultElementData.border;
        if(defaultBorder) {
            this.element.classList.remove(borderTheme[defaultBorder])
        }

        if(borderColor) {
            const finalBorderColor = borderTheme[borderColor]
            this.element.classList.add(finalBorderColor)
        }
        this.elementData.border = borderColor;
    }

    /**
     * Set the element's background color.
     * @param color The color to be applied. If null, it would apply the default bg. If void, removes the backgroud color
     */
    public setElementBg(color: YanexWidgetBgThemeTypes | null | "void" = null){
        // Remove the current bg color applied to the element
        const currentBg = this.elementData.bg;
        const defaultBg = this.defaultElementData.bg;

        if(color !== null) {
            if(currentBg) {
                this.element.classList.remove(bgTheme[currentBg])
            }
            // Remove the default bg too if present
            if(defaultBg) {
                this.element.classList.remove(bgTheme[defaultBg])
            }
        }

        if(color === "void") {
            this.elementData["bg"] = null
            return
        }
        if(color) {
            const newColor = bgTheme[color]

            this.element.classList.add(newColor)
            this.elementData.bg = color

        } else {
            const origColor = this.defaultElementData.bg;
            if(origColor) {
                this.element.classList.add(bgTheme[origColor])
            }
            if(this.elementData.bg) {
                this.element.classList.remove(bgTheme[this.elementData.bg]);
            }
        }
    }

    /**
     * Add a class to an element
     * @param className The classnames to be added. Either a string or an array of string.
     */
    public addElementClassName(className: Array<string> | string) {
        if(typeof className === "string") {
            className = [className]
        }
        this.element.classList.add(...className)

    }

    public removeElementClassName(className: Array<string> | string): void {
        if(typeof className === "string") {
            className = [className]
        }
        this.element.classList.remove(...className)
    }


    /**Append a child node to this element */
    public  appendChild(child: YanexElement | HTMLElement): void {
        if(child instanceof BaseClass) {
            child = child.widget
        }

        this.element.appendChild(child)
    }

    /**
     * Show the element
     */
    public show(updateScrollable: boolean = false): void {
        this.element.classList.remove("hidden");
        if(updateScrollable) {
            this.updateYScrollable()
        }
    }

    /**
     * Hide the element
     * @param del If true, delete the yanex element. Hid it otherwise.
     */
    public hide(del: boolean = false): void {

        if(del) {
            // Remove the yanex reference. Prevent memory leak
            YanexWidgetsHelper.deleteYanexElement(this.element)
            
        } else {
            this.element.classList.add("hidden")
        }
    }

    /**
     * Disables child elements
     * @param elements The elements to be disabled
     * @param state The state for the elements
     */
    public setElementsState(elements: YanexDisableElements | Array<YanexDisableElements>, state: boolean) {
        if(!Array.isArray(elements)) {
            elements = [elements]
        }
        const cleanedElements =[];

        for(const element of elements) {
            cleanedElements.push(element.replace("Yanex", "").toLowerCase())
        }
        const queriedElements = this.element.querySelectorAll(cleanedElements.join(","))
        for(const elem of queriedElements) {
            // Get element yanex reference
            const yanexId = YanexWidgetsHelper.getYanexWidgetId(elem as HTMLElement);
            if(yanexId){
            
                const yanexRef = YanexWidgetsHelper.getYanexWidgetReference(yanexId)
                if(yanexRef) {
                    yanexRef.setState(state)
                }
            }
        }
    }

    /**
     * Set the elements state to enabled (true) or disabled (false)
     * @param state The state of the element
     */
    public setState(state: boolean): void {
        if(this.options?.state !== undefined && this.options?.state !== null) {
            this.options.state = state;
            if(state) {
        
                this.setElementBg()
                this.setElementFg()
                this.element.classList.remove("hover:cursor-not-allowed")                

                if(this.isSelected) {
                    this.select(true)
                }

            } else {
                this.setElementBg("disabledColorBg")
                this.setElementFg("disabledColorFg")
                this.element.classList.add("hover:cursor-not-allowed")
            }
        }
    }

    /**
     * Configures the yanex element's attributes
     * @param config The configuration settings
     */
    public configure(config: YanexWidgetElementData): void {
        Object.assign(this.elementData, config);
        Object.assign(this.defaultElementData, config);
        this.setDefaultElementBehaviour();
    }

    /**
     * Clear fields under this element
     * @param fieldTypes The widget type/s. 
     */
    public clearFields(fieldTypes: YanexFieldWidgets | Array<YanexFieldWidgets> = "YanexInput"): void {
        if(!Array.isArray(fieldTypes)) {
            fieldTypes = [fieldTypes]
        }

         const cleanedTypes =[];

        for(const element of fieldTypes) {
            cleanedTypes.push(element.replace("Yanex", "").toLowerCase())
        }

        const queriedElements = this.element.querySelectorAll(cleanedTypes.join(","))
        for(const elem of queriedElements) {
            (elem as HTMLInputElement | HTMLTextAreaElement).value = ""
        }
    }

    /**
     * Add event listener. It is recommended to add listeners here when using Yanex Widgets.
     * @param event The event type
     * @param callback Callback function
     */
    public addEventListener<K extends keyof HTMLElementEventMap>(
        event: K,
        callback: (e: HTMLElementEventMap[K]) => any
    ): void {
        
        this.element.addEventListener(event, (e) => this.handleEvent(e, callback));
    }

    /**
     * Handle fired events — only calls callback if state is active
     */
    private handleEvent<K extends keyof HTMLElementEventMap>(
        e: HTMLElementEventMap[K],
        callback: (e: HTMLElementEventMap[K]) => any
    ): void {
        if (this.options?.state === false) {
            if(["keydown", "keyup"].includes(e.type)) {
                e.preventDefault()
            }
            return;
        }; 

        switch (e.type) {
            case "click":
                this.handleClickEvents()
                break;
        }
        callback(e);
    }

   /**
     * Sets the status of the Yanex widget.
     * @param status The status to be set.
     * @param mutateToChildElement Determines whether to apply the effect to child elements.
     *  - "shallow" → mutate only the first-level children
     *  - "deep" → mutate all descendants recursively
     *  - null → no mutation
     * @param fgMutation Mutate effects to fg 
     * @param bgMutation Mutate effects to bg
     */
    public setStatus(
        status: YanexWidgetStatus,
        mutateToChildElement: "shallow" | "deep" | null = null,
        fgMutation: boolean = true,
        bgMutation: boolean = true
    ): void {


        // Helper function for applying status to a YanexElement
        const applyStatusToElement = (yanex: YanexElement) => {
            switch (status) {
            case "selected":
                if(bgMutation && yanex || yanex === this) {
                    yanex.setElementBg("specialColorBg");

                }

                if (fgMutation && yanex instanceof YanexHeading || yanex === this) {
                    yanex.setElementFg("contrastFg")
                    }

                break;

            case "none":
                if(bgMutation && yanex || yanex === this) {
                    yanex.setElementBg(yanex.defaultElementData.bg)
                }

                if (fgMutation && yanex instanceof YanexHeading || yanex === this) {

                    yanex.setElementFg(yanex.defaultElementData.fg)
                }
                break;
            }

            yanex.elementData.status = status
        };

        // Apply to current element first
        applyStatusToElement(this);

        // Handle child mutation
        if (mutateToChildElement) {
            const applyToChildren = (elements: YanexElement[], deep: boolean) => {
            for (const yanex of elements) {
                applyStatusToElement(yanex);
                if (deep) {
                const children = yanex.getChildren();
                if (children.length > 0) {
                    applyToChildren(children, true);
                }
                }
            }
            };

            const directChildren = this.getChildren();
            const deep = mutateToChildElement === "deep";
            applyToChildren(directChildren, deep);
        }

        // Update internal state
        this.elementData.status = status;
    }

    /**
     * Adds a classnmae directly at the text element of this element. Ignores if there's no text
     * @param classValue The class value to be added (in tailwind form)
     */
    public addTextClass(classValue: string | Array<string>): void {
        if(!this.elementInnerElems.textElem) return;
        this.elementInnerElems.textElem.addElementClassName(classValue)
    }

    /**
     * Get yanex elements from an element
     * @param selectors The yanex type
     * @param standardQuery If true, uses the original querySelectorAll function of javascript instead
     * @returns Array of YanexElements
     */
    public querySelectorAll<K extends keyof YanexElementsMap>(selectors: K | string, 
        standardQuery: boolean = false): Array<YanexElementsMap[K]> {
        
        if(standardQuery) {
            const elems = this.element.querySelectorAll(selectors);
            const returnVal: Array<YanexElementsMap[K]> = [];

            for(const elem of elems){
                if(elem && elem instanceof HTMLElement){
                    const yanexRef = YanexWidgetsHelper.getYanexReference(elem);
                    if(yanexRef) {
                        returnVal.push(yanexRef)

                    }
                }
            }
            return returnVal
        } else {
            const elements = this.element.querySelectorAll(selectors.replace("yanex", "").toLowerCase());
            const returnVal: Array<YanexElementsMap[K]> = [];
            
            for(const elem of elements) {
                if(elem instanceof HTMLElement) {
                    const yanex = YanexWidgetsHelper.getYanexReference(elem);
                    if(yanex) {
                        returnVal.push(yanex)
                    }
                }
            }
            return returnVal
        }
    }


    /**
     * Query select the first yanex element
     */
    public querySelector<K extends keyof YanexElementsMap>(selector: K): YanexElement | null{
        const element = this.element.querySelector(selector.replace("yanex", "").toLowerCase());
        if(element) {
            if(element instanceof HTMLElement) {
                const yanex = YanexWidgetsHelper.getYanexReference(element);
                if(yanex) return yanex;
            }
        }
        return null;
    }

    /**
     * Get the children of an element
     * @return Array of the yanex reference
     */
    public getChildren(): Array<YanexElement> {
        const childs = this.element.children;
        const returnVal: Array<YanexElement> = [];

        for(const child of childs) {
            if(child instanceof HTMLElement) {
                const yanex = YanexWidgetsHelper.getYanexReference(child);

                if(yanex) {
                    returnVal.push(yanex)
                }
            }
        }

        return returnVal;
    }

    /**
     * Add additional dataset for this widget
     * @param title The title of the dataset (in camelcase)
     * @param value The value of the dataset
     */
    public addDataset(title: string, value: string): void {
        this.element.dataset[title] = value;

        // Check if the init data of yanex has dataset title for icons
        if(YanexWidgetStorage.yanexInitData.imageDatasetIconTitle) {

            if(title === YanexWidgetStorage.yanexInitData.imageDatasetIconTitle) {
                this.createIconElement("")
                if(this.elementInnerElems.iconElem) {
                    // Set bg for it to be visible
                    this.elementInnerElems.iconElem.addElementClassName("animate-pulse")
                    const currentBg = this.elementInnerElems.iconElem.bg;
                    const nextBg = YanexThemeHelper.getNextBgColorInLine(currentBg);
                    this.elementInnerElems.iconElem.setElementBg(nextBg)
                }
            }
        }
    }

    /**
     * Gets the value of the dataset of the yanex element
     * @param title The title of the dataset
     */
    public getDataset(title: string): string | null {
        const datasetValue = this.element.dataset[title];
        if(datasetValue) return datasetValue;
        return null
    }

    /**Clears the inner html of this element */
    public clearChildren(): void {
        for(const child of this.element.children) {
            const yanex = YanexWidgetsHelper.getYanexReference(child as HTMLElement);
            if(yanex) {
                yanex.hide(true)
            }
        }
        this.element.innerHTML = ""
    }


    // ------------------------------- GETTERS ------------------------------
    /**
     * Get the created element
     */
    public get widget(): HTMLElement {
        return this.element;
    }

    /**
     * Get the status of the widget
     */
    public get status(): YanexWidgetStatus {
        return this.elementData.status || "none"
    }

    public get state(): boolean {
        if(this.options && (this.options.state !== undefined && this.options.state !== null)) {
            return this.options.state;
        }
        return true
    }

    /**
     * Get the dataset value
     */
    public get dataSet(): string | null{
        if(this.elementData.dataSetValue){
            return this.elementData.dataSetValue
        }
        return null
    }

    /**
     * Get the text content of the element
     */
    public get text(): string {
        return this.element.textContent;
    }

    /**
     * Get the value. Returns null if element is not an input or texarea
     */
    public get value(): string | null {
        if(this.element instanceof HTMLInputElement ||
            this.element instanceof HTMLTextAreaElement
        ){
            return this.element.value
        }
        return null
    }

    /**
     * Get the yanex id
     */
    public get yanexId(): string {
        return this.element.dataset[YanexWidgetRecords.yanexWidgetDataAttrName] || ""
    }

    /**
     * Get the select state
     */
    public get isSelected(): boolean {
        return this.selected
    }

    /**
     * Get the element's current bg
     */
    public get bg(): YanexWidgetBgThemeTypes | null {
        return this.elementData.bg || null
    }

    /**
     * True if this element is hidden. Otherwise, false
     */
    public get isHidden(): boolean {
        if(this.element.classList.contains("hidden")) {
            return true
        }
        return false
    }

    // -------------------------------------------------    SETTERS ---------------------
    /**
     * Set the text content of the element
     */
    public set text(txt: string | number) {
        if(typeof txt === "number") {
            txt = txt.toString();
        }
        this.setElementText(txt)
        this.elementData.text = txt
    }

    /**
     * Set value
     */
    public set value(value: string) {
        if(this.element instanceof HTMLInputElement ||
            this.element instanceof HTMLTextAreaElement ||
            this.element instanceof HTMLSelectElement
        ) {
            this.element.value = value
        }
        this.setElementEmptyValueBehaviour();
    }

    /**
     * Set dataset
     */
    public set dataset(value: string) {
        if(this.elementData.dataSetName) {
            this.element.dataset[this.elementData.dataSetName] = value;
            this.elementData.dataSetValue = value
        }
    }

    /**
     * Set the src of an image
     */
    public set src(value: string) {
        if(this.element instanceof HTMLImageElement) {
            this.element.src = value
        }
    }

    /**
     * Set the hover bg effect for this widget
     */
    public set hoverBg(value: YanexWidgetBgThemeTypes) {
        this.defaultElementData["hoverBg"] = value
        this.elementData["hoverBg"] = value
        this.setElementHover()
    }

    /**
     * Set the hover fg effect for this widget
     */
    public set hoverFg(value: YanexWidgetFgThemeTypes) {
        this.defaultElementData["hoverFg"] = value;
        this.elementData["hoverFg"] = value;
        this.setElementHover()
    }

    /**
     * Set the select state of the element
     */
    public set setSelect(value: boolean) {
        if(value) {
            this.select()
        } else {
            this.deselect()
        }
    }

    /**
     * Set the bg of the element
     */
    public set bg(value: YanexWidgetBgThemeTypes | null) {
        if(value) {
            this.setElementBg(value);

            this.defaultElementData["bg"] = value
        } else {
            this.setElementBg("void")
            this.defaultElementData["bg"] = value
        }

    }

    /**
     * Set the state of the element
     * @param value The state for the element
     */
    public set state(value: boolean) {
        this.setState(value)
    }
}

export class YanexSpan extends BaseClass{
    
    /**
     * Create a new span element
     */
    constructor(parent?: YanexElement | null, 
            elementData?: YanexWidgetElementData,
            options?: YanexWidgetOptions,

        ) 
    {

        const button = document.createElement("span");
        
        if(parent) {
            parent.appendChild(button);
        }

        // Set default element data for this element
        const defaultElementData: YanexWidgetElementData = {
            bg: "defaultBg",
            fg: "defaultFg",
            hoverBg: null
        }

        if(elementData) {
            Object.assign(defaultElementData, elementData)
        }
        super(button, defaultElementData, options, parent || null)
    }
}

export class YanexButton extends BaseClass {


    /**
     * Create a new button element.
     */
    constructor(parent?: YanexElement | null, 
                elementData?: YanexWidgetElementData,
                options?: YanexWidgetOptions,

            ) 
        {
        if(options && options.isInternal &&
            options.isInternal >= 2
        ) {
            return
        }


        const button = document.createElement("button");
        
        if(parent) {
            parent.appendChild(button);

        }

        // Set default element data for this element
        const defaultElementData: YanexWidgetElementData = {
            bg: "defaultBg",
            fg: "defaultFg",
            hoverBg: null
        }

        if(elementData) {
            Object.assign(defaultElementData, elementData)

        }

        super(button, defaultElementData, options, parent || null)
    }

}


export class YanexDiv extends BaseClass {
    
    /**
     * Create a new div element
     */
    constructor(parent?: YanexElement | null | HTMLBodyElement, 
                elementData?: YanexWidgetElementData,
                options?: YanexWidgetOptions,

            ) 
        {
        if(options && options.isInternal &&
            options.isInternal >= 2
        ) {
            return
        }

        const element = document.createElement("div");

        if(parent) {
            parent.appendChild(element);

        }

        // Set default options for a div
        const defaultElementBehaviour: YanexWidgetOptions = {
            addHoverEffect: false
        }

        if(options) {
            Object.assign(defaultElementBehaviour, options)
        }

        // Set default element data for this element
        const defaultElementData: YanexWidgetElementData = {
            bg: "defaultBg",
            fg: null,
            hoverBg: null
        }
        if(elementData) {
            Object.assign(defaultElementData, elementData)
        }
        super(element, defaultElementData, defaultElementBehaviour, parent || null);
    }
}

export class YanexHeading extends BaseClass{
    
    /**
     * Create a new heading element
     * @param heading The heading element to be created
     */
    constructor(parent?: YanexElement | null,
        headingType: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h1",
        elementData?: YanexWidgetElementData,
        options?: YanexWidgetOptions,
    ) {
        if(options && options.isInternal &&
            options.isInternal >= 2
        ) {
            return
        }

        const headingElem = document.createElement(headingType);
        
        if(parent) {
            parent.appendChild(headingElem);

        }

         // Set default options for the heading elements
        const defaultElementBehaviour: YanexWidgetOptions = {
            addHoverEffect: false
        }
        if(options){
            Object.assign(defaultElementBehaviour, options);

        }

        // Set default element data for this element
        const defaultElementData: YanexWidgetElementData = {
            bg: null,
            fg: "defaultFg",
            hoverBg: null,
            text:""
        }

        if(elementData) {
            Object.assign(defaultElementData, elementData)
        }
        super(headingElem, defaultElementData,  defaultElementBehaviour, parent || null);

    }
}

export class YanexLabel extends BaseClass{
    
    /**
     * Create a new heading element
     * @param heading The heading element to be created
     */
    constructor(parent?: YanexElement | null,
        elementData?: YanexWidgetElementData,
        options?: YanexWidgetOptions,
    ) {
        if(options && options.isInternal &&
            options.isInternal >= 2
        ) {
            return
        }

        const headingElem = document.createElement("label");
        
        if(parent) {
            parent.appendChild(headingElem);

        }

         // Set default options for the heading elements
        const defaultElementBehaviour: YanexWidgetOptions = {
            addHoverEffect: false
        }
        if(options){
            Object.assign(defaultElementBehaviour, options);

        }

        // Set default element data for this element
        const defaultElementData: YanexWidgetElementData = {
            bg: null,
            fg: "defaultFg",
            hoverBg: null,
            text:""
        }

        if(elementData) {
            Object.assign(defaultElementData, elementData)
        }
        super(headingElem, defaultElementData,  defaultElementBehaviour, parent || null);
    }
}

export class YanexForm extends BaseClass{
    /**
     * Create a new div element
     */
    constructor(parent: YanexElement | null, 
                elementData?: YanexWidgetElementData,
                options?: YanexWidgetOptions,

            ) 
        {
        if(options && options.isInternal &&
            options.isInternal >= 2
        ) {
            return
        }

        const element = document.createElement("form");
        if(parent) {
            parent.appendChild(element)
        }

        // Set default options for a div
        const defaultElementBehaviour: YanexWidgetOptions = {
            addHoverEffect: false
        }

        if(options) {
            Object.assign(defaultElementBehaviour, options)
        }

        // Set default element data for this element
        const defaultElementData: YanexWidgetElementData = {
            bg: "defaultBg",
            fg: null,
            hoverBg: null
        }
        if(elementData) {
            Object.assign(defaultElementData, elementData)
        }

        super(element, defaultElementData, defaultElementBehaviour, parent || null);
    }
}

export class YanexInput extends BaseClass{
    /**
     * Create a new div element
     */
    constructor(parent:YanexElement | null, 
                elementData?: YanexWidgetElementData,
                options?: YanexWidgetOptions | YanexInputExclusiveOptions,

            ) 
        {
        if(options && 
            "isInternal" in options &&
            options.isInternal &&
            options.isInternal >= 2
        ) {
            return
        }

        const button = document.createElement("input");
        
        if(parent)parent.appendChild(button);

        // Set default options for a div
        const defaultElementBehaviour: YanexWidgetOptions = {
            addHoverEffect: false
        }

        if(options) {
            Object.assign(defaultElementBehaviour, options)
        }

        // Set default element data for this element
        const defaultElementData: YanexWidgetElementData = {
            bg: "defaultBg",
            fg: "defaultFg",
        }
        if(elementData) {
            Object.assign(defaultElementData, elementData);

        }

        super(button, defaultElementData, defaultElementBehaviour, parent || null);

        if(this.elementData && this.elementData.accept) {
            (this.element as HTMLInputElement).accept = this.elementData.accept
        }
        

    }
}

export class YanexDialog extends BaseClass {
    /**
     * Create a new dialog element
     */
    constructor(parent?: YanexElement | null | HTMLBodyElement, 
                elementData?: YanexWidgetElementData,
                options?: YanexWidgetOptions,

            )
        {
        if(options && options.isInternal &&
            options.isInternal >= 2
        ) {
            return
        }

        const element = document.createElement("dialog");

        if(parent) {
            parent.appendChild(element);

        }

        // Set default options for a div
        const defaultElementBehaviour: YanexWidgetOptions = {
            addHoverEffect: false
        }

        if(options) {
            Object.assign(defaultElementBehaviour, options)
        }

        // Set default element data for this element
        const defaultElementData: YanexWidgetElementData = {
            bg: "defaultBg",
            fg: null,
            hoverBg: null
        }
        if(elementData) {
            Object.assign(defaultElementData, elementData)
        }
        super(element, defaultElementData, defaultElementBehaviour, parent || null);
    }
}

export class YanexImage extends BaseClass {
        /**
     * Create a new image element
     */
    constructor(parent?: YanexElement | null, 
                elementData?: YanexWidgetElementData,
                options?: YanexWidgetOptions,
            )
        {
        if(options && options.isInternal &&
            options.isInternal >= 2
        ) {
            return
        }

        const element = document.createElement("img");

        if(parent) {
            parent.appendChild(element);

        }

        // Set default options for a div
        const defaultElementBehaviour: YanexWidgetOptions = {
            addHoverEffect: false
        }

        if(options) {
            Object.assign(defaultElementBehaviour, options)
        }

        // Set default element data for this element
        const defaultElementData: YanexWidgetElementData = {
            bg: "defaultBg",
            fg: null,
            hoverBg: null
        }
        if(elementData) {
            Object.assign(defaultElementData, elementData)
        }
        
        super(element, defaultElementData, defaultElementBehaviour, parent || null);

        // Add additional data exclusive for image element
        if(elementData?.src){
            if(this.options && this.options.isInternal) {
                this.setIcon(elementData.src)
            } else {
                (this.element as HTMLImageElement).src = elementData.src
            }
            // (this.element as HTMLImageElement).src = elementData.src
        }
        element.alt = ""
        if(this.elementData.alt) {
            element.alt = this.elementData.alt
        }

    }

}

export class YanexTextArea extends BaseClass {
    /**
     * Create a new textarea element
     */
    constructor(parent?: YanexElement | null, 
                elementData?: YanexWidgetElementData,
                options?: YanexWidgetOptions,
            )
        {
        if(options && options.isInternal &&
            options.isInternal >= 2
        ) {
            return
        }

        const element = document.createElement("textarea");

        if(parent) {
            parent.appendChild(element);

        }

        // Set default options for a div
        const defaultElementBehaviour: YanexWidgetOptions = {
            addHoverEffect: false
        }

        if(options) {
            Object.assign(defaultElementBehaviour, options)
        }

        // Set default element data for this element
        const defaultElementData: YanexWidgetElementData= {
            bg: "defaultBg",
            fg: "defaultFg",
            hoverBg: null,
            rows: 6
        }
        if(elementData) {
            Object.assign(defaultElementData, elementData)
        }
        
        super(element, defaultElementData, defaultElementBehaviour, parent || null);
        if(this.elementData && this.elementData.rows) {
            (this.element as HTMLTextAreaElement).rows = this.elementData.rows
        }
    }
}

export class YanexSelect extends BaseClass {
    /**
     * Create a new textarea element
     */
    constructor(parent?: YanexElement | null, 
                elementData?: YanexWidgetElementData,
                options?: YanexWidgetOptions,
            )
        {
        if(options && options.isInternal &&
            options.isInternal >= 2
        ) {
            return
        }

        const element = document.createElement("select");

        if(parent) {
            parent.appendChild(element);

        }

        // Set default options for a div
        const defaultElementBehaviour: YanexWidgetOptions = {
            addHoverEffect: false
        }

        if(options) {
            Object.assign(defaultElementBehaviour, options)
        }

        // Set default element data for this element
        const defaultElementData: YanexWidgetElementData= {
            bg: "defaultBg",
            fg: "defaultFg",
            hoverBg: null,
            rows: 6
        }
        if(elementData) {
            Object.assign(defaultElementData, elementData)
        }
        
        super(element, defaultElementData, defaultElementBehaviour, parent || null);
        if(this.elementData && this.elementData.rows) {
            (this.element as HTMLTextAreaElement).rows = this.elementData.rows
        }
    }
}

export type YanexElement = BaseClass;
