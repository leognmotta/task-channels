import React from "react";
import * as Flex from "@twilio/flex-ui";
import TransferButton from "../ov-transfer-button";

import {
  ActivityWrapper,
  Button,
  TextWrapper,
  TitleWrapper,
  Wrapper,
} from "./ov-task-canvas-header.styles";
import { Attributes } from "../../types/attributes";
import { getTitleFromTaskAttributes } from "../../shared/utils";
import { channels } from "../../shared/constants";
import flexState from "../../helpers/flexState";

export interface OvTaskCanvasHeaderProps {
  task?: Flex.ITask;
}

export class OvTaskCanvasHeaderView extends React.Component<OvTaskCanvasHeaderProps> {
  openDisposition = () => {
    Flex.Actions.invokeAction("SetComponentState", {
      name: "DispositionDialog",
      state: { isOpen: true, disableBackdropClick: false },
    });
  };

  onClick = () => {
    if (this.props.task?.taskChannelUniqueName === channels.voiceChannel) {
      if (flexState.hasLiveCallTask) {
        Flex.Actions.invokeAction("HangupCall", { sid: this.props.task.sid });
      } else {
        this.openDisposition();
      }
    } else {
      this.openDisposition();
    }
  };

  render(): React.ReactNode {
    const attributes = this.props.task?.attributes as Attributes;

    return (
      <Wrapper>
        <TextWrapper>
          <TitleWrapper>
            <span>{getTitleFromTaskAttributes(attributes)}</span>
          </TitleWrapper>
          <ActivityWrapper>
            <span>{this.props.task?.taskStatus}</span>
          </ActivityWrapper>
        </TextWrapper>

        {this.props.task?.taskChannelUniqueName ===
          channels.conversationChannel &&
          this.props?.task?.taskStatus === "assigned" && <TransferButton />}

        {this.props.task?.taskChannelUniqueName === channels.voiceChannel ? (
          <Button
            style={{
              background: flexState.hasLiveCallTask
                ? "linear-gradient(to top, rgb(47, 91, 211), rgb(47, 85, 211))"
                : "linear-gradient(to top, rgb(211, 47, 47), rgb(211, 47, 47))",
            }}
            onClick={this.onClick}
          >
            {flexState.hasLiveCallTask ? "HANG UP" : "COMPLETE"}
          </Button>
        ) : (
          <Button
            style={{
              background:
                this.props.task?.status === "accepted"
                  ? "linear-gradient(to top, rgb(47, 91, 211), rgb(47, 85, 211))"
                  : "linear-gradient(to top, rgb(211, 47, 47), rgb(211, 47, 47))",
            }}
            onClick={this.onClick}
          >
            {this.props.task?.status === "accepted" ? "WRAP UP" : "COMPLETE"}
          </Button>
        )}
      </Wrapper>
    );
  }
}
