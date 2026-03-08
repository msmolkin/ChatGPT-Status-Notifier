// Author: Michael Smolkin
// Date: 2023-05-08, Updated: 2025-04-06
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
 * Determines whether the current site is ChatGPT or Claude
 * @returns {string} - 'chatgpt' or 'claude'
 */
function getSiteType() {
  if (window.location.href.includes('chat.openai.com') || window.location.href.includes('chatgpt.com')) {
    return 'chatgpt';
  } else if (window.location.href.includes('claude.ai')) {
    return 'claude';
  } else if (window.location.href.includes('gemini.google.com')) {
    return 'gemini';
  }
  return 'unknown';
}

/**
 * Checks if ChatGPT is currently typing
 * @returns {boolean} - True if ChatGPT is typing, false otherwise
 */
function checkChatGPTTyping() {
  // Check using the composer-submit-button ID
  let submitButton = document.getElementById('composer-submit-button');
  
  if (submitButton) {
    const isStopButton = submitButton.getAttribute('data-testid') === 'stop-button' || 
                         submitButton.getAttribute('aria-label') === 'Stop streaming';
    if (isStopButton) {
      return true;
    }
    return false;
  }
  
  // Fallback to old UI buttons
  const oldUIButtons = document.querySelectorAll("button.btn-neutral");
  if (oldUIButtons && oldUIButtons.length > 0) {
    for (let button of oldUIButtons) {
      if (button.innerText === 'Stop generating') {
        return true;
      }
    }
  }
  
  // Additional check for the newest UI version - look for the stop icon square
  const stopIcon = document.querySelector('button[data-testid="stop-button"]');
  if (stopIcon) {
    return true;
  }
  
  // If we couldn't find any indicators, assume not typing
  return false;
}

/**
 * Checks if Claude is currently typing
 * @returns {boolean} - True if Claude is typing, false otherwise
 */
function checkClaudeTyping() {
  // Check for the Stop response button which is present when Claude is typing
  const stopButton = document.querySelector('button[aria-label="Stop response"]');
  if (stopButton) {
    // If the stop button exists, Claude is typing
    return true;
  }
  
  // As a secondary check, look for typing indicators
  const typingIndicator = document.querySelector('div[data-state="open"]');
  if (typingIndicator) {
    return true;
  }
  
  // The absence of both the stop button and typing indicator means Claude is not typing
  return false;
}

/**
 * Checks if Gemini is currently typing
 * @returns {boolean} - True if Gemini is typing, false otherwise
 */
function checkGeminiTyping() {
  // Look for the stop button using its class instead of a brittle exact ARIA string
  const stopButtonByClass = document.querySelector('button.stop');
  if (stopButtonByClass) {
    return true;
  }
  
  // Fallback: look for buttons with an aria-label containing "top" and "esponse" (case-insensitive workaround for "Stop Response")
  const stopButtonByAria = document.querySelector('button[aria-label*="top"][aria-label*="esponse"]');
  if (stopButtonByAria) {
    return true;
  }
  
  return false;
}

/**
 * Notifies the user whether AI is still generating a response.
 */
let responseTimeCounter = 0;
let timerInterval = null;
let isGeneratingState = false;

function checkAITypingStatus() {
  const siteType = getSiteType();
  let isGenerating = false;
  
  if (siteType === 'chatgpt') {
    isGenerating = checkChatGPTTyping();
  } else if (siteType === 'claude') {
    isGenerating = checkClaudeTyping();
  } else if (siteType === 'gemini') {
    isGenerating = checkGeminiTyping();
  }
  
  // State transitions for local logging
  if (isGenerating !== isGeneratingState) {
    if (isGenerating && !isGeneratingState) {
      responseTimeCounter = 0;
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        responseTimeCounter++;
      }, 1000);
    }
    
    if (!isGenerating && isGeneratingState) {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        console.log(`${siteType} response time: ${responseTimeCounter} seconds`);
      }
    }
    isGeneratingState = isGenerating;
  }
  
  return { isGenerating, site: siteType };
}

// Event-driven logic: tell background script to start checking us
function handleUserAction() {
  browser.runtime.sendMessage({
    type: "startObserving",
    site: getSiteType()
  });
}

// Start observing when user presses Enter (without Shift) or clicks a button
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    handleUserAction();
  }
});

document.addEventListener('click', (e) => {
  const target = e.target.closest('button') || e.target.closest('[role="button"]');
  if (target) {
    handleUserAction();
  }
});

let originalTitle = document.title;
let titleExclamationTimeout = null;

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "checkStatus") {
    return Promise.resolve(checkAITypingStatus());
  } else if (message.type === "showTitleExclamation") {
    // Save the original title just in case it changed since page load
    if (!document.title.startsWith("(!) ")) {
      originalTitle = document.title;
      document.title = "(!) " + originalTitle;
    }
  } else if (message.type === "hideTitleExclamation") {
    // Restore the title explicitly, removing the exactly matched (!)
    if (document.title.startsWith("(!) ")) {
      document.title = document.title.substring(4);
    }
  }
});