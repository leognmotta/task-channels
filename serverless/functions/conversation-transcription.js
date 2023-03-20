const axios = require("axios");

function isPhoneNumber(str) {
  const phoneRegex = /^\+?\d{1,3}?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  return phoneRegex.test(str);
}

function replaceUndefined(str) {
  const words = str.split(" ");
  const replacedWords = words.map((word) => (word === "undefined" ? "" : word));
  const result = replacedWords.join("");

  if (result === "") {
    return "";
  }

  return result;
}

function getName(author, clientName) {
  if (isPhoneNumber(author) && clientName !== "") {
    return clientName;
  } else if (isPhoneNumber(author) && clientName === "") {
    return author;
  } else {
    return fixAgentName(author);
  }
}

function fixAgentName(name) {
  const [firstName, lastName] = name
    .replace("_2E", " ")
    .replace("_40", " ")
    .split(" ");

  if (firstName && lastName) {
    return `${firstName.charAt(0).toUpperCase()}${firstName
      .slice(1)
      .toLowerCase()} ${lastName.charAt(0).toUpperCase()}${lastName
      .slice(1)
      .toLowerCase()}`;
  } else {
    return firstName;
  }
}

function formatDateString(dateString) {
  const date = new Date(dateString);

  const month = date.toLocaleString("en-US", { month: "long" });
  const day = date.toLocaleString("en-US", { day: "numeric" });
  const year = date.toLocaleString("en-US", { year: "numeric" });
  const time = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const formattedString = `${month} ${day}, ${year} at ${time}`;
  return formattedString;
}

function mapConversationToHTML(messages, clientName, conversationSid) {
  let html = "";

  messages.forEach((message) => {
    let messageHTML = `
      <div>
        <p><strong>${getName(message.author, clientName)}:</strong></p>
        <p>${message.body}</p>
        <p><small>${formatDateString(message.date_created)}</small></p>
      </div>
      <hr>
    `;
    html += messageHTML;
  });

  html = `<div><h2>Twilio Conversation Transcript</h2><div><p><strong>Conversation SID:</strong></p><p>${conversationSid}</p></div><hr>${html}</div>`;
  return html.replace(/\n/g, "").replace(/"/g, "");
}

exports.handler = async function (context, event, callback) {
  const response = new Twilio.Response();
  const accountSid = context.TWILIO_ACCOUNT_SID;
  const authToken = context.TWILIO_AUTH_TOKEN;
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.appendHeader("Content-Type", "application/json");

  const { conversationSid, clientName } = event;
  let url = `https://conversations.twilio.com/v1/Conversations/${conversationSid}/Messages`;
  const messages = [];

  try {
    do {
      const result = await axios.default.get(url, {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(accountSid + ":" + authToken).toString("base64"),
        },
      });
      url = result.data.meta.next_page_url;
      messages.push(...result.data.messages);
    } while (Boolean(url));

    response.setBody(
      mapConversationToHTML(
        messages,
        replaceUndefined(clientName),
        conversationSid
      )
    );

    callback(null, response);
  } catch (error) {
    console.log(error);
    callback(error);
  }
};
