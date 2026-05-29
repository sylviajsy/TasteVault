import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { TasteRadarChart } from "./TasteRadarChart";
import { mockWine } from "../../../test-data/wines";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  RadarChart: ({ children, data }) => (
    <div data-testid="radar-chart" data-chart={JSON.stringify(data)}>
      {children}
    </div>
  ),
  PolarGrid: () => <div data-testid="polar-grid" />,
  PolarAngleAxis: ({ dataKey }) => <div data-testid="angle-axis">{dataKey}</div>,
  PolarRadiusAxis: ({ ticks }) => (
    <div data-testid="radius-axis">{ticks.join(",")}</div>
  ),
  Radar: ({ dataKey }) => <div data-testid="radar">{dataKey}</div>,
}));

describe("TasteRadarChart", () => {
  test("renders taste profile chart labels", () => {
    render(<TasteRadarChart wine={mockWine} />);

    expect(screen.getByText(/taste profile/i)).toBeInTheDocument();
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
    expect(screen.getByTestId("polar-grid")).toBeInTheDocument();
    expect(screen.getByTestId("angle-axis")).toHaveTextContent("metric");
    expect(screen.getByTestId("radius-axis")).toHaveTextContent("0,2,4,6,8,10");
    expect(screen.getByTestId("radar")).toHaveTextContent("value");
  });
});
