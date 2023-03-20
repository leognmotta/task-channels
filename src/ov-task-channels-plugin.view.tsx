import * as Flex from "@twilio/flex-ui";
import { FlexPlugin } from "@twilio/flex-plugin";

import { registerZendeskUI } from "./channels/zendeskChannel";
import { registerVoiceChannelUI } from "./channels/registerVoiceChannelUI";
import { registerMonitoringChannel } from "./channels/registerMonitoringChannel";
import { registerNonTimeSensitiveChannel } from "./channels/registerNonTimeSensitiveChannel";
import { registerConversationChannel } from "./channels/registerConversationChannel";
import { OvTaskInfoPanel } from "./components/ov-task-info-panel";
import reducers, { namespace } from "./states";
import { OvDispositionDialog } from "./components/ov-disposition-dialog";
import { OvTaskCanvasHeader } from "./components/ov-task-canvas-header";
import { channels } from "./shared/constants";
import { createNewAttributesObject } from "./helpers/createNewAttributesObject";
import { ITask } from "@twilio/flex-ui";
import { OvEmojiPicker } from "./components/ov-emoji-picker";
import ChatNotificationMessage from "./components/ov-chat-notification-message";
import { interceptTransferOverrideForChatTasks } from "./flex-hooks/actions/TransferTask";

import "./styles/global";

const PLUGIN_NAME = "ov-task-channels-plugin";

export default class OvTaskChannelsPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof Flex }
   * @param manager { Flex.Manager }
   */
  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    this.registerReducers(manager);

    registerZendeskUI(flex);
    registerVoiceChannelUI(flex);
    registerMonitoringChannel(flex);
    registerNonTimeSensitiveChannel(flex);
    registerConversationChannel(flex);
    interceptTransferOverrideForChatTasks(flex, manager);

    manager.strings.TaskTabHeaderChat = "Chat";

    flex.MessageListItem.Content.replace(
      <ChatNotificationMessage key="Notification-Message" />,
      {
        if: (props) =>
          props?.message?.source?.attributes?.notification === true,
      }
    );

    flex.MessageInputActions.Content.add(
      <OvEmojiPicker key="EmojiPicker-component" />,
      {
        sortOrder: -1,
      }
    );

    flex.DefaultTaskChannels.Default.templates!.Supervisor!.TaskOverviewCanvas!.firstLine =
      (task) =>
        `${task.attributes.client_firstName} ${task.attributes.client_lastName}`;

    flex.Supervisor.TaskInfoPanel.Content.replace(
      <OvTaskInfoPanel key="OvTaskInfoPanel" fromSupervisor />,
      {
        sortOrder: -1,
        if: (props) => {
          return (
            props.task.taskChannelUniqueName === channels.zendeskChannel ||
            props.task.taskChannelUniqueName === channels.voiceChannel
          );
        },
      }
    );

    flex.TaskInfoPanel.Content.replace(
      <OvTaskInfoPanel key="OvTaskInfoPanel" />,
      {
        sortOrder: -1,
        if: (props) => {
          return (
            props.task.taskChannelUniqueName === channels.zendeskChannel ||
            props.task.taskChannelUniqueName === channels.voiceChannel ||
            props.task.taskChannelUniqueName === channels.monitoringChannel ||
            props.task.taskChannelUniqueName ===
              channels.nonTimeSensitiveChannel
          );
        },
      }
    );

    flex.TaskCanvasHeader.Content.replace(
      <OvTaskCanvasHeader key="ov-task-canvas-header" />,
      {
        if: (props) =>
          props.task.status === "accepted" || props.task.status === "wrapping",
      }
    );

    flex.AgentDesktopView.Panel1.Content.add(
      <OvDispositionDialog key="disposition-modal" />,
      { sortOrder: 100 }
    );

    manager.workerClient?.on("reservationCreated", async (reservation) => {
      const task = reservation.task as ITask;
      if (task) {
        const newAttributes = createNewAttributesObject(task);
        await task?.setAttributes(newAttributes);
      }

      if (reservation.task.taskChannelUniqueName === "voice") {
        reservation.on("wrapup", () => {
          flex.Actions.invokeAction("SetComponentState", {
            name: "DispositionDialog",
            state: { isOpen: true, disableBackdropClick: false },
          });
        });
      }

      reservation.on("transfer-initiated", () => {
        alert("reservation.on(transfer-initiated)");
      });
    });
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  private registerReducers(manager: Flex.Manager) {
    if (!manager.store.addReducer) {
      // eslint-disable-next-line
      console.error(
        `You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${Flex.VERSION}`
      );
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
