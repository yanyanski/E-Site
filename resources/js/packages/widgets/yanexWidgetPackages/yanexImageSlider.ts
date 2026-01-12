import { YanexDiv, YanexElement, YanexHeading, YanexImage, YanexLabel } from "../yanexWidgets";
import { YanexWidgetsHelper } from "../yanexWidgetsHelper";

interface YanexImagesSliderOptions{
    default?: number,
    hideArrows?: boolean,
    hideCountdown?: number,
    imageData: Array<any>,
    noImageText?: string
}

interface YanexImageSliderParts {
    sliderContainer: YanexDiv,
    imageContainer: YanexDiv,
    blurredImageBg: YanexImage,
    image: YanexImage,
    leftArrow: YanexDiv,
    rightArrow: YanexDiv,
    counters: Array<YanexDiv>
    noImageTextlabel: YanexLabel,
    counterContainer: YanexDiv
}

export default class YanexImageSlider{
    
    private parent!: YanexElement;
    private images!: Array<string>;
    private options?: YanexImagesSliderOptions;

    private imageSliderParts!: YanexImageSliderParts;

    private currentShownImage: number = 0;
    private currentActivatedCounter: number | null = null;

    // private counterHeadingDataSetAttrName: string = "yanexImageSliderCounterIndex"

    private arrowHidden: boolean = false;
    private mouseEnteredImageContainer: boolean = false;
    
    // The list of images that was removed from the slider.
    private removedImagesData: Array<any> = [];

    /**
     * Create a new image slider
     * @param parent The parent for the slider
     * @param images Link of the images
     * @param options Additional options for the slider
     */
    constructor(parent: YanexElement, images: Array<string>, 
        options?: YanexImagesSliderOptions 
    ){  
        this.parent = parent;
        this.images = images;
        this.options = options;
        this.imageSliderParts = {} as YanexImageSliderParts;

        const check = this.check();

        if(check === false) {
            return
        }

        this.setDefaultOptions();

        this.buildUi();


        // Ignore this if the image only has one
        this.createImageCounter();
        

        this.finalize();
    }

    // Checks if every needed data is ok
    private check(): boolean {
        if(!this.images || this.images.length === 0) {
            console.error("No images was given")
            return false;
        }
        return true;
    }

    private finalize(): void {
        if(this.options) {
            this.setImage(this.options.default);
            this.setCounter(this.options.default)
        } else {
            this.setImage(0);
            this.setCounter(0);
        }

        // Set arrow hiding effect

        if( this.imageSliderParts.leftArrow && // Arrows might had not been created because there's only a single image
            this.options && 
            this.options.hideArrows) {

            this.hideArrows()

            this.imageSliderParts.imageContainer.addEventListener("mouseenter", () => {
                this.mouseEnteredImageContainer = true;
                this.showArrows();
                this.mouseEnteredImageContainer = true;
            })
            this.imageSliderParts.imageContainer.addEventListener("mouseleave", () => {
                this.mouseEnteredImageContainer = false;
                let timeout = null;

                if(this.options && this.options.hideCountdown) {
                    timeout = this.options.hideCountdown * 1000;
                }

                if(timeout) {
                    setTimeout(() => (this.hideArrows()), timeout)
                } else {
                    this.hideArrows()
                }
                this.mouseEnteredImageContainer
            })

            this.arrowHidden = true;
        }

        // Show the default text if no images were presented
        if(this.images.length === 0) {
            this.showNoImageText();
        }
    }

    private setDefaultOptions(): void {
        const defaultOptions: YanexImagesSliderOptions = {
            default: 0,
            hideCountdown: 1,
            imageData: [],
            noImageText: "No Image"
        }

        Object.assign(defaultOptions, this.options || {});
        this.options = defaultOptions;
    }

