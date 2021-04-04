import { Sticky, StickyContainer } from "../../src";
import { Header } from "../header";

let renderCount = 0;
export function Relative() {
  return (
    <div>
      <StickyContainer className="container relative">
        <div
          className="gap tall"
          style={{ background: "linear-gradient(#aaa, #fff)" }}
        >
          <div className="gap short" />
          <Sticky relative={true}>
            {({ style }) => (
              <Header style={style} renderCount={renderCount++} />
            )}
          </Sticky>
          <div className="gap short" />
          <h2>scrolling container</h2>
        </div>
      </StickyContainer>
    </div>
  );
}
