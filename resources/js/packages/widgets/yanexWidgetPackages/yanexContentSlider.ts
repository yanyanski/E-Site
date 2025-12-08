import { YanexDisableElements } from "../yanexTypes";
import { YanexDiv, YanexElement, YanexHeading } from "../yanexWidgets";
import { YanexWidgetsHelper } from "../yanexWidgetsHelper";
import { YanexAnimate } from "../yanexWidgetUtilities";

type YanexContentSliderContainerStatus = "check" | "ok" | "danger";
type YanexContentSliderNavLocation = "bottom" | "top";

type YanexContentSliderEvents = "contentChange";

interface YanexContentSliderOptions {
    contents: Array<YanexElement>,
    contentsAlias?: Array<string>,
    addArrows?: boolean,
    defaultActiveContent?: string,
    defaultActiveContentIndex?: number,
    navLocation?: YanexContentSliderNavLocation
}

interface YanexContentSliderParts {
    slider?: YanexDiv,
    contentContainer?: YanexDiv,
    navContainer?: YanexDiv,
}



export default class YanexContentSlider{

    private parent!: YanexElement;
    private options?: YanexContentSliderOptions;
    private sliderPart!: YanexContentSliderParts;

    private collatedContents: Record<string, YanexElement> = {};
    private navContainers: Record<string, YanexDiv> = {};


    // The counter for the default alias of the content (if alias is not provided)
    private aliasCounter: number = 0;

    private navLineClassName: string = "yanexContentSliderNavLine";
    private navContainerDataAttrName: string = "yanexContentSliderNav";
    private activeContent: string = "";

    // Storage for the events
    private events: Partial<Record <YanexContentSliderEvents, CallableFunction>> = {};

    // If true, prevents any events on firing on the slider. The content of the array should
    // be the yanex elements to be disabled
    private disabledStates: Array<string> = []


    constructor (parent: YanexElement, options?: YanexContentSliderOptions){
        this.parent = parent;
        this.options  = options;

        this.setDefaultData();
        this.buildUi();
        this.collateContents();

        this.createNavigation();

        this.setFurtherSettings();
    }

    private setFurtherSettings(): void {
        const index = this.options?.defaultActiveContentIndex;

        if(index || index === 0) {
            const aliases = Object.keys(this.collatedContents);

            const alias = aliases[index]
            if(alias) {
                this.setActiveContent(alias)
            }
        }

        if(this.options?.defaultActiveContent) {
            if(Object.hasOwn(this.collatedContents, this.options.defaultActiveContent)) {
                this.setActiveContent(this.options.defaultActiveContent)
            }
        }
    }

    private setDefaultData(): void {
        this.sliderPart = {};
        const defaultOptions: YanexContentSliderOptions = {
            contents: [],
            addArrows: false,
            navLocation: "top"
        }

        Object.assign(defaultOptions, this.options);
        this.options = defaultOptions;
    }

    /**
     * Collate the contetns for easy read and access
     */
    private collateContents(): void {
        if(this.options && this.options.contents){
            for(const [index, content] of this.options?.contents.entries()) {
                content.hide();

                if(this.options.contentsAlias && this.options.contentsAlias[index]) {
                    this.addContent(content, this.options.contentsAlias[index]);
                    continue;
                }
                this.addContent(content)
            }
        }
    }


    /**
     * Adds a content to the slider
     * @param content The content to be added
     * @param alias Optional. The alias for the content.
     * @returns The alias for the content
     */
    public addContent(content: YanexElement, alias: string | null = null): string{
        if(alias) {
            this.collatedContents[alias] = content;

            // Append content
            if(this.sliderPart.contentContainer) {
                this.sliderPart.contentContainer.appendChild(content)
            }
            return alias
        }
            
        this.collatedContents[this.aliasCounter.toString()] = content;
        this.aliasCounter += 1;

        // Append content
        if(this.sliderPart.contentContainer) {
            this.sliderPart.contentContainer.appendChild(content)
        }
        return (this.aliasCounter - 1).toString();
    }

    /**
     * Add hover effect to the line
     */
    private addNavLineHoverEffect(event: MouseEvent): void {
        const eventType = event.type;
        const navLine = (event.target as HTMLElement).querySelector(`.${this.navLineClassName}`) as HTMLElement;

        const yanexRef = YanexWidgetsHelper.getYanexReference(navLine);

        if(yanexRef) {
            // ignore if the yanex is already selected
            if(yanexRef.status === "selected") return;

            if(eventType === "mouseenter") {

                yanexRef.setElementBg("lighterSpecialColorBg")
                
            } else if (eventType === "mouseleave") {

                yanexRef.setElementBg("extraBg")
            
            }
        }
    }

    /**
     * Add click effect to the nav button
     */
    private addNavLineClickEffect(event: MouseEvent): void {
        const target = event.target as HTMLElement;

        const yanexRef = YanexWidgetsHelper.getYanexReference(target);

        if(yanexRef) {
            const alias = yanexRef.dataSet
            if(alias) this.setActiveContent(alias);
        }

        if(this.events.contentChange) {
            this.events.contentChange(event)
        }
    }

