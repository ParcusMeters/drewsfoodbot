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
    month = String(date_ob.getMonth() + 1).padStart(2, '0');
    /* date = String(date_ob.getDate()).padStart(2, '0'); */

    /* month = date_ob.getMonth() + 1 */
    date = String(date_ob.getDate()).padStart(2, '0');
    year = date_ob.getFullYear();
  } else{
    month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    date = String(tomorrow.getDate()).padStart(2, '0');
    year = tomorrow.getFullYear();
  }
  

  //const uri_string = `https://students.standrewscollege.edu.au/wp-content/uploads/${year}/${month}/${year}-${month}-${date}.pdf`;
  const uri_string = `https://students.standrewscollege.edu.au/wp-content/uploads/${year}/02/${year}-${month}-${date}.pdf`;
  //change when fixed
  return uri_string;
}
