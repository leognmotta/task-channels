import React from "react";

export const OvTitle: React.FC = ({ children }) => (
  <p
    style={{
      fontWeight: "bold",
      fontSize: "16px",
      lineHeight: "24px",
      letterSpacing: "0.1px",
      textDecoration: "underline",
    }}
  >
    {children}
  </p>
);
