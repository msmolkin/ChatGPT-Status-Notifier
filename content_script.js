// Author: Michael Smolkin
// Date: 2023-05-08
// License: MIT

/**
 * Waits for a certain element to appear on the page before allowing code to execute.
 * @param {string} selector - The CSS selector of the element to wait for.
 * @returns {Promise} - A promise that resolves when the element is found on the page.
 */
function waitFor(selector) {
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(intervalId);
        resolve(element);
      }
    }, 100);
  });
}

/**
 * Notifies the user whether GPT is still generating a response.
 * In a future version, this will also notify the user when GPT has finished generating a response via an alert.
 * May also notify via push notification when paired with an app.
 */
var checkWhetherGptTyping = function () {

    const buttons = document.querySelectorAll("button.btn-neutral");
    let gptGeneratingButton;    // should be const
    if (buttons && buttons.length > 0) {
        for (let button of buttons) {
            if (button.innerText === 'Stop generating' || button.innerText === 'Regenerate response') {
                gptGeneratingButton = button;
                break;
            }
        }
    }

    const isGenerating = gptGeneratingButton && gptGeneratingButton.getAttribute('typing') === 'true';
    let counter = 0; let showCounter = false;    // Counter to count how long it takes to generate a response
    
    if (gptGeneratingButton) {
        if (!isGenerating && gptGeneratingButton.innerText === 'Stop generating') {
            // This is the case where the user has clicked "Regenerate response" and the response is being generated
            gptGeneratingButton.setAttribute('typing', 'true');
            counter++; showCounter = true;
        } else if (!isGenerating && gptGeneratingButton.innerText === 'Regenerate response') { // TODO: why does this work?
            // This is the case where the user has clicked "Stop generating" or the response has been generated
            gptGeneratingButton.setAttribute('typing', 'false');

            // I can inject the time that it took to generate a response into the page here.
            if (showCounter){
                console.log(`Response time: ${counter} seconds`);
                counter = 0;
                showCounter = false;
            }
        }   // Todo: add a case for when the user gave too much text input and we have an error (the page must be refreshed)


        // Send a message to the background script
        browser.runtime.sendMessage({ type: "updateGeneratingState", data: gptGeneratingButton.getAttribute('typing') === 'true' });
} else {
        // if url contains /c/, then the user is in a chat
        if (window.location.href.includes('/c/')) {
            console.error('Could not find the button element for whether GPT is currently generating content.');
        } // else the user is in a new chat, and there is no button element
    }

}

// TODO possibly later:
// if the user is in another tab, alert the user when GPT has finished typing
// this will only run if the user checks the box in the options page (requires adding the option to the options page, checked by default)

// Call updateNotification function every 500ms
setInterval(checkWhetherGptTyping, 500);