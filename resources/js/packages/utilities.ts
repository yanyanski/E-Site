import { debounce } from "../public";
import { Numbers } from "./datatypeHelpers";
import { LoginCredentialsData, CursorUtilityDataParam, EventDelegationElemSearchReturnStructure, PrefixedElementAttrReturnStructure, CursorUtilityScrollDataParam} from "./interfaces";
import { ElementStates, ElementStatus, FetchUtilityProcessedResponse, InputTypeLimits, LoadingBorderPositions } from "./typing"
import { YanexHeading } from "./widgets/yanexWidgets";

// Whenever the start() function is called in the FetchUtility, this increments by 1.
let currentFetchUtilProcessId: number = 0;

/**
 * Utility class to simplify fetch requests. Supports latest fetch versioning id.
 */
export class FetchUtility{
     /** HTTP method to use in the request (GET or POST) */
    method: null | "POST" | "GET" = null;

    /** Type of content to send ('json' or 'text'). Undefined for multimedia */
    contentType: undefined | "application/json" | "text/plain" | "multipart/form-data"  = undefined;

    /**The data to be sent to the server */
    data: Record<string, any>| null | LoginCredentialsData = null;

    /**The CSRF Token for this specific request */
    csrfToken : null | string = null;

    /**The expected response from the server */
    expectedServerResponse: "application/json" | "text/html" | "text/plain" | "*/*" = "*/*";

    // Whenever the start() function is called, its value would copy the value of
    // fetchUtilProcessId from the module.
    private thisFetchUtilLatestId: number | null = null;

    /**
     * A utility class to simplify fetch request.
     *  Automatically gets all the data from the form if the 
     * type of the data parameter is a HTMLFormElement.
     * 
     * @param method - HTTP method to use ("POST" or "GET")
     * @param expectedResponse - The expected response from the server. (Defaulted to json)
     * @param data - The payload for the request; either an object or a FormData instance
     * @param contentType - Type of content to send. Undefined or "auto" for multimedia.
     * @param elemParentOfCSRFTarget - The reference for the parent of where the CSRF Token is placed. If null, gets the token from the
     * data parameter if it is an instance of HTMLFormElement. If the data parameter is an instance of record, it would get the csrfToken if it has
     * a key _token in it. 
     *  Defaults to the body if former checks had failed.

     */
    constructor(method: "POST" | "GET", 
        expectedResponse: "json" | "html" | "text" | "any" = "any",
        data: Record<string | number, Object> | HTMLFormElement | null | LoginCredentialsData | FormData = null,
        contentType: "json" | "text" | "auto" = "auto",
        elemParentOfCSRFTarget: null |HTMLElement = null,
    ){
        this.method = method;
        
        switch(contentType.toLowerCase()){
            case "json":
                this.contentType = "application/json";
                break;
            case "text":
                this.contentType = "text/plain";
                break;
            default:
                this.contentType = undefined
        }

        switch(expectedResponse.toLowerCase()){
            case "json":
                this.expectedServerResponse = "application/json";
                break;
            case "html":
                this.expectedServerResponse = "text/html";
                break;
            case "text":
                this.expectedServerResponse = "text/plain";
                break;
            default:
                this.expectedServerResponse = "*/*";
                break;

        }

        if(data instanceof HTMLFormElement){
            const form = new FormData(data);
            this.data = Object.fromEntries(form);
        } else {
            this.data = data;
        }

        // Function for getting csrf token form a specific element
        function getCsrfToken(element: HTMLElement) : string | null {
                const bodyCsrfToken: HTMLInputElement | null = element.querySelector("input[name='_token']");
                if(bodyCsrfToken != null){
                    return bodyCsrfToken.value;
                }
                return null;
            }
        
        // Handle csrf token value retrieval
        
        // Handle csrf token from other possible elements if specified csrf token parent element
        // is null or if X-CSRF-TOKEN or _token key is not present in the data

        if(this.data && (Object.hasOwn(this.data, "_token") || Object.hasOwn(this.data, "X-CSRF-TOKEN"))){
            this.csrfToken = this.data._token ?? this.data["X-CSRF-TOKEN"];
        }
        else if(elemParentOfCSRFTarget === null){

            let hasCsrfToken: boolean = false;
            
            if (data instanceof HTMLFormElement){
                // Get CSRF token from the passed form
                const tokenValue = getCsrfToken(data);
                if(tokenValue != null){
                    this.csrfToken = tokenValue;
                    hasCsrfToken = true;
                }
            }

            // Try getting from the data
            if(hasCsrfToken === false){
                if (typeof data === "object" && data !== null && "_token" in data){
                    const csrfToken = (data as Record<string, unknown>)["_token"];
                    this.csrfToken = csrfToken as string; // or more specific type
                    hasCsrfToken = true;
                }
            }

            // Try getting csrf from the headers
            const csrfToken = document.querySelector('meta[name="csrf-token"]');
            if(csrfToken) {
                const token = csrfToken.getAttribute('content');
                if(token){
                    this.csrfToken = token;
                    hasCsrfToken = true
                }
            }

            // Try getting csrf from the body
            if(hasCsrfToken === false) {
                const tokenValue = getCsrfToken(document.body);
                    if(tokenValue != null){
                        this.csrfToken = tokenValue;
                        hasCsrfToken = true;
                    }
                }
            // Set the csrf token to null
            if(hasCsrfToken === false){
                this.csrfToken  = null;
            }


        } 
        else {

            if(elemParentOfCSRFTarget != undefined) {
                const tokenValue = getCsrfToken(elemParentOfCSRFTarget as HTMLElement);
                if(tokenValue != null) {
                    this.csrfToken = tokenValue
                } else{
                    // Get Token from the body instead
                    const tokenValue = getCsrfToken(document.body);
                    this.csrfToken = tokenValue
                }
            }
        }
    }

