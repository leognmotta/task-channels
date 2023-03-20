import React from "react";
import LocalPhoneIcon from "@material-ui/icons/LocalPhone";
import * as Flex from "@twilio/flex-ui";
import { ITask } from "@twilio/flex-ui";
import { Attributes } from "types/attributes";

const customGetTitleFromTaskAttributes = (attributes: Attributes) => {
  const {
    client_firstName: firstName,
    client_lastName: lastName,
    brand_displayName: brandDisplayName,
    from,
  } = attributes;

  let joinedName = [firstName, lastName].filter((r) => Boolean(r)).join(" ");

  if (joinedName) {
    return brandDisplayName
      ? `${joinedName} (${brandDisplayName})`
      : joinedName;
  }

  if (brandDisplayName && from) {
    return `${from} (${brandDisplayName})`;
  }

  return from;
};

export const registerVoiceChannelUI = (flex: typeof Flex) => {
  flex.DefaultTaskChannels.Call.templates!.TaskCanvasHeader!.title = (
    task: ITask
  ) => {
    if (
      (task.attributes.client_firstName || task.attributes.client_lastName) &&
      task.attributes.brand_displayName
    ) {
      return `${task.attributes.client_firstName} ${task.attributes.client_lastName} (${task.attributes.brand_displayName})`;
    } else if (task.attributes.brand_displayName) {
      return task.attributes.brand_displayName;
    } else {
      return task.attributes.direction === "outbound"
        ? task.attributes.outbound_to
        : task.attributes.from;
    }
  };

  flex.DefaultTaskChannels.Call.icons = {
    main: <LocalPhoneIcon />,
    active: <LocalPhoneIcon />,
    list: <LocalPhoneIcon />,
  };

  flex.DefaultTaskChannels.Call.colors = { main: "#FF8080" };

  flex.DefaultTaskChannels.Call.templates!.TaskListItem!.firstLine = (
    task: ITask
  ) => {
    if (
      (task.attributes.client_firstName || task.attributes.client_lastName) &&
      task.attributes.brand_displayName
    ) {
      return `${task.attributes.client_firstName} ${task.attributes.client_lastName} (${task.attributes.brand_displayName})`;
    } else if (task.attributes.brand_displayName) {
      return task.attributes.brand_displayName;
    } else {
      return task.attributes.direction === "outbound"
        ? task.attributes.outbound_to
        : task.attributes.from;
    }
  };

  flex.DefaultTaskChannels.Call.templates!.TaskListItem!.secondLine = (
    task
  ) => {
    if (
      task.attributes.direction === "outbound" &&
      task.queueName === "Outbound Call"
    ) {
      return `Outbound Call`;
    } else if (task.status === "pending") {
      return `Incoming call from ${task.queueName}`;
    } else if (task.status === "accepted") {
      return `Live Call | ${
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

  flex.DefaultTaskChannels.Call.templates!.IncomingTaskCanvas!.firstLine = (
    task
  ) => {
    if (
      (task.attributes.client_firstName || task.attributes.client_lastName) &&
      task.attributes.brand_displayName
    ) {
      return `${task.attributes.client_firstName} ${task.attributes.client_lastName} (${task.attributes.brand_displayName})`;
    } else if (task.attributes.brand_displayName) {
      return task.attributes.brand_displayName;
    } else {
      return task.attributes.direction === "outbound"
        ? task.attributes.outbound_to
        : task.attributes.from;
    }
  };

  flex.DefaultTaskChannels.Call.templates!.IncomingTaskCanvas!.secondLine = (
    task
  ) => {
    if (task.status === "accepted") {
      return `Live Call | ${
        new Flex.TaskHelper(task).durationSinceUpdateShort
      } | ${task.queueName}`;
    } else if (task.status === "wrapping") {
      return `Wrap Up | ${task.queueName}`;
    } else {
      return `${task.status} | ${task.queueName}`;
    }
  };
  flex.DefaultTaskChannels.Call.templates!.TaskCard!.firstLine = (
    task: ITask
  ) => task.attributes.brand_displayName;
};
