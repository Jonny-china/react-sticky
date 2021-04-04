import React from "react";
export interface StickyChildArgs {
    style: React.CSSProperties;
    isSticky: boolean;
    wasSticky: boolean;
    distanceFromTop: number;
    distanceFromBottom: number;
    calculatedHeight: number;
}
export interface StickyProps {
    children: (args: StickyChildArgs) => React.ReactElement;
    className?: string;
    style?: any;
    /**
     * Set `relative` to `true` if the `<Sticky />` element will be rendered within an overflowing `<StickyContainer />`
     * (e.g. `style={{ overflowY: 'auto' }}`) and you want the `<Sticky />` behavior to react to events only within that container.
     *
     * When in `relative` mode, `window` events will not trigger sticky state changes.
     * Only scrolling within the nearest `StickyContainer` can trigger sticky state changes.
     *
     * @default false
     */
    relative?: boolean;
    /**
     * Sticky state will be triggered when the top of the element is `topOffset` pixels from the top of the closest `<StickyContainer />`.
     * Positive numbers give the impression of a lazy sticky state, whereas negative numbers are more eager in their attachment.
     *
     * app.js
     * ```jsx
     * <StickyContainer>
     *   ...
     *   <Sticky topOffset={80}>
     *     { props => (...) }
     *   </Sticky>
     *   ...
     * </StickyContainer>
     * ```
     * The above would result in an element that becomes sticky once its top is greater
     * than or equal to 80px away from the top of the `<StickyContainer />`.
     *
     * @default 0
     */
    topOffset?: number;
    /**
     * Sticky state will be triggered when the bottom of the element is `bottomOffset` pixels from the bottom of the closest `<StickyContainer />`.
     *
     * app.js
     * ```jsx
     * <StickyContainer>
     *   ...
     *   <Sticky bottomOffset={80}>
     *     { props => (...) }
     *   </Sticky>
     *   ...
     * </StickyContainer>
     * ```
     * The above would result in an element that ceases to be sticky once its bottom is 80px away from the bottom of the `<StickyContainer />`.
     *
     * @default 0
     */
    bottomOffset?: number;
    /**
     *Set `disableCompensation` to `true` if you do not want your `<Sticky />` to apply padding to a hidden placeholder `<div />` to correct "jumpiness" as attachment changes from `position:fixed` and back.
     *
     * app.js
     * ```jsx
     * <StickyContainer>
     *   ...
     *   <Sticky disableCompensation>
     *     { props => (...) }
     *   </Sticky>
     *   ...
     * </StickyContainer>
     * ```
     * @default false
     */
    disableCompensation?: boolean;
    /**
     * When `disableHardwareAcceleration` is set to `true`, the `<Sticky />` element will not use hardware acceleration
     * (e.g. `transform: translateZ(0)`). This setting is not recommended as it negatively impacts the mobile experience,
     * and can usually be avoided by improving the structure of your DOM.
     *
     * app.js
     * ```jsx
     * <StickyContainer>
     *   ...
     *   <Sticky disableHardwareAcceleration>
     *     { props => (...) }
     *   </Sticky>
     *   ...
     * </StickyContainer>
     * ```
     */
    disableHardwareAcceleration?: boolean;
}
declare const Sticky: React.FC<StickyProps>;
export default Sticky;