    /**
     * Start fetching the data
     * @param url The url to be accessed
     * @param timeout Set timeout (in ms). Returns a status of false if timeout has been reached
     * @param payload The payload to be sent (Optional). If payload is not defined, it will use the payload that was passed in the contructor.
     * @param setId Creates an id for this fetch process if true. Otherwise, ignores setting an id for it.
     * @returns Promise<Response>
     */
    async start(url: string, payload?: Record<string, any>,
        timeout: number = 20000,
        setId: boolean = true,
    ): Promise<Response>{
        if(payload){
            this.data = payload
        }

        if(setId) {
            if(currentFetchUtilProcessId === null) {
                currentFetchUtilProcessId = 0
            } else {
                currentFetchUtilProcessId += 1;
            }
            this.thisFetchUtilLatestId = currentFetchUtilProcessId;
        } else {
            this.thisFetchUtilLatestId = null
        }

        return Promise.race([
            this.startFetch(url, setId), 
            this.startTimeout(timeout)
        ])
    }
        /**
         * Processes the response from the server and returns a 
         *  FetchUtilityProcessedResponse which equates to
         * Promise<{response_status:boolean, message: string, data: any}.
         * The responseStatus determines if the response is successful or not.
         * The message is the message if the responseStatus is unsuccessful
         * The data is the response from the server that processed based on the expectedServerResponse
         */
    async processResponse(response: Response): 
        FetchUtilityProcessedResponse {
            console.log(response)
            try {
                
                if (!response.ok){
                    return {
                        'responseStatus': false,
                        'message': `HTTP Error ${response.status}: ${response.statusText}`,
                        'data': null
                    }
                }

                let data: any = null;

                switch(this.expectedServerResponse){
                    case "application/json":
                        data = await response.json().catch(() => null);
                        break;
                    case "text/plain":
                    case "text/html":
                        data = await response.text();
                        break;
                }
                return {
                    'responseStatus': true,
                    'message': "Request Successfull",
                    'data': data
                }
            } catch(error: any){
                return {
                    "responseStatus": false,
                    'message': error.message || "Unknown Error",
                    'data': null
                }
            }
    }

    private startTimeout(timeout: number): Promise<Response> {
        return new Promise((_, reject) => (
            setTimeout(() => reject(new Error ("Request Timed Out")), timeout)
            )
        )
    }
    

