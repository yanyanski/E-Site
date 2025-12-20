
export class PublicStringValues {
    public static widgetIconDataSetTitle: string = "yanexWidgetIcon"
    public static currency: string = "$"
}

export class PublicNumberValues {
    public static paginationLimit: number = 10;
}

export class PublicLinks {

    public static GETPRODUCTVARIANTS: string = "/public/products/variants";

    public static GETPRODUCTCATEGORIES: string = "/public/products/categories";

    public static GETPRODUCTLISTS: string = "/public/products/lists";

    public static GETPRODUCTYPES: string = "/public/products/types";

    public static GETICONS: string = "/public/icons"
}

export class Keys{
    private static  readonly specialKeyList: Array<string> = [
    "Backspace",
    "Tab",
    "Enter",
    "Escape",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Delete",
  ];

  public static get specialKeys(): Array<string> {
    return this.specialKeyList
  }
}

export function getCsrf(): string | null{
    const csrfToken = document.querySelector('meta[name="csrf-token"]');
    if(csrfToken) {
        const token = csrfToken.getAttribute('content');
        if(token){
            return token
        }
    }
    return null
}

export function appendCsrfToForm(csrfToken: string, form: FormData): void {
    form.append("X-CSRF-TOKEN", csrfToken)
}

/**
 * Returns a debounced version of a function.
 * ! Don't set leading and trailing to false. The callback will not fire.
 * @param func Function to debounce
 * @param wait Delay in milliseconds
 * @param leading If true, callback is triggered immediately on first call
 * @param trailing If true, invoke on the trailing edge (last call)
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    leading: boolean = false,
    trailing: boolean = true
): (...args: Parameters<T>) => void {

    let timeout: number | undefined;
    let lastArgs: Parameters<T> | null = null;

    return (...args: Parameters<T>) => {
        const isCold = timeout === undefined;
        lastArgs = args;

        // LEADING EDGE
        if (leading && isCold) {
            func(...args);
        }

        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = window.setTimeout(() => {
            // TRAILING EDGE
            if (trailing && (!leading || !isCold)) {
                if (lastArgs) {
                    func(...lastArgs);
                }
            }

            timeout = undefined;
            lastArgs = null;
        }, wait);
    };
}

