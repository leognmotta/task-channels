import React from "react";
import { render } from "@testing-library/react";

import { OvTaskInfoPanel } from "../ov-task-info-panel";
import { Flex } from "@twilio/flex-ui/src/FlexGlobal";

import { attributes } from "shared/tests/payload";

describe("OvTaskInfoPanel component", () => {
  test("do not show Unable to display", () => {
    const { findByText } = render(
      <OvTaskInfoPanel
        task={{ attributes: { attributes } } as unknown as Flex.ITask}
      />
    );

    const text = findByText("Unable to display");

    expect(text).not.toBeInTheDocument();
  });

  test("show Unable to display", () => {
    const { findByText } = render(
      <OvTaskInfoPanel
        task={
          {
            attributes: {
              attributes: { ...attributes, skippedAddresses: "6" },
            },
          } as unknown as Flex.ITask
        }
      />
    );

    const text = findByText("Unable to display");

    expect(text).toBeInTheDocument();
  });
});
