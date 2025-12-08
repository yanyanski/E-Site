import { ImageCompressionRates, ImageUtility } from "../../utilities";
import { YanexButton, YanexDiv, YanexElement, YanexHeading, YanexImage, YanexInput } from "../yanexWidgets";
import { YanexWidgetsHelper } from "../yanexWidgetsHelper";


interface YanexImageViewerOptions {
    noImageMessage?: string,
    compressionRate?: ImageCompressionRates,
    maximumImageKbSize?: number
}
interface YanexImageViewerParts{
    container?: YanexDiv,
    imageContainer?: YanexDiv,
    noImageInfo?: YanexHeading,
    imageInput?: YanexInput
}

export default class YanexImageView{

    private parent!: YanexElement;
    private options?: YanexImageViewerOptions;

    private imageViewerParts: YanexImageViewerParts = {};

    private imageContainerDataAttrName: string = "yanexImageViewerImageContainer"
    private imageOverlaySuffixId: string = "yanex-image-viewer-overlay-id-"
    private imageIdCounter: number = 0;
    private imageCloseButtonDataAttrName: string = "yanexImageViewerCloseButton";

    private imageContainerData: Record<string, YanexDiv> = {};
    private imageBlobs: Record<string, Blob> = {};

    /**
     * Create an image viewer
     * @param parent The parent for the image viewer
     * @param options Additional options
     */
    constructor(parent: YanexElement, 
        options?: YanexImageViewerOptions) {
            this.parent = parent;
            this.options = options || {}

            this.setDefaultOptions();
            this.buildUi();

    }

    private setDefaultOptions(): void {
        const defaultOptions: YanexImageViewerOptions = {
            noImageMessage: "No Images Selected",
            compressionRate: 0.7
        }

        Object.assign(defaultOptions, this.options)
        this.options = defaultOptions;
    }

    private handleAddImageEvent(event: PointerEvent): void {

        if(this.imageViewerParts.imageInput) {
            this.imageViewerParts.imageInput.widget.click();
        }
    }

    private removeImage(e: PointerEvent): void {
        const xButton = e.target as HTMLButtonElement;
        const containerId = xButton.dataset[this.imageCloseButtonDataAttrName];
        if(containerId){
            const container = this.imageContainerData[containerId];
            if(container){
                container.hide(true);
            }
            delete this.imageContainerData[containerId]
            delete this.imageBlobs[containerId]
        }

        // Check if there are still remaining images
        if(Object.keys(this.imageContainerData).length <= 0 &&
            this.imageViewerParts.noImageInfo
        ) {
            this.imageViewerParts.noImageInfo.show()
        }
    }

    private createImageContainer(imageUrl: string): YanexDiv {

        const container = new YanexDiv(null, {
            dataSetName: this.imageContainerDataAttrName,
            dataSetValue: this.imageIdCounter.toString(),
            className: "max-w-[300px] flex-shrink-0 relative"
        })
        this.imageContainerData[this.imageIdCounter.toString()] = container;

        const image = new YanexImage(container, {
            src: imageUrl,
            className: "w-full h-full object-scale-down rounded",
        });

        // (image.widget as HTMLImageElement).loading = "lazy"

        // Close (X) Button
        const closeBtn = new YanexButton(container, {
            className:  "absolute top-1 right-1 rounded-full w-6 h-6 flex items-center justify-center shadow transition",
            type: "button",
            bg:"lighterBg",
            hoverBg: "extraBg",
            dataSetName: this.imageCloseButtonDataAttrName,
            dataSetValue: this.imageIdCounter.toString(),
            text: "✕"
        }, {
            addHoverEffect: true
        })
        // closeBtn.innerHTML = "✕";

        const overlay = new YanexDiv(container, {
            className: "absolute inset-0 opacity-50 rounded",
            bg:"lighterBg",
            id: `${this.imageOverlaySuffixId}${this.imageIdCounter}`
        })

        const loadingContainer = new YanexDiv(overlay, {
            className: "absolute inset-0 flex items-center justify-center flex-col w-full h-full"
        })
        
        new YanexHeading(loadingContainer, "h1", {
            className: "text-slate-900 font-semibold",
            text: "Compressing..."
        })

        new YanexHeading(loadingContainer, "h6", {
            text: "0%",
            className: "text-slate-900 font-bold"
        })

        // Close behavior
        closeBtn.addEventListener("click", (e) => this.removeImage(e));

        this.imageIdCounter += 1;

        return container
            
    }

