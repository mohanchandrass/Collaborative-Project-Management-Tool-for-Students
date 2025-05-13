import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import Message from "./Message";

test("renders Message component", () => {
  const message = {
    sender: { username: "Alice" },
    text: "Hello!",
    timestamp: new Date().toISOString(),
  };

  render(<Message message={message} isCurrentUser={false} />);
});
