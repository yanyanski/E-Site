import { YanexButton } from "../../packages/widgets/yanexWidgets";
import { CategoryFilterSectionBundle } from "./categoryFilterSection/categoryFilterSectionBundle";
import { CategoryFilterSectionFactory, CategoryFilterSectionHelper, CategoryFilterSectionRequests } from "./categoryFilterSection/categoryFilterSectionHelper";
import { PriceFilterSectionBundle } from "./priceFilterSection/priceFilterSectionBundle";
import { SearchFilterFactory, SearchFilterHelper } from "./searchFilterHelper";
import { SearchFilterRecord } from "./searchFilterRecord";
import { SearchFilterRef } from "./searchFilterRef";
import { TypeFilterSectionBundle } from "./typeFilterSection/typeFilterSectionBundle";
import { TypeFilterSectionFactory, TypeFilterSectionHelper, TypeFilterSectionRequests } from "./typeFilterSection/typeFilterSectionHelper";
import { VariantFilterSectionBundle } from "./variantFilterSection/variantFilterSectionBundle";
import { VariantFilterSectionFactory, VariantFilterSectionHelper, VariantFilterSectionRequests } from "./variantFilterSection/variantFilterSectionHelper";


export class SearchFilterBundle{

    public static async initialize(): Promise<void> {
        if(SearchFilterRef.initialized) {
            SearchFilterRef.searchFilterModal.show(null, true)
            return;
        }

        SearchFilterFactory.createSearchFilterModal();
        SearchFilterFactory.createSearchMessages();
        SearchFilterFactory.createFilterHeader();
        SearchFilterFactory.createFilterContentContainer();
        SearchFilterFactory.createFilterLoadingContainer();
        SearchFilterFactory.createFilterButtons();

        // Initialize filter sections
        CategoryFilterSectionBundle.initialize();
        VariantFilterSectionBundle.initialize();
        TypeFilterSectionBundle.initialize();
        PriceFilterSectionBundle.initialize();

        // Initialize the primary content to be shown
        SearchFilterEvents.filterHeaderButtonsClicked(SearchFilterRef.selectedFilterHeaderButton,
            Object.keys(SearchFilterRecord.filterSections)[0]
        )

        // Get filters
        // CATEGORIES
        const categories = await CategoryFilterSectionRequests.getCategories()
        const cats = CategoryFilterSectionHelper.saveCategories(categories);
        for(const [id, catData] of Object.entries(cats)) {
            CategoryFilterSectionFactory.createCategoryButton(catData["cat_name"], parseInt(id));
        }

        // VARIANTS
        const variants = await VariantFilterSectionRequests.getVariants();
        const vars = VariantFilterSectionHelper.saveVariants(variants)
        for(const [id, varData] of Object.entries(vars)) {
            VariantFilterSectionFactory.createVariantButton(varData["var_title"], parseInt(id));
        }

        // Types
        const types = await TypeFilterSectionRequests.getTypes();
        const tys = TypeFilterSectionHelper.saveTypes(types)
        for(const [id, tyData] of Object.entries(tys)) {
            TypeFilterSectionFactory.createTypeButton(tyData["type_name"], parseInt(id));
        }
        // Unhide the filter content section
        SearchFilterRef.searchFilterTypesContainer.show();
        SearchFilterRef.searchFilterLoadingContainer.hide(true);
        SearchFilterRef.initialized = true
    }
}

export class SearchFilterEvents{
    public static filterHeaderButtonsClicked( button: YanexButton,
        key: string
    ): void {
        if(button.isSelected) return;

        if(SearchFilterRef.activeContentKey !== "") {
            SearchFilterHelper.hideShowFilterContainers(true, SearchFilterRef.activeContentKey);
        }

        button.select();
        SearchFilterRef.activeContentKey = key;
        if(SearchFilterRef.selectedFilterHeaderButton &&
            SearchFilterRef.selectedFilterHeaderButton !== button
        ) {

            SearchFilterRef.selectedFilterHeaderButton.deselect()};

        SearchFilterRef.selectedFilterHeaderButton = button;

        SearchFilterHelper.hideShowFilterContainers(false, key);
    }

    public static filterButtonClicked(e: PointerEvent, key: string): void {
        switch(key) {
            case "okay":
                break
        }
    }
}