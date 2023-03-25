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
        response = [Response.genWebUrlButton("button", "www.bbc.co")];
        break;
    }

    return response;
  }

};



