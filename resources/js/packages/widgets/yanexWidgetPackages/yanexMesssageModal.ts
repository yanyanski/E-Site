import { YanexButton, YanexDiv, YanexHeading } from "../yanexWidgets";

export interface MessageModalPassedParam {
    actionValue: boolean
    actionPressed: string
}

export type MessageModalListener = "close";

export type ModalButtons = "close" | "yes-no" | "okay-close" | "okay";

/**
 * Shows a message modal
 */
export default class YanexMessageModal {

    private message: string;
    private buttons: ModalButtons | null;
    private modalElement!: YanexDiv;
    private onClose?: (action: MessageModalPassedParam) => void | Promise<void>;
    private modalData: MessageModalPassedParam;
    private modalContent: YanexDiv | null = null;

    private modalEvents: Partial<Record<MessageModalListener, Array<(e: PointerEvent) => any>>> = {};

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
            const modal = new YanexDiv(document.body as HTMLBodyElement, {
            className: "fixed inset-0 flex items-center justify-center z-[9999999] p-10",
            bg:null,
            
        });
        // Content container
        const modalContent = new YanexDiv(modal, {
            className: "rounded-lg shadow-lg p-6 text-center border-[1px]",
            border: "specialColorBorder"
        })

        const modalContentContainer = new YanexDiv(modalContent, {
            className: "rounded w-auto h-auto flex gap-2 items-center justify-center"
        })
        this.modalContent = modalContentContainer

        // Message
        const messageEl = new YanexHeading(modalContentContainer, "h1", {
            text: this.message,
            className: "text-lg"
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

    public createButton(label: string): YanexButton {
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

        // Execute any close event listeners that were added
        if(this.modalEvents["close"]) {
            for(const callback of this.modalEvents["close"]) {
                try{
                    callback(event);
                } catch(e) {
                    console.error("Failed to execute callback for YanexMessageModal while closing. Error: ", e)
                }
            }
        }
    }

    public addLoadingAnimation(){
        if(this.modalContent) {
            const loadingContainer = new YanexDiv(this.modalContent, {
                className: "animate-spin rounded w-[20px] h-[20px]",
                bg:"specialColorBg"
            });
            
            this.modalContent.appendChild(loadingContainer)
        }
    }

    public addEventListener(e: MessageModalListener, 
        callback: (e: PointerEvent) => any): void {
            if(!this.modalEvents[e]) {
                this.modalEvents[e] = []
            }
            this.modalEvents[e].push(callback)
    }
}
