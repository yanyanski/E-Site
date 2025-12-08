import { ButtonicModalCreatedButtonStructure, ButtonicModalUpdateButtonStructure, MessageModalPassedParam, ModalAtClickAdditionalData, ModalAtClickPassedParam, ModalButtonContentParamStructure} from "./interfaces";
import { CustomModalButtonLayout, ElementStates, SizeTypes, TCSSColors } from "./typing";
import { PublicIconLinkCollaterUtility } from "./utilities";

import { ModalButtons } from "./typing";
import { Dict } from "./datatypeHelpers";
import { YanexButton, YanexDialog, YanexDiv, YanexHeading } from "./widgets/yanexWidgets";

/**
 * Shows a message modal
 */
export class MessageModals {

    private message: string;
    private buttons: ModalButtons | null;
    private modalElement!: YanexDiv;
    private onClose?: (action: MessageModalPassedParam) => void | Promise<void>;
    private modalData: MessageModalPassedParam;
    private modalContent: YanexDiv | null = null;

    constructor(message: string, buttons?: ModalButtons, onClose?: (action: MessageModalPassedParam) => void) {
        this.message = message;
        
        this.buttons = buttons || null;

        this.modalData = {
            actionPressed: "",
            actionValue: false
        }

        this.onClose = onClose;

        this.createModal();
    }

    private createModal() {
        const modal = new YanexDiv(document.body, {
        className: "fixed inset-0 flex items-center justify-center bg-black/50 z-[999999]"
        });
        // Content container
        const modalContent = new YanexDiv(modal, {
            className: "rounded-lg shadow-lg p-6 w-96 text-center"
        })

        const modalContentContainer = new YanexDiv(modalContent, {
            className: "rounded w-full h-full flex gap-2 items-center justify-center"
        })
        this.modalContent = modalContentContainer

        // Message
        const messageEl = new YanexHeading(modalContentContainer, "h1", {
            text: this.message,
            className: "text-slate-800 text-lg"
        });

        // Buttons container
        const btnContainer = new YanexDiv(modalContent,
            {
                className:"mt-6 flex justify-center gap-4"

            }
        );

        // Generate buttons based on this.buttons
        if(this.buttons) {
            switch (this.buttons) {
                case "close": {
                    btnContainer.appendChild(this.createButton("Close"));
                    break;
                }
                case "yes-no": {
                    btnContainer.appendChild(this.createButton("Yes"));
                    btnContainer.appendChild(this.createButton("No"));
                    break;
                }
                case "okay-close": {
                    btnContainer.appendChild(this.createButton("Okay"));
                    btnContainer.appendChild(this.createButton("Close"));
                    break;
                }
                case "okay": {
                    btnContainer.appendChild(this.createButton("Okay"));
                    break;
                }
            }
        }

        modalContent.appendChild(btnContainer);
        modal.appendChild(modalContent);
        document.body.appendChild(modal.widget);

        this.modalElement = modal;
    }

    private createButton(label: string): YanexButton {
        const btn = new YanexButton(null, {
            text: label,
            className: `px-4 py-2 rounded`,
            bg:'lighterBg'
        });
        
        btn.addEventListener("click", (e) => (this.close(e, label.toLowerCase())));
        return btn;
    }

    public close(event: PointerEvent, action: string) {
        if (this.modalElement) {
            document.body.removeChild(this.modalElement.widget);
        }

        const assignValue: MessageModalPassedParam = {
            actionPressed: action,
            actionValue: false

        }

        if (["yes", "okay"].includes(action)){
            assignValue.actionValue = true
        }


        Object.assign(this.modalData, assignValue);


        if (this.onClose) {
            this.onClose(this.modalData);
        }
    }

    public addLoadingAnimation(){
        if(this.modalContent) {
            const loadingContainer = new YanexDiv(this.modalContent, {
                className: "animate-spin bg-green-600 rounded w-[20px] h-[20px]"
            });
            
            this.modalContent.appendChild(loadingContainer)
        }
    }

}



