import { Manager, TaskHelper } from "@twilio/flex-ui";

class FlexState {
  private manager = Manager.getInstance();

  get flexState() {
    return this.manager.store.getState().flex;
  }

  get workerTasks() {
    return this.flexState.worker.tasks;
  }

  get hasLiveCallTask() {
    if (!this.workerTasks) return false;

    return Array.from(this.workerTasks.values()).some((task) =>
      TaskHelper.isLiveCall(task)
    );
  }
}

const flexStateSingleton = new FlexState();

export default flexStateSingleton;
