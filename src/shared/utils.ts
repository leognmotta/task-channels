import * as Flex from "@twilio/flex-ui";

import * as http from "../helpers/http";
import { buildUrl } from "../helpers/urlHelpers";
import { Attributes } from "../types/attributes";

const url = buildUrl("/inqueue-utils");

const manager = Flex.Manager.getInstance();

export const startTransfer = async ({
  taskSid,
  attributes,
  workflowSid,
  queueName,
  queueSid,
  type,
}: any) => {
  const data = {
    mode: "requeueTasks",
    type,
    Token: manager.store.getState().flex.session.ssoTokenPayload.token,
    taskSid,
    attributes,
    workflowSid,
    queueSid,
    queueName,
    state: false,
  };

  return http.post(url, data, {
    verbose: true,
    title: "Requeue web service",
  });
};

export const getTitleFromTaskAttributes = (attributes: Attributes) => {
  const {
    client_firstName: firstName,
    client_lastName: lastName,
    brand_displayName: brandDisplayName,
    requester_email: requesterEmail,
  } = attributes;

  let joinedName = [firstName, lastName].filter((r) => Boolean(r)).join(" ");

  if (joinedName) {
    return brandDisplayName
      ? `${joinedName} (${brandDisplayName})`
      : joinedName;
  }

  if (brandDisplayName && requesterEmail) {
    return `${requesterEmail} (${brandDisplayName})`;
  }

  return requesterEmail;
};

export function formatPhoneNumber(phoneNumberString: string) {
  var cleaned = ("" + phoneNumberString.replace("+1", "")).replace(/\D/g, "");
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "+1 " + "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return "";
}
