import { ITask } from "@twilio/flex-ui";

type StateAttributes = {
  dispositionValue?: string;
  comments?: string;
  ticketNumber?: string;
  tags?: string[];
};

type StringObject = { [key: string]: string | null };

const buildFullName = (firstName?: string, lastName?: string) => {
  const names: string[] = [];

  if (firstName) names.push(firstName);
  if (lastName) names.push(lastName);

  if (Boolean(names.length)) {
    return null;
  }

  return names.join(" ");
};

const buildZendeskURL = (
  type: "tickets" | "users",
  partner_zendeskUrl?: string,
  referenceId?: string
) => {
  if (partner_zendeskUrl && referenceId) {
    return `${partner_zendeskUrl}/${type}/${referenceId}`;
  } else {
    return null;
  }
};

const cleanObject = (object: StringObject) => {
  const newObject: StringObject = {};
  for (const key in object) {
    const value = object[key];

    if (value) {
      newObject[key] = value;
    }
  }

  return newObject;
};

export const createNewAttributesObject = (
  task: ITask,
  { comments, dispositionValue, tags, ticketNumber }: StateAttributes = {}
) => {
  const fullName = buildFullName(
    task?.attributes.client_firstName,
    task?.attributes.client_lastName
  );
  const newAttributes = { ...task?.attributes };
  const conversations = task?.attributes.conversations;
  const newConv: any = {
    ...conversations,
    conversation_attribute_1: newAttributes.brand_displayName || null,
    conversation_attribute_2:
      newAttributes.address_routing_serviceLevel || null,
    conversation_attribute_3: dispositionValue || null,
    conversation_attribute_6: comments || null,
    conversation_attribute_4: buildZendeskURL(
      "tickets",
      task?.attributes?.partner_zendeskUrl,
      ticketNumber
    ),
    conversation_attribute_5: tags?.join(",") || null,
    conversation_attribute_7: ticketNumber || null,
    conversation_attribute_9: task?.taskSid || null,
  };
  const newCustomers: any = {
    name: fullName,
    customer_link: buildZendeskURL(
      "users",
      task?.attributes.partner_zendeskUrl,
      task?.attributes.client_zdUserId
    ),
    customer_attribute_1: task?.attributes?.brand_displayName || null,
    email: task?.attributes?.client_primaryEmail || null,
    external_id: task?.attributes?.client_zdUserId || null,
    from: task?.attributes.from || null,
  };

  if (dispositionValue) {
    newConv.outcome = dispositionValue;
  }

  newAttributes.conversations = cleanObject(newConv);
  newAttributes.customers = cleanObject(newCustomers);

  return newAttributes;
};
