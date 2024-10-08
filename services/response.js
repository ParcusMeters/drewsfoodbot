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

const i18n = require("../i18n.config"),
fetch = require('node-fetch');

module.exports = class Response {
  static genQuickReply(text, quickReplies) {
    let response = {
      text: text,
      quick_replies: []
    };

    for (let quickReply of quickReplies) {
      response["quick_replies"].push({
        content_type: "text",
        title: quickReply["title"],
        payload: quickReply["payload"]
      });
    }

    return response;
  }

  static genGenericTemplate(image_url, title, subtitle, buttons) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: title,
              subtitle: subtitle,
              image_url: image_url,
              buttons: buttons
            }
          ]
        }
      }
    };
    return response;
  }

  static genRecurringNotificationsTemplate(
    image_url,
    title,
    notification_messages_frequency,
    payload
  ) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "notification_messages",
          title: title,
          image_url: image_url,
          notification_messages_frequency: notification_messages_frequency,
          payload: payload
        }
      }
    };
    return response;
  }

  static genImageTemplate(image_url, title, subtitle = "") {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: title,
              subtitle: subtitle,
              image_url: image_url
            }
          ]
        }
      }
    };

    return response;
  }

  static genSendImage(url) {
    let response = {
      attachment: {
        type: "image",
        payload: {
          url: url
        }
      }
    };
    return response;
  }

  static genButtonTemplate(title, buttons) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: title,
          buttons: buttons
        }
      }
    };

    return response;
  }

  static genText(text) {
    let response = {
      text: text
    };

    return response;
  }

  static genTextWithPersona(text, persona_id) {
    let response = {
      text: text,
      persona_id: persona_id
    };

    return response;
  }

  static genPostbackButton(title, payload) {
    let response = {
      type: "postback",
      title: title,
      payload: payload
    };

    return response;
  }

  static genRatingButton(){

    let response = Response.genGenericTemplate("https://www.standrewscollege.edu.au/wp-content/uploads/College-grounds-and-rooms_Page_04.jpg", "Did you like todays dinner?", "Please provide a rating.", [
        {
          type: 'postback',
          payload: "LIKE_MENU",
          title: "😀"
        },
        {
          type: 'postback',
          payload: "DISLIKE_MENU",
          title: "😠"
        }
      ]);
    return response;
  }

  static genRatingButtonLunch(){

    let response = Response.genGenericTemplate("https://www.standrewscollege.edu.au/wp-content/uploads/20190412_ReadingRoom-009-1.jpg", "Did you like todays lunch?", "Please provide a rating.", [
        {
          type: 'postback',
          payload: "LIKE_LUNCH",
          title: "😁"
        },
        {
          type: 'postback',
          payload: "DISLIKE_LUNCH",
          title: "😤"
        }
      ]);

    return response;
  }

  

  static genMenuButton(userPSID) {
    const url1 = createLink(true);
    const url2 = createLink(false);
    const valid1 = isURLValid(url1);
    const valid2 = isURLValid(url2);
    console.log(valid1);
    console.log(valid1);

    if(!valid1){
      return this.genText("The menu has not been uploaded yet. Please try again later.");
    }
    if(!valid2){
      return this.genText("The menu has not been uploaded yet. Please try again later.");
    }
    let menu = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: `What menu would you like to see?`,
          buttons: [
            {
              type: 'web_url',
              url: createLink(true),
              title: "Today's"
            },
            {
              type: 'web_url',
              url: createLink(false),
              title: "Tomorrow's"
            }
          ]
        }
      }
    }
    
    return menu;
  }

  static genTestButton(){
    response = {
        type: "web_url",
        title: "Visit Deez.com",
        url: "https://www.deez.com"
      
    }
    return response;
  }

  static genNuxMessage(user) {
    let welcome = this.genText(
      i18n.__("get_started.welcome", {
        userFirstName: user.firstName
      })
    );

    let guide = this.genText(i18n.__("get_started.guidance"));

    let curation = this.genQuickReply(i18n.__("get_started.help"), [
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

    return [welcome, guide, curation];
  }

  static genReviewMessage(){
    let curation = this.genQuickReply("What do you think about today's menu?", [
      {
        title: "😀",
        payload: "LIKE_MENU"
      },
      {
        title: "😠",
        payload: "DISLIKE_MENU"
      }
    ]);

    return [curation]
  }


  static genMenuMessage(user) {
    let curation = this.genQuickReply(i18n.__("get_started.help"), [
      {
        title: i18n.__("menu.todays_menu"),
        payload: "TODAYS_MENU"
      },
      {
        title: i18n.__("menu.tomorrows_menu"),
        payload: "TOMORROWS_MENU"
      }
    ]);

    return [curation];
  }
  static genMenuImage(url) {
    let response = {
      attachment: {
        type: "file",
        payload: {
          "url": url,
          "is_reusable": true
        }
      }
    };

    return response;
  }

  static createLink(today){
    return createLink(today);
  }


};

function createLink(today){
  let sydneyOffset = 11 * 60; // Use 11 for AEDT, 10 for AEST
  let  date_ob = new Date(new Date().getTime() + sydneyOffset * 60 * 1000);

  let tomorrow  = new Date(date_ob.getTime() + (24 * 60 * 60 * 1000))

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
  

  const uri_string = `https://students.standrewscollege.edu.au/wp-content/uploads/${year}/${month}/${year}-${month}-${date}.pdf`;
  //const uri_string = `https://students.standrewscollege.edu.au/wp-content/uploads/${year}/02/${year}-${month}-${date}.pdf`;
  //change when fixed
  console.log(uri_string);
  return uri_string;
};



function isURLValid(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        console.log('404 error occurred');
        return false;
      } else {
        console.log('Page is OK: ', url);
        return true;
      }
    })
    .catch(error => {
      console.error('Error occurred:', error);
      return false;
    });
}



