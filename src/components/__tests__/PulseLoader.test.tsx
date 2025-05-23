import { it, expect } from "vitest";
import { screen, render } from "@testing-library/react";
import PulseLoader from "../PulseLoader";

it("should apply CSS override", () => {
  const styles = {
    margin: "10px",
    padding: "10px",
    color: "rgb(0, 255, 0)",
  };
  render(<PulseLoader cssOverride={styles} data-testid="test" />);

  const container = screen.getByTestId("test");
  expect(container).toHaveStyle(styles);
});

it("should apply color", () => {
  const color = "rgb(255, 0, 0)";
  const view = render(<PulseLoader color={color} data-testid="test" />);

  // eslint-disable-next-line
  for (const span of view.container.querySelectorAll(
    '[data-testid="test"] > span',
  )) {
    expect(span).toHaveStyle({ backgroundColor: color });
  }
});