    /**
     * Shows the content of the given alias. Ignores if key doesn't exist
     * @param contentKey The alias name
     */
    public setActiveContent(alias: string): void {

        // Ignore if the alias is already the active content
        if(alias === this.activeContent) return;
        
        const nav = this.navContainers[alias];
        
        const activeNav = this.navContainers[this.activeContent];

        if(activeNav) {
            const navLine = activeNav.widget.querySelector(`.${this.navLineClassName}`);
            if(navLine) {
                const navLineYanex = YanexWidgetsHelper.getYanexReference(navLine as HTMLElement);
                if(navLineYanex) {
                    navLineYanex.setStatus("none", "shallow")
                }
            }

            const content = this.collatedContents[this.activeContent];
            if(content){
                content.hide()
            }
        }

        if(nav){
            const navLine = nav.widget.querySelector(`.${this.navLineClassName}`);
             if(navLine) {
                const navLineYanex = YanexWidgetsHelper.getYanexReference(navLine as HTMLElement)

                if(navLineYanex) {
                    if(navLineYanex.status === "selected"){
                        navLineYanex.setStatus("none", "shallow");
                    } else if (navLineYanex.status === "none") {
                        navLineYanex.setStatus("selected", "shallow")
                    }
                }

            }

            const content = this.collatedContents[alias];
            if(content) {
                content.show();
            }
        }
        this.activeContent = alias;
    }

    /**
     * Add another nav button
     */
    private addNav(text: string, status: YanexContentSliderContainerStatus = "ok"): void {
        if(this.sliderPart.navContainer) {
            const navContainer = new YanexDiv(this.sliderPart.navContainer, 
                {   
                    bg:"lighterBg",
                    className: "rounded w-full flex flex-col h-full nt-auto",
                    hoverBg: "strongerBg",
                    dataSetName: this.navContainerDataAttrName,
                    dataSetValue: text
                }, {
                    addHoverEffect:true,   
                }
            )

            navContainer.addEventListener("mouseenter", (e) => {this.addNavLineHoverEffect(e)})
            navContainer.addEventListener("mouseleave", (e) => {this.addNavLineHoverEffect(e)})
            navContainer.addEventListener("click", (e) => {this.addNavLineClickEffect(e)})

            this.navContainers[text] = navContainer;

            const navTitle = new YanexHeading(navContainer , "h1", {
                text: text,
                className: "p-2 pointer-events-none h-full pointer-event-none text-sm"
            })


            const line = new YanexDiv(navContainer , {
                className: `${this.navLineClassName} h-[10px] transition pointer-events-none w-full place-content-between pointer-event-none`,
                bg: "extraBg"
            })

        }
    }

    private createNavigation(): void {
        if(this.sliderPart.slider) {
            const navContainer = new YanexDiv(this.sliderPart.slider, {
                className: "w-full self-end flex",
                
            }, {
                prepend: this.options?.navLocation === "top"
            })

            this.sliderPart.navContainer = navContainer;

            for(const [contentTitle, content] of Object.entries(this.collatedContents)) {

                this.addNav(contentTitle,
                    "danger"
                )
            }

        }

    }

    private buildUi() {
        const container = new YanexDiv(this.parent, {
            className: "w-full h-full flex gap-1 flex-col p-2 h-full items-center"
        });
        this.sliderPart.slider = container

        const contentContainer = new YanexDiv(container, {
            className: "w-full h-full flex items-center justify-center"
        });

        if(this.options?.addArrows) {
            const leftArrow = new YanexHeading(contentContainer, "h1", {
                text: "<",
                className: "font-bold"
            });
        }

        const content = new YanexDiv(contentContainer, {
            className: "w-full"
        });
        this.sliderPart.contentContainer = content;

        if(this.options?.addArrows)  {
            const rightArrow = new YanexHeading(contentContainer, "h1", {
                text:'>'
            })
        }
    }

    public addEventListener(event: YanexContentSliderEvents, 
        callback: (e: PointerEvent) => any): void {
            this.events[event] = callback
    }

    
    /**
     * Disables child elements
     * @param elements The elements to be disabled
     * @param state The state for the elements
     */
    public setSliderElementsState(elements: YanexDisableElements | Array<YanexDisableElements>, state: boolean): void {
        if(this.sliderPart.slider) {
            this.sliderPart.slider.setElementsState(elements, state)
        }
    }

    // -------------------------------------------------- GETTERS -------------------

    /**
     * Returns the current active content of the slider
     */
    public get active(): string {
        return this.activeContent
    }

    /**
     * Returns the aliases of the content slider
     */
    public get contentAliases(): Array<string> | null {
        if(this.options) {
            return this.options.contentsAlias || null
        }
        return null
    }
}