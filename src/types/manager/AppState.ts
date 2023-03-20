import * as Flex from "@twilio/flex-ui";

// Register all component states under the namespace
export default interface AppState {
  flex: Flex.AppState;
  custom: any;
}
