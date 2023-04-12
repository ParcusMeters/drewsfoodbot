"use strict";

// Imports dependencies
const Response = require("./response"),
  i18n = require("../i18n.config"),
  config = require("./config");

module.exports = class Menu {
  static handlePayload(payload) {
    let response;

    switch (payload) {
      case "TODAYS_MENU":

        /* response = Response.genButtonTemplate("Todays Feed", Response.genWebUrlButton("Todays Feed", createLink(true))); */
        response = [
          Response.genText("Here is todays menu!"),
          Response.genText(createLink(true))
        ];
        break;
  
      case "TOMORROWS_MENU":
        response = [
          Response.genText("Here is tomorrows menu!"),
          Response.genText(createLink(false))
        ];
        break;

      case "BUTTON":
        response = Response.genMenuButton();
        break;
    }

    return response;
  }

};



