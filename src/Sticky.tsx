import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StickyContext } from "./Container";

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

interface StickyState {
  isSticky: boolean;
  wasSticky: boolean;
  distanceFromTop: number;
  distanceFromBottom: number;
  calculatedHeight: number;
  style: React.CSSProperties;
}

const Sticky: React.FC<StickyProps> = (props) => {
  const context = useContext(StickyContext);
  const { children } = props;

  const [state, setState] = useState<StickyState>({
    isSticky: false,
    wasSticky: false,
    distanceFromTop: 0,
    distanceFromBottom: 0,
    calculatedHeight: 0,
    style: {},
  });

  const placeholder = useRef<HTMLDivElement>(null);
  const content = useRef<Element>();

  const element = useMemo(
    () =>
      React.cloneElement(children({ ...state }), {
        ref: content,
      }),
    [children, state]
  );

  const calculateStyle = useCallback(
    (
      isSticky: boolean,
      distanceFromBottom: number,
      calculatedHeight: number
    ) => {
      const parent = context.getParent();
      const placeholderClientRect = placeholder.current?.getBoundingClientRect();
      const bottomDifference =
        distanceFromBottom - (props.bottomOffset ?? 0) - calculatedHeight;
      let style: Record<string, any> = {};

      if (isSticky) {
        if (props.relative) {
          style = {
            position: "absolute",
            top: parent.offsetTop - (parent.offsetParent?.scrollTop ?? 0),
            width: placeholderClientRect?.width,
          };

          if (bottomDifference <= 0) {
            style.top = style.top + bottomDifference;
            style.clipPath = `inset(${-bottomDifference}px 0 0 0)`;
          }
        } else {
          style = {
            position: "fixed",
            top: bottomDifference > 0 ? 0 : bottomDifference,
            left: placeholderClientRect?.left,
            width: placeholderClientRect?.width,
          };
        }
      }

      return style;
    },
    []
  );

  const handleContainerEvent = useCallback(
    ({
      distanceFromTop,
      distanceFromBottom,
    }: {
      distanceFromTop: number;
      distanceFromBottom: number;
    }) => {
      if (props.relative) {
        const parent = context.getParent();
        distanceFromTop =
          -(parent.scrollTop + parent.offsetTop) +
          (placeholder.current?.offsetTop ?? 0);
      }

      const contentClientRect = content.current?.getBoundingClientRect();
      const calculatedHeight = contentClientRect?.height ?? 0;

      const wasSticky = !!state.isSticky;
      const isSticky =
        distanceFromTop <= -(props.topOffset ?? 0) &&
        distanceFromBottom > -(props.bottomOffset ?? 0);

      const style = calculateStyle(
        isSticky,
        distanceFromBottom,
        calculatedHeight
      );

      distanceFromBottom = distanceFromBottom - calculatedHeight;

      if (!props.disableHardwareAcceleration) {
        style.transform = "translateZ(0)";
      }

      placeholder.current &&
        (placeholder.current.style.paddingBottom = `${
          isSticky ? calculatedHeight : 0
        }px`);

      setState({
        isSticky,
        wasSticky,
        distanceFromBottom,
        distanceFromTop,
        style,
        calculatedHeight,
      });
    },
    [
      context,
      state.isSticky,
      props.bottomOffset,
      props.disableHardwareAcceleration,
      props.relative,
      props.topOffset,
    ]
  );

  useEffect(() => {
    if (!context.subscribe)
      throw new TypeError(
        "Expected Sticky to be mounted within StickyContainer"
      );

    context.subscribe(handleContainerEvent);
    return () => {
      context.unsubscribe(handleContainerEvent);
    };
  }, []);

  useEffect(() => {
    placeholder.current!.style.paddingBottom = props.disableCompensation
      ? "0"
      : `${state.isSticky ? state.calculatedHeight : 0}px`;
  }, [props.disableCompensation]);

  return (
    <div className={props.className} style={props.style}>
      <div ref={placeholder} />
      {element}
    </div>
  );
};

export default Sticky;
