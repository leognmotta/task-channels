export interface Address {
  addresses_ui_serviceLevel: string;
  addresses_ui_zdOrgId: number;
  addresses_ui_tosAccepted: string;
  addresses_ui_combinedAddress: string;
}

export interface PhoneNumber {
  phoneNumbers_ui_phone: string;
}

export interface Attributes {
  partner_timeZone: string;
  addresses: Address[];
  ticket_subject: string;
  client_lastName: string;
  ticket_link: string;
  brand_displayName: string;
  client_primaryPhone: string;
  phoneNumbers: PhoneNumber[];
  assignee_email: string;
  partner_zendeskDomain: string;
  ticket_comment: string;
  callback_scheduled: string;
  partner_litsStatus: boolean;
  client_primaryEmail: string;
  ticket_status: string;
  address_routing_serviceLevel: string;
  client_firstName: string;
  address_routing_tosAccepted: string;
  requester_email: string;
  skippedAddresses: number;
  nts_status: string;
  partner_zendeskUrl: string;
  partner_supportPhone: string;
  address_routing_combinedAddress: string;
  client_zdUserId: number;
  address_routing_zdOrgId: number;
  from: string;
}
