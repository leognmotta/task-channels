import React from "react";
import TimerOffIcon from "@material-ui/icons/TimerOff";
import * as Flex from "@twilio/flex-ui";
import { ITask } from "@twilio/flex-ui";

import { channels } from "../shared/constants";
import { getTitleFromTaskAttributes } from "../shared/utils";
import { Attributes } from "types/attributes";

export const registerNonTimeSensitiveChannel = (flex: typeof Flex) => {
  const nonTimeSensitiveChannel =
    flex.DefaultTaskChannels.createDefaultTaskChannel(
      channels.nonTimeSensitiveChannel,
      (task: ITask) =>
        task.taskChannelUniqueName === channels.nonTimeSensitiveChannel,
      <TimerOffIcon />,
      <TimerOffIcon />,
      "#2AC5C9"
    );

  nonTimeSensitiveChannel.capabilities.add(Flex.TaskChannelCapability.Wrapup);

  nonTimeSensitiveChannel.templates!.TaskCanvasHeader!.title = (task: ITask) =>
    getTitleFromTaskAttributes(task.attributes as Attributes);
  nonTimeSensitiveChannel.templates!.TaskListItem!.firstLine = (task: ITask) =>
    getTitleFromTaskAttributes(task.attributes as Attributes);
  nonTimeSensitiveChannel.templates!.TaskListItem!.secondLine = (
    task: ITask
  ) => {
    if (task.status === "accepted") {
      return `Accepted | ${
        new Flex.TaskHelper(task).durationSinceUpdateShort
      } | ${task.queueName}`;
    } else if (task.status === "wrapping") {
      return `Wrap Up | ${
        new Flex.TaskHelper(task).durationSinceUpdateShort
      } | ${task.queueName}`;
    } else if (task.status === "pending") {
      return `Pending - | ${task.queueName}`;
    } else {
      return `${task.status} | ${task.queueName}`;
    }
  };
  nonTimeSensitiveChannel.templates!.IncomingTaskCanvas!.firstLine = (
    task: ITask
  ) => getTitleFromTaskAttributes(task.attributes as Attributes);
  nonTimeSensitiveChannel.templates!.IncomingTaskCanvas!.secondLine = (
    task
  ) => {
    if (task.status === "accepted") {
      return `Zendesk Email | ${task.queueName}`;
    } else {
      return "";
    }
  };

  nonTimeSensitiveChannel.templates!.TaskCard!.firstLine = (task: ITask) =>
    task.attributes.brand_displayName;

  flex.TaskChannels.register(nonTimeSensitiveChannel);
};