export class TextBasedElementFactories{
    
    private static simpleMessageContainerId: string = "factory-simple-message-container-id";

    /**
     * @param message The message to be displayed
     * @param container The container for this label
     * Appends a simple label on a document. Defaults to the body if continer is null or is not found.
     */
    public static appendSimpleMessage(message: string, container: HTMLElement | null): void {

        const label = document.createElement('label');
        label.classList.add("text-slate-300", "w-full", "py-2", "self-center", "justify-self-center");
        label.id = this.simpleMessageContainerId;
        label.textContent = message;
        
        if(container !== null){
            container.appendChild(label)
        } else {
            document.body.appendChild(label)
        }

    }
    /**
     * Removes the simple message created in the document if a simple message is created from this class.
     */
    public static removeSimpleMessage(): void {

        const label = document.getElementById(this.simpleMessageContainerId);

        if(label !== null){
            label.remove()
        }
    }

    /**
     * Updates the text of the simple message if a simple message is present in the document
     * @param message The new text message for the simple message
     */
    public static updateSimpleMessage(message: string): void {
        const label = document.getElementById(this.simpleMessageContainerId);

        if(label !== null){
            label.textContent = message;
        }
    }

}
export class DivBasedElementFactories{

    public static insertCircle(color: TCSSColors, element: HTMLElement,
        id: null | string = null, position: InsertPosition = "beforeend"
    ): void {
        const idTag = ` id=\"${id}\"`;

        const html = `<div${id !== null ? idTag : ""}} class="rounded-full bg-green-500 w-[10px] h-[10px]">
                </div>`
        element.insertAdjacentHTML(position, html)
    }

    public static removeCircle(id: string): void {
        const circle = document.getElementById(id);
        if (circle !== null) {
            circle.remove()
        }
    }
}

/**
 * Create a small modal at the click position
 */


export class ButtonicModalAtClick {
    private static contentButtons: Array<ModalButtonContentParamStructure>;
    private static width: number;
    private static height: number;
    private static x: number = 0;
    private static y: number = 0;
    private static modal: HTMLDialogElement | null = null;
    private static additionalData:ModalAtClickAdditionalData;
    private static buttonIdFunctions: Record<string, CallableFunction> = {}
    private static closed: boolean = true;
    private static createdButtondata: Record<string, ButtonicModalCreatedButtonStructure> = {};
    private static disabledButtons: Record<string, HTMLButtonElement> = {}

    // HTML ELEMENTS
    private static modalElements: Record<string, HTMLElement | null> = {};

    // Element IDS
    private static modalId: string = "factories-buttonic-modal";
    private static modalCloseId: string = "factories-buttonic-close-button";
    private static modalTitleId: string = "factories-buttonic-title";
    private static modalExtraTitleId: string = "factories-buttonic-extra-title";


    /**
     * Create a simple dialog with buttons as its main content. 
     * @param contentButtons The buttons to be shown on the modal's contents
     * @param width The width of the dialog
     * @param height The height of the dialog
     * @param additionalData Additional settings for the dialog
     */


    public static initialize(contentButtons: Array<ModalButtonContentParamStructure>, 
        width: number = 420, height: number = 420,
        additionalData: null | ModalAtClickAdditionalData){

        this.width = width;
        this.height = height;

        if (additionalData !== null) {
            this.additionalData = additionalData;
        }

        this.contentButtons = contentButtons;
        this.setDefaults();

    }

    /**
     * Set default values for undefined values in the additional data
     */
    private static setDefaults() {
        const defaultData: Required<ModalAtClickAdditionalData> = {
            closeOnOutsideClick: true,
            closeOnScroll: true,
            title: "",
            extraTitle: ""
        }

        this.additionalData = Object.assign(defaultData, this.additionalData)

    }
    
    public static updateTitles(newTitles: Record<"title" | "extraTitle", string>): void {
        Object.assign(this.additionalData, {
            title: newTitles.title ?? "",
            extraTitle: newTitles.extraTitle ?? ""
        })
    }

