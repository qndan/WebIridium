import { render } from "@testing-library/react";
import { Provider } from "jotai";

/**
 * Same as testing-library's render function, additionally wrapping stores so they don't persist between tests.
 */
export const renderWrappedStores = (node: React.ReactNode) => {
  return render(<Provider>{node}</Provider>);
};
