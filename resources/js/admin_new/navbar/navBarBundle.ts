import { DocInfoUtility, FetchUtility, GlobalEventsUtility } from "../../packages/utilities";
import { YanexButton } from "../../packages/widgets/yanexWidgets";
import { YanexWidgetsHelper } from "../../packages/widgets/yanexWidgetsHelper";
import { AddCategoryBundle } from "../category/addCategory/addCategoryBundle";
import { AddCategoryRef } from "../category/addCategory/addCategoryRef";
import { CategoryListBundle } from "../category/categoryLists/categoryListBundle";
import { CategoryListRef } from "../category/categoryLists/categoryListRef";
import { AddProductBundle } from "../products/product/addProduct/addProductBundle";
import { AddProductRef } from "../products/product/addProduct/addProductRef";
import { ProductListBundle } from "../products/product/productList/productListBundle";
import { ProductListRef } from "../products/product/productList/productListRef";
import { AddProductTypeBundle } from "../products/productType/addProductType/addProductTypeBundle";
import { AddProductTypeRef } from "../products/productType/addProductType/addVariantRef";
import { ProductTypeListBundle } from "../products/productType/productTypeList/productTypeListBundle";
import { ProductTypeListRef } from "../products/productType/productTypeList/productTypeListRef";
import { AddUserBundle } from "../users/addUser/addUserBundle";
import { AddUserRef } from "../users/addUser/adduserRef";
import { UserListBundle } from "../users/usersList/usersListBundle";
import { UserListRef } from "../users/usersList/usersListRef";
import { AddVariantBundle } from "../variants/addVariant/addVariantBundle";
import { AddVariantRef } from "../variants/addVariant/addVariantRef";
import { VariantListBundle } from "../variants/variantList/variantListBundle";
import { VariantListRef } from "../variants/variantList/variantListRef";
import { NavBarFactory, NavBarHelper } from "./navBarHelper";
import { AdminCategoriesSubButtons, AdminNavBarButtons, AdminProductSubButtons, AdminUsersSubButtons, AdminVariantsSubButtons } from "./navBarRecords";
import { NavBarRef } from "./navBarRef";


export class NavBarBundle{
    public static initialize(){
        if(!NavBarRef.initialized) {
            NavBarFactory.generateNavBar();
            NavBarHelper.setTimeInterval();

            // Add a function where when a user clicks outside the navbar container, hide the nav sub container (For phone sizes only)
            GlobalEventsUtility.registerGlobalEvent("click", (e) => NavBarEvents.hideNavSubContainer(e))
            GlobalEventsUtility.registerGlobalEvent("touchstart", (e) => NavBarEvents.hideNavSubContainer(e))
        }
    }

}

export class NavBarEvents {
    
    /**
     * Hides the sub container if the click is outside its container. (For phone size only)
     */
    public static hideNavSubContainer(e: Event): void {
        if(DocInfoUtility.isDocSizeSmall()) {
            const target = e.target as HTMLElement;
            const targetYanex = YanexWidgetsHelper.getYanexReference(target);

            // User pressed the navbar button. Was already handled elsewhere
            if(!targetYanex) return;

            if(Object.values(NavBarRef.navBarButtons).includes(targetYanex)) return;

            // User pressed the nav sub buttons. Was already handled elsewhere
            if(Object.values(NavBarRef.navBarSubButtons).includes(targetYanex)) return;

            NavBarHelper.setButtonSelectState(null)
            NavBarHelper.showSubNavButtons(null)
        }
    }

    /**
     * Listener for the nav bar buttons
     * @param event PointerEvent
     */
    public static async navButtonsClicked(event: PointerEvent): Promise<void> {
        const button = event.target as HTMLButtonElement;

        const buttonText = button.textContent as AdminNavBarButtons;
        const yanexButton = YanexWidgetsHelper.getYanexReference(button);
        NavBarHelper.showSubNavButtons(buttonText)
        NavBarHelper.setButtonSelectState(yanexButton!)
    }


    /**Listener for the Add Variant sub buttons
     * @param event PointerEvent
     */
    public static async variantSubButtonsClicked(event: PointerEvent): Promise<void> {
        const button = event.target as HTMLButtonElement;
        const buttonText = button.textContent as AdminVariantsSubButtons;
        // Hide the sub buttons container if the screen is in phone size
        if(DocInfoUtility.isDocSizeSmall()) {
            if(NavBarRef.currentNavButtonsShown.size !== 0) {
                const activeContent = Array.from(NavBarRef.currentNavButtonsShown)[0];
                NavBarHelper.showSubNavButtons(activeContent)
                NavBarHelper.setButtonSelectState(NavBarRef.navBarButtons["Variants"])
            }
        }

        NavBarHelper.hideActiveContent();

        switch(buttonText) {
            case "Add Variants":
                AddVariantBundle.initialize();
                NavBarRef.activeContent = AddVariantRef.addVariantParent;
                break;

            case "Variants Lists":
                NavBarHelper.setNavbarButtonsState(false)
                await VariantListBundle.initialize();
                NavBarRef.activeContent = VariantListRef.variantListParent;
                if(VariantListRef.variantListParent) {
                    VariantListRef.variantListParent.show()
                }
                NavBarHelper.setNavbarButtonsState(true)
                break;
        }

    }