    private static modalTemplate(): string {
        const templateParts: Array<string> = []

        // Modal Open tag
        templateParts.push(
            `<dialog id="${this.modalId}" class="z-50 px-5 py-2 rounded-xl border-[2px] border-green-300">`
        )

        // Title and close area
        templateParts.push(
            `
                <div class='flex w-full items-center justify-end'>
                    <div class="flex flex-row gap-1 w-full">
                        <img src="${PublicIconLinkCollaterUtility.getImageLink("info")}" class="w-[25px] justify-self-start flex pointer-events-none mx-1 object-scale-down">
                        <p id="${this.modalTitleId}" class="flex items-center justify-center w-full font-bold text-slate-600 justify-self-start">${this.additionalData.title}</p>
                    </div>
                    <h1 id="${this.modalCloseId}" class="flex text-lg text-slate-600 hover:cursor-pointer transition-all hover:text-slate-800 hover:bg-slate-200 p-2 rounded-md">X</h1>
                </div>
            `
        )

        // Extra title area
        templateParts.push(
            `
            <div class="divider flex items-center justify-center">
                    <h1 id="${this.modalExtraTitleId}" class="flex items-center justify-center text-xs text-slate-700 px-1">${this.additionalData.extraTitle}</h1>
            </div>
            `
        )

        // Content buttons container open tag
        templateParts.push(
            `
                <div class="w-full flex flex-col gap-2 py-2">
            `
        )

        this.contentButtons.forEach(buttonData => {
            const butId = buttonData.buttonId;

            const buttonId = butId !== "" ? `id="${buttonData.buttonId}"` : "";

            const buttonSrc = buttonData.buttonIconLink !== undefined ? `src="${buttonData.buttonIconLink}"` : "";
            

            const imgElem = buttonSrc !== "" ? `<img ${buttonSrc} class="w-[25px] justify-self-start flex pointer-events-none mx-1">` : "";


            templateParts.push(
                `
                    <button ${buttonId} class="w-full flex items-center justify-center bg-slate-100 py-2 text-black
                    rounded hover:bg-slate-200 duration-100 transition-all hover:gap-3 gap-1 outline-none border-none">
                        ${imgElem}    
                        <span class="button-text pointer-events-none">${buttonData.buttonText}</span>
                    </button>
                `
            )

            if (buttonData.buttonId !== "" && butId !== undefined &&
                buttonData.buttonCallable !== undefined
            ){
                this.buttonIdFunctions[butId] = buttonData.buttonCallable;

            }
        });

        // Content buttons container closing tag
        templateParts.push(
            `
                </div>
            `

        )

        // Dialog closing tag
        templateParts.push(`</dialog>`)

        const collatedModal = templateParts.join("\n")

        return collatedModal
    }

    private static showModal() {
        if(this.modal !== null) {
            this.closed = false
            this.modal.style.position = "fixed";

            // Determine if the click is near the right edge of the document and
            // adjsut where to show the modal accordingly
            
            this.modal.style.width = `${this.width}px`
            this.modal.style.height = `${this.height}px`

          
            let left = this.x;
            let top = this.y;

            // Adjust X (horizontal) position
            if ((this.x + this.width) > window.innerWidth) {
                // Click is near or beyond the right edge → position modal to the left of cursor
                left = Math.max(0, this.x - this.width);
            } else {
                // Otherwise, position it to the right of cursor
                left = this.x;
            }

            // Adjust Y (vertical) position
            if ((this.y + this.height) > window.innerHeight) {
                // Click is near bottom → position modal above cursor
                top = Math.max(0, this.y - this.height);
            } else {
                // Otherwise, position it below cursor
                top = this.y;
            }


            this.modal.style.left = `${left}px`;
            this.modal.style.top = `${top}px`;

            // Set modal titles
            const modalTitle = this.modalElements.title as (null |undefined | HTMLParagraphElement);
            if (modalTitle){
                modalTitle.textContent = this.additionalData.title ?? "";
            }

            const modalExtraTitle = this.modalElements.extraTitle as (null |undefined | HTMLHeadingElement);
            if(modalExtraTitle) {
                modalExtraTitle.textContent = this.additionalData.extraTitle ?? "";
            }
            this.modal.style.margin = "0";
            this.modal.show()
        }
    }

