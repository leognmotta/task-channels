import * as React from "react";
import * as Flex from "@twilio/flex-ui";
import { Actions } from "@twilio/flex-ui";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Chip from "@material-ui/core/Chip";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import { classes } from "./ov-disposition-dialog.styles";
import { createNewAttributesObject } from "../../helpers/createNewAttributesObject";
import { channels } from "../../shared/constants";

const CONVERSATION_TRANSCRIPTION = `${process.env.REACT_APP_TASK_CHANNELS_SERVICE_BASE_URL}/conversation-transcription`;
const SAVE_ZENDESK_TRANSCRIPTION = `${process.env.FLEX_APP_AWS_LAMBDA_API}/zendesk-transcription`;
const DefaultDisposition = "DEFAULT";
const DefaultTag = "DEFAULT";
const OtherCommentRequired = "Other - Comment Required";
const initialTags: string[] = [];

export interface Props {
  isOpen: boolean;
  disableBackdropClick: boolean;
  task?: Flex.ITask;
  theme: { isLight: boolean };
}

export default class OvDispositionDialog extends React.Component<Props> {
  state = {
    callDisposition: DefaultDisposition,
    tags: initialTags,
    ticketNumber: "",
    comments: "",
    noTicket: false,
    errors: {
      disposition: false,
      ticketNumber: false,
      comments: false,
    },
    dispositionsOptions: [
      "Already Worked *NEW",
      "Callback Scheduled - Client Requested",
      "Callback Scheduled - Reboot/Follow up",
      "Callback Scheduled - Trans to Tech",
      "Deleted",
      "Escalated to Advanced - Normal",
      "Escalated to Advanced - Urgent",
      "Issue Resolved - Basic",
      "Issue Resolved - Client Thank You",
      "Issue Resolved - Membership",
      "Issue Resolved - Unresponsive Client",
      "Merged RSM",
      "Merged w/ Basic",
      "Merged w/ Advanced",
      "New RSM - Emailed Client",
      "Non-Support Event - Closed",
      "Non-Support Event - Escalated",
      "Ticket Followup- New Due Date",
      "Reskilled",
      "RSM Team - Disable Notifications",
      "Spam Call",
      "Outbound to Client",
      "Left Voicemail",
      "Transferred to Tech Spec.",
      "Transferred to Partner",
      "Updated AS ticket",
      "Internal System Testing",
      "Other - Comment Required",
    ],
    tagsOptions: [
      "e+_sold",
      "priority_sold",
      "proactive_sold",
      "signature_sold",
      "tos_accepted_non-member",
      "exception_used",
      "marketing_email",
      "gathered",
      "multiple_tickets",
    ],
  };

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.task?.attributes?.ticket_link !==
      prevProps.task?.attributes?.ticket_link
    ) {
      if (this.props.task?.attributes?.ticket_link) {
        const urlArray: string[] =
          this.props.task?.attributes.ticket_link.split("/");
        const ticketNumber = urlArray[urlArray.length - 1];
        this.setState({ ticketNumber });
      }
    }
  }

  handleClose = () => {
    if (!this.props.disableBackdropClick) this.closeDialog();
  };

  closeDialog = () => {
    this.setState({ ticketNumber: "" });
    Actions.invokeAction("SetComponentState", {
      name: "DispositionDialog",
      state: { isOpen: false },
    });
  };

  handleDispositionReasonChange = (
    e: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    const value = e.target.value;
    this.setState({
      errors: {
        ...this.state.errors,
        disposition: false,
      },
    });
    this.setState({ callDisposition: value });
  };

  handleTagChange = (
    e: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    const value = e.target.value;
    this.setState({ tags: [...this.state.tags, value] });
  };

  handleTicketNumberChange = (
    e: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    const value = e.target.value;
    this.setState({
      errors: {
        ...this.state.errors,
        ticketNumber: false,
      },
    });
    this.setState({ ticketNumber: value });
  };

  handleCommentsChange = (
    e: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    const value = e.target.value;
    this.setState({
      errors: {
        ...this.state.errors,
        comments: false,
      },
    });
    this.setState({ comments: value });
  };

  handleDeleteTag = (value: string) =>
    this.setState({ tags: this.state.tags.filter((tag) => tag !== value) });

  validate = () => {
    let isValid = true;

    if (!Boolean(this.state.ticketNumber) && !this.state.noTicket) {
      isValid = false;
      this.setState({
        errors: {
          ...this.state.errors,
          ticketNumber: true,
        },
      });
    }

    if (this.state.callDisposition === DefaultDisposition) {
      isValid = false;
      this.setState({
        errors: {
          ...this.state.errors,
          disposition: true,
        },
      });
    }

    if (
      this.state.callDisposition === OtherCommentRequired &&
      !Boolean(this.state.comments)
    ) {
      isValid = false;
      this.setState({
        errors: {
          ...this.state.errors,
          comments: true,
        },
      });
    }

    return isValid;
  };

  handleSaveDisposition = async () => {
    const dispositionValue = this.state.callDisposition;
    const isValid = this.validate();

    if (isValid && this.props.task) {
      const newAttributes = createNewAttributesObject(this.props.task, {
        dispositionValue,
        comments: this.state.comments,
        tags: this.state.tags,
        ticketNumber: this.state.ticketNumber,
      });

      // save chat history
      if (
        !this.state.noTicket &&
        this.props.task.taskChannelUniqueName ===
          channels.conversationChannel &&
        this.state.ticketNumber
      ) {
        try {
          const body = {
            conversationSid: this.props.task.attributes.conversationSid,
            workflowSid: this.props.task.workflowSid,
            partnerZendeskUrl: this.props.task.attributes.partner_zendeskUrl,
            ticketId: this.state.ticketNumber,
            partnerId: this.props.task.attributes.partner_id,
            transcription: "",
            clientName: `${this.props.task.attributes.client_client_firstName} ${this.props.task.attributes.client_client_lastName}`,
          };
          const transcription = await fetch(CONVERSATION_TRANSCRIPTION, {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(body),
          });
          body.transcription = await transcription.text();
          await fetch(SAVE_ZENDESK_TRANSCRIPTION, {
            headers: {
              "Content-Type": "application/json",
              Authorization: Flex.Manager.getInstance().user.token,
            },
            method: "POST",
            body: JSON.stringify(body),
          });
        } catch (error) {
          console.error(error);
        }
      }

      await this.props.task?.setAttributes(newAttributes);

      //clear disposition
      this.setState({
        callDisposition: DefaultDisposition,
        tags: initialTags,
        comments: "",
        ticketNumber: "",
        noTicket: false,
        errors: {
          disposition: false,
          ticketNumber: false,
        },
      });
      Actions.invokeAction("CompleteTask", { sid: this.props.task?.sid });
      this.closeDialog();
    }
  };

  render() {
    return (
      <Dialog
        disableBackdropClick={this.props.disableBackdropClick}
        open={this.props.isOpen || false}
        onClose={this.handleClose}
      >
        <DialogContent>
          <DialogContentText style={classes.dialogContentText}>
            Please select the outcome/disposition value for this task.
          </DialogContentText>

          <FormControl
            style={classes.formControl}
            fullWidth
            error={this.state.errors.disposition}
          >
            <Select
              variant="standard"
              fullWidth
              value={this.state.callDisposition}
              onChange={this.handleDispositionReasonChange}
              name="disposition"
            >
              <MenuItem disabled value={DefaultDisposition}>
                Disposition Reason
              </MenuItem>
              {this.state.dispositionsOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {this.state.errors.disposition && (
              <FormHelperText>Disposition is required</FormHelperText>
            )}
          </FormControl>

          <FormControl
            style={classes.formControl}
            fullWidth
            error={this.state.errors.ticketNumber}
          >
            <TextField
              variant="standard"
              fullWidth
              value={this.state.ticketNumber}
              onChange={this.handleTicketNumberChange}
              placeholder="Ticket Number"
              name="ticket"
              type="number"
              disabled={this.state.noTicket}
            />
            {this.state.errors.ticketNumber && (
              <FormHelperText>Ticket Number is required</FormHelperText>
            )}
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.noTicket}
                onChange={() =>
                  this.setState({ noTicket: !this.state.noTicket })
                }
                name="noTicket"
                color="primary"
              />
            }
            label="No ticket"
          />

          <div style={classes.tagsContainer}>
            {Boolean(this.state.tags && this.state.tags.length) ? (
              <>
                {this.state.tags.map((tag) => (
                  <div key={tag} style={classes.chipContainer}>
                    <Chip
                      label={tag}
                      onDelete={() => this.handleDeleteTag(tag)}
                    />
                  </div>
                ))}
              </>
            ) : (
              " No tags"
            )}
          </div>

          <Select
            variant="standard"
            style={classes.formControl}
            fullWidth
            value={DefaultTag}
            onChange={this.handleTagChange}
            name="tags"
          >
            <MenuItem disabled value={DefaultTag}>
              Select Tags
            </MenuItem>
            {this.state.tagsOptions
              .filter((tag) => !this.state.tags.includes(tag))
              .map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
          </Select>

          {this.state.callDisposition === OtherCommentRequired && (
            <FormControl
              style={classes.formControl}
              fullWidth
              error={this.state.errors.comments}
            >
              <TextField
                variant="standard"
                fullWidth
                multiline
                inputProps={{ maxLength: 140 }}
                rows={5}
                value={this.state.comments}
                onChange={this.handleCommentsChange}
                placeholder="Comments (maximum 140 characters)"
                name="comments"
              />
              {this.state.errors.comments && (
                <FormHelperText>Comment is required</FormHelperText>
              )}
            </FormControl>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={this.handleSaveDisposition}
            style={{
              color:
                this.state.errors.disposition || this.state.errors.ticketNumber
                  ? "lightgray"
                  : "#2AC5C9",
              cursor:
                this.state.errors.disposition || this.state.errors.ticketNumber
                  ? "not-allowed"
                  : "pointer",
            }}
            disabled={
              this.state.errors.disposition || this.state.errors.ticketNumber
            }
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
