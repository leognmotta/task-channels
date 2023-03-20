import React from "react";
import { CopyTooltip } from "../ov-copy-tooltip";

export interface TaskInfoProps {
  label: string;
  value: string;
  href?: string;
  copyable?: boolean;
}

export const OvTaskInfoView: React.FC<TaskInfoProps> = ({
  label,
  value,
  href,
  copyable,
}) => {
  const valueToDisplay = Boolean(value) ? value : "Unknown";

  return (
    <div style={{ height: 32 }}>
      <span
        style={{
          fontWeight: "bold",
          fontSize: "14px",
          lineHeight: "24px",
          letterSpacing: "0.1px",
        }}
      >
        {label}:{" "}
      </span>
      {href && valueToDisplay !== "Unknown" ? (
        <a target="_blank" href={href}>
          {valueToDisplay}
        </a>
      ) : (
        <span>{valueToDisplay}</span>
      )}

      {copyable && valueToDisplay !== "Unknown" && (
        <CopyTooltip textToCopy={valueToDisplay} />
      )}
    </div>
  );
};
