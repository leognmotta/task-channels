import React from "react";
import SmsIcon from "@material-ui/icons/Sms";
import * as Flex from "@twilio/flex-ui";
import { ITask } from "@twilio/flex-ui";

import { channels } from "../shared/constants";

export const registerConversationChannel = (flex: typeof Flex) => {
  const conversationChannel = flex.DefaultTaskChannels.createDefaultTaskChannel(
    channels.conversationChannel,
    (task: ITask) =>
      task.taskChannelUniqueName === channels.conversationChannel,
    <SmsIcon />,
    <SmsIcon />,
    "#D0ACFF"
  );

  conversationChannel.capabilities.add(Flex.TaskChannelCapability.Wrapup);

  conversationChannel.templates!.TaskCanvasHeader!.title = (task: ITask) => {
    if (
      (task.attributes.client_firstName || task.attributes.client_lastName) &&
      task.attributes.brand_displayName
    ) {
      return `${task.attributes.client_firstName} ${task.attributes.client_lastName} (${task.attributes.brand_displayName})`;
    } else if (task.attributes.brand_displayName) {
      return task.attributes.brand_displayName;
    } else {
      return task.attributes.from;
    }
  };

  conversationChannel.templates!.TaskListItem!.firstLine = (task: ITask) => {
    if (
      (task.attributes.client_firstName || task.attributes.client_lastName) &&
      task.attributes.brand_displayName
    ) {
      return `${task.attributes.client_firstName} ${task.attributes.client_lastName} (${task.attributes.brand_displayName})`;
    } else if (task.attributes.brand_displayName) {
      return task.attributes.brand_displayName;
    } else {
      return task.attributes.from;
    }
  };

  conversationChannel.templates!.TaskListItem!.secondLine = (task) => {
    if (task.status === "pending") {
      return `Incoming conversation from ${task.queueName}`;
    } else if (task.status === "accepted") {
      return `Live Conversation | ${
        new Flex.TaskHelper(task).durationSinceUpdateShort
      } | ${task.queueName}`;
    } else if (task.status === "wrapping") {
      return `Wrap Up | ${
        new Flex.TaskHelper(task).durationSinceUpdateShort
      } | ${task.queueName}`;
    } else {
      return `${task.status} | ${task.queueName}`;
    }
  };

  conversationChannel.templates!.IncomingTaskCanvas!.firstLine = (task) => {
    if (
      (task.attributes.client_firstName || task.attributes.client_lastName) &&
      task.attributes.brand_displayName
    ) {
      return `${task.attributes.client_firstName} ${task.attributes.client_lastName} (${task.attributes.brand_displayName})`;
    } else if (task.attributes.brand_displayName) {
      return task.attributes.brand_displayName;
    } else {
      return task.attributes.from;
    }
  };

  conversationChannel.templates!.IncomingTaskCanvas!.secondLine = (task) => {
    if (task.status === "accepted") {
      return `Live Conversation | ${
        new Flex.TaskHelper(task).durationSinceUpdateShort
      } | ${task.queueName}`;
    } else if (task.status === "wrapping") {
      return `Wrap Up | ${task.queueName}`;
    } else {
      return `${task.status} | ${task.queueName}`;
    }
  };

  conversationChannel.templates!.TaskCard!.firstLine = (task: ITask) =>
    task.attributes.brand_displayName;

  flex.TaskChannels.register(conversationChannel);
};
