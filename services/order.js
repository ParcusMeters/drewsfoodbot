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

module.exports = class Order {
  static handlePayload(payload) {
    let response;

    switch (payload) {

      case "TODAYS_MENU":
        response = Response.genMenuImage(
          `${config.appUrl}/Todays_Feed.pdf`
        );
        break;
  
      case "TOMORROWS_MENU":
        response = Response.genMenuImage(
          `${config.appUrl}/Tomorrows_Feed.pdf`
        );
        break;
    }

    return response;
  }
};