    private static handleModalButtonContentsCallables(e: PointerEvent) {
        // Set the content buttons callables
        const target = e.target as HTMLElement | null;

        for (const buttonData of this.contentButtons) {
            if(target !== null && target.id !== "") {

                // Ignore if the state of the button is disabled
                const createdButtonData = this.createdButtondata;
                if(createdButtonData[target.id] !== undefined && createdButtonData[target.id] !== null) {
                    if (createdButtonData[target.id].state === "disabled") {
                        break;
                    }
                }

                if (buttonData.buttonId === target.id){
                    if(buttonData.buttonCallable) {
                        const passedData: ModalAtClickPassedParam = {
                            event: e
                        }
                        buttonData.buttonCallable(passedData)
                    }
                    break;
                }
            }
        }

    }

    /**
     * Show the modal at x, y locations. 
     * @param x Shows the modal at x location. Defaults to the past x location (defaults to 0 if there's no past location) if not provided.
     * @param y Shows the modal at y location. Defaults to the past y location (defaults to 0 if there's no past location) if not provided.
     * @param where The element of where this modal shall be appended
     */
    public static show(x: number | null = null, y: number | null = null, where: HTMLElement | null = null) {

        if (x !== null) {
            this.x = x;
        }

        if (y !== null) {
            this.y = y;
        }

        if (this.modal === null){
            const template = this.modalTemplate();
            if(where === null) {
                document.body.insertAdjacentHTML("afterbegin", template )
            } else {
                where.insertAdjacentHTML("afterbegin", template)
            }
            const modal = document.getElementById(this.modalId) as (null | HTMLDialogElement)

            this.modal = modal

            if(modal !== null) {
                const closeButton = document.getElementById(this.modalCloseId)
                if (closeButton !== null){

                    closeButton.addEventListener("click", () => this.hide())
                }

                this.modalElements["title"] = document.getElementById(this.modalTitleId);
                this.modalElements["extraTitle"] = document.getElementById(this.modalExtraTitleId);
                
                modal.addEventListener("click", (e) => (this.handleModalButtonContentsCallables(e)))
                
                // Set buttons
                for(const buttonData of this.contentButtons) {
                    if (buttonData.buttonId) {
                        const createdButton = document.getElementById(buttonData.buttonId) as (null | HTMLButtonElement)
                        if(createdButton) {
                            const createdButtonData: ButtonicModalCreatedButtonStructure = {
                                button: createdButton,
                                state: "enabled"
                            }
                            this.createdButtondata[buttonData.buttonId] = createdButtonData;
                        }
                    }
                }

            }
        } 

        this.showModal()
    }

    /**
     * Update the show button contents by using the id as the key identified
     * @param buttondData A record of with the key as the button content's id and the value as the update value
     */
    public static updateShownButtons(buttonData: Record<string, ButtonicModalUpdateButtonStructure>) {

        const disabledButtonIds: Array<string> = []

        for (const [buttonId, buttonUpdateData] of Object.entries(buttonData)) {
            const buttonCreatedData = this.createdButtondata[buttonId];
            if (buttonCreatedData) {
                if(buttonCreatedData) {
                    // Update buttons
                    if(buttonUpdateData.state) {
                        buttonCreatedData.state = buttonUpdateData.state

                        if(buttonUpdateData.state === "disabled") {
                            if(this.disabledButtons[buttonId] === undefined || this.disabledButtons[buttonId] === null) {
                                this.disabledButtons[buttonId] = this.createdButtondata[buttonId].button
                            }
                        } else {
                            if(this.disabledButtons[buttonId]) {
                                // Remove it later
                                disabledButtonIds.push(buttonId)
                            }
                        }
                    }

                // Set button text
                const button = buttonCreatedData.button;
                if (button) {
                    // Update the text only leaving the  <img> element untouched
                    const textSpan = button.querySelector(".button-text");
                    if (textSpan) textSpan.textContent = "Blocked";
                }
            }
                
            }
        }
        const omittedData = Dict.omit(this.disabledButtons, disabledButtonIds) as Record<string, HTMLButtonElement>;
        this.disabledButtons = omittedData;
        // Update button state
        this.setButtonState("enabled", true, Object.keys(this.disabledButtons))

    }

