import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Button } from "./button";

describe("Button", () => {
  const mockOnClick = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render its children and fires onClick", async () => {
    render(<Button onClick={mockOnClick}>Sign in</Button>);

    const button = screen.getByRole("button", { name: "Sign in" });
    await userEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledOnce();
  });

  it("should disable the button and skips the click handler when disabled", async () => {
    render(
      <Button onClick={mockOnClick} disabled>
        Sign in
      </Button>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(mockOnClick).not.toHaveBeenCalled();
  });
});
