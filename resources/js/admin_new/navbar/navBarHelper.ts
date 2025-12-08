import { DatetimeUtility } from "../../packages/utilities";
import YanexGroupedButtons from "../../packages/widgets/yanexWidgetPackages/yanexGroupedButtons";
import YanexTextDivider from "../../packages/widgets/yanexWidgetPackages/yanexTextDivider";
import { YanexButton, YanexDiv, YanexHeading } from "../../packages/widgets/yanexWidgets";
import { YanexAnimate } from "../../packages/widgets/yanexWidgetUtilities";
import { PublicStringValues } from "../../public";
import { AdminRefs } from "../adminRef";
import { NavBarEvents } from "./navBarBundle";
import { AdminNavBarButtons, NavBarRecords } from "./navBarRecords";
import { NavBarRef } from "./navBarRef";

export class NavBarHelper{

    /**
     * Sets the time interval for updating the time
     */
    public static setTimeInterval(): void {
        function getTime(): string {
            const time = DatetimeUtility.getTimeOnly()
            return DatetimeUtility.toHumanTime(time)
        }

        setInterval(() => {

            const time = getTime();
            NavBarRef.timeLabel!.text = time;
        }, 1000)
    }

    /**
     * Shows the nav sub navbar buttons of the navbutton. Hides it if it is already shown instead
     * @param navButton The navbutton text
     */
    public static showSubNavButtons(navButton: AdminNavBarButtons): void {
        const subNavBarContainer: YanexDiv | undefined = NavBarRef.navSubButtonContainer[navButton];

        if(NavBarRef.currentNavButtonsShown.has(navButton)){
            if(subNavBarContainer){
                YanexAnimate.animateSlide(subNavBarContainer, "up", 300)
                NavBarRef.currentNavButtonsShown.delete(navButton)

            }
        } else {
            if(subNavBarContainer){
                YanexAnimate.animateSlide(subNavBarContainer, "down", 300)
                NavBarRef.currentNavButtonsShown.add(navButton);

            }
        }
    }

    /**
     * Hide the active content
     */
    public static hideActiveContent(): void {
        console.log("Active", NavBarRef.activeContent)
        if(NavBarRef.activeContent) {
            console.log("HIDDEN?")
            NavBarRef.activeContent.hide();
        }
        if(AdminRefs.noShownContentContainer) {
            console.log(AdminRefs.noShownContentContainer)
            AdminRefs.noShownContentContainer.hide(true);
            AdminRefs.noShownContentContainer = null;
        }
    }

    /**
     * Prevent user from selecting other contents. Needed while awaiting response from the server
     */
    public static setNavbarButtonsState(state: boolean): void {
        for(const button of Object.values(NavBarRef.navBarSubButtons)) {
            button.setState(state)
        }
    }
}

export class NavBarFactory{

