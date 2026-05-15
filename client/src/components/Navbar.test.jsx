import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

vi.mock("../store/userSlice", () => ({
  selectDisplayName: () => "Siyi",
}));

const renderNavbar = () => {
  const store = configureStore({
    reducer: {
        dummy: (state = {}) => state,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </Provider>
  );
};

describe("Navbar", () => {
  test("renders brand and display name", () => {
    renderNavbar();

    expect(screen.getByText("TasteVault")).toBeInTheDocument();
    expect(screen.getByText(/Siyi/i)).toBeInTheDocument();
  });
});