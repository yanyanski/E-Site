import { YanexButton, YanexDiv } from "../../../packages/widgets/yanexWidgets";


export class TypeFilterSectionRef{

    public static initialized: boolean = false;

    // The container for the types
    public static typeContainer: YanexDiv;

    // Storage for the craeted types with its id as the key and value as the type value
    public static typeButtons: Record<number, YanexButton> = {}

    // The container for the filter buttons
    public static buttonContainer: YanexDiv;
}

export class TypeFilterSectionStorage{
    public static types: Record<number, Record<string, any>> = {};

    // The storage for the selected filter of type button
    public static selectedTypes: Set<number>= new Set();

}