import { ElementStates } from "./typing"

/**The default data structure of any return type concerning status checks or any 
 * processes that checks something
 * @var status The result status of the check
 * @var message The message for the result
 */
export interface StatusReturnType {
    "status": boolean,
    "message": string,

}
/**The default data structure of any return type concerning status checks or any 
 * processes that checks something
 * @var status The result status of the check
 * @var message The message for the result
 * @var data An extra data for the check (Usually a Record or Dictionary)
 */
export interface DataStatusReturnType extends StatusReturnType {
    "data": null | Record<string | number, Object>
}

/**
 * The required data taken from a login form or something with the form's CSRF token.
 * @var _token The value of the csrf input
 * @var username The entered username in an input
 * @var password The entered password in an input (non-hashed)
 */
export interface LoginCredentialsData{
    "_token"?: string,
    "X-CSRF-TOKEN"?: string,
    "username": string,
    "password": string
}

export interface TitleLabelRecord {
    "title": string,
    "message": string,
    "footerMessage"?: string
}

//-------------------------------Buttonic Modal Click Interfaces ------------------------------

/**
 * @var title The title for the modal
 * @var extraTitle The extra title for the modal
 * @var closeOnOutsideClick Closes the modal if a click was detected outside of it
 * @var closeOnScroll Closes the modal if the use scrolls
 */
export interface ModalAtClickAdditionalData{
    title?: string,
    extraTitle?: string,
    closeOnOutsideClick?: boolean
    closeOnScroll?: boolean
}

export interface ModalAtClickPassedParam {
    event: PointerEvent
}

/**
 * @var buttonText The text of the button
 * @var buttonId The id for the button
 * @var buttonCallable The callable function to be called if the button is clicked
 * @var buttonIconLink The link for the icon of the button
 */
export interface ModalButtonContentParamStructure{
    buttonText?: string
    buttonId?: string
    buttonCallable?: (param: ModalAtClickPassedParam) => void | Promise<void>
    buttonIconLink?: string
}

/**
 * @var button The html button
 * @var state The current state of the button
 */
export interface ButtonicModalCreatedButtonStructure {
    button: HTMLButtonElement,
    state: ElementStates,
}

export interface ButtonicModalUpdateButtonStructure {
    state?: ElementStates,
    newText: string
}


//-------------------------------CursorUtility Interfaces ------------------------------

export interface CursorUtilityDataParam {
    lastClickPosition: Record<'x' | "y", number> | null
    event: PointerEvent
}

export interface CursorUtilityScrollDataParam {
    event: Event
}



//------------------------------- Event Delegation Interfaces------------------------------

export interface EventDelegationElemSearchReturnStructure {
    isPresent: boolean,
    element: HTMLElement | null,
}

//------------------------------- PrefixingUtility Interfaces------------------------------

export interface PrefixedElementAttrReturnStructure {
    prefixedValue: string,
    removedPrefix: string,
    element: HTMLElement | null,
}


//------------------------------- Messages Modal ------------------------------
export interface MessageModalPassedParam {
    actionValue: boolean
    actionPressed: string
}