    /**
     * Generate the nav bar section of the app
     */
    public static generateNavBar(): void {
        const navBar = new YanexDiv(document.body as HTMLBodyElement, {
            className: "flex flex-col gap-2 h-screen w-[300px] p-2 overflow-y-auto scroll-modern",
            bg:"extraBg"
        });

        NavBarRef.navBarContainer = navBar

        const greetingContainer = new YanexDiv(navBar, {
            className: "w-full flex flex-col p-2 pb-7",
            bg: null
        })
        new YanexHeading(greetingContainer, "h1", {
            text:"Welcome Back!",
            className:"font-bold text-lg"
        }, {
            textAlignment: "w"
        })

        new YanexHeading(greetingContainer, "h1", {
            text:"Admin",
            fg: "lighterFg",
            className: "text-sm"
        }, {
            textAlignment: "w"
        })


        const today = DatetimeUtility.getDateOnly()
        const todayRead = DatetimeUtility.toHumanDate(today)

        new YanexHeading(greetingContainer, "h6", {
            className: "w-full text-sm pt-3 font-bold",
            fg: "lighterFg",
            text: todayRead
        }, {
            textAlignment: "w"
        })

        const time = DatetimeUtility.getTimeOnly()
        const timeRead = DatetimeUtility.toHumanTime(time)

        const timeDis = new YanexHeading(greetingContainer, "h6", {
            className: "w-full text-sm",
            fg: "lighterFg",
            text: timeRead
        }, {
            textAlignment: "w"
        })
        NavBarRef.timeLabel = timeDis

        new YanexTextDivider(navBar)

        const groupedButton = new YanexGroupedButtons(null, {
            reselectable: false,
            selectBg: null,
            selectBorder: "specialColorBorder",
            selectFg: "specialColorFg",
            selectMode: "browse",
        })



        // ADd nav bar buttons
        for(const button of NavBarRecords.navBarButtons.values()) {

            const buttonContainer = new YanexDiv(navBar, {
                bg:null
            });

            const navBut = new YanexButton(buttonContainer, {
                text:button,
                className: "flex w-full py-3 px-1 rounded justify-start min-h-[45px] max-h-[50px]",
                bg: "extraBg",
                hoverBg: "lighterSpecialColorBg",
                selectBg: "lighterBg"
            });
            navBut.widget.addEventListener("click", (e) => (NavBarEvents.navButtonsClicked(e)))
            navBut.addDataset(PublicStringValues.widgetIconDataSetTitle, NavBarRecords.navBarButtonsIcons[button])
            
            // Add sub buttons
            const subButtonContainer = new YanexDiv(buttonContainer, {
                className: "flex flex-col pl-5 pt-1 hidden",
                bg:null
            })

            NavBarRef.navSubButtonContainer[button] = subButtonContainer
            
            switch(button) {
                case "Products":
                    // Set icon dataset
                    for (const subBut of NavBarRecords.productNavBarSubButtons) {
                        const subButton = new YanexButton(subButtonContainer, {
                            text:subBut,
                            className:"py-2 px-3 flex border-l-[2px]",
                            hoverFg: "lighterSpecialColorFg",
                            hoverBorder: "specialColorBorder",
                            hoverBg: null,
                            bg: null,
                            border: "lighterBorder",
                            selectBorder: "specialColorBorder",
                            selectFg: 'specialColorFg'
                        }, {
                            addHoverEffect: true,
                            textAlignment: "w"
                        });
                        groupedButton.addButton(subButton)

                        subButton.addEventListener("click", (e) => {
                            NavBarEvents.productSubButtonsClicked(e)
                        })
                        // subButton.addDataset(PublicStringValues.widgetIconDataSetTitle, 
                        //     NavBarRecords.productNavBarSubButtonsIcons[subBut]
                        // )
                        NavBarRef.navBarSubButtons[subBut] = subButton
                    }
                    break;
                case "Categories":

                    for (const subBut of NavBarRecords.categoriesNavBarSubButtons) {
                       const subButton = new YanexButton(subButtonContainer, {
                            text:subBut,
                            className:"py-2 px-3 flex border-l-[2px]",
                            hoverFg: "lighterSpecialColorFg",
                            hoverBorder: "specialColorBorder",
                            hoverBg: null,
                            bg: null,
                            border: "lighterBorder",
                            selectBorder: "specialColorBorder",
                            selectFg: 'specialColorFg'
                        }, {
                            addHoverEffect: true,
                            textAlignment: "w"
                        });
                        groupedButton.addButton(subButton);

                        subButton.addEventListener("click", (e) => {
                            NavBarEvents.categorySubButtonsClicked(e)
                        })
                        // subButton.addDataset(PublicStringValues.widgetIconDataSetTitle, 
                        //     NavBarRecords.categoriesNavBarSubButtonsIcons[subBut]
                        // )
                        NavBarRef.navBarSubButtons[subBut] = subButton
                    }
                    break;
                case "Variants":

                    for (const subBut of NavBarRecords.variantsNavBarSubButtons) {
                       const subButton = new YanexButton(subButtonContainer, {
                            text:subBut,
                            className:"py-2 px-3 flex border-l-[2px]",
                            hoverFg: "lighterSpecialColorFg",
                            hoverBorder: "specialColorBorder",
                            hoverBg: null,
                            bg: null,
                            border: "lighterBorder",
                            selectBorder: "specialColorBorder",
                            selectFg: 'specialColorFg'
                        }, {
                            addHoverEffect: true,
                            textAlignment: "w"
                        });
                        groupedButton.addButton(subButton)

                        subButton.addEventListener("click", (e) => {NavBarEvents.variantSubButtonsClicked(e)})
                        // subButton.addDataset(PublicStringValues.widgetIconDataSetTitle, 
                        //     NavBarRecords.variantsNavBarSubButtonsIcons[subBut]
                        // )
                        NavBarRef.navBarSubButtons[subBut] = subButton
                    }
                    break;
                
                case "Users":
                    for (const subBut of NavBarRecords.usersNavBarSubButtons) {
                       const subButton = new YanexButton(subButtonContainer, {
                            text:subBut,
                            className:"py-2 px-3 flex border-l-[2px]",
                            hoverFg: "lighterSpecialColorFg",
                            hoverBorder: "specialColorBorder",
                            hoverBg: null,
                            bg: null,
                            border: "lighterBorder",
                            selectBorder: "specialColorBorder",
                            selectFg: 'specialColorFg'
                        }, {
                            addHoverEffect: true,
                            textAlignment: "w"
                        });
                        groupedButton.addButton(subButton)

                        subButton.addEventListener("click", (e) => {NavBarEvents.usersSubButtonsClicked(e)})
                        // subButton.addDataset(PublicStringValues.widgetIconDataSetTitle, 
                        //     NavBarRecords.variantsNavBarSubButtonsIcons[subBut]
                        // )
                        NavBarRef.navBarSubButtons[subBut] = subButton
                    }
                break;
            }
        }
        const otherButtonContainer = new YanexDiv(navBar, {
            className: "flex w-full items-end self-end mt-auto"
        })
        // Other nav bar buttons
        for(const otherButtons of NavBarRecords.otherButtons){
            const navBut = new YanexButton(otherButtonContainer, {
                text:otherButtons,
                className: "flex w-full py-3 px-1 rounded justify-start min-h-[45px] max-h-[50px]",
                bg: "extraBg",
                hoverBg: "lighterSpecialColorBg"
            });
            navBut.addDataset(PublicStringValues.widgetIconDataSetTitle, NavBarRecords.otherButtonsIcons[otherButtons])
            navBut.addEventListener("click", (e) => {NavBarEvents.productOtherButtonsClicked(e)})
        }
    }

    /**
     * Set the shown content
     */
    public static setAdminContent(content: AdminNavBarButtons): void{
        switch(content) {
            case "Products":

        }
    }
}