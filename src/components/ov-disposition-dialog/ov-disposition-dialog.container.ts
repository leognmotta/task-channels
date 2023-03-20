import { withTaskContext, withTheme } from "@twilio/flex-ui";
import { connect } from "react-redux";

import { AppState } from "../../states";
import OvDispositionDialog from "./ov-disposition-dialog.view";

export interface StateToProps {
  isOpen: boolean;
  disableBackdropClick: boolean;
}

const mapStateToProps = (state: AppState): StateToProps => {
  const componentViewStates = state.flex.view.componentViewStates;
  const dispositionDialogState =
    componentViewStates && componentViewStates.DispositionDialog;
  const isOpen = dispositionDialogState && dispositionDialogState.isOpen;
  const disableBackdropClick =
    dispositionDialogState && dispositionDialogState.disableBackdropClick;
  return {
    isOpen,
    disableBackdropClick,
  };
};

export const OvDispositionDialogView = connect(mapStateToProps)(
  withTheme(withTaskContext(OvDispositionDialog))
);
