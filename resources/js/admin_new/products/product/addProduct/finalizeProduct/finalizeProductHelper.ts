import { FetchUtilityProcessedResponse, FetchUtilityRawProcessedResponse } from "../../../../../packages/typing";
import { FetchUtility } from "../../../../../packages/utilities";
import { YanexButton, YanexDiv, YanexHeading } from "../../../../../packages/widgets/yanexWidgets";
import { PublicStringValues } from "../../../../../public";
import { AddProductContentAliases } from "../addProductRecord";
import { AddProductRef } from "../addProductRef";
import { FinalizeProductBundle, FinalizeProductEvents } from "./finalizeProductBundle";
import { FinalizeProductLinks, FinalizeProductRecord } from "./finalizeProductRecord";
import { FinalizeProductRef } from "./finalizeProductRef";


export class FinalizeProductFactory {

    public static createFinalizeUi(): YanexDiv {
        const container = new YanexDiv(null, {
            className: "w-full p-3 rounded flex flex-col gap-2",
            bg: "extraBg"
        });
        FinalizeProductRef.finalizationMainContainer = container;
        const titleContainer = new YanexDiv(container, {
            className: "p-2 flex flex-col w-full",
            bg: "extraBg"
        })
        const title = new YanexHeading(titleContainer, "h1", {
            text: FinalizeProductRecord.finalizeTitle.title,
            className: "font-bold flex"
        }, {
            textAlignment: "w"
        })

        title.addDataset(PublicStringValues.widgetIconDataSetTitle, 
            FinalizeProductRecord.finalizeTitleIcons["title"] as string
        )

        new YanexHeading(titleContainer, "h1", {
            text: FinalizeProductRecord.finalizeTitle.message,
            fg: "lighterFg",
            className: "text-sm"
        }, {
            textAlignment: "w"
        })


        const addProductButton = new YanexButton(container, {
            className: "rounded p-2",
            bg: "specialColorBg",
            hoverBg: "lighterSpecialColorBg",
            text: "Add Product",

        }, {
            state: false,
            addHoverEffect: true
        })
        FinalizeProductRef.addProductButton = addProductButton;

        const addProductLabelContainer = new YanexDiv(container, {
            className: "flex gap-2 p-1 hidden",
            bg: null
            
        })
        new YanexDiv(addProductLabelContainer, {
            className: "animate-spin h-[25px] w-[25px] rounded",
            bg: "specialColorBg"
        })
        new YanexHeading(addProductLabelContainer, "h1", {
            text: "Submitting...",
            fg: "specialColorFg",

        })
        FinalizeProductRef.finalizeStatusContainer = addProductLabelContainer;

        addProductButton.addEventListener("click", (e) => {FinalizeProductBundle.addProduct(e)})

        new YanexHeading(container, "h1", {
            text: "Following are the needed fields to be filled:",
            className: "p-4 mt-2 w-full"
        }, {
            textAlignment: "w"
        })

        const neededDataInfoContainer = new YanexDiv(container, {
            className: "scroll-modern overflow-y-auto rounded-md px-4"
        })
        FinalizeProductRef.finalizationNeededDataContainer = neededDataInfoContainer;

        return container
    }

    public static createIncompleteAreaInfoTabs(): void {
         // Create an incomplete info area
        if(AddProductRef.addProductSlider){
            const contentAliases = AddProductRef.addProductSlider.contentAliases;
            if(contentAliases) {


                for(const alias of contentAliases) {
                     const mainContainer = new YanexDiv(FinalizeProductRef.finalizationNeededDataContainer, {
                        className: "flex flex-col w-full gap-1 p-2"
                    })

                     new YanexHeading(mainContainer, "h6", {
                        text: `${alias}`,
                        fg: "specialColorFg",
                        className: "font-bold"
                    }, {
                        textAlignment: "w"
                    })

                    const incompleteContainer = new YanexDiv(mainContainer, {
                        className: "w-full flex flex-col gap-1 p-2"
                    })
                    FinalizeProductRef.contentAliasesContainer[alias as AddProductContentAliases] = incompleteContainer
                }
            }

        }
    }

    public static createCompleteInfo(infoMessage: string, container: AddProductContentAliases) {
         const messageContainer = FinalizeProductRef.contentAliasesContainer[container];
        if(messageContainer) {
            const header = new YanexHeading(messageContainer, "h6", {
                text: infoMessage,
                className: "px-3 font-sm w-full",
                fg:'green'
            }, {
                addHoverEffect: true,
                textAlignment: "w"
            });
        }
    }

    /**
     * Add an info message to a container
     * @param infoMessage The message to be shown
     * @param container The container to where the message will be contained
     */
    public static addIncompleteInfo(infoMessage: string, container: AddProductContentAliases): void {
        
        const messageContainer = FinalizeProductRef.contentAliasesContainer[container];
        if(messageContainer) {
            const header = new YanexHeading(messageContainer, "h6", {
                text: infoMessage,
                className: "px-3 text-sm",
                fg:'red'
            }, {
                addHoverEffect: true,
                textAlignment: "w"
            });

            header.addEventListener("click", (e) => {FinalizeProductEvents.neededInfoClicked(e, container)});

        }
    }
}

export class FinalizeProductHelper {
    /**
     * Clear all the shown incomplete info
     */
    public static clearShownInfo(): void {
        for(const yanex of Object.values(FinalizeProductRef.contentAliasesContainer)) {
            const infoLabels = yanex.querySelectorAll("yanexH6");
            for(const yanex of infoLabels){
                yanex.hide(true)
            }
        }
    }
}

export class FinalizeProductRequests {
    public static async uploadProduct(payload: Record<string, any>): Promise<FetchUtilityRawProcessedResponse> {
        const fetchUtil = new FetchUtility("POST", "json", payload, "auto");
        const resp = await fetchUtil.start(FinalizeProductLinks.ADDPRODUCTLINK);
        return fetchUtil.processResponse(resp)
    }
}