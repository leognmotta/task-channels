import React from "react";
import RouterIcon from "@material-ui/icons/Router";
import * as Flex from "@twilio/flex-ui";
import { ITask } from "@twilio/flex-ui";

import { channels } from "../shared/constants";
import { getTitleFromTaskAttributes } from "../shared/utils";
import { Attributes } from "types/attributes";

export const registerMonitoringChannel = (flex: typeof Flex) => {
  const monitoringChannel = flex.DefaultTaskChannels.createDefaultTaskChannel(
    channels.monitoringChannel,
    (task: ITask) => task.taskChannelUniqueName === channels.monitoringChannel,
    <RouterIcon />,
    <RouterIcon />,
    "#2AC5C9"
  );

  monitoringChannel.capabilities.add(Flex.TaskChannelCapability.Wrapup);

  monitoringChannel.templates!.TaskCanvasHeader!.title = (task: ITask) =>
    getTitleFromTaskAttributes(task.attributes as Attributes);
  monitoringChannel.templates!.TaskListItem!.firstLine = (task: ITask) =>
    getTitleFromTaskAttributes(task.attributes as Attributes);
  monitoringChannel.templates!.TaskListItem!.secondLine = (task: ITask) => {
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
  monitoringChannel.templates!.IncomingTaskCanvas!.firstLine = (task: ITask) =>
    getTitleFromTaskAttributes(task.attributes as Attributes);
  monitoringChannel.templates!.IncomingTaskCanvas!.secondLine = (
    task: ITask
  ) => {
    if (task.status === "accepted") {
      return `Zendesk Email | ${task.queueName}`;
    } else {
      return "";
    }
  };

  monitoringChannel.templates!.TaskCard!.firstLine = (task: ITask) =>
    task.attributes.brand_displayName;

  flex.TaskChannels.register(monitoringChannel);
};
