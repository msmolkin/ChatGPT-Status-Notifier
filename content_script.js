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
  }
  return 'unknown';
}

/**
 * Checks if ChatGPT is currently typing
 * @returns {boolean} - True if ChatGPT is typing, false otherwise
 */
function checkChatGPTTyping() {
  // Use the composer-submit-button ID which is consistently present in the new UI. We need to query the DOM each time because React may unmount and remount (`let` instead of `const`).
  // the button with the same ID but different properties
  let submitButton = document.getElementById('composer-submit-button');
  
  if (submitButton) {
    // Check the aria-label to determine the state
    const ariaLabel = submitButton.getAttribute('aria-label');
    
    // When ChatGPT is typing, the button shows "Stop streaming" or "Stop generating"
    if (ariaLabel === 'Stop streaming' || ariaLabel === 'Stop generating') {
      return true;
    }
    
    // Otherwise, it's not typing (either idle or user is typing)
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
 * Notifies the user whether AI is still generating a response.
 */
let prevGeneratingState = false;
let responseTimeCounter = 0;
let timerInterval = null;

function checkAITypingStatus() {
  const siteType = getSiteType();
  let isGenerating = false;
  
  if (siteType === 'chatgpt') {
    isGenerating = checkChatGPTTyping();
  } else if (siteType === 'claude') {
    isGenerating = checkClaudeTyping();
  }
  
  // State transitions
  if (isGenerating !== prevGeneratingState) {
    // AI started typing
    if (isGenerating && !prevGeneratingState) {
      // Reset and start counter
      responseTimeCounter = 0;
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        responseTimeCounter++;
      }, 1000);
    }
    
    // AI finished typing
    if (!isGenerating && prevGeneratingState) {
      // Stop counter and log time
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        console.log(`${siteType} response time: ${responseTimeCounter} seconds`);
      }
    }
    
    // Send message to background script
    browser.runtime.sendMessage({
      type: "updateGeneratingState",
      data: isGenerating,
      site: siteType
    });
    prevGeneratingState = isGenerating;
  }
}

// Call updateNotification function every 500ms
setInterval(checkAITypingStatus, 500);