    private async handleImageInputChange(event: Event): Promise<void> {
        const fileInput = event.target as HTMLInputElement;

        if(fileInput) {
            const files = fileInput.files;

            if(files) {
                // Hide the no info
                if(this.imageViewerParts.noImageInfo) {
                    this.imageViewerParts.noImageInfo.hide();
                }

                for(const file of files) {
                    const imageLocalUrl = URL.createObjectURL(file);
                    const container = this.createImageContainer(imageLocalUrl)
                    if(this.imageViewerParts.imageContainer) {
                        this.imageViewerParts.imageContainer.appendChild(container)
                    }

                    const image = container.querySelector("yanexImg")
                    const percentText = container.querySelector("yanexH6");
                    try {

                        let compressionRate = this.options?.compressionRate || 0.7;
                        let compressedImage = await ImageUtility.compressImage(file, compressionRate, percentText || null);
                        let originalInitialCompressedImage = compressedImage;

                        // Check if max size is set
                        if(this.options?.maximumImageKbSize) {
                            let breakDueForCompressionRate: boolean = true;
                            while(
                                parseInt((compressedImage.size / 1024).toFixed(2)) > this.options.maximumImageKbSize &&
                                breakDueForCompressionRate
                            ) {

                                // Re Compress image 
                                if((compressionRate) < 0.1 || 
                                parseFloat((file.size / 1024 / 1024).toFixed(2)) > 20 // Drastically set compression rate to 0.1 if original file is over 20 mb
                            ) {
                                    compressionRate = 0.1;
                                    breakDueForCompressionRate = false;
                                }
                                compressedImage = await ImageUtility.compressImage(new File([originalInitialCompressedImage], file.name), compressionRate as ImageCompressionRates)

                                compressionRate = parseFloat((compressionRate - 0.1).toPrecision(1)) as ImageCompressionRates;
                            }

                        }
                        // Hide overlay
                        const elementId = `${this.imageOverlaySuffixId}${this.imageIdCounter - 1}`
                        const overlay = YanexWidgetsHelper.getYanexById(elementId);
                        if(overlay) {
                            overlay.hide()
                        }
                        // Update the src of the image

                        if(image){
                            (image.widget as HTMLImageElement).src = URL.createObjectURL(compressedImage);
                            this.imageBlobs[(this.imageIdCounter - 1).toString()] = compressedImage;
                        }
                    } catch(error) {
                        const loadingLabel = container.querySelector("yanexH1");
                        if(loadingLabel){
                            loadingLabel.text = "Error"
                        }

                        if(percentText) {
                            percentText.text = `${error ?? "Something went wrong"}`
                        }
                    }
                    
                }
            }

        }
    }

    /**
     * Clears all the images in the viewer
     */
    public clearImages(): void {

        for(const imageContainer of Object.values(this.imageContainerData)) {
            imageContainer.hide(true)
        }
        this.imageBlobs = {};
        if(this.imageViewerParts.noImageInfo) {
            this.imageViewerParts.noImageInfo.show()
        }
    }

    private buildUi(): void {
        const container = new YanexDiv(this.parent, {
            className: "flex flex-col gap-1 p-1"
        });
        this.imageViewerParts.container = container;
        
        const imageContainer = new YanexDiv(container, {
            className: "flex gap-1 overflow-x-auto scroll-modern w-full h-[150px]"
        })
        this.imageViewerParts.imageContainer = imageContainer;

        const imageInput = new YanexInput(imageContainer, {
            className: "hidden",
            accept: "images/*",
            type: "file"
        });
        (imageInput.widget as HTMLInputElement).multiple = true;
        
        imageInput.addEventListener("change", (e) => {this.handleImageInputChange(e)})
        this.imageViewerParts.imageInput = imageInput

        const noImageInfo = new YanexHeading(imageContainer, "h1", {
            className: "flex w-full h-full items-center justify-center",
            text: this.options?.noImageMessage || "No Images Selected",
            fg:"lighterFg"
        })
        this.imageViewerParts.noImageInfo = noImageInfo

        const addButton = new YanexButton(container, {
            className: "w-full p-1 rounded",
            text: "Add Image",
            hoverBg: "specialColorBg",
            bg: "lighterSpecialColorBg",
            fg:"contrastFg"
        }, {
            addHoverEffect: true
        });

        addButton.addEventListener("click", (e) => {this.handleAddImageEvent(e)});
    }

    //---------------------------- GETTERS -----------------------------------------------
    /**
     * Get the uploaded images. Null if none.
     */
    public get images(): Array<Blob> | null {
        let imageBites = 0;
        for(const image of Object.values(this.imageBlobs)) {
            imageBites += image.size
        }

        if(this.imageContainerData){
            return Array.from(Object.values(this.imageBlobs))
        }

        return null
    }
}