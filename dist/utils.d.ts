import { type MixTagValue } from './MixTagInput.d';
export declare const DEFAULT_TAG_CLASS = "mtag";
export declare function nodesToArray(nodes: NodeList | undefined): MixTagValue[];
export declare function tagValueArrToString(valueArr: MixTagValue[] | undefined): string;
export declare function getCaretOffset(element: HTMLElement | null): number;
