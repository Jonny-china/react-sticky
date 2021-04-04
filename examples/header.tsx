import React from "react";

interface HearderProps {
  className?: string;
  style?: any;
  renderCount?: React.ReactNode;
}

export const Header = React.forwardRef<HTMLDivElement, HearderProps>(
  ({ className, style, renderCount }, ref) => {
    return (
      <div className={"header " + className} style={style} ref={ref}>
        <h2>
          <span className="pull-left">
            {"<Sticky /> "}
            {renderCount ? <small>(invocation: #{renderCount})</small> : null}
          </span>
        </h2>
      </div>
    );
  }
);
