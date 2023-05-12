// Author: Michael Smolkin
// Date: 2023-05-08
// License: MIT

// window.onload = function () {
// }

// Listen for messages from content scripts

/**
 * @param {Object} message
 * @param {Object} sender
 * @param {Function} sendResponse
 * @returns {Promise<void>}
 * 
 * Badge the app icon with "typing…" when ChatGPT is generating a response.
 * Also play as sound when the response is ready.
 */
let prevGeneratingState = false;

browser.runtime.onMessage.addListener((message, sender) => {
    if (message.type === "updateGeneratingState") {
        // console.log("Message received from content script:", message.data);
        if (Boolean(message.data)) {
            badgeText = "…"
        } else {
            badgeText = "";
            // play sound
            if (prevGeneratingState) {
                var audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU' + Array(1e3).join(25)) // https://gist.github.com/xem/670dec8e70815842eb95
                audio.play();
            }
            // console.log("badgeText: ", badgeText)
        }
        // play a sound if it's not typing and was typing during the last message. if it was not typing during the last message or is typing now, don't play a sound.
        prevGeneratingState = Boolean(message.data);
        browser.browserAction.setBadgeText({ text: badgeText });
        browser.browserAction.setBadgeBackgroundColor({ color: "#00FF00" });
    }
});