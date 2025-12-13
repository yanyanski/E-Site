import { Conventions, Strings } from "../../datatypeHelpers";
import { YanexDiv, YanexElement, YanexHeading } from "../yanexWidgets";
import { YanexWidgetsHelper } from "../yanexWidgetsHelper";
import { YanexWidgetCalculator } from "../yanexWidgetUtilities";

type YanexTreeviewParts = "treeview" | "heading" | "rowContainer" | "treeviewPulseContainer" | "loadingRowContainer" | "noRowText";
type YanexTreeviewSelectModes = "browse" | "multi";
export type YanexTreeviewEvents = "rowSelect" | "rowDeselect";

export interface YanexTreeviewEvent{
    rowId: string,
    row: YanexElement,
    treeview: YanexTreeview,
    originalEvent: PointerEvent,
    yanexEventType: YanexTreeviewEvents
}



// TODO add event listener to the treeviewhp
export interface YanexTreeviewColumnStructure {
    columnName: string,
    columnWidth?: "w-full" | "w-fit",
    imageLink?: string | null,
}

export interface YanexTreeviewInitData {
    selectMode?: YanexTreeviewSelectModes,
    noRowText?: string,
    reselectable?: boolean
}


export default class YanexTreeview{

    private columns: Array<YanexTreeviewColumnStructure>;

    private parent: YanexElement | HTMLBodyElement | null = null;

    private initialData!: YanexTreeviewInitData | null;

    // The dataset name of the row
    private rowDataSetAttrName: string = "yanexTreeviewRowId"
    
    // The current row
    private currentRowCounter: number = 0;

    // The row data with the key as the row id and the value as the row data
    private rowData: Record<string, Record<string, any>> = {}

    // Storage for row data widget
    private rowWidgets: Record<string, YanexDiv> = {};

    // Store the selected rows
    private selectedRows: Record<string, YanexDiv> = {};


    private treeviewParts: Record<YanexTreeviewParts, YanexElement | null> = {
        treeview: null,
        heading: null,
        rowContainer: null,
        treeviewPulseContainer: null,
        loadingRowContainer: null,
        noRowText: null
    };
    
    // Flag if the row container of the treeview was calculated
    private rowContainerHeightCalculated: boolean = false;

    // Storage for added events for the treeview
    private treeviewEvents: Partial<Record<YanexTreeviewEvents, CallableFunction>> = {};

    // Flag if the treeview would igore the events
    private eventState: boolean = true;

    constructor(parent: YanexElement | HTMLBodyElement | null,
        columns: Array<YanexTreeviewColumnStructure>,
        initialData: YanexTreeviewInitData | null = null
    ) {
        this.initialData = initialData;
        this.columns = columns;
        
        this.parent = parent;

        this.setDefaultData();

        this.build();

        this.setBehaviour();
    }

    private setBehaviour(): void {
        if(this.initialData?.noRowText) {
            this.createNoRowText()
        }
    }

    private createNoRowText(): void {
        const label = new YanexHeading(this.treeviewParts.rowContainer, "h1", {
            text: this.initialData?.noRowText,
            className: "text-xs p-4 mt-1",
            bg: "lighterBg"
        });
        this.treeviewParts.noRowText = label;
    }

    /**
     * Set default data 
     */
    private setDefaultData(): void {
        const normalizedDefaultData: Array<YanexTreeviewColumnStructure> = [];
        const defaultData: YanexTreeviewColumnStructure = {
            columnName: "",
            columnWidth: "w-full",
            imageLink: null
        }
        for (const columnData of this.columns) {
            const newColData = {};
            Object.assign(newColData, defaultData);
            normalizedDefaultData.push(
                Object.assign(newColData, columnData)
            )
        }
        this.columns = normalizedDefaultData

        // Set default initial data for the treeview's configuration
        const initDefaultData: YanexTreeviewInitData = {
            selectMode: "multi",
            reselectable: true
        }

        Object.assign(initDefaultData, this.initialData);
        this.initialData = initDefaultData;
    }


    /**
     * Create the heading of the treeview
     */
    private createHeading(){
        const heading = new YanexDiv(this.treeviewParts.treeview, {
            bg: "lighterContrastBg",
            className: "flex w-full gap-1"
        })

        for(const columnData of this.columns) {

            // Create a container for the column
            new YanexHeading(heading, "h1", {
                bg:"defaultBg",
                text:columnData.columnName,
                className:`${columnData.columnWidth} p-2`
            });
        }

    }

