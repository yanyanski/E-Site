/**Either has a type or null/undefined */
export type Optional<T> = T | null | undefined;

/**Either has a type or is void */
export type MayVoid<T> = T | void;

/**Either has a type or is null */
export type Nullable<T> = T | null;

/** An Array type that has an equivalent length of 2*/
export type ArrayPair<T, U> = [T, U];

/**The return type of the processed response from the FetchUtility.processResponse function */
export type FetchUtilityProcessedResponse = Promise<{responseStatus:boolean, message: string, data: any}> 

export type FetchUtilityRawProcessedResponse = {responseStatus:boolean, message: string, data: any}

/**The position of the loading border */
export type LoadingBorderPositions = "bottom" | "top";

/**Modal buttons */
export type ModalButtons = "close" | "yes-no" | "okay-close" | "okay";

/**Tailwind colors */
export type TCSSColors = "red" | "orange" | "amber" | "yellow" | 
                        "lime" | "green" | "emerald" | "teal" | "cyan" | 
                        "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" |
                        "pink" | "rose" | "slate" | "gray" | "zinc"| "neutral" | "stone";


/**LARAVEL Eloquent pagination types */
export type LaravelPaginationTypes = "simple" | "normal";

/**Db Infos */
export type DbInfoUserstatus = "blocked" | "admin" | "user";

/** HTML ELEMENTS */
export type ElementStates = "enabled" | "disabled";
export type ElementStatus = "selected" | "none";
export type InputTypeLimits = "digits" | "characters" | "specialCharacters"

/** Custom modal */
export type CustomModalButtonLayout = "row" | "column";

export type SizeTypes = "px" | "%" | "vh"

