import { YanexElement } from "./yanexWidgets";


export class YanexWidgetCalculator{

    // Function that calculates the height of an element deeply nested within a body document or dialog
    public static computeRemainingHeightWithinContainer(
        element: HTMLElement,
        container?: HTMLBodyElement | HTMLDialogElement
        ): number {
            // Default container is the dialog ancestor or <body>
            if (!container) {
                container = (element.closest("dialog") || document.body) as HTMLBodyElement | HTMLDialogElement;
            }

            const elemRect = element.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            // Remaining space from the element’s top to the bottom edge of the container
            let remaining = containerRect.bottom - elemRect.top;
            const parent: HTMLElement | null = element.parentElement;
            if(parent &&
                parent !== container
             ) {
                for(const child of parent.children){
                    if(child !== element) {
                        remaining -= child.getBoundingClientRect().height;
                    }
                }
             }

            // Ensure it doesn’t go negative
            return Math.max(0, remaining <= 0? containerRect.bottom - elemRect.top : remaining);
    }

}

export class YanexAnimate{
    /**
     * Rotate element to any degree
     * @param element The yanex element to be rotated
     * @param fromDeg From which the degree of rotation
     * @param toDeg To which the degree of rotation
     * @param duration The duration of the rotation (in ms)
     */
    static animateRotate(element: YanexElement, fromDeg: number, toDeg: number, duration: number = 500) {
        const start = performance.now();

        function frame(now: any) {
            const progress = Math.min((now - start) / duration, 1);
            const current = fromDeg + (toDeg - fromDeg) * progress;

            element.widget.style.transform = `rotate(${current}deg)`;

            if (progress < 1) requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
    }


   static async animateSlide(
    element: YanexElement,
    direction: "up" | "down" | "left" | "right",
    duration: number = 500
    ): Promise<void> {
    return new Promise((resolve) => {
        const el = element.widget;
        el.style.overflow = "hidden"; // required

        el.classList.remove("hidden");

        // Measure natural size
        const fullHeight = el.scrollHeight;
        const fullWidth = el.scrollWidth;

        let startValue = 0;
        let endValue = 0;
        let property = "";

        switch (direction) {
            case "down":
                property = "height";
                startValue = 0;
                endValue = fullHeight;
                break;

            case "up":
                property = "height";
                startValue = fullHeight;
                endValue = 0;
                break;

            case "right":
                property = "width";
                startValue = 0;
                endValue = fullWidth;
                break;

            case "left":
                property = "width";
                startValue = fullWidth;
                endValue = 0;
                break;
        }

        const start = performance.now();

        function frame(now: number) {
            const progress = Math.min((now - start) / duration, 1);
            const current = startValue + (endValue - startValue) * progress;

            (el.style as any)[property] = current + "px";

            if (progress < 1) {
                requestAnimationFrame(frame);
            } else {
                // Cleanup after animation
                if (endValue === 0) {
                    el.classList.add("hidden");
                } else {
                    (el.style as any)[property] = "auto";
                }
                el.style.height = "";
                el.style.width = "";
                el.style.overflow = "";

                resolve(); // Resolve the promise when animation is done
            }
        }

        // Set initial size
        (el.style as any)[property] = startValue + "px";

        requestAnimationFrame(frame);
    });
}
}