    /**
     * Build the initial structure oif the treeview
     */
    private build(): void{

        // Create treeview container
        const treeview = new YanexDiv(this.parent || null, {
            className: "p-2 w-full"
        })
        this.treeviewParts.treeview = treeview;

        this.createHeading();

        // The content holder
        this.treeviewParts.rowContainer = new YanexDiv(treeview, {
            className: "w-full flex flex-col gap-1 overflow-y-auto scroll-modern"
        })

    }


    /**
     * Creates a row ui
     */
    private buildRow(rowData: Array<string | number>): Record<"widget" | "id", YanexDiv | number> {
        const rowContainer = new YanexDiv(this.treeviewParts.rowContainer, {
            className: "flex w-full gap-1",
            bg:"lighterBg",
            hoverBg: "lighterSpecialColorBg"
        }, {
            addHoverEffect:true,
            isClickable:true
        });
        // Add row id data
        const rowId = this.currentRowCounter;

        const text = new YanexHeading(rowContainer, "h6", {
            text:rowId.toString()
        });
        text.widget.dataset[this.rowDataSetAttrName] = rowId.toString();
        text.hide();
        
        for(const [index, data] of rowData.entries()){
            const dataContainer = new YanexDiv(rowContainer, {
                className: `${this.columns[index].columnWidth} p-2 pointer-events-none`,
                bg:null
            })

            // Add the 
            new YanexHeading(dataContainer, "h1", {
                text: data.toString(),
                className: "pointer-events-none"
            })
        }
        this.currentRowCounter += 1;

        return {
            "widget": rowContainer,
            "id": rowId
        }
    }

    /**
     * Adds a row 
     * @param data The data of the row
     * @returns The row Id
     */
    public addRow(data: Array<string | number>): string {
        const row = this.buildRow(data);
        
        if(row.widget) {

            const collatedRowData: Record<string, any> = {};
            // Store the data as dictionary column:data
            for(const [index, rowData] of data.entries()) {
                const columnName = this.columns[index].columnName;
                collatedRowData[columnName] = rowData
            }

            this.rowData[row.id.toString()] = collatedRowData;
            this.rowWidgets[row.id.toString()] = row.widget as YanexDiv;

            (row.widget as YanexDiv).addEventListener("click", (e) => {this.handleTreeviewRowClicks(e)});

            // Hide the no row text
            if(this.treeviewParts.noRowText) {
                this.treeviewParts.noRowText.hide();
            }
        }
        
        return row.id.toString()
        
    }

    /**
     * Creates the event data to be sent to the callback functions
     */
    private createEventData(data: Partial<YanexTreeviewEvent>): YanexTreeviewEvent {
        // Add additional data
        const additionalData: Partial<YanexTreeviewEvent> = {
            treeview: this,
        }
        return Object.assign(data, additionalData) as YanexTreeviewEvent;
    }

    /**
     * Handle the treeview row clicks
     * @param event Pointer event
     */
    private handleTreeviewRowClicks(event: PointerEvent): void {
        if(this.eventState === false) return;

        const target = event.target as HTMLDivElement;

        // Check if the reselectable is false
        if(this.initialData!.reselectable === false){
           const idHolder = target.querySelector("h6");
           if(idHolder) {
                if(this.getActivatedRowIds().includes(idHolder.textContent)) {
                    // Ignore this click
                    return;
                }
           }
        }
        
        // Get yanex instance
        if(target) {
            const yanex = YanexWidgetsHelper.getYanexReference(target);

            // Allow multiple selection if multi mode
            if(yanex){
                // Get the id holder of this row
                const yanexIdHolder = yanex.querySelector("yanexH6");
                let rowId = null;
                
                if(yanex.status === "selected") {
                    
                    if(yanexIdHolder) {
                        rowId = yanexIdHolder.widget.textContent;
                    }

                    if(rowId) {
                        this.deactivateRow(rowId)
                    }

                    // Further added events
                    if(this.treeviewEvents.rowDeselect) {
                        const ev = this.createEventData({
                            originalEvent: event,
                            rowId: rowId || "",
                            row: yanex,
                            yanexEventType:"rowDeselect"
                        })
                        const callBack = this.treeviewEvents["rowDeselect"];
                        callBack(ev)
                    }

                } else {
                    yanex.setStatus("selected", "deep", true, false)
                    if(yanexIdHolder) {
                        rowId = yanexIdHolder.widget.textContent;
                    }

                    if(rowId) {
                        if(this.initialData?.selectMode === "browse") {
                            for(const rowId of Object.keys(this.selectedRows)) {
                                this.deactivateRow(rowId)
                            }
                        }
                        this.selectedRows[rowId] = yanex
                    }

                    // Further added events
                    if(this.treeviewEvents.rowSelect) {
                          const ev = this.createEventData({
                            originalEvent: event,
                            rowId: rowId || "",
                            row: yanex,
                            yanexEventType:"rowSelect"
                        })
                        const callBack = this.treeviewEvents["rowSelect"];
                        callBack(ev)
                    }
                }

            }
        }
    }

