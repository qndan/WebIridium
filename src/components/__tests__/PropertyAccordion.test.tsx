import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PropertyAccordion from "../property-accordion/PropertyAccordion";
import PropertyAccordionItem from "../property-accordion/PropertyAccordionItem";

describe("Accordion", () => {
  it("should render its children", () => {
    render(
      <PropertyAccordion defaultValue={["test", "test2"]}>
        <PropertyAccordionItem title="hello" value="test">
          test
        </PropertyAccordionItem>
        <PropertyAccordionItem title="hello2" value="test2">
          test2
        </PropertyAccordionItem>
      </PropertyAccordion>,
    );

    expect(screen.getByText("hello")).toBeInTheDocument();
    expect(screen.getByText("hello2")).toBeInTheDocument();
    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByText("test2")).toBeInTheDocument();
  });
});
