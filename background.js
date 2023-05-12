// Author: Michael Smolkin
// Date: 2023-05-08
// License: MIT

// Listen for messages from content scripts

/**
 * @param {Object} message
 * @param {Object} sender
 * @param {Function} sendResponse
 * @returns {Promise<void>}
 * 
 * Badge the app icon with "typing…" when ChatGPT is generating a response.
 * Also play a sound when the response is ready.
 */
let prevGeneratingState = false;

browser.runtime.onMessage.addListener((message, sender) => {
    if (message.type === "updateGeneratingState") {
        if (Boolean(message.data)) {
            badgeText = "…"
        } else {
            badgeText = "";
            // play a sound if GPT is not typing now && was typing during the last message && the play sound setting is enabled
            if (prevGeneratingState) {
                browser.browserAction.setBadgeText({ text: "!" });
                console.log("Response ready!");

                browser.storage.local.get("playSound").then((result) => {
                    if (result.playSound) {
                        let audioBase64 = ding;
                        var audio = new Audio(audioBase64);
                        audio.play();
                    }
                }).catch((error) => {
                    console.error(`Error: ${error}`);
                });
            }
        }
        prevGeneratingState = Boolean(message.data);
        browser.browserAction.setBadgeText({ text: badgeText });
        browser.browserAction.setBadgeBackgroundColor({ color: "#00FF00" });
    }
});


browser.runtime.onInstalled.addListener(details => {
    if (details.reason === 'install') {
        browser.storage.local.set({ playSound: true });
    }
});

// Sounds
let beep = 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU' + Array(1e3).join(25); // https://gist.github.com/xem/670dec8e70815842eb95
let ding = 'data:audio/wav;base64,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' // https://www.reddit.com/r/shortcuts/comments/9kpqdy/play_the_very_satisfying_app_store_touch_id/ -> https://theinspiringdad.com/wp-content/uploads/2017/11/AppStore-Touch-ID-Authentication-Sound-Play-and-Download-Here.mp3
let someOtherSound = 'data:audio/mpeg;base64,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wZ0G7jqlt/OcDIKX+/1NblSX+VKfQfP8xuJJGk7////rf////+PgXTv///1JThJJQainmySAB6imUyuVbVttUo7T4Csa821OuF88f62+CZHFnGf///mQgYIEO0SMF2NVy9NxYTdlqJ8AuS4zr//SJoTUJ+CaKKTcZvosrUPo8W/MUv0f033E9E/QpN6P///v/////WRR2mwUAYUABjabRu1vrOLKAF0kIdHjnEx/iNWo7jGn1////mApxNTJQQOU1Het/NoUFTMQs6Vja///THaGIl/0fojl8mjd/Jo8W+ZfpNpCajsz7////6kn/////WRRgDz//LD1KSTDjKOciSAKxdLx5S31uYqKIWj/+5JECgAC8V5M6g9rdFyr6Vo9rW6KtHcr5DEJQRkSpLRklSigvVc4QpmyPe9H3zHR1/in9P/8VNCMJOzYUDyVjfwHP0ZgiZt/3/+9EBnDKbegdUrckhgntHaQ9vX/X/9A/////+r/////mJ3/9ItRcoVRogAcmV9N8z0pvES8QQsKoMGXEymPQyWm6E4HQLqgpv/CZJAtYXQSwoF8e6SB56zABEoW+qgZjJAZovGr0Gl5/OjFKL3JwnaX9v7/X8y1f/////////49WAzMzEYYMZLq6CUANIqbDX7lisBIdraAEPwShTRc9WZ2vAqBc4NQ9GrUNaw0Czcrte0g1NEoiU8NFjx4NFh54FSwlOlgaCp0S3hqo8SLOh3/63f7P/KgKJxxhgGSnAFMCnIogwU5JoqBIDAuBIiNLETyFmiImtYiDTSlb8ziIFYSFv/QPC38zyxEOuPeVGHQ77r/1u/+kq49//6g4gjoVQSUMYQUSAP8PwRcZIyh2kCI2OwkZICZmaZxgnsNY8DmSCWX0idhtz3VTJSqErTSB//1X7TTTVVV//uSZB2P8xwRJ4HvYcItQlWBACM4AAABpAAAACAAADSAAAAEVf/+qCE000VVVVU0002//+qqqqummmmr///qqqppppoqqqqppppoqqATkEjIyIxBlBA5KwUEDBBwkFhYWFhUVFfiqhYWFhcVFRUVFv/Ff/xUVFRYWFpMQU1FMy45OS41qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg=='; // https://stackoverflow.com/questions/35497243/how-to-make-a-short-beep-in-javascript-that-can-be-called-repeatedly-on-a-page