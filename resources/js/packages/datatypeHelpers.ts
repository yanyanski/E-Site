import { Keys } from "../public"

export type Conventions = "kebabcase" | "snakecase" | "camelcase" | "spacecase" | "title" | "uppercase" | "lowercase"
    
export class Strings {

    /** -----------------------
     *  Normalize string → tokens
     *  ----------------------- */
    private static tokenize(value: string, convention: Conventions): string[] {
        switch (convention) {
            case "kebabcase":
                return value.split("-");

            case "snakecase":
                return value.split("_");

            case "spacecase":
                return value.split(/\s+/g);

            case "camelcase":
                // Split camelCase or PascalCase
                return value
                    .replace(/([a-z])([A-Z])/g, "$1 $2")
                    .split(/\s+/)
                    .map(v => v.toLowerCase());

            case "title":
                return value.split(/\s+/).map(v => v.toLowerCase());

            case "uppercase":
            case "lowercase":
                // guess separators
                return value.includes("_")
                    ? value.split("_")
                    : value.includes("-")
                        ? value.split("-")
                        : value.split(/\s+/);

            default:
                return value.split(/\s+/);
        }
    }

    /** ---------------------------
     *  Convert tokens → convention
     *  --------------------------- */
    private static build(tokens: string[], convention: Conventions): string {
        switch (convention) {
            case "kebabcase":
                return tokens.join("-").toLowerCase();

            case "snakecase":
                return tokens.join("_").toLowerCase();

            case "camelcase":
                return (
                    tokens[0].toLowerCase() +
                    tokens
                        .slice(1)
                        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                        .join("")
                );

            case "spacecase":
                return tokens.join(" ").toLowerCase();

            case "title":
                return tokens
                    .map(t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase())
                    .join(" ");

            case "uppercase":
                return tokens.join(" ").toUpperCase();

            case "lowercase":
                return tokens.join(" ").toLowerCase();

            default:
                return tokens.join(" ");
        }
    }

    /** ---------------------------------------
     *   General converter used by all methods
     *   --------------------------------------- */
    public static convertCase(
        value: string,
        valueConvention: Conventions,
        trim: boolean,
        returnConvention: Conventions
    ): string {

        if (trim) value = value.trim();

        const tokens = this.tokenize(value, valueConvention);
        return this.build(tokens, returnConvention);
    }


    /* --------------------------------------------------
     *   Public API: toKebabCase, toSnakeCase, toCamelCase
     * -------------------------------------------------- */

    static toKebabCase(
        value: string,
        valueConvention: Conventions,
        trim: boolean = true,
    ): string {
        return this.convertCase(value, valueConvention, trim, "kebabcase");
    }

    static toSnakeCase(
        value: string,
        valueConvention: Conventions,
        trim: boolean = true,
    ): string {
        return this.convertCase(value, valueConvention, trim, "snakecase");
    }

    static toCamelCase(
        value: string,
        valueConvention: Conventions,
        trim: boolean = true,
    ): string {
        return this.convertCase(value, valueConvention, trim, "camelcase");
    }


    public static toTitleCase(str: string, trim: boolean = true): string {
        /**
         * Returns a title case of the string
         */
        // Copied this from stack overflow. Don't know what this do since I'm not yet
        // versed in regex
        if(!str) {
            return ""
        }
        const titledCase = str.replace(
            /\w\S*/g,
            text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
        );

        return trim? titledCase.trim() : titledCase;

        }

}

interface DictChangeKeyReturn {
    status: boolean,
    data: Record<string | number, unknown>
}
export class Dict {
    /**
     * Omit a data from a dictionary by their key
     * @param obj A dictionary object
     * @param keysToRemove An array of string / number with the keys to be omitted
     * @returns Object with the omitted keys
     */
    public static omit(obj: Record<string | number, unknown> , keysToRemove: Array<number | string>): Record<string | number, unknown>{
        return Object.fromEntries(
            Object.entries(obj).filter(([key]) => !keysToRemove.includes(key))
        );
    }

    /**
     * Changes the key of an object
     * @param obj The source dictionary object
     * @param oldKey The key to be replaced
     * @param newKey The key for the replacement
     * @param direct If true, directly assigns the new keys to the source object.
     */
    public static changeKey(obj: Record<string | number, any>, 
        oldKey: string, 
        newKey: string,
        direct: boolean = true
    ): DictChangeKeyReturn {
        const clonedObject = {...obj};
          const value = clonedObject[oldKey];
        if(Object.hasOwn(obj, oldKey)) {

            clonedObject[newKey] = value;
            delete clonedObject[oldKey]
            
            if(direct) {
                obj[newKey] = value
                delete obj[oldKey]
            }

            return {
                status: true,
                data: clonedObject
            }
        }

        return {
            data: clonedObject,
            status: false
        }
    }

    /**
     * Stitches an dictionary into one dictionary. If both objects have the same key, its value would be overriden instead.
     * @param objs The dictionary to be stitched
     */
    public static stitch(objs: Array<Record<any, any>>): Record<any, any> {
        const returnVal = {};

        for(const obj of objs) {
            Object.assign(returnVal, obj)
        }
        return returnVal
    }
}

export class Numbers {
    public static isNumber(char: string, event?: KeyboardEvent){
        // Allow combinations like Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, etc.
        if (event?.ctrlKey || event?.metaKey) {
            return true;
        }

        // Allow control keys (non-character keys)
        if (Keys.specialKeys.includes(char)) {
            return true;
        }

        // Trim whitespace and check if it's a single character
        if (!char || char.trim() === "") return false;

        // Only allow digits 0–9
        return !isNaN(Number(char)) && char >= "0" && char <= "9";
            }
}

export class Arrays {
    /**
     * Converts all values in an array to strings.
     * @param arr The array whose values will be converted to strings.
     * @returns A new array with all elements stringified.
     */
    public static stringify(arr: Array<any>): Array<string> {
        if (!Array.isArray(arr)) {
            throw new TypeError("ArrayUtilities.stringify expects an array as argument.");
        }
        return arr.map(item => String(item));
    }
}