    /**
     * Get the current selected rows
     * @returns Array of selected row ids
     */
    public getActivatedRowIds(): Array<string>{
        return Array.from(Object.keys(this.selectedRows))
    }

    /**
     * Get all the activated row data
     * @param setColumnConvention Sets the keys with the desired convention. Null for none modification
     * @returns Array 
     */
    public getActivatedRowData(setColumnConvention: Conventions | null = null): Array<Record<string, any>> {
        const returnVal = [];

        for(const key of Object.keys(this.selectedRows)) {
            const rowData = this.rowData[key];
            if(rowData) {
                const rData: Record<string, any> = {};
                if(setColumnConvention) {
                    for(const [key, value] of Object.entries(rowData)) {
                        switch (setColumnConvention) {
                            case "kebabcase":
                                rData[Strings.toKebabCase(key, "lowercase", true)] = value;
                                break;
                            case "snakecase":
                                rData[Strings.toKebabCase(key, "lowercase", true)] = value;
                                break;
                        }
                    }
                    returnVal.push(rData)

                } else {
                    returnVal.push(rowData)
                }
            }
        }
        return returnVal
    }

    /**
     * Activates a row's status to be selected
     * @param rowId The row id
     */
    public activateRow(rowId: string): void {
        const rowWidget = this.rowWidgets[rowId];

        if(rowWidget) {
            rowWidget.setStatus("selected", "deep", true, false);
            this.selectedRows[rowId] = rowWidget
        }
    }

    /**
     * Deactivates a row status
     * @param rowId the row id
     */
    public deactivateRow(rowId: string | "all"): void {
        if(rowId === "all") {
            for(const [row, rowContainer] of Object.entries(this.selectedRows)) {
                rowContainer.setStatus("none", "deep", true, false);
                delete this.selectedRows[row]
            }
            
        } else {
            const rowWidget = this.selectedRows[rowId];

            if(rowWidget) {
                rowWidget.setStatus("none", "deep", true, false)
                delete this.selectedRows[rowId]
            }
        }

    }

    /**
     * Deletes a row
     * @param rowId The row Id to be deleted
     */
    public deleteRow(rowId: string | "all"): void {
        if(rowId === "all") {
            for(const row of Object.values(this.rowWidgets)) {
                row.hide(true);
                delete this.rowData[rowId]
                delete this.rowWidgets[rowId]
            }
            this.rowData = {};
            this.rowWidgets = {};
            this.selectedRows = {};

        } else {
            const row = this.rowWidgets[rowId];
            if(row) {
                row.hide(true);
                delete this.rowData[rowId]
                delete this.rowWidgets[rowId]

                // Remove if the row is also selected
                const rowSelected = this.selectedRows[rowId];
                if(rowSelected) {
                    delete this.selectedRows[rowId]
                }
            }   
        }

        if(this.treeviewParts.noRowText &&
            Object.keys(this.rowData).length === 0) {
            this.treeviewParts.noRowText.show();
        }

    }

    /**
     * Clears all activated rows
     */
    public clearActivatedRows(): void {
        for(const rowId of Object.keys(this.selectedRows)) {
            this.deactivateRow(rowId)
        }
    }

    /**
     * Retrieves the data of the row id
     * @param rowId The rowIds to be retrieved.
     */
    public getRowData(rowId: Array<string> | string): Array<Record<string, any>> {
        const returVal: Array<Record<string, any>> = [];

        if(typeof rowId === "string") {
            rowId = [rowId]
        }

        for(const rid of rowId) {
            const rowData = this.rowData[rid]
            if(rowData) {
                returVal.push(rowData)
            }
        }
        return returVal
    }

