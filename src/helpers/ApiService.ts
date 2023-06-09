import * as Flex from "@twilio/flex-ui";
import { EncodedParams } from "../types/serverless";
import { getFeatureFlags } from "./configuration";
import { random } from "lodash";

function delay<T>(ms: number, result?: T) {
  return new Promise((resolve) => setTimeout(() => resolve(result), ms));
}

export default abstract class ApiService {
  protected manager = Flex.Manager.getInstance();
  readonly baseUrl: string;

  constructor() {
    const custom_data = getFeatureFlags() || {};

    // use serverless_functions_domain from ui_attributes, or .env or set as undefined

    this.baseUrl = "";

    if (process.env?.REACT_APP_TASK_CHANNELS_SERVICE_BASE_URL)
      this.baseUrl = process.env?.REACT_APP_TASK_CHANNELS_SERVICE_BASE_URL;

    if (!this.baseUrl)
      console.error(
        "serverless_functions_domain is not set in flex config or env file"
      );
  }

  protected buildBody(encodedParams: EncodedParams): string {
    return Object.keys(encodedParams).reduce((result, paramName, idx) => {
      if (encodedParams[paramName] === undefined) {
        return result;
      }
      if (idx > 0) {
        return `${result}&${paramName}=${encodedParams[paramName]}`;
      }
      return `${paramName}=${encodedParams[paramName]}`;
    }, "");
  }

  protected fetchJsonWithReject<T>(
    url: string,
    config: RequestInit,
    attempts = 0
  ): Promise<T> {
    return fetch(url, config)
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .catch(async (error) => {
        // Try to return proper error message from both caught promises and Error objects
        // https://gist.github.com/odewahn/5a5eeb23279eed6a80d7798fdb47fe91
        try {
          // Generic retry when calls return a 'too many requests' response
          // request is delayed by a random number which grows with the number of retries
          if (error.status === 429 && attempts < 10) {
            await delay(random(100, 750) + attempts * 100);
            return await this.fetchJsonWithReject<T>(url, config, attempts + 1);
          }
          return error.json().then((response: any) => {
            throw response;
          });
        } catch (e) {
          throw error;
        }
      });
  }
}
