import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { WineAttributeCard } from "./WineAttributeCard";

describe("WineAttributeCard", () => {
  test("renders label and value", () => {
    render(<WineAttributeCard label="Acidity" value="7/10" />);

    expect(screen.getByText("Acidity")).toBeInTheDocument();
    expect(screen.getByText("7/10")).toBeInTheDocument();
  });
});