    private async startFetch(url: string, setId: boolean): Promise<Response> {

        const headers = this.getHeaders();

        let requestPayload: Record<string, any>;

        if(this.method === "GET"){
            requestPayload = {
                method: this.method,
                headers: headers,
            }

            if(this.data) {
                requestPayload["body"] = JSON.stringify(this.data);
            }
            
        } else{
            requestPayload = {
                method: this.method,
                headers: headers,
                body: this.data instanceof FormData ? this.data : JSON.stringify(this.data)
            }
        }

        const response = await fetch(url, requestPayload);
        return response;
    }

    private getHeaders(): Object {

        const headers: Record<string, string> = {
            "Accept": this.expectedServerResponse,
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRF-TOKEN": this.csrfToken || ""
        };
        // Include content type if it is explicitly set
        if (this.contentType) {
            headers["Content-Type"] = this.contentType;
        }

        return headers;
    }

    /**
     * Get the latest fetch id
     * If null, this instance haven't made any request yet.
     */
    public get instanceFetchId(): number | null {
        return this.thisFetchUtilLatestId
    }

    /**
     * Get the latest fetch id made throughout the whole calls of this the same instance
     */
    public static get latestGlobalCurrentFetchId(): number {
        return currentFetchUtilProcessId
    }

    /**
     * Checks whether the latest fetch version id of this instance
     * is equivalent to the latest fetch id assigned in the module.
     */
    public get isFetchLatest(): boolean {
        return this.thisFetchUtilLatestId === currentFetchUtilProcessId;
    }
}

export class LoadingBorder{

    /**
     * Adds a loading border on the bottom of the element
     * 
     */
    public static addLoadingBorder(element: HTMLElement | null, position: LoadingBorderPositions = "bottom"): void{
        if (element){
            element.classList.add(`loading-border-${position}`)
        }
    }

    /**
     * Removes a loading border on the top of the element (if it exist)
     */
    public static removeLoadingBorder(element: HTMLElement | null): void{
        if(element){
            element.classList.remove("loading-border-top", "loading-border-bottom")
        }
    }

    /**
     * Adds a loading border by providing the element's id.
     */
    public static addLoadingBorderById(elementId: string, position: LoadingBorderPositions): void {
        const element = document.getElementById(elementId);
        if (element != null){
            this.addLoadingBorder(element)
        }
    }

    /**
     * Removes a loading border by providing the element's id
     */
    public static removeLoadingBorderById(elementId: string): void {
        const element = document.getElementById(elementId);
        if (element != null){
            this.removeLoadingBorder(element)
        }
    }
}

export class CursorUtility{
    private static initialized: boolean = false;
    private static cursorLastClicked: null | Record<"x" | "y", number> = null;

    // Functions for clicks
    private static functions: Array<(param: CursorUtilityDataParam) => void> = []

    // Functions for scroll
    private static scrollFunctions: Array<(param: CursorUtilityScrollDataParam) => void> = []



    public static initialize(): void {
        if (this.initialized === false){
            document.addEventListener("click", (e) => {
                this.recordLastMouseClick(e);
                this.callFunctions(e);
            })

            document.addEventListener('scroll', (e) => {
                this.callScrollFunctions(e);
            })
        }
    }

    private static recordLastMouseClick(e: PointerEvent){
        this.cursorLastClicked = {x: e.clientX, y: e.clientY};
    }

    public static getLastClickPosition(): null | Record<string, number> {
        return this.cursorLastClicked
    }
    
    /**
     * Register a function to be called when a user clicks on the document
     * @param func The function to be called. It should have a single parameter for the data to be passed
     */
    public static addFunctionForClickEmit(func: (param: CursorUtilityDataParam) => void): void {
        if(this.functions.includes(func)) return;
        this.functions.push(func);
    }

    private static callFunctions(e: PointerEvent): void{
        const data: CursorUtilityDataParam = {
            lastClickPosition: this.cursorLastClicked,
            event: e
        }
        this.functions.forEach(func => {
            try{
                func(data)
            } catch(e) {
                console.error("Function Emit Failed: Error: ", e)
            }
        });
    }

    public static addFunctionForScrollEmit(func: (param: CursorUtilityScrollDataParam) => void): void {
        if(this.scrollFunctions.includes(func)) return;
        this.scrollFunctions.push(func);
    }

