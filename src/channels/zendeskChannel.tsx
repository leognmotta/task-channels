import React from "react";
import * as Flex from "@twilio/flex-ui";
import EmailIcon from "@material-ui/icons/Email";
import { ITask } from "@twilio/flex-ui";

import { channels } from "../shared/constants";
import { getTitleFromTaskAttributes } from "../shared/utils";
import { Attributes } from "types/attributes";

export const registerZendeskUI = (flex: typeof Flex) => {
  const zendeskChannel = flex.DefaultTaskChannels.createDefaultTaskChannel(
    channels.zendeskChannel,
    (task: ITask) => task.taskChannelUniqueName === channels.zendeskChannel,
    <EmailIcon />,
    <EmailIcon />,
    "#2AC5C9"
  );

  zendeskChannel.capabilities.add(Flex.TaskChannelCapability.Wrapup);

  zendeskChannel.templates!.TaskCanvasHeader!.title = (task: ITask) =>
    getTitleFromTaskAttributes(task.attributes as Attributes);
  zendeskChannel.templates!.TaskListItem!.firstLine = (task: ITask) =>
    getTitleFromTaskAttributes(task.attributes as Attributes);
  zendeskChannel.templates!.TaskListItem!.secondLine = (task: ITask) => {
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
  zendeskChannel.templates!.IncomingTaskCanvas!.firstLine = (task: ITask) =>
    getTitleFromTaskAttributes(task.attributes as Attributes);
  zendeskChannel.templates!.IncomingTaskCanvas!.secondLine = (task: ITask) => {
    if (task.status === "accepted") {
      return `Zendesk Email | ${task.queueName}`;
    } else {
      return "";
    }
  };

  zendeskChannel.templates!.TaskCard!.firstLine = (task: ITask) =>
    task.attributes.brand_displayName;

  flex.TaskChannels.register(zendeskChannel);
};
