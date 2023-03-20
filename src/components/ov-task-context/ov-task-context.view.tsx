import React from "react";
import { Flex } from "@twilio/flex-ui/src/FlexGlobal";

import { OvTaskContextContainer } from "./ov-task-context.styles";
import { OvTitle } from "../ov-title";
import { OvTaskInfo } from "../ov-task-info";

export interface OvTaskContextProps {
  task: Flex.ITask;
}

export const OvTaskContextView: React.FC<OvTaskContextProps> = ({ task }) => {
  return (
    <OvTaskContextContainer>
      <OvTitle>Task Context</OvTitle>

      <OvTaskInfo label="Task Type" value={task.channelType} />
      <OvTaskInfo
        label="Task Created On"
        value={task.dateCreated.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      />
      <OvTaskInfo label="Task Priority" value={task.priority.toString()} />
      <OvTaskInfo label="Task Queue" value={task.queueName} />
      <OvTaskInfo label="Task Sid" value={task.taskSid} />
      <OvTaskInfo label="Reservation Sid" value={task.workerSid} />
    </OvTaskContextContainer>
  );
};
