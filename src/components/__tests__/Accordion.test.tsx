import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Accordion from "../accordion/Accordion";
import AccordionItem from "../accordion/AccordionItem";

describe("Accordion", () => {
  it("should render its children", () => {
    render(
      <Accordion>
        <AccordionItem title="hello">test</AccordionItem>
        <AccordionItem title="hello2">test2</AccordionItem>
      </Accordion>,
    );

    expect(screen.getByText("hello")).toBeInTheDocument();
    expect(screen.getByText("hello2")).toBeInTheDocument();
    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByText("test2")).toBeInTheDocument();
  });

  it("should close and open on click", async () => {
    render(
      <Accordion>
        <AccordionItem title="hello">test</AccordionItem>
      </Accordion>,
    );

    expect(screen.getByText("hello")).toBeInTheDocument();
    expect(screen.getByText("test")).toBeVisible();

    await userEvent.click(screen.getByRole("button"));

    // the animation should play, then it should become invisible
    const body = screen.getByTestId("accordionBody");
    fireEvent.animationEnd(body);
    expect(screen.queryByText("test")).not.toBeVisible();

    // now click to open
    await userEvent.click(screen.getByRole("button"));
    fireEvent.animationEnd(body);
    expect(screen.queryByText("test")).toBeVisible();
  });

  it("should open and close when clicked an excessive amount of times", async () => {
    render(
      <Accordion>
        <AccordionItem title="hello">test</AccordionItem>
      </Accordion>,
    );
    const body = screen.getByTestId("accordionBody");

    // spam click the accordion
    for (let i = 0; i < 10; i++) {
      await userEvent.click(screen.getByRole("button"));
      fireEvent.animationEnd(body);
      expect(screen.queryByText("test")).not.toBeVisible();

      await userEvent.click(screen.getByRole("button"));
      fireEvent.animationEnd(body);
      expect(screen.queryByText("test")).toBeVisible();
    }
  });
});