    /**
     * Build the image slider ui.
     */
    private buildUi(): void {
        const container = new YanexDiv(this.parent, {
            className: "w-full h-full flex relative flex-col",
            bg: null
        })
        this.imageSliderParts.sliderContainer = container;

        // The text to be shown when no image is present
        const noImageInfoLabel = new YanexHeading(container, "h1", {
            className: "w-full h-full flex items-center justify-center hidden py-10 ",
            text: this.options!.noImageText,
            bg: "extraBg"
        })
        this.imageSliderParts.noImageTextlabel = noImageInfoLabel

        const imageContainer = new YanexDiv(container, {
            className: "flex w-full h-full relative overflow-hidden"
        });

        this.imageSliderParts.imageContainer = imageContainer;

        // Background (blurred) image
        const imageBg = new YanexImage(imageContainer, {
            className: "absolute inset-0 w-full h-full blur-lg scale-100 pointer-events-none z-0 object-cover"
        })
        this.imageSliderParts.blurredImageBg = imageBg

        // Foreground (main) image
        const image = new YanexImage(imageContainer, {
            className: "relative w-full h-full flex object-contain border-[0] z-10 outline-none",
            bg: null
        })
        // image.widget.style.maxHeight = `${imageContainer.widget.clientHeight}px`
        this.imageSliderParts.image = image;

        if(this.images.length !== 1) {
            // Shared arrow styles
            const arrowBaseClasses = `
                absolute top-1/2 -translate-y-1/2 
                bg-white/10 opacity-70
                hover:scale-110 transition-all
                text-lf w-10 h-10 flex items-center justify-center 
                rounded-full shadow-md cursor-pointer z-20 select-none transition-discrete
            `;

            // Left arrow
            const leftArrow = new YanexDiv(imageContainer, {
                className: `${arrowBaseClasses} left-4 z-20 flex items-center justify-center select-none
            backdrop-blur-md h-[50px]`,
                text: "<",
            })
            leftArrow.widget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
            this.imageSliderParts.leftArrow = leftArrow;
            leftArrow.addEventListener("click", (e) => {this.handleEvents(e)})

            // Right arrow
            const rightArrow = new YanexDiv(imageContainer, {
                className: `${arrowBaseClasses} right-4 z-20 flex items-center justify-center select-none backdrop-blur-md
            h-[50px]`,
                text: ">"
            })
            rightArrow.widget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";

            rightArrow.addEventListener("click", (e) => {this.handleEvents(e)})

            this.imageSliderParts.rightArrow = rightArrow;
        }   
    }

    /**
     * Show the no image text if no images were presented
     * @param show Shows the text if true. Otherwise, hide it.
     */
    public showNoImageText(show: boolean = true): void {
        if(show) {
            this.imageSliderParts.noImageTextlabel.show();
            this.imageSliderParts.imageContainer.hide();
            this.imageSliderParts.counterContainer.hide();
        } else {
            this.imageSliderParts.noImageTextlabel.hide();
            this.imageSliderParts.imageContainer.show();
            this.imageSliderParts.counterContainer.show();
        }

    }

    /**
     * Shows the image slider arrows 
     */
    public showArrows(): void {
        if(this.arrowHidden) {
            const arrows = [this.imageSliderParts.leftArrow,
            this.imageSliderParts.rightArrow];
        
            for(const arrow of arrows) {
                arrow.removeElementClassName(["opacity-100", "md:opacity-0"])
            }
            this.arrowHidden = false
        }
    }

    /**
     * Hides the image sldier arrows
     */
    public hideArrows(): void {
        if(this.arrowHidden ||
            this.mouseEnteredImageContainer // Prevent hiding arrows if user re hovers the image container
        ) return;

        const arrows = [this.imageSliderParts.leftArrow,
            this.imageSliderParts.rightArrow];
        
        for(const arrow of arrows) {
            arrow.addElementClassName(["opacity-100", "md:opacity-0"])
        }

        this.arrowHidden = true
    }

    /**
     * Creates a heading for current image tracking
     */
    private createImageCounter(): void {
        const counterContainer = new YanexDiv(this.imageSliderParts.sliderContainer, {
            className: "flex grow h-[5px] w-full z-20 gap-1",
            bg: "lighterBg"
        }, {
            prepend: true
        })
        this.imageSliderParts.counterContainer = counterContainer
        const headers = [];

        for(let i = 0; i < this.images.length; i++) {
            headers.push(
                new YanexDiv(counterContainer, {
                className: "flex w-full h-full grow",
                bg: "extraBg",
                hoverBg: "lighterSpecialColorBg",
                // dataSetName: this.counterHeadingDataSetAttrName,
                // dataSetValue: i.toString()
            }, {
                addHoverEffect: true,
            }));

            headers[i].addEventListener("click", (e) => {
                this.handleCounterEvents(e)
            })
        }
        this.imageSliderParts.counters = headers
    }

