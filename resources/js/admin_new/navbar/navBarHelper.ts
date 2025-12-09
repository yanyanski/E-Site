import { DatetimeUtility, DocInfoUtility } from "../../packages/utilities";
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

    public static setButtonSelectState(yanexButton: YanexButton): void {
        const isMedium = DocInfoUtility.isDocSizeMedium(false);
        if(isMedium) {
            if(yanexButton && yanexButton.isSelected) {
                yanexButton.deselect();
                
            } else {
                yanexButton.select()
            }
        } else {
            // only select one button
            for(const buttonkey of NavBarRef.currentNavButtonsShown) {
                const button = NavBarRef.navBarButtons[buttonkey];
                if(button && button.isSelected) {
                    button.deselect()
                } else {
                    button.select()
                }
            }

        }
    }

    /**
     * Shows the nav sub navbar buttons of the navbutton. Hides it if it is already shown instead
     * @param navButton The navbutton text
     */
    public static async showSubNavButtons(navButton: AdminNavBarButtons): Promise<void> {
        const subNavBarContainer: YanexDiv | undefined = NavBarRef.navSubButtonContainer[navButton];

        if(NavBarRef.currentNavButtonsShown.has(navButton)){
            if(subNavBarContainer){
                
                await YanexAnimate.animateSlide(subNavBarContainer, "up", 300)
                NavBarRef.currentNavButtonsShown.delete(navButton)

                const isMedium = DocInfoUtility.isDocSizeMedium(false);
                if(isMedium) {
                    subNavBarContainer.addElementClassName("md:hidden")
                }

            }
        } else {
            if(subNavBarContainer){
                const isMedium = DocInfoUtility.isDocSizeMedium(false);
                NavBarRef.currentNavButtonsShown.add(navButton);
                if(isMedium){
                    subNavBarContainer.removeElementClassName("md:hidden")
                } else {
                    // Hide other nav bar container
                    for(const navBut of NavBarRef.currentNavButtonsShown){
                        if(navBut !== navButton) {
                            const container: YanexDiv | undefined = NavBarRef.navSubButtonContainer[navBut]; 
                            if(container) {
                                await YanexAnimate.animateSlide(container, "up", 300)
                                NavBarRef.currentNavButtonsShown.delete(navBut as AdminNavBarButtons)

                            }
                        }
                    }
                };
                YanexAnimate.animateSlide(subNavBarContainer, "down", 300)
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
        const navBar = new YanexDiv(AdminRefs.adminWrapper, {
            className: "flex flex-col gap-2 p-2 overflow-y-auto scroll-modern w-full h-[150px]",
            mdClasses: "md:h-screen md:w-[300px] md:min-w-[180px]",
            bg:"extraBg"
        });

        NavBarRef.navBarContainer = navBar

        const greetingContainer = new YanexDiv(navBar, {
            className: "w-full flex flex-row",
            mdClasses: "md:flex-col md:p-2 md:pb-7",
            bg: null
        })
        new YanexHeading(greetingContainer, "h1", {
            text:"Welcome Back!",
            className:"font-bold text-lg whitespace-nowrap flex items-end justify-start"
        }, {
            textAlignment: "w"
        })

        new YanexHeading(greetingContainer, "h1", {
            text:"Admin",
            fg: "lighterFg",
            className: "text-sm items-end flex justify-start"
        }, {
            textAlignment: "w"
        })

        const dateContainer = new YanexDiv(greetingContainer, {
            className: 'flex w-full flex-col',

            bg: null
        })
        const today = DatetimeUtility.getDateOnly()
        const todayRead = DatetimeUtility.toHumanDate(today)

        new YanexHeading(dateContainer, "h6", {
            className: "w-full text-sm pt-3 font-bold flex justify-end",
            mdClasses: 'md:justify-start',
            fg: "lighterFg",
            text: todayRead
        }, {
            textAlignment: "w"
        })

        const time = DatetimeUtility.getTimeOnly()
        const timeRead = DatetimeUtility.toHumanTime(time)

        const timeDis = new YanexHeading(dateContainer, "h6", {
            className: "w-full text-sm flex justify-end hidden",
            mdClasses: "md:justify-start md:flex",
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
        
        // The container for the nav button containers
        const navButContainer = new YanexDiv(navBar, {
            className: "w-full h-full flex flex-row place-content-between",
            mdClasses: "md:flex-col",
            bg: null
        })

        const mainNavButtons = new YanexDiv(navButContainer, {
            className: "w-full flex flex-row place-content-between",
            mdClasses: "md:flex-col md:place-content-center",
            bg: null
        })

        function initializeNavSubButtonsClasses(container: YanexDiv): void {
            if(DocInfoUtility.isDocSizeMedium(false)) {
                container.addElementClassName(["pl-5", "pt-1", "md:flex-col", "md:flex", "md:hidden"])
            } else {
                container.addElementClassName(["absolute", "hidden", "rounded-md", "z-[999999]"])
            }
        }

        // ADd nav bar buttons
        for(const button of NavBarRecords.navBarButtons.values()) {

            const buttonContainer = new YanexDiv(mainNavButtons, {
                bg:null,

            });

            const navBut = new YanexButton(buttonContainer, {
                text:button,
                className: "flex w-full py-3 px-1 rounded justify-start min-h-[45px] max-h-[50px]",
                bg: "extraBg",
                hoverBg: "lighterSpecialColorBg",
                selectBg: "lighterBg"
            });
            navBut.addTextClass([
                "hidden", "md:flex"
            ])
            navBut.widget.addEventListener("click", (e) => (NavBarEvents.navButtonsClicked(e)))
            navBut.addDataset(PublicStringValues.widgetIconDataSetTitle, NavBarRecords.navBarButtonsIcons[button])
            NavBarRef.navBarButtons[button] = navBut

            // Add sub buttons
            // Classes for this container is added when user clicks to it
            const subButtonContainer = new YanexDiv(buttonContainer, {

                bg:"extraBg"
            })
            
            // const subButtonContainer = new YanexDiv(buttonContainer, {
            //     className: "hidden absolute top-20 pl-5 pt-1",
            //     mdClasses: "md:flex md:flex-col md:hidden md:top-auto md:left-auto",
            //     bg: "extraBg"
            // });

            NavBarRef.navSubButtonContainer[button] = subButtonContainer
            initializeNavSubButtonsClasses(subButtonContainer)

            switch(button) {
                case "Products":
                    // Set icon dataset
                    for (const subBut of NavBarRecords.productNavBarSubButtons) {
                        const subButton = new YanexButton(subButtonContainer, {
                            text:subBut,
                            className:"py-2 px-3 flex border-l-[2px] text-sm whitespace-nowrap",
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
                            className:"py-2 px-3 flex border-l-[2px] text-sm  whitespace-nowrap",
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
                            className:"py-2 px-3 flex border-l-[2px] text-sm  whitespace-nowrap",
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
                            className:"py-2 px-3 flex border-l-[2px] text-sm whitespace-nowrap",
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
        const otherButtonContainer = new YanexDiv(navButContainer, {
            className: "flex h-full self-end mt-auto pl-8 items-start",
            mdClasses: "md:pl-1 md:w-full md:items-end",
            bg:null
        })
        // Other nav bar buttons
        for(const otherButtons of NavBarRecords.otherButtons){
            const navBut = new YanexButton(otherButtonContainer, {
                text:otherButtons,
                className: "flex w-full px-1 rounded justify-start min-h-[45px] max-h-[50px] whitespace-nowrap text-sm",
                mdClasses:"md:text-base",
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