    /**Listener for the Add Variant sub buttons
     * @param event PointerEvent
     */
    public static async categorySubButtonsClicked(event: PointerEvent): Promise<void> {
        const button = event.target as HTMLButtonElement;
        const buttonText = button.textContent as AdminCategoriesSubButtons;

        // Hide the sub buttons container if the screen is in phone size
        if(DocInfoUtility.isDocSizeSmall()) {
            if(NavBarRef.currentNavButtonsShown.size !== 0) {
                const activeContent = Array.from(NavBarRef.currentNavButtonsShown)[0];
                NavBarHelper.showSubNavButtons(activeContent)
                NavBarHelper.setButtonSelectState(NavBarRef.navBarButtons["Categories"])
            }
        }
        NavBarHelper.hideActiveContent();

        switch(buttonText) {
            case "Add Category":
                AddCategoryBundle.initialize();
                NavBarRef.activeContent = AddCategoryRef.addCategoryParent;

                break;

            case "Category Lists":
                NavBarHelper.setNavbarButtonsState(false)
                await CategoryListBundle.initialize();
                NavBarRef.activeContent = CategoryListRef.categoryListParent;
                if(CategoryListRef.categoryListParent) {
                    CategoryListRef.categoryListParent.show()
                }
                NavBarHelper.setNavbarButtonsState(true)
                break;
        }

    }
        /**Listener for the Add Users sub buttons
     * @param event PointerEvent
     */
    public static async usersSubButtonsClicked(event: PointerEvent): Promise<void> {
        const button = event.target as HTMLButtonElement;
        const buttonText = button.textContent as AdminUsersSubButtons;

        // Hide the sub buttons container if the screen is in phone size
        if(DocInfoUtility.isDocSizeSmall()) {
            if(NavBarRef.currentNavButtonsShown.size !== 0) {
                console.log(NavBarRef.currentNavButtonsShown)
                const activeContent = Array.from(NavBarRef.currentNavButtonsShown)[0];
                NavBarHelper.showSubNavButtons(activeContent)
                NavBarHelper.setButtonSelectState(NavBarRef.navBarButtons["Users"])
            }
        }
        NavBarHelper.hideActiveContent();

        switch(buttonText) {
            case "Add User":
                AddUserBundle.initialize();
                NavBarRef.activeContent = AddUserRef.addUserParent;

                break;

            case "Users Lists":
                NavBarHelper.setNavbarButtonsState(false)
                await UserListBundle.initialize();
                NavBarRef.activeContent = UserListRef.userListParent;
                if(UserListRef.userListParent) {
                    UserListRef.userListParent.show()
                }
                NavBarHelper.setNavbarButtonsState(true)
                break;
        }

    }

    public static async productSubButtonsClicked(event: PointerEvent): Promise<void> {
        const button = event.target as HTMLButtonElement;
        const buttonText = button.textContent as AdminProductSubButtons

        // Hide the sub buttons container if the screen is in phone size
        if(DocInfoUtility.isDocSizeSmall()) {
            if(NavBarRef.currentNavButtonsShown.size !== 0) {
                console.log(NavBarRef.currentNavButtonsShown)
                const activeContent = Array.from(NavBarRef.currentNavButtonsShown)[0];
                NavBarHelper.showSubNavButtons(activeContent)
                NavBarHelper.setButtonSelectState(NavBarRef.navBarButtons["Products"])
            }
        }
        
        NavBarHelper.hideActiveContent();
        switch(buttonText) {
            case "Add Product":
                AddProductBundle.initialize();
                NavBarRef.activeContent = AddProductRef.addProductParentContainer;
                break;
            case "Product List":
                NavBarHelper.setNavbarButtonsState(false)
                await ProductListBundle.initialize();
                NavBarRef.activeContent = ProductListRef.productListContainer;
                NavBarHelper.setNavbarButtonsState(true)

                break;
            case "Add Product Type":
                AddProductTypeBundle.initialize();
                NavBarRef.activeContent = AddProductTypeRef.addProductTypeParent;
                break;
            case "Product Types":
                NavBarHelper.setNavbarButtonsState(false)
                
                await ProductTypeListBundle.initialize();
                NavBarRef.activeContent = ProductTypeListRef.productTypeListParent;
                if(ProductTypeListRef.productTypeListParent){
                    ProductTypeListRef.productTypeListParent.show();
                }
                NavBarHelper.setNavbarButtonsState(true)
                break;
        }

    }

    public static async productOtherButtonsClicked(event: PointerEvent): Promise<void> {
        const button = event.target as HTMLButtonElement;
        const buttonText: string = button.textContent;

        switch(buttonText) {
            case "Log Out":
                const yanex = YanexWidgetsHelper.getYanexReference(button);
                yanex!.addElementClassName("animate-pulse");
                yanex!.setState(false);

                NavBarHelper.setNavbarButtonsState(false);

                const fetchUtil = new FetchUtility("GET");
                const start = await fetchUtil.start("/logout");
                const response = await fetchUtil.processResponse(start);


                if(response.responseStatus) {
                    window.location.href = "/"
                }

            break;
        }
    }


}