    /**
     * Show the treeview 
     * @param parent The parent for this treeview. If null, uses the parent that passed on the constructor
     */
    public show(parent: YanexElement | null = null): void {
        if(this.treeviewParts.treeview) {
            if(parent) {
                parent.appendChild(this.treeviewParts.treeview)
            } else {
                if(this.parent) {
                    if(this.parent instanceof HTMLBodyElement) {
                        this.parent.appendChild(this.treeviewParts.treeview.widget)
                    } else {
                        this.parent.appendChild(this.treeviewParts.treeview)
                    }
                }
            }
        }
        if (this.rowContainerHeightCalculated) return;

        requestAnimationFrame(() => {

            if(this.treeviewParts.rowContainer && this.treeviewParts.treeview) {
                            // Get the root parent of this treeview
                let element: HTMLElement = this.treeviewParts.treeview.widget
                while(true) {

                    const elementParent = element.parentElement as HTMLElement | null;

                    if(elementParent === null) {
                        // The element is now the body element
                        element = element
                        break;
                    } else if (elementParent instanceof HTMLDialogElement) {
                        element = elementParent;
                        break;
                    }
                    element = elementParent
                }

                const height = YanexWidgetCalculator.computeRemainingHeightWithinContainer(
                    this.treeviewParts.rowContainer.widget,
                    element as HTMLBodyElement | HTMLDialogElement
                )
                this.treeviewParts.rowContainer.widget.style.maxHeight = `${height.toFixed()}px`;
                this.rowContainerHeightCalculated = true;
            }

        })
    }

    /**
     * Updates the row values of the treeview
     * @param rowId The rowId of the row to be updated
     * @param rowValue The new row value
     */
    public updateRow(rowId: string, rowValue: Array<string | number>): void {
        const row = this.rowWidgets[rowId]

        if(row) {
            const head1Elements = row.querySelectorAll("yanexH1");
            const newRowValue: Record<string, any> = {};

            for(const [index, headElem] of head1Elements.entries()) {
                headElem.text = rowValue[index];
                newRowValue[this.columns[index].columnName] = rowValue[index]
            }

            const rowData = this.rowData[rowId];
            if(rowData) {
                this.rowData[rowId] = newRowValue;
            }
        }
    }



    public addEventListener(event: YanexTreeviewEvents, callback: (e: YanexTreeviewEvent) => any) {
        this.treeviewEvents[event] = callback
    }

    /**
     * Sets the event state of the treeview
     * @param state If true, events (such as clicks) will normally work. Otherwise, it would ignore events.
     */
    public setEventsState(state: boolean): void {
        this.eventState = state
    }
    
    /**
     * Removes the pulsing row effects
     */
    public hideLoadingRow(): void {

        if(this.treeviewParts.loadingRowContainer) {
            this.treeviewParts.loadingRowContainer.hide(true)
            this.treeviewParts.loadingRowContainer = null
        }
        if(Object.keys(this.rowData).length !== 0) {
            // Show the no text row info if rowData is empty
            if(this.treeviewParts.noRowText?.isHidden === true) {
                this.treeviewParts.noRowText.hide()
            }
        }
        
    }

    /**
     * Adds a pulsing row effect
     * @param rowCount  The count of the pulsing row
     */
    public addLoadingRow(rowCount: number = 3): void {
        // Temporary hide the no text row if row is loading
        if(this.treeviewParts.noRowText?.isHidden === false) {
            this.treeviewParts.noRowText.hide()
        }

        if(this.treeviewParts.loadingRowContainer) {
            this.treeviewParts.loadingRowContainer.show()
        } else {
            if(this.treeviewParts.rowContainer) {
                const rowContainer = new YanexDiv(this.treeviewParts.rowContainer, {
                    className: "w-full flex flex-col gap-1 animate-pulse"
                })

                this.treeviewParts.loadingRowContainer = rowContainer;

                // Creates a loading rows
                for(let i = 0; i <= rowCount; i++){
                    new YanexDiv(rowContainer, {
                        className: "w-full h-[35px] rounded",
                        bg:"lighterBg"
                    });
                }
            }
        }
    }


    // ---------------------------- GETTERS --------------------------------------------- 
    /**
     * Get the count of selected rows
     */   
    public get selectedRowCount(): number {
        return Object.keys(this.selectedRows).length;
    }

    
    // ---------------------------------- SETTERS ----------------------
    public set noRowText(value: string) {
        this.initialData!.noRowText = value;

        if(this.treeviewParts.noRowText === null) {
            this.createNoRowText()
        }
        this.treeviewParts.noRowText!.text = value;
    }
}