    public static callScrollFunctions(e: Event) {
        const data: CursorUtilityScrollDataParam = {
            event: e
        }

        this.scrollFunctions.forEach(func => {
            try{
                func(data)
            } catch (e) {
                console.error("Function Scroll Emit Failed. Error: ", e)
            }
        })


    }
}   

export class DelegationUtility{

    /**
     * Find an element on an element
     * @param parentElement The parent element for the target element
     * @param targetElement The target element to be searched
     * @returns interface EventDelegationElemSearchReturnStructure
     */
    public static findElementOnAnElement(parentElement: HTMLElement | null, targetElement: HTMLElement | null): EventDelegationElemSearchReturnStructure{

        const returnVal: EventDelegationElemSearchReturnStructure = {
            isPresent: false,
            element: null
        }
        if (parentElement && targetElement){
            const childNodes = parentElement.childNodes;

            for(const node of childNodes){
                if(node === targetElement) {
                    return {
                        isPresent: true,
                        element: node as HTMLElement
                    }
                }
            }
        }
        return returnVal;
    }

    /**
     * Find an element on an element with both their ids.
     * @param parentElementId The id for the parent element.
     * @param targetElementId The id for the target element
     * @returns interface EventDelegationElemSearchReturnStructure
     */
    public static findElementIdViaElementId(parentElementId: string, targetElementId: string): EventDelegationElemSearchReturnStructure {
        const parentElement = document.getElementById(parentElementId);
        const targetElement = document.getElementById(targetElementId)
        return this.findElementOnAnElement(parentElement, targetElement)
    }

    /**
     * Find an element on an element 
     * @param parentElement The parent element for the target element
     * @param targetElementId The id of the target element
     * @returns interface EventDelegationElemSearchReturnStructure
     */
    public static findElementIdOnAnElement(parentElement: HTMLElement | null, targetElementId: string): EventDelegationElemSearchReturnStructure {
        const targetElement = document.getElementById(targetElementId)
        return this.findElementOnAnElement(parentElement, targetElement)
    }

    /**
     * Find an element on an element via a parent's id
     * @param parentElementId The id of the parent element
     * @param targetElement The target element
     * @returns interface EventDelegationElemSearchReturnStructure
     */
    public static findElementViaAnElementId(parentElementId: string, targetElement: HTMLElement | null): EventDelegationElemSearchReturnStructure {
        const parentElement = document.getElementById(parentElementId);
        return this.findElementOnAnElement(parentElement, targetElement);
    }

    public static delegateUntilClassnameIsFound(element: HTMLElement, classname: string): HTMLElement | null {
        let elementTarget: HTMLElement | null = element;

        while(elementTarget) {
            if(elementTarget.classList.contains(classname)) {
                return elementTarget
            }
            elementTarget = elementTarget.parentElement
            
        }
        return null;
    }

}

export class PrefixingUtility{

    /**
     * Removes the a prefix string on a string. Returns null if either parameter is not string.
     * @param prefixValue The prefix to be removed
     * @param fullValue The full value of the string
     * @returns null/string
     */
    public static cutPrefix(prefixValue: string, fullValue: string): string | null {
        if(typeof(prefixValue) === "string" && typeof(fullValue) === "string") {
           return fullValue.startsWith(prefixValue) ? fullValue.slice(prefixValue.length) : fullValue;
        }
        return ""
    }

    /**
     * Removes the prefix on an element's id. Returns null if element has no id (or is equals to "") or if element is null.
     * @param prefixValue The prefix to be removed
     * @param element The HTML Element
     * @returns string
     */
    public static cutPrefixOnElementId(prefixValue: string, element: HTMLElement | null): PrefixedElementAttrReturnStructure {
        
        const returnVal: PrefixedElementAttrReturnStructure = {
            prefixedValue: "",
            removedPrefix: prefixValue,
            element: element,
        }
        if(element === null || element === undefined){
            return returnVal;
        }

        if(element.id == ""){
            return returnVal;
        }
        
        return Object.assign(returnVal, {
            prefixedValue: this.cutPrefix(prefixValue, element.id)
        })
    }

