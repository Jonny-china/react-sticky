import React, { HTMLAttributes } from "react";
export declare const StickyContext: React.Context<{
    subscribe: Func;
    unsubscribe: Func;
    getParent: () => HTMLDivElement;
}>;
declare type Func = (...arg: any[]) => void;
declare const Container: React.FC<HTMLAttributes<HTMLDivElement>>;
export default Container;
