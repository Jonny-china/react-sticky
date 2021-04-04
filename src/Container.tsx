import React, {
  HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import raf from "raf";

const events = [
  "resize",
  "scroll",
  "touchstart",
  "touchmove",
  "touchend",
  "pageshow",
  "load",
];

export const StickyContext = React.createContext(
  {} as {
    subscribe: Func;
    unsubscribe: Func;
    getParent: () => HTMLDivElement;
  }
);

type Func = (...arg: any[]) => void;

const Container: React.FC<HTMLAttributes<HTMLDivElement>> = (props) => {
  const [subscribers, setSubscribers] = useState<Func[]>([]);
  const rafHandle = useRef<number | null>(null);

  const framePending = useRef(false);
  const node = useRef<HTMLDivElement>(null);

  const subscribe = useCallback((handler: Func) => {
    setSubscribers((prev) => [...prev, handler]);
  }, []);

  const unsubscribe = useCallback((handler: Func) => {
    setSubscribers((prev) => [
      ...prev.filter((current) => current !== handler),
      handler,
    ]);
  }, []);

  const notifySubscribers = useCallback(
    (evt: any) => {
      if (!framePending.current) {
        const { currentTarget } = evt;
        rafHandle.current = raf(() => {
          framePending.current = false;
          const { top, bottom } = node.current?.getBoundingClientRect() ?? {};
          subscribers.forEach((handler) =>
            handler({
              distanceFromTop: top,
              distanceFromBottom: bottom,
            })
          );
        });

        framePending.current = true;
      }
    },
    [subscribers]
  );

  useEffect(() => {
    events.forEach((event) =>
      window.addEventListener(event, notifySubscribers)
    );
    return () => {
      if (rafHandle.current) {
        raf.cancel(rafHandle.current);
        rafHandle.current = null;
      }
      events.forEach((event) =>
        window.removeEventListener(event, notifySubscribers)
      );
    };
  }, [notifySubscribers]);

  return (
    <StickyContext.Provider
      value={{
        subscribe,
        unsubscribe,
        getParent: () => node.current!,
      }}
    >
      <div
        {...props}
        ref={node}
        onScroll={notifySubscribers}
        onTouchEnd={notifySubscribers}
        onTouchMove={notifySubscribers}
        onTouchStart={notifySubscribers}
      />
    </StickyContext.Provider>
  );
};

export default Container;
