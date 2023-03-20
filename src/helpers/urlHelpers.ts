import urlJoin from "url-join";

const baseUrl = process.env.REACT_APP_TASK_CHANNELS_SERVICE_BASE_URL || "";

export const buildUrl = (...uris: string[]) => {
  return urlJoin(baseUrl, ...uris);
};
