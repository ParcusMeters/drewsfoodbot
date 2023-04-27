/**
 * Copyright 2021-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger For Original Coast Clothing
 * https://developers.facebook.com/docs/messenger-platform/getting-started/sample-apps/original-coast-clothing
 */

"use strict";

const Menu = require("./menu"),
  Response = require("./response"),
  GraphApi = require("./graph-api"),
  i18n = require("../i18n.config"),
  Database = require("./database");

module.exports = class Receive {
  constructor(user, webhookEvent, isUserRef) {
    this.user = user;
    this.webhookEvent = webhookEvent;
    this.isUserRef = isUserRef;
  }

  // Check if the event is a message or postback and
  // call the appropriate handler function
  handleMessage() {
    let event = this.webhookEvent;

    let responses;

    try {
      if (event.message) {
        let message = event.message;

        if (message.quick_reply) {
          responses = this.handleQuickReply();
        } else if (message.attachments) {
          responses = this.handleAttachmentMessage();
        } else if (message.text) {
          responses = this.handleTextMessage();
        }
      } else if (event.postback) {
        responses = this.handlePostback();
      } else if (event.referral) {
        responses = this.handleReferral();
      } else if (event.optin) {
        responses = this.handleOptIn();
      } else if (event.reaction){
        responses = this.handleReaction()
      }
    } catch (error) {
      console.error(error);
      responses = {
        text: `An error has occured: '${error}'. We have been notified and \
        will fix the issue shortly!`
      };
    }

    if (Array.isArray(responses)) {
      let delay = 0;
      for (let response of responses) {
        console.log(response);
        this.sendMessage(response, delay * 2000, this.isUserRef);
        delay+=4;
      }
    } else {
      this.sendMessage(responses, this.isUserRef);
    }
  }

  // Handles messages events with text
  handleTextMessage() {
    console.log(
      "Received text:",
      `${this.webhookEvent.message.text} for ${this.user.psid}`
    );

    let event = this.webhookEvent;

    // check greeting is here and is confident
    let greeting = this.firstEntity(event.message.nlp, "greetings");
    let message = event.message.text.trim().toLowerCase();

    let response;

    if (
      (greeting && greeting.confidence > 0.8) ||
      message.includes("start over")
    ) {
      response = Response.genMenuMessage(this.user);

      //added features
    } else if (message.includes("food menu")){
      response = Response.genMenuButton();
    } else if (message.includes("image")){
      response = Menu.handlePayload("TODAYS_MENU");
    }else if (message.includes("can i see the menu?")){
      response = Response.genMenuButton();
    }else if (message.includes("can i see the menu")){
      response = Response.genMenuButton();
    }else if (message.includes("Can I see the menu?")){
      response = Response.genMenuButton();
    }else if (message.includes("Menu Options")){
      response = Response.genMenuButton();
    }else if (message.includes("help")){
      response = Response.genText("A human user has been contacted and will be with you shortly to assist.");
    }else if (message.includes("button")){
      response = Response.genWebUrlButton();
    }else if (message.includes("👍")){
      Database.newRating(true, Response.createLink(true));
      response = Response.genText("You liked the menu.");
    }else if (message.includes("👎")){
      Database.newRating(false, Response.createLink(true));
      response = Response.genText("You disliked the menu.");
    }else if (message.includes("data")){
      Database.retrieveData();
    }else if (message.includes("connect")){
      Database.connect();
    }else if (message.includes("review")){
      response = Response.genRatingButton();
    }else if (message.includes("connect")){
      Database.connect();
    }else if (message.includes("disc")){
      Database.close();
    }else if (message.includes("deeznuts")){
      response = Response.genReviewMessage();
    }else if (message.includes("anothertest")){
      console.log(this.user);
      response = [
        Response.genText("deez"),
        Response.genMenuButton(),
        Response.genRatingButton()
        ];
    }

    else {
      response = [
        Response.genText(
          i18n.__("fallback.any", {
            message: event.message.text
          })
        ),
        Response.genText(i18n.__("get_started.guidance")),
        Response.genQuickReply(i18n.__("get_started.help"), [
          {
            title: "Can I see the menu?",
            payload: "CAN I SEE THE MENU?"
          }
        ])
      ];
    }

    return response;
  }

  // Handles mesage events with attachments
  handleAttachmentMessage() {
    let response;

    // Get the attachment
    let attachment = this.webhookEvent.message.attachments[0];
    console.log("Received attachment:", `${attachment} for ${this.user.psid}`);

    response = Response.genQuickReply(i18n.__("fallback.any"), [
      {
        title: i18n.__("menu.todays_menu"),
        payload: "TODAYS_MENU"
      },
      {
        title: i18n.__("menu.tomorrows_menu"),
        payload: "TOMORROWS_MENU"
      }
    ]);

    return response;
  }

  // Handles mesage events with quick replies
  handleQuickReply() {
    // Get the payload of the quick reply
    let payload = this.webhookEvent.message.quick_reply.payload;

    return this.handlePayload(payload);
  }

  

  // Handles postbacks events
  handlePostback() {
    let postback = this.webhookEvent.postback;
    // Check for the special Get Starded with referral
    let payload;
    if (postback.referral && postback.referral.type == "OPEN_THREAD") {
      payload = postback.referral.ref;
    } else if (postback.payload) {
      // Get the payload of the postback
      payload = postback.payload;
    }

    return this.handlePayload(payload.toUpperCase());
  }

  // Handles referral events
  handleReferral() {
    // Get the payload of the postback
    let payload = this.webhookEvent.referral.ref.toUpperCase();

    return this.handlePayload(payload);
  }

  // Handles optins events
  handleOptIn() {
    let optin = this.webhookEvent.optin;
    // Check for the special Get Starded with referral
    let payload;
    if (optin.type === "notification_messages") {
      payload = "RN_" + optin.notification_messages_frequency.toUpperCase();
      this.sendRecurringMessage(optin.notification_messages_token, 5000);
      return this.handlePayload(payload);
    }
    return null;
  }
  handlePayload(payload) {
    console.log("Received Payload:", `${payload} for ${this.user.psid}`);

    let response;

    // Set the response based on the payload
    if (
      payload === "GET_STARTED" ||
      payload === "DEVDOCS" ||
      payload === "GITHUB"
    ) {
      response = Response.genNuxMessage(this.user);
    } 
    //adding menu options
    else if (payload === "CAN I SEE THE MENU?"){
      response = Response.genMenuButton();
    }
    else if (payload === "LIKE_MENU"){
      Database.newRating(true, Response.createLink(true));
    }
    else if (payload === "DISLIKE_MENU"){
      Database.newRating(false, Response.createLink(true));
    }
    else {
      response = {
        text: `This feature is currently under development`
      };
    }

    return response;
  }

  handlePrivateReply(type, object_id) {
    let welcomeMessage =
      i18n.__("get_started.welcome") +
      " " +
      i18n.__("get_started.guidance") +
      ". " +
      i18n.__("get_started.help");

    let response = Response.genQuickReply(welcomeMessage, [
      {
        title: i18n.__("menu.suggestion"),
        payload: "CURATION"
      },
      {
        title: i18n.__("menu.help"),
        payload: "CARE_HELP"
      },
      {
        title: i18n.__("menu.product_launch"),
        payload: "PRODUCT_LAUNCH"
      }
    ]);

    let requestBody = {
      recipient: {
        [type]: object_id
      },
      message: response
    };
    GraphApi.callSendApi(requestBody);
  }

  handleReaction(payload){
    
  }

  sendMessage(response, delay = 0, isUserRef) {
    // Check if there is delay in the response
    if (response === undefined) {
      return;
    }
    if ("delay" in response) {
      delay = response["delay"];
      delete response["delay"];
    }
    // Construct the message body
    let requestBody = {};
    if (isUserRef) {
      // For chat plugin
      requestBody = {
        recipient: {
          user_ref: this.user.psid
        },
        message: response
      };
    } else {
      requestBody = {
        recipient: {
          id: this.user.psid
        },
        message: response
      };
    }

    // Check if there is persona id in the response
    if ("persona_id" in response) {
      let persona_id = response["persona_id"];
      delete response["persona_id"];
      if (isUserRef) {
        // For chat plugin
        requestBody = {
          recipient: {
            user_ref: this.user.psid
          },
          message: response,
          persona_id: persona_id
        };
      } else {
        requestBody = {
          recipient: {
            id: this.user.psid
          },
          message: response,
          persona_id: persona_id
        };
      }
    }

    setTimeout(() => GraphApi.callSendApi(requestBody), delay);
  }
  firstEntity(nlp, name) {
    return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
  }
};
