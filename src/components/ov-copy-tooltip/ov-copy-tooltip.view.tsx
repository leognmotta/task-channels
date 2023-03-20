import React from "react";
import { Button } from "@material-ui/core";

interface Props {
  textToCopy: string;
}

const INITIAL_VALUE = "Copy";
const COPIED_VALUE = "Copied!";

export class CopyTooltip extends React.Component<Props> {
  state = {
    tooltipText: INITIAL_VALUE,
    timeout: 0,
  };

  componentDidUpdate() {
    if (this.state.tooltipText !== COPIED_VALUE) {
      clearTimeout(this.state.timeout);
    }
  }

  resetTextAfterTime = () => {
    const timeout = setTimeout(() => {
      this.setState({
        tooltipText: INITIAL_VALUE,
      });
    }, 3000);

    this.setState({ timeout });
  };

  handleCopyToClipboard = () => {
    if (this.props.textToCopy) {
      navigator.clipboard.writeText(this.props.textToCopy);
      this.setState({ tooltipText: COPIED_VALUE });
      this.resetTextAfterTime();
    }
  };

  render(): React.ReactNode {
    return (
      <span>
        <Button
          onClick={this.handleCopyToClipboard}
          size="small"
          color="primary"
          variant="text"
        >
          {this.state.tooltipText}
        </Button>
      </span>
    );
  }
}
