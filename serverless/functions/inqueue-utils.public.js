exports.handler = async function (context, event, callback) {
  // setup twilio client
  const client = context.getTwilioClient();

  const resp = new Twilio.Response();
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
  resp.setHeaders(headers);

  // get method
  const { mode } = event;

  switch (mode) {
    case "requeueTasks":
      //  handler to create new task
      function newTask(workflowSid, attr) {
        return client.taskrouter
          .workspaces(context.TWILIO_WORKSPACE_SID)
          .tasks.create({
            taskChannel: event.type,
            workflowSid,
            attributes: JSON.stringify(attr),
            channel: event.type,
          })
          .catch((error) => {
            console.log("newTask error");
            handleError(error);
            return Promise.reject(error);
          });
      }

      //  handler to update the existing task
      function completeTask(taskSid) {
        return client.taskrouter
          .workspaces(context.TWILIO_WORKSPACE_SID)
          .tasks(taskSid)
          .update({
            assignmentStatus: "completed",
            reason: "task transferred",
          })
          .catch((error) => {
            console.log("completeTask error");
            return Promise.reject(error);
          });
      }

      //  main logic for requeue execution
      let newAttributes = {
        ...event.attributes,
        queueTargetSid: event.queueSid,
        queueTargetName: event.queueName,
        address_routing_serviceLevel: event.queueName,
        address_routing_tosAccepted: "yes",
      };

      /*
       * setup new task's attributes such that its linked to the
       * original task in Twilio WFO
       */
      if (!newAttributes.hasOwnProperty("conversations")) {
        // eslint-disable-next-line camelcase
        newAttributes = {
          ...newAttributes,
          conversations: { conversation_id: event.taskSid },
        };
      }
      //  create new task
      const createdTask = await newTask(event.workflowSid, newAttributes);
      //  update existing task
      const completedTask = await completeTask(event.taskSid);

      return callback(null, resp.setBody({ createdTask, completedTask }));
      break;

    default:
      return callback(500, "Mode not specified");
      break;
  }
};