    /**
     * handle counter events
     */
    private handleCounterEvents(event: PointerEvent): void {
        const counter = event.target as HTMLDivElement;
        const yanex = YanexWidgetsHelper.getYanexReference(counter);

        if(yanex) {
            const index = yanex.dataSet;
            if(index) {
                this.setImage(parseInt(index));
                this.setCounter(parseInt(index));
            }
        }
    }

    /**
     * Handle events of the image slider
     */
    private handleEvents(event: PointerEvent): void {
        const element = event.target;

        switch (element) {
            case (this.imageSliderParts.leftArrow.widget):
                this.prev()
                break;
            
            case (this.imageSliderParts.rightArrow.widget):
                this.next();
                break;

        }
    }

    /**
     * Show previous image
     */
    public prev(): void {
        if(this.currentShownImage <= 0) {
            this.currentShownImage = this.images.length - 1
        } else {
            this.currentShownImage -= 1;
        }
        this.setImage()
        this.setCounter()
    }

    /**
     * Show next image
     */
    public next(): void {
        if(this.currentShownImage >= this.images.length - 1) {
            this.currentShownImage = 0;
        } else {
            this.currentShownImage += 1
        }
        this.setImage();
        this.setCounter();
    }

    /**
     * Show the image based on its index on the given array links
     * @param index The index of the image to be shown. If null, it would use the current setted index instead
     */
    public setImage(index: number | null = null): void {
        if(index === null) {
            index = this.currentShownImage;
        }
        const image = this.images[index];
        
        if(image) {
            this.imageSliderParts.blurredImageBg.src = image;
            this.imageSliderParts.image.src = image;
            this.currentShownImage = index;
        }
    }

    /**
     * Sets the counter of
     * @param index The counter index to be set. If null, uses the current shown image index instead
     */
    public setCounter(index: number | null = null): void {
        if(index === null) {
            index = this.currentShownImage;
        }
        if(!this.imageSliderParts.counters) return;

        const counter = this.imageSliderParts.counters[index];

        if(counter) {

            counter.setStatus("selected", "shallow", false, true)

            if(this.currentActivatedCounter || this.currentActivatedCounter === 0) {
                // Deactivate the previous activated counter
                const formerCounter = this.imageSliderParts.counters[this.currentActivatedCounter];
                if(formerCounter) {
                    formerCounter.setStatus("none", "shallow", false, true)
                }
            }
            this.currentActivatedCounter = index
        }
    }

    /**
     * Clears the images of the slider
     * @returns The array of the image links
     */
    public clearImages(): Array<string> {
        this.imageSliderParts
        return this.images
    }

    /**
     * Removes an image.
     * @param imageIndex The index of the image to be removed. Ignores if the index doesn't exist . 
     * If no index was passed, uses the current index of the image instead
     */
    public removeImage(imageIndex: number | null = null): void {
        if(imageIndex === null) {
            imageIndex = this.currentShownImage
        }
        if (!this.images[imageIndex]) return;

        // Track removed images
        if (this.options?.imageData?.[imageIndex]) {
            this.removedImagesData.push(this.options.imageData[imageIndex]);
            this.options.imageData.splice(imageIndex, 1); // shrink array too
        } else {
            this.removedImagesData.push(this.images[imageIndex]);
        } 

        // Remove the visible image
        this.images.splice(imageIndex, 1); // SHRINK ARRAY

        // Remove counter
        this.imageSliderParts.counters[imageIndex].hide(true);
        this.imageSliderParts.counters.splice(imageIndex, 1);

        // If the removed image was the current one, show next
        if (this.currentShownImage === imageIndex) {
            this.currentActivatedCounter = null

            // Set the active shown image on the first image if the image being removed is the last one
            if(imageIndex === this.images.length) imageIndex = 0;

            this.setImage(imageIndex);
            this.setCounter(imageIndex);
        }

        // Show the no image if the images are depleted
        if(this.images.length === 0) {
            this.showNoImageText()
        }

    }

    // ----------------------- GETTERS -----------------------------
    /**
     * Get the image data. Defaults to empty array if the imageData was not filled
     */
    public get imageData(): Array<any> {
        return this.options!.imageData
    }

    /**
     * Get the data of the removed images.
     */
    public get removedImages(): Array<any> {
        return this.removedImagesData;
        
    }
}