    public static hide(){

        if (this.modal !== null){
            this.modal.close()
            this.closed = true
        }
    }

    /**
     * Set the state of the content buttons
     * @param state Either enabled/disabled
     * @param preserveState Preserves the disabled state of the button if it was previously disabled
     * @param buttonIds An array of button's ids to be updated. Updates all if it is null
     */
    public static setButtonState(state: ElementStates, preserveState: boolean = true, buttonIds: Array<string> | null = null): void {

        const setBState = (button: HTMLButtonElement, overridedState: ElementStates | null = null) => {
            switch(overridedState ?? state) {
                case "disabled":

                    button.classList.add("text-slate-400", "hover:cursor-not-allowed");

                    break;
                
                case "enabled":
                    if (preserveState) {

                        if(button.id !== "" && this.disabledButtons[button.id]) {
                            
                            // Disable it if it is in the disabledButtons list
                            setBState(button, "disabled")
                            break;
                        }
                    }

                    button.classList.remove("text-slate-400", "hover:cursor-not-allowed");
                    break;
            }
        }

        for (const [buttonId, buttonData] of Object.entries(this.createdButtondata)) {
            
            if(buttonIds !== null && buttonIds.length !== 0 && !buttonIds.includes(buttonId)) {
                // Skip if the button Id is not included in the buttonIds array
                continue;
            }
            
            setBState(buttonData.button)
            this.createdButtondata[buttonId].state = state
        }
    }

    get closed(): boolean {
        return this.closed
    }        
}

interface CustomModalButtonParamStructure{
    button: HTMLButtonElement,
    originalFontColor: string,
    state: ElementStates,
    text: string
}

export class CustomModal {
    private dialog: HTMLDialogElement;
    private wrapper: HTMLDivElement | null = null;
    private contentDiv: HTMLDivElement;
    private buttonDiv: HTMLDivElement;
    private width: number;
    private height: number;
    private widthType: SizeTypes;
    private heightType: SizeTypes;
    private x: number | null;
    private y: number | null;
    private title: string | null;
    private buttonLayout: CustomModalButtonLayout;
    private buttons: Record<string, CustomModalButtonParamStructure> = {};

    private modalContentContainer: HTMLDivElement | null = null;

    constructor({
        width = 400,
        height = 400,
        x = null,
        y = null,
        title = null,
        buttonLayout = "row",
        widthType ="px",
        heightType = "px"
    }: {
        width?: number;
        height?: number;
        x?: number | null;
        y?: number | null;
        title?: string | null;
        buttonLayout?: CustomModalButtonLayout;
        widthType?: SizeTypes;
        heightType?: SizeTypes
    } = {}) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.title = title;
        this.buttonLayout = buttonLayout;
        this.widthType = widthType;
        this.heightType = heightType

