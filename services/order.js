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
      case "TRACK_ORDER":
        response = Response.genQuickReply(i18n.__("order.prompt"), [
          {
            title: i18n.__("order.account"),
            payload: "LINK_ORDER"
          },
          {
            title: i18n.__("order.search"),
            payload: "SEARCH_ORDER"
          },
          {
            title: i18n.__("menu.help"),
            payload: "CARE_ORDER"
          }
        ]);
        break;

      case "SEARCH_ORDER":
        response = Response.genText(i18n.__("order.number"));
        break;

      case "ORDER_NUMBER":
        response = Response.genImageTemplate(
          `${config.appUrl}/order.png`,
          i18n.__("order.status")
        );
        break;

      case "TODAYS_MENU":
        response = Response.genButtonTemplate("Todays Feed", genWebUrlButton("Todays Feed", createLink(true)));
        break;
  
      case "TOMORROWS_MENU":
        response = Response.genText(createLink(false));
        break;


      case "LINK_ORDER":
        response = [
          Response.genText(i18n.__("order.dialog")),
          Response.genText(i18n.__("order.searching")),
          Response.genImageTemplate(
            `${config.appUrl}/order.png`,
            i18n.__("order.status")
          )
        ];
        break;
    }

    return response;
  }
};


function createLink(today){
  let date_ob = new Date();

  let tomorrow  = new Date(); // The Date object returns today's timestamp
  tomorrow.setDate(tomorrow.getDate() + 1);

  let month;
  let date;
  let year;
  if(today){
    month = date_ob.getMonth();
    date = date_ob.getDate();
    year = date_ob.getFullYear();
  } else{
    month = tomorrow.getMonth();
    date = tomorrow.getDate();
    year = tomorrow.getFullYear();
  }
  
  


  const uri_string = `https://students.standrewscollege.edu.au/wp-content/uploads/${year}/0${month+1}/${year}-${month+1}-${date}.pdf`;


  return uri_string;
}
