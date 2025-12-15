import { YanexButton, YanexDiv, YanexElement, YanexHeading } from "../yanexWidgets";

export type YanexListBoxOptions = {
    defaultValues?: Array<string> | string,
    noValueMessage?: string
}

export type YanexListBoxEvent = {
    event: PointerEvent,
    removedValue: string,
}

type YanexListBoxParts = {
    container?: YanexDiv,
    noValueContainer?: YanexDiv
}

type YanexListBoxEvents = "listRemoved";

export default class YanexListBox{

    private parent!: YanexElement;
    private options?: YanexListBoxOptions;
    private listBoxParts: YanexListBoxParts = {};

    private lists: Record<string, YanexDiv> = {};
    private events: Partial<Record<YanexListBoxEvents, CallableFunction>> = {};


    /**
     * Create a new list box
     * @param parent The parent for the listbox
     * @param options Additional options for the listbox
     */
    constructor(parent: YanexElement, options?: YanexListBoxOptions) {
        this.parent = parent;
        this.options = options;

        this.setDefaultOptions();

        this.buildUi();

        this.initialize();

    }
    private initialize(): void {
        if(this.options) {
            if(this.options.defaultValues) {
                for(const value of this.options.defaultValues) {
                    this.addValue(value)
                }
                this.showNoValueAdded(false)
            }

        }

    }

    private setDefaultOptions(): void {
        // Default Options
        if(this.options === undefined) {
            this.options = {};
        }

        if(this.options && this.options.defaultValues) {
            if(typeof this.options.defaultValues === "string") {
                this.options.defaultValues = [this.options.defaultValues]
            }
        }
    }

    private buildUi(): void {
        const container = new YanexDiv(this.parent, {
            className: "w-full rounded flex gap-3 flex-wrap overflow-y-auto scroll-modern items- self-start p-2"
        })  
        this.listBoxParts["container"] = container;

        const noValueContainer = new YanexHeading(container, "h6", {
            className: "w-full h-full flex items-center justify-center",
            text: this.options?.noValueMessage || "No Lists"
        })
        this.listBoxParts["noValueContainer"] = noValueContainer;
    }

    private setHoverEffects(event: MouseEvent, xButton: YanexButton): void {
        console.log(xButton, xButton.state)
        if(xButton.state === false) return;
        const eventType = event.type;

        switch(eventType) {
            case "mouseenter":
                xButton.setElementFg("red")
                break;

            case "mouseleave":
                xButton.setElementFg()
            break;
        }
    }

    private setClickEvent(e: PointerEvent, value: string) {
        const state = this.removeValue(value);
        if(state === false) return;

        // Check if the list is empty
        if(Object.keys(this.lists).length === 0) {
            this.showNoValueAdded()
        }

        if(this.events["listRemoved"]) {
            const eventParam: YanexListBoxEvent = {
                event: e,
                removedValue: value,
            };
            this.events["listRemoved"](eventParam)
        }
    }

    private createList(value: string): void {
        const list = new YanexDiv(this.listBoxParts.container, {
            className: "px-5 py-1 flex gap-2 w-min h-min rounded relative",
            bg: "specialColorBg",
            hoverBg: "lighterSpecialColorBg"
        }, {
            addHoverEffect: true,
            disableHoverIfStateIsFalse: true
        });
        new YanexHeading(list, "h1" , {
            className: "flex items-center justify-center text-sm whitespace-nowrap",
            bg: null,
            fg: "contrastFg",
            text: value
        },{
            disableHoverIfStateIsFalse: true
        })
        const xButton = new YanexButton(list, {
            text: "✕",
            bg:"lighterBg",
            className: "text-sm -right-2 -top-2 absolute rounded-full "
        }, {
            disableHoverIfStateIsFalse: true
        })

        list.addEventListener("mouseenter", (e) => {
            this.setHoverEffects(e, xButton)
        })
        list.addEventListener("mouseleave", (e) => {
            this.setHoverEffects(e, xButton)
        })
        list.addEventListener("click", (e) => {
            this.setClickEvent(e, value)
        })
        this.lists[value] = list
    }

    /**
     * Add an new value to the list
     * @param value The value to be added
     */
    public addValue(value: string): void {
        this.createList(value);
        this.showNoValueAdded(false);
    }

    /**
     * Removes a value to the list
     * @param value The value to be removed
     */
    public removeValue(value: string): boolean{
        const container = this.lists[value];

        // Check if the button of this container is not disabled
        const xButton = container.querySelector("yanexButton");
        if(xButton && xButton.state === false) return false;

        if(container) {
            container.hide(true)
            delete this.lists[value]
        }
        return true;
    }
    
    private showNoValueAdded(show: boolean = true): void {
        const noValue = this.listBoxParts.noValueContainer;
        if(noValue) {
            show? noValue.show() : noValue.hide();
        }
    }

    public addEventListener(event: YanexListBoxEvents, callback: (event: YanexListBoxEvent) => any): any {
        this.events[event] = callback
    }

}