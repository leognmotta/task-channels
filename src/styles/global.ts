import { injectGlobal } from "react-emotion";

injectGlobal`
  .MuiList-root{
    display: flex !important; 
    flex-direction: column !important;
    align-items: start !important; 
    justify-content: start !important;
  }

  .MuiMenuItem-root {
    width: 100% !important;
    justify-content: left !important;
    padding: 6px 12px !important;
  }

  .css-7r294t {
    width: auto !important;
    min-width: 420px !important;
  }
`;
