import * as Flex from "@twilio/flex-ui";
import { Player } from "@twilio/flex-ui/src/api/insights";
import { channels } from "../../shared/constants";
import ChatTransferService from "../../helpers/ChatTransferService";
import { FlexActionEvent, FlexAction } from "../../types/feature-loader/index";

export interface TransferOptions {
  attributes: string;
  mode: string;
  priority: string;
}

export interface EventPayload {
  task: Flex.ITask;
  sid?: string; // taskSid or task is required
  targetSid: string; // target of worker or queue sid
  options?: TransferOptions;
}

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.TransferTask;
// if the task channel is not chat, function defers to existing process
// otherwise the function creates a new task for transfering the chat
// and deals with the chat orchestration
export const interceptTransferOverrideForChatTasks = (
  flex: typeof Flex,
  manager: Flex.Manager
) => {
  Flex.Actions.addListener(
    `${actionEvent}${actionName}`,
    async (payload: EventPayload, abortFunction: any) => {
      if (payload.task.taskChannelUniqueName === channels.conversationChannel) {
        // abortFunction(payload);
        // Execute Chat Transfer Task
        await ChatTransferService.executeChatTransfer(
          payload.task,
          payload.targetSid,
          payload.options
        );
      }
    }
  );
};
