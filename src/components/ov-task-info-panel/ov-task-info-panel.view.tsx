import React from "react";
import * as Flex from "@twilio/flex-ui";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import { Actions } from "@twilio/flex-ui";

import { Attributes } from "../../types/attributes";
import { OvTaskInfo } from "../ov-task-info";
import { OvTaskContext } from "../ov-task-context";
import { OvTitle } from "../ov-title";
import { channels } from "../../shared/constants";
import { startTransfer } from "../../shared/utils";
import styles from "./styles";
import { formatPhoneNumber } from "../../shared/utils";

const allowedQueues = [
  "Non-Member",
  "Essentials Plus",
  "Priority",
  "Signature",
  "Unidentified",
  "Inactive",
  "Proactive",
];

export interface TaskInfoPanelProps {
  task?: Flex.ITask;
  fromSupervisor?: boolean;
}

export interface TaskInfoPanelState {
  menuAnchor: EventTarget | null;
  queues: any[];
  isUnidentified: boolean;
}

export class OvTaskInfoPanelView extends React.Component<
  TaskInfoPanelProps,
  TaskInfoPanelState
> {
  static displayName = "OvTaskInfoPanelView";

  constructor(props: TaskInfoPanelProps) {
    super(props);
    this.state = {
      queues: [],
      menuAnchor: null,
      isUnidentified: !Boolean(
        this.props?.task?.attributes.client_firstName +
          this.props?.task?.attributes.client_lastName
      ),
    };
  }

  componentDidMount() {
    Flex.Manager.getInstance()
      .insightsClient.instantQuery("tr-queue")
      .then((q) => {
        q.on("searchResult", (items) => {
          this.setState({ queues: items });
        });
        q.search('data != ""');
      });
  }

  startTransfer = async (queue: any) => {
    await startTransfer({
      taskSid: this.props.task?.taskSid,
      attributes: this.props.task?.attributes,
      workflowSid: this.props.task?.workflowSid,
      queueName: queue.queue_name,
      queueSid: queue.queue_sid,
      type: this.props.task?.taskChannelUniqueName,
    });
    Actions.invokeAction("updateActivity");
  };

  render(): React.ReactNode {
    const attributes = this.props.task?.attributes as Attributes;
    const task = this.props.task;
    const fromSupervisor = this.props.fromSupervisor;

    if (!task) {
      return null;
    }

    return (
      <div>
        <div style={{ marginBottom: 15 }}>
          <OvTitle>Partner Information</OvTitle>
          {Boolean(attributes.brand_displayName) && (
            <OvTaskInfo label="Name" value={attributes.brand_displayName} />
          )}
          <OvTaskInfo label="Timezone" value={attributes.partner_timeZone} />
        </div>

        <div style={{ marginBottom: 15 }}>
          <OvTitle>User Information</OvTitle>
          <OvTaskInfo
            label="Full Name"
            value={
              this.state.isUnidentified
                ? ""
                : `${attributes.client_firstName} ${attributes.client_lastName}`
            }
          />
          <OvTaskInfo
            label="Primary Phone"
            value={formatPhoneNumber(attributes.client_primaryPhone || "")}
            copyable
          />
          {attributes.requester_email && (
            <OvTaskInfo
              label="Requester Email"
              value={`${attributes.requester_email}`}
              copyable
            />
          )}
        </div>

        {task.taskChannelUniqueName === channels.zendeskChannel ||
        task.taskChannelUniqueName === channels.monitoringChannel ||
        task.taskChannelUniqueName === channels.nonTimeSensitiveChannel ? (
          <div style={{ marginBottom: 15 }}>
            <OvTitle>Ticket Information</OvTitle>
            <OvTaskInfo
              label="Subject"
              value={`${attributes.ticket_subject}`}
            />
            <OvTaskInfo
              label="Link"
              value={`${attributes.ticket_link}`}
              href={`${attributes.ticket_link}`}
            />
            <OvTaskInfo label="Comment" value={attributes.ticket_comment} />
          </div>
        ) : null}

        <div style={{ marginBottom: 15 }}>
          <OvTitle>Routing Organization</OvTitle>
          <OvTaskInfo
            label="Address"
            value={attributes.address_routing_combinedAddress}
            href={
              attributes.address_routing_zdOrgId
                ? `${attributes.partner_zendeskUrl}/organizations/${attributes.address_routing_zdOrgId}`
                : undefined
            }
          />
          <OvTaskInfo
            label="Service Level"
            value={attributes.address_routing_serviceLevel}
          />
          <OvTaskInfo
            label="Terms of Service"
            value={attributes.address_routing_tosAccepted}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <OvTaskInfo label="Task SID" value={task.taskSid} />
        </div>

        {fromSupervisor && <OvTaskContext task={task} />}

        <Button
          style={styles.cbButton}
          variant="outlined"
          disabled={this?.props?.task?.taskStatus?.toLowerCase() !== "assigned"}
          onClick={(event) => {
            this.setState({ menuAnchor: event.target });
          }}
        >
          Re-Queue
        </Button>

        <Menu
          anchorEl={(this.state.menuAnchor as HTMLElement) || undefined}
          open={Boolean(this.state.menuAnchor)}
          onClose={() => {
            this.setState({ menuAnchor: null });
          }}
        >
          <Typography style={styles.reQueueMenuCaption}>
            Select queue:
          </Typography>
          {Object.values(this.state.queues)
            .filter((queue) => allowedQueues.includes(queue.queue_name))
            .sort()
            .map((queue) => {
              return (
                <MenuItem
                  key={queue.queue_sid}
                  onClick={() => {
                    this.startTransfer(queue);
                    this.setState({ menuAnchor: null });
                  }}
                >
                  {queue.queue_name}
                </MenuItem>
              );
            })}
        </Menu>
      </div>
    );
  }
}
