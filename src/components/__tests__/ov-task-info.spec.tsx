import React from "react";
import { render } from "@testing-library/react";

import { OvTaskInfo } from "../ov-task-info";

describe("OvTaskInfo component", () => {
  test("renders correct", async () => {
    const { findByText } = render(
      <OvTaskInfo label="Some Label" value="Some Value" />
    );

    const label = await findByText("Some Value");
    const value = await findByText("Some Label");

    expect(label).toBeInTheDocument();
    expect(value).toBeInTheDocument();
  });

  test("renders as link", async () => {
    const { findByRole } = render(
      <OvTaskInfo label="Some Label" value="Some Value" href="some-href.com" />
    );

    const link = await findByRole("link");

    expect(link).toBeDefined();
  });

  test("renders value as unknown", async () => {
    const { findByText } = render(<OvTaskInfo label="Some Label" value="" />);

    const text = await findByText("Unknown");

    expect(text).toBeInTheDocument();
  });
});
