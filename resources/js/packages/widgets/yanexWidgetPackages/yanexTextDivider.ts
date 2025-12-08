import { YanexDiv, YanexElement, YanexSpan } from "../yanexWidgets";
import { YanexWidgetBorderThemeTypes, YanexWidgetFgThemeTypes } from "../yanexWidgetTheme/yanexThemeTypes";


export interface YanexTextDividerOptions {
    border?: YanexWidgetBorderThemeTypes
    fg?: YanexWidgetFgThemeTypes,
    lineOrientation?: "x" | "y",
    classname?: string,
    text?: string
}

export default class YanexTextDivider{
    private parent!: YanexElement | HTMLBodyElement;
    private options!: YanexTextDividerOptions;

    constructor(parent: YanexElement | HTMLBodyElement,
         options?: YanexTextDividerOptions) {

            this.parent = parent
            this.options = options || {};
            this.setDefaultOptions();
            this.buildUi();

    } 
    private setDefaultOptions(): void {
        const defaultOptions: YanexTextDividerOptions = {
            fg: "defaultFg",
            lineOrientation: "x",
            border: "lighterBorder"
        }
        Object.assign(defaultOptions, this.options);
        this.options = defaultOptions
    }

    private buildUi(): void {
        let orientation: string = "w-full";
        if(this.options.lineOrientation === "y") {
            orientation = "h-full flex-col"
        } 

        const container = new YanexDiv(this.parent, {
            bg: null,
            className: `${orientation} flex items-center`
        });

        new YanexDiv(container, {
            className: "w-full border-[1px]",
            bg: null,
            border: this.options.border
        });

        const text = new YanexSpan(container, {
            text: this.options.text? this.options.text : "",
            className: `whitespace-nowrap ${this.options.classname || ""} px-[1px]`,
            fg: this.options.fg,
            bg: null
        }, {
            addHoverEffect: false
        });

        if(!this.options.text) text.hide();

        new YanexDiv(container, {
            className: "w-full border-[1px]",
            bg: null,
            border: this.options.border
        });
    }
}