    /**
     * Removes the prefix on an element's id. Returns null element has no id (or is equals to "") or if element is null. 
     * @param prefixValue The value of the prefix to be removed
     * @param elementId The element's id
     */
    public static cutPrefixOnElementIdById(prefixValue: string, elementId: string) : PrefixedElementAttrReturnStructure {
        const element = document.getElementById(elementId);
        return this.cutPrefixOnElementId(prefixValue, element);
    }

    /**
     * Removes the prefix on an element's custom attribute value. 
     * @param prefixValue The value of the prefix to be removed
     * @param element The target element
     * @param elementAttr The attr name of the element
     * @return string/null
     */
    public static cutPrefixOnElementAttr(prefixValue: string, element: HTMLElement | null, elementAttr: string) : PrefixedElementAttrReturnStructure{
        const returnVal: PrefixedElementAttrReturnStructure = {
            prefixedValue: "",
            removedPrefix: prefixValue,
            element: element,
        }

        if(element !== null && element.hasAttribute(elementAttr)){
            return Object.assign(returnVal, {
                prefixedValue: this.cutPrefix(prefixValue, element.getAttribute(elementAttr) ?? "")
            });
        }
        return returnVal
    }

    /**
     * Removes the prefix on an element's custom attribute by providing the element's id
     * @param prefixValue The value of the prefix to be removed
     * @param elementId The element's id
     * @param elementAttr The attr name of the element
     * @returns string/null
     */
    public static cutPrefixOnElementAttrById(prefixValue: string, elementId: string, elementAttr: string) : PrefixedElementAttrReturnStructure{
        const element = document.getElementById(elementId);
        return this.cutPrefixOnElementAttr(prefixValue, element, elementAttr);
    }
}


export class DatetimeUtility {

    private static timeFormat: string = "en-PH";
    /**
     * Pads numbers < 10 with a leading zero.
     */
    private static pad(value: number): string {
        return value.toString().padStart(2, "0");
    }

    /**
     * Returns the current date in MySQL format (YYYY-MM-DD)
     */
    public static getDateOnly(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = this.pad(now.getMonth() + 1);
        const day = this.pad(now.getDate());
        return `${year}-${month}-${day}`;
    }

    /**
     * Returns the current time in MySQL format (HH:MM:SS)
     */
    public static getTimeOnly(): string {
        const now = new Date();
        const hours = this.pad(now.getHours());
        const minutes = this.pad(now.getMinutes());
        const seconds = this.pad(now.getSeconds());
        return `${hours}:${minutes}:${seconds}`;
    }

    /**
     * Returns the full datetime in MySQL format (YYYY-MM-DD HH:MM:SS)
     */
    public static getDateTime(): string {
        return `${this.getDateOnly()} ${this.getTimeOnly()}`;
    }

    // ---------------------------
    // Human-readable conversions
    // ---------------------------

