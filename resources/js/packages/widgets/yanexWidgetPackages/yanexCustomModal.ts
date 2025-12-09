import { YanexButton, YanexDialog, YanexDiv, YanexElement, YanexHeading } from "../yanexWidgets";
import { YanexThemeHelper } from "../yanexWidgetTheme/yanexThemeHelper";

type YanexCustomModalDimensions = number | "parent" | "screen" | null;

type YanexCustomModalEvent = "close";

export interface YanexCustomModalEvents {
    event: PointerEvent,
    modal: YanexCustomModal
}

export interface YanexCustomModalOptions{
    x?: number,
    y?: number
    contentDirection?: "row" | "col" 
    title?: string,
    reduceHeight?: number,
    reduceWidth?: number,
    outlined?: boolean,
    addClass?: string,
    hideHeader?: boolean
}

interface YanexCustomModalModalParts {
    modal?: YanexDialog,
    contentContainer? :YanexDiv,
    header?: YanexDiv
}

export default class YanexCustomModal{

    private width!:YanexCustomModalDimensions;
    private height!: YanexCustomModalDimensions;
    private options?: YanexCustomModalOptions;
    private parent: YanexElement | HTMLBodyElement | null = null;

    private modalParts: YanexCustomModalModalParts = {};

    private events: Partial<Record<YanexCustomModalEvent, CallableFunction>> = {};

    constructor(
        parent: YanexElement | HTMLBodyElement | null,
        width: YanexCustomModalDimensions = 500,
        height: YanexCustomModalDimensions = 500,
        options?: YanexCustomModalOptions
    ) {

        this.width = width;
        this.height = height

        this.options = options
        this.parent = parent
        
        this.setDefaultOptions()
        this.initialize();

        this.build()
        this.finalize();

    }

    private finalize(): void {
        if(this.options?.hideHeader) {
            this.showHeader(false)
        }
    }

    private setDefaultOptions(): void {
        const defaultOptions: YanexCustomModalOptions= {
            outlined: true
        }
        Object.assign(defaultOptions, this.options || {});
        this.options = defaultOptions
    }

    /**
     * Initialize the modal
     */
    private initialize(): void {
        // Initialize height
        if(this.width === "parent") {
            if(this.parent) {
                if(this.parent instanceof HTMLBodyElement) {
                    this.width = window.screen.width;
                } else {
                    this.width = this.parent.widget.clientWidth
                }
            } else {
                this.width = 500
            }

        } else if (this.width === "screen") {

            this.width = window.screen.width
        }else {
            this.width = this.width;
        }

        // Initialize height
        if(this.height === "parent") {
            if(this.parent) {
                if(this.parent instanceof HTMLBodyElement) {
                    this.height = window.screen.height;
                } else {
                    this.height = this.parent.widget.clientHeight
                }
            } else {
                this.height = 500
            }
        } else if(this.height === "screen") {
            this.height = window.screen.height
        } else {
            this.height = this.height
        }

        
        if(this.options) {
            // Reduce dimensions if reduce in options is defined
            if(this.width) {
                const reduceWidth = this.options.reduceWidth;
                if(reduceWidth) {
                    this.width -= reduceWidth
                }
            }

            if(this.height) {
                const reduceHeight = this.options.reduceHeight;
                if(reduceHeight) {
                    this.height -= reduceHeight
                }
            }
        }
    }   


    /**
     * Build the ui
     */
    private build(): void{
        const additionalClasses = [];
        const theme = YanexThemeHelper.getCurrentThemeSchema();
        const borders = theme["border"];

        if(this.options) {
            if(this.options.outlined) {
                additionalClasses.push(borders["specialColorBorder"])
                additionalClasses.push("border-[1px]")
            }
            if(this.options.addClass) {
                additionalClasses.push(this.options.addClass);
            }
        } 
        
        const modal = new YanexDialog(this.parent, 
            {
                bg:"extraBg",
                className: `backdrop:bg-black backdrop:bg-opacity-80 p-0 overflow-hidden z-[99999] flex rounded-md flex-col
                ${additionalClasses.join(" ")}
                `
            }
        )

        modal.widget.style.width = `${this.width}px`
        modal.widget.style.height = `${this.height}px`
        modal.widget.style.maxHeight = `${this.width}px`

        this.modalParts.modal = modal;

        const x = this.options?.x;
        const y = this.options?.y;
        if(x && y) {
            modal.widget.style.position = "fixed"
            modal.widget.style.left = `${x}px`;
            modal.widget.style.top = `${y}px`;
            modal.widget.style.margin = "0";
            modal.widget.style.transform = "none";
        }

        const headerContainer = new YanexDiv(modal, {
            className: "w-full flex px-3 py-2"
        })
        this.modalParts.header = headerContainer;
        
        const titleContainer = new YanexDiv(headerContainer, {
            className:"w-full"
        });

        if(this.options?.title) {
            const title = new YanexHeading(titleContainer, "h6", {
                className: "font-bold w-full p-2",
                text:this.options.title
            })
        }

        const xButton = new YanexButton(headerContainer, {
            bg: null,
            className: "right-3 top-2 font-bold text-md self-end justify-self-end ",
            text:"✕",
            hoverFg: "disabledColorFg",
        }, {
            addHoverEffect: true
        })

        xButton.addEventListener("click", (e) => {
            this.close();
            if(this.events["close"]) {
                const ev: YanexCustomModalEvents = {
                    event: e,
                    modal: this
                }
                this.events["close"](ev)
            }
        })

    }

    /**
     * Shows the modal. 
     * @param parent The parent for this modal. If null, it would use the parent passed in the constructor
     * @param modalType If true, shows the dialog as modal type.
     */
    public show(
        parent: YanexElement | HTMLBodyElement | null = null,
        modalType: boolean = false
    ) {
        if(this.modalParts.modal) {
            if(parent) {
                if(parent instanceof HTMLBodyElement) {
                    parent.appendChild(this.modalParts.modal.widget)
                } else {
                    parent.appendChild(this.modalParts.modal)
                }
            } else {
                if(this.parent instanceof HTMLBodyElement) {
                    this.parent.appendChild(this.modalParts.modal.widget)
                } else {
                    this.parent?.appendChild(this.modalParts.modal)
                }
            }

            if(modalType) {
                (this.modalParts.modal.widget as HTMLDialogElement).showModal()
            } else {
                (this.modalParts.modal.widget as HTMLDialogElement).show()
            }
            this.modalParts.modal.show();
        }
    }

    /**
     * Shows the header of the modal
     * @param show Boolean state. If true, show the header. Otherwise, hide.
     */
    public showHeader(show: boolean = true): void {
        if(show) {
            this.modalParts.header!.show();
        } else {
            this.modalParts!.header?.hide();
        }
    }

    /**
     * Close the modal
     * @param del If true, delete this modal. Hide otherwise.
     */
    public close(del: boolean = false): void {
        if(this.modalParts.modal) {

            (this.modalParts.modal.widget as HTMLDialogElement).close();
            (this.modalParts.modal.hide())
            if(del) {
                this.modalParts.modal.widget.remove();
            }
        };


    }

    /**
     * Add A content to the modal
     * @param content Add a yanex element
     */
    public addContent(content: YanexElement): void {
        if(this.modalParts.modal) {
            this.modalParts.modal.appendChild(content)
        }
    }

    /**
     * Get the yanex modal
     * @return YanexDialog
     */
    public get modalDialog(): YanexDialog {
        return this.modalParts.modal as YanexDialog
    }

    public addEventListener(event: YanexCustomModalEvent, callback: (e: YanexCustomModalEvents) => any): void {
        this.events[event] = callback
    }
}