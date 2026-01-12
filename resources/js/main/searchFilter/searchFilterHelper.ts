import YanexCustomModal from "../../packages/widgets/yanexWidgetPackages/yanexCustomModal";
import { YanexButton, YanexDiv, YanexHeading } from "../../packages/widgets/yanexWidgets";
import { MainRef } from "../mainRef";
import { CategoryFilterSectionRef } from "./categoryFilterSection/categoryFilterSectionRef";
import { PriceFilterSectionRef } from "./priceFilterSection/priceFilterSectionRef";
import { SearchFilterEvents } from "./searchFilterBundle";
import { SearchFilterRecord } from "./searchFilterRecord";
import { SearchFilterRef } from "./searchFilterRef";
import { TypeFilterSectionRef } from "./typeFilterSection/typeFilterSectionRef";
import { VariantFilterSectionRef } from "./variantFilterSection/variantFilterSectionRef";


export class SearchFilterHelper{
    public static hideShowFilterContainers(hide: boolean, content: string): void {
        // Hide the active content
        switch(content){
            case "category":
                hide ? 
                    CategoryFilterSectionRef.categoryContainer.hide()
                    :
                    CategoryFilterSectionRef.categoryContainer.show()
                break;
            case "variant":
                hide ? 
                    VariantFilterSectionRef.variantContainer.hide()
                    :
                    VariantFilterSectionRef.variantContainer.show()
                break;
            case "type":
                hide ?
                    TypeFilterSectionRef.typeContainer.hide()
                    :
                    TypeFilterSectionRef.typeContainer.show()
                break;
            case "price":
                hide ?
                    PriceFilterSectionRef.priceContainer.hide()
                    :
                    PriceFilterSectionRef.priceContainer.show()
                break;
        }
    }

}

export class SearchFilterFactory{

    /**
     * Create the modal for the search filter
     */
    public static createSearchFilterModal(): void {
        const modal = new YanexCustomModal(MainRef.wrapperContainer, 
            "screen", 500, {
                title: "Filter Search"
            })
        modal.show(null, true)
        SearchFilterRef.searchFilterModal = modal;

        SearchFilterRef.searchFilterModaWrapper = new YanexDiv(modal.modalDialog, {
            className: "w-full h-full flex flex-col"
        })
    }

    public static createSearchMessages(): void {
        const messContainer = new YanexDiv(SearchFilterRef.searchFilterModaWrapper, {
            className: "w-full flex flex-col",

        })

        new YanexHeading(messContainer, "h1", {
            className: "w-full font-bold text-lg",
            text: SearchFilterRecord.filterMessage["title"],
        }, {
            textAlignment: "w"
        })

        new YanexHeading(messContainer, "h1", {
            className: "w-full text-xs",
            text: SearchFilterRecord.filterMessage["message"],
            fg:"lighterFg"
        }, {
            textAlignment:"w"
        })
    }

    public static createFilterLoadingContainer(): void {
        const container = new YanexDiv(SearchFilterRef.searchFilterModaWrapper, {
            className: "w-full h-full flex gap-1 items-center justify-center"
        });
        
        new YanexDiv(container, {
            className: "w-[20px] h-[20px] rounded-md animate-spin",
            bg: "specialColorBg"
        })

        new YanexHeading(container, "h1", {
            text: "Loading. Please wait...",
            className: "animate-pulse text-xs",
            fg: "lighterFg"
        })
        SearchFilterRef.searchFilterLoadingContainer = container
    }

    public static createFilterContentContainer(): void {
        const container = new YanexDiv(SearchFilterRef.searchFilterModaWrapper, {
            className: "456 w-full h-full flex hidden"
        });
        SearchFilterRef.searchFilterTypesContainer = container

    }
    public static createFilterHeader(): void {
        const container = new YanexDiv(SearchFilterRef.searchFilterModaWrapper, {
            className: 'flex w-full scroll-modern px-2 mt-2'
        })
        let firstIter = true;
        for(const [filterKey, filterType] of Object.entries(SearchFilterRecord.filterSections)) {
            
            const button = new YanexButton(container, {
                className: "w-full rounded-md",
                hoverBg: "specialColorBg",
                bg:"lighterBg",
                text: filterType,
                selectBg: "specialColorBg"
            })
            if(firstIter) {
                firstIter = false;
                SearchFilterRef.selectedFilterHeaderButton = button;
            }

            button.addEventListener("click", (e) => SearchFilterEvents.filterHeaderButtonsClicked(button,
                filterKey
            ))
        }

    }

    public static createFilterButtons(): void {
        const container = new YanexDiv(SearchFilterRef.searchFilterModaWrapper, {
            className: "self-end p-2 w-full flex gap-2",

        })

       for(const [key, button] of Object.entries(SearchFilterRecord.filterButtons)) {
            const but = new YanexButton(container, {
                className: "w-full h-full flex rounded-md items-center justify-center py-1",
                hoverBg: "specialColorBg",
                bg: "lighterSpecialColorBg",
                text: button
            }, {
                textAlignment: "center"
            })

            SearchFilterRef.searchFilterButtons[key] = but
            but.addEventListener("click", (e) => SearchFilterEvents.filterButtonClicked(e, key))
       }

    }
}