    /**
     * Converts a MySQL date string ("YYYY-MM-DD") into a human-readable format
     * Example: "2025-10-09" → "October 9, 2025"
     */
    public static toHumanDate(mysqlDate: string): string {
        const date = new Date(mysqlDate.replace(" ", "T"));
        return date.toLocaleDateString( this.timeFormat, {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    }

    /**
     * Converts a MySQL time string ("HH:MM:SS") into a human-readable format
     * Example: "08:22:29" → "8:22 AM"
     */
    public static toHumanTime(mysqlTime: string): string {
        const [hours, minutes, seconds] = mysqlTime.split(":").map(Number);
        const date = new Date();
        date.setHours(hours, minutes, seconds);
        return date.toLocaleTimeString(this.timeFormat, {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });
    }

    /**
     * Converts a MySQL or ISO datetime string into a human-readable format
     * and ensures the output is localized to the Philippines (Asia/Manila).
     *
     * Example:
     * "2025-10-09 08:22:29"  → "October 9, 2025, 8:22 AM"
     * "2025-10-15T06:56:45.000000Z" → "October 15, 2025, 2:56 PM"
     */
    public static toHumanDateTime(mysqlDateTime: string): string {
        // Handle both "YYYY-MM-DD HH:mm:ss" and "YYYY-MM-DDTHH:mm:ss.sssZ"
        let normalized = mysqlDateTime.trim();

        // If format is MySQL style with space, convert to ISO format
        if (normalized.includes(" ") && !normalized.endsWith("Z")) {
            normalized = normalized.replace(" ", "T") + "Z"; // assume it's UTC if no timezone
        }

        const date = new Date(normalized);

        // Use Intl to format in Philippines time zone
        return new Intl.DateTimeFormat(this.timeFormat, {
            timeZone: "Asia/Manila",
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).format(date);
    }


     /**
     * Extracts only the date or only the time from a MySQL DATETIME string.
     * @param mysqlDateTime e.g. "2025-10-09 08:22:29"
     * @param type "date" | "time"
     * @returns "2025-10-09" or "08:22:29"
     */
    public static extractFromDateTime(mysqlDateTime: string, type: "date" | "time"): string {
        if (!mysqlDateTime.includes(" ")) return mysqlDateTime; // Already date-only
        const [datePart, timePart] = mysqlDateTime.split(" ");
        return type === "date" ? datePart : timePart;
    }
}



export class PublicIconLinkCollaterUtility{
    private static SITEPUBLICICONS: string = "/icons/"

    public static getImageLink(image_name: string, image_extension: string = "png"): string {

        return `${this.SITEPUBLICICONS}${image_name}.${image_extension}`;
    }
}

export class HTMLElementUtilities {
    public static setButtonElementState(button: HTMLButtonElement, state: ElementStates): void {
        if(state === "disabled") {
            button.style.cursor = "not-allowed";
            button.classList.add("text-red-400")
            button.classList.remove("text-slate-600", "hover:font-bold");
        } else {
            button.style.cursor = "pointer";
            button.classList.remove("text-red-400")
            button.classList.add("text-slate-600", "hover:font-bold");
        }
    }

    public static setButtonElementStatus(button: HTMLButtonElement, status: ElementStatus): void {
        if(status === "selected") {
            button.classList.add("font-bold");
        } else {
            button.classList.remove("font-bold")
        }
    }
    public static isButtonElementStatusActive(button: HTMLButtonElement): boolean {
        if(button.classList.contains("font-bold")) {
            return true;
        }
        return false
    }

    public static limitInputAcceptedValue(input: HTMLInputElement, limitTo: Array<InputTypeLimits>){
        
        function setLimitation(e: KeyboardEvent){
            if(limitTo.includes("digits")) {
                if(!Numbers.isNumber(e.key)) {
                    e.preventDefault();
                }
            }
        }

        input.addEventListener("keydown", setLimitation)

    }
}
export type ImageCompressionRates = 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1.0;
export class ImageUtility{

    public static async compressImage(file: File, 
        quality: ImageCompressionRates = 0.5,
        loadingLabel: YanexHeading | null = null
    ): Promise<Blob> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            let progress = 0;
            const simulateProgress = setInterval(() => {
                progress += Math.random() * 20; 
                if (progress >= 90) progress = 90;
                
                if (loadingLabel) {
                    loadingLabel.widget.textContent = `${progress.toFixed(0)}%`;
                }
            }, 100);
            reader.onload = (event) => {
                const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (!ctx) return reject("No canvas context");

                // Resize to original dimensions (or scale down)
                canvas.width = img.width;
                canvas.height = img.height;
                try {
                    ctx.drawImage(img, 0, 0, img.width, img.height);

                    // Convert to blob (compress)
                    canvas.toBlob(
                        (blob) => {
                        clearInterval(simulateProgress);

                        if (blob) {
                            resolve(blob);
                        } else {
                            if (loadingLabel)
                            loadingLabel.widget.textContent = "❌ Compression failed";
                            reject("Compression failed");
                        }
                        },
                        "image/jpeg",
                        quality
                    );
                } catch (err) {
                    clearInterval(simulateProgress);
                    reject(err);
                }
            }

            img.src = event.target?.result as string;
            };

            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

}

export class ScrollUtility{
    // Store scroll positions using elements as keys
    private static scrollMap = new WeakMap<Element, number>();

    /**
     * Save the current scrollTop position of an element
     */
    static saveScroll(element: Element) {
        if (!element) return;
        ScrollUtility.scrollMap.set(element, element.scrollTop);
        console.log(element.scrollTop)
    }

    /**
     * Apply the saved scroll position.
     * 
     * @param element The element whose scroll position will be restored.
     * @param animate Whether to animate the scroll restoration (default: false).
     * @param duration Animation duration in ms (default: 300).
     */
    static applyScroll(element: Element, animate: boolean = false, duration: number = 300) {
        if (!element) return;

        const target = ScrollUtility.scrollMap.get(element);
        console.log(element, target, "TARGET")
        if (target === undefined || target === null) return;

        if (!animate) {
            element.scrollTop = target;
            return;
        }

        ScrollUtility.animateScroll(element, target, duration);
    }

    /**
     * Smoothly animate scrolling using requestAnimationFrame
     */
    public static animateScroll(element: Element, target: number, duration: number) {
        const start = element.scrollTop;

        const change = target - start;
        const startTime = performance.now();

        function animationFrame(now: number) {
            const progress = Math.min((now - startTime) / duration, 1);
            const ease = ScrollUtility.easeOutCubic(progress);

            element.scrollTop = start + change * ease;

            if (progress < 1) {
                requestAnimationFrame(animationFrame);
            }
        }

        requestAnimationFrame(animationFrame);
    }

    /**
     * Easing function for smooth animation
     * easeOutCubic gives a nice smooth deceleration
     */
    private static easeOutCubic(t: number): number {
        return 1 - Math.pow(1 - t, 3);
    }

    /**
     * Triggers a callback when an element's scroll reaches a given percentage.
     * If percent is [] and callback is [], then both should have the same lenght. The callbacks[n] would 
     * be called if the scroll reaches the certain percent[n].
     * If percent is a number and callback is [], then all callbacks would be fired when scroll is at percent.
     * If percent is [] and callback is not a [], then it would fire the callback if the scroll is at percent[n]
     *
     * @param element Target scrollable HTMLElement
     * @param percent Percentage (0–100) of scroll height to trigger at
     * @param callback Function executed when condition is met
     * @param direction Optional scroll direction filter ("up" | "down" | null)
     * @param debounceTime The timer for the debounce of the scroll (in ms)
     * @param debounceLead If true, executes the callback immediately the first time it executes
     * @param debounceTrail If true, executes the callback for one last time
     */
    public static onScrollReachPercent(
        element: HTMLElement,
        percent: number | number[],
        callback: ((e: Event) => any) | Array<(e: Event) => any>,
        direction: "up" | "down" | null = null,
        debounceTime: number | null = 100,
        debounceLead: boolean = true,
        debounceTrail: boolean = false,
    ): void {

        const percents = Array.isArray(percent)
            ? percent.map(p => Math.min(100, Math.max(0, p)))
            : [Math.min(100, Math.max(0, percent))];

        const callbacks = Array.isArray(callback) ? callback : [callback];

        const firedPercents = new Set<number>();
        let lastScrollTop = element.scrollTop;

        const handler = (e: Event) => {

            const currentScrollTop = element.scrollTop;
            const maxScrollable = element.scrollHeight - element.clientHeight;
            if (maxScrollable <= 0) return;

            const currentPercent = (currentScrollTop / maxScrollable) * 100;

            const scrollingDown = currentScrollTop > lastScrollTop;
            const scrollingUp = currentScrollTop < lastScrollTop;
            lastScrollTop = currentScrollTop;

            if (
                (direction === "down" && !scrollingDown) ||
                (direction === "up" && !scrollingUp)
            ) {
                return;
            }

            percents.forEach((p, index) => {
                if ((direction === "down" && currentPercent >= p ) ||
                    (direction === "up" && currentPercent <= p)) {

                    // Case 1: percent[] + callback[]
                    if (Array.isArray(percent) && Array.isArray(callback)) {
                        callbacks[index]?.(e);
                    }
                    // Case 2: percent[] + callback
                    else if (Array.isArray(percent)) {
                        callbacks[0](e);
                    }
                    // Case 3: percent + callback[]
                    else if (Array.isArray(callback)) {
                        callbacks.forEach(cb => cb(e));
                    }
                    // Case 4: percent + callback
                    else {
                        callbacks[0](e);
                    }
                }
            });
        };

        if (debounceTime === null) {
            element.addEventListener("scroll", handler);
        } else {
            const debouncedHandler = debounce(
                handler,
                debounceTime,
                debounceLead,
                debounceTrail
            );
            element.addEventListener("scroll", debouncedHandler);
        }
    }
}

export class DocInfoUtility{
     /**
     * Get the current document's width and height.
     * @returns An object containing the width and height of the document.
     */
    public static getDocumentSize(): { width: number; height: number } {
        const width = document.documentElement.clientWidth || window.innerWidth;
        const height = document.documentElement.clientHeight || window.innerHeight;

        return { width, height };
    }

    /**
     * Check if the document size is considered "small" (phones).
     * Tailwind's typical breakpoint: < 768px.
     * @returns True if document width is small, else false.
     */
    public static isDocSizeSmall(): boolean {
        const { width } = this.getDocumentSize();
        return width < 768; // typical mobile breakpoint
    }

    /**
     * Check if the document size is considered "medium" (tablets).
     * Tailwind's typical breakpoint: >= 768px and < 1024px.
     * @param addBreakpoint If true, returns false if screen is >1024px. Else, removes the breakpoint limit, resulting to true.
     * @returns True if document width is medium, else false.
     */
    public static isDocSizeMedium(addBreakpoint: boolean = true): boolean {
        const { width } = this.getDocumentSize();
        if(addBreakpoint) {
            return width >= 768 && width < 1024 // tablet breakpoint
        }
        return width >= 768 
    }

    /**
     * Check if the document size is considered "large" (desktops and beyond).
     * Tailwind's typical breakpoint: >= 1024px.
     * @returns True if document width is large, else false.
     */
    public static isDocSizeLarge(): boolean {
        const { width } = this.getDocumentSize();
        return width >= 1024; // desktop breakpoint
    }
}
export class GlobalEventsUtility {
    // Map eventType 


    private static registeredFuncs: Partial<Record<keyof HTMLElementEventMap, 
    Array<(e: HTMLElementEventMap[keyof HTMLElementEventMap])=>any>>> = {}

    private static initializedListeners: Set<string> = new Set();

    /**
     * Registers a global event callback for any DOM event type.
     *
     * @param eventType The DOM event type to listen for (e.g., "click", "touchstart")
     * @param callback The function to execute when the event occurs
     */
    public static registerGlobalEvent <K extends keyof HTMLElementEventMap>(
        event: K,
        callback: (e: HTMLElementEventMap[keyof HTMLElementEventMap]) => any
    ): void {
        if(!this.registeredFuncs[event]) {
            this.registerListener(event)
        }
        if (!this.registeredFuncs[event]) {
            this.registeredFuncs[event] = []
        }
        this.registeredFuncs[event].push(callback);

    }

    /**
     * Removes a previously registered global event callback.
     *
     * @param eventType The DOM event type
     * @param callback The function to remove
     */
    public static removeGlobalEvent<K extends HTMLElementEventMap>(
        eventType: keyof HTMLElementEventMap,
        callback: (e: Event) => void
    ): void {
        const funcs = this.registeredFuncs[eventType];
        if (!funcs) return;

        const index = funcs.indexOf(callback);
        if (index !== -1) {
            funcs.splice(index, 1);
        }
    }

    /**
     * Initializes a global listener for the specified event type (only once per type).
     *
     * @param eventType The DOM event type to listen for
     */
    private static registerListener(eventType: keyof HTMLElementEventMap): void {
        if (this.initializedListeners.has(eventType)) return;

        this.initializedListeners.add(eventType);

        document.addEventListener(eventType, (e: HTMLElementEventMap[keyof HTMLElementEventMap]) => {
            const funcs = this.registeredFuncs[eventType];
            if (!funcs) return;
            for (const callback of funcs) {
                try {
                    callback(e);
                } catch (error) {
                    console.error(
                        `Error executing global ${eventType} callback:`,
                        error
                    );
                }
            }
        });
    }
}