        this.dialog = this.createModal();
        this.contentDiv = this.dialog.querySelector("div[data-content]") as HTMLDivElement;
        this.buttonDiv = this.dialog.querySelector("div[data-buttons]") as HTMLDivElement;
    }

    /** Create the modal structure using dialog element */
    private createModal(): HTMLDialogElement {
        // Dialog element
        // const dialog = new YanexDialog(document.body);
        const dialog = document.createElement("dialog");
        dialog.className = "backdrop:bg-black backdrop:bg-opacity-50 bg-transparent p-0 overflow-hidden";
        dialog.style.width = `${this.width}${this.widthType}`
        dialog.style.height = `${this.height}${this.heightType}`;

        // Modal container
        const modal = document.createElement("div");
        modal.className = "w-full h-full relative bg-white rounded-lg shadow-xl overflow-hidden flex flex-col px-3 mt-1";
        this.wrapper = modal;

        // Position handling
        if (this.x !== null && this.y !== null) {
            dialog.style.position = "fixed";
            dialog.style.left = `${this.x}px`;
            dialog.style.top = `${this.y}px`;
            dialog.style.margin = "0";
            dialog.style.transform = "none";
        }

        // Title Bar
        const header = document.createElement("div");
        header.className = "flex justify-between items-center p-3 border-b border-gray-200 bg-slate-100";

        const titleEl = document.createElement("h2");
        titleEl.className = "font-semibold text-gray-700 text-lg px-2";
        titleEl.textContent = this.title ?? "";

        const closeBtn = document.createElement("button");
        closeBtn.innerHTML = "✕";
        closeBtn.className = "text-gray-500 hover:text-gray-800 hover:bg-gray-200 p-2 rounded transition";
        this.buttons["cmCloseButton"] = {
            button: closeBtn,
            state: "enabled",
            originalFontColor: "text-gray-500",
            text: "✕"
        }
        closeBtn.addEventListener("click", (e) => (this.handleButtonClicks(e, "cmCloseButton", this.thisHide.bind(this))))
        header.appendChild(titleEl);
        header.appendChild(closeBtn);

        // Content area
        const content = document.createElement("div");
        content.setAttribute("data-content", "");
        content.className = "flex-1 p-4 overflow-auto w-[100%] h-[90%]";
        this.modalContentContainer = content;

        // Button area
        const buttons = document.createElement("div");
        buttons.setAttribute("data-buttons", "");
        buttons.className = `flex ${
            this.buttonLayout === "row" ? "flex-row" : "flex-col"
        } justify-right items-center justify-items-right gap-2 p-3 my-3 border-t border-gray-200`;

        // Build structure
        modal.appendChild(header);
        modal.appendChild(content);
        modal.appendChild(buttons);

        dialog.appendChild(modal);
        document.body.appendChild(dialog);

        // Close on backdrop click
        dialog.addEventListener("click", (e) => {
            const rect = dialog.getBoundingClientRect();
            if (
                e.clientX < rect.left ||
                e.clientX > rect.right ||
                e.clientY < rect.top ||
                e.clientY > rect.bottom
            ) {
                this.hide();
            }
        });

        return dialog;
    }

    /** Show the modal */
    public show(): void {
        document.body.style.overflowY = "hidden"
        this.dialog.showModal();
    }

    /** Hide and optionally remove the modal from the DOM */
    public hide(destroy: boolean = false): void {
        document.body.style.overflowY = "auto"
        if (!this.dialog) return;

        if (destroy) {
            this.dialog.close();
            this.dialog.remove();
        } else {
            this.dialog.close();
        }
    }

    /** Hide and optionally remove the modal from the DOM */
    private thisHide(e: PointerEvent): void {
        document.body.style.overflowY = "auto"
        if (!this.dialog) return;
        this.dialog.close();
        this.dialog.remove;
    }

    /** Insert HTML into the content area */
    public insertHTML(html: string): void {
        this.contentDiv.insertAdjacentHTML("beforeend", html);
    }

    /** Clear content */
    public clearContent(): void {
        this.contentDiv.innerHTML = "";
    }

    /**
     * Remove a loading bar on the custom modal
     */
    public removeLoadingBar(){
        const modal = this.dialog.querySelector("div") as HTMLDivElement;
        if (modal) {
            this.dialog.classList.remove("loading-border-top")
        }
    }

    /**
     * Add a loading bar on the custom modal
     */
    public addLoadingBar() {
        const modal = this.dialog.querySelector("div") as HTMLDivElement;
        if (modal) {
            this.dialog.classList.add("loading-border-top")
        }
    }

    /**
     * Handle the button clicks
     */
    private handleButtonClicks(e:PointerEvent, btnLabel: string, callback: (param: PointerEvent) => void | Promise<void>): void {
        const target = e.target as (null | HTMLButtonElement)
        if(target) {
            
            let button = this.buttons[target.textContent]
            button = button? button : this.buttons[btnLabel];
            
            if(button){
                if(button.state && button.state === "enabled"){
                    callback(e)
            }
        }
        }
    }

    /** Add a button to the modal */
    public addButton(label: string, onClick: (param: PointerEvent) => void | Promise<void>): void {
        const btn = document.createElement("button");
        const falseButtons = ["close", "cancel", "no"];

        let btnBg;
        let hoverBg;
        let textFg;

        if (falseButtons.includes(label.toLowerCase())) {
            btnBg = "bg-slate-200";
            hoverBg = "hover:bg-slate-100";
            textFg = "text-slate-800";
        } else {
            btnBg = "bg-green-500";
            hoverBg = "hover:bg-green-600";
            textFg = "text-white";
        }
        btn.textContent = label;
        btn.className = `px-4 py-1 ${btnBg} ${hoverBg} ${textFg} rounded transition w-full`;
        this.buttons[label] = {
            button: btn,
            state: "enabled",
            originalFontColor: textFg,
            text: label
        }

        btn.addEventListener("click", (e) => (this.handleButtonClicks(e, label, onClick)))
        this.buttonDiv.appendChild(btn);
    }

    /** Change the layout of buttons dynamically */
    public setButtonLayout(layout: CustomModalButtonLayout): void {
        this.buttonLayout = layout;
        this.buttonDiv.classList.remove("flex-row", "flex-col");
        this.buttonDiv.classList.add(layout === "row" ? "flex-row" : "flex-col");
    }

    /**
     * Disables the buttons in the custom modal
     */
    public disableButtons(){

        for(const buttonData of Object.values(this.buttons)){
            if(buttonData.state === "enabled") {
                if(buttonData.button) {
                    console.log("DIsBLED")
                    buttonData.button.classList.remove(buttonData.originalFontColor)
                    buttonData.button.classList.add("text-slate-600")
                    buttonData.button.style.cursor = "not-allowed"
                }
                buttonData.state = "disabled"
            }
        }
    }

    /**
     * Re enable the buttons
     */
    public enableButtons(){
        for (const buttonData of Object.values(this.buttons)) {
            if(buttonData.state) {
                if(buttonData.button) {
                    buttonData.button.classList.remove("text-slate-400")
                    buttonData.button.classList.add(buttonData.originalFontColor)
                    buttonData.button.style.cursor = "pointer"
                }
                buttonData.state = "enabled"
            }
        }
    }

    /**
     * Get the content container of the modal
     */
    public get contentContainer(): null | HTMLDivElement {
        return this.modalContentContainer;
    }

    /**
     * Get the modal dialog
     */
    public get modalDialog(): null | HTMLDialogElement {
        return this.dialog;
    }

    /**
     * Get modal dialog wrapper (not the dialog)
     */
    public get modalWrapper(): null | HTMLDivElement {
        return this.wrapper
    }

    /**
     * Update the button's texts
     * @param buttonData A dictionary that should contain a key for the text of the current target button 
     * and its value containing the new value. Skips if the button is not found
     */
    public updateButtonTexts(buttonData: Record<string, string>){
        for(const [buttonTarget, buttonNewText] of Object.entries(buttonData)) {
            const buttonData = this.buttons[buttonTarget];
            if(buttonData) {
                buttonData.text = buttonNewText
                buttonData.button.textContent = buttonNewText
                Dict.changeKey(this.buttons, buttonTarget, buttonNewText)
            }
        }
    }
}