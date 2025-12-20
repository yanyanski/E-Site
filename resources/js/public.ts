
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


