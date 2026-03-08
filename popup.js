// When the options button is clicked, open the options page
document.querySelector('#optionsButton').addEventListener('click', () => {
  browser.runtime.openOptionsPage();
});

// When the popup page is loaded, populate the checkbox with the current setting
browser.storage.local.get('playSound').then((result) => {
  document.querySelector('#soundCheckbox').checked = result.playSound;
});

// Save the setting whenever the checkbox is toggled
document.querySelector('#soundCheckbox').addEventListener('change', (event) => {
  browser.storage.local.set({ playSound: event.target.checked });
});

// Feedback Logic
const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
const feedbackPrompt = document.getElementById('feedbackPrompt');
const feedbackButtons = document.getElementById('feedbackButtons');
const linkRate = document.getElementById('linkRate');
const linkEmail = document.getElementById('linkEmail');

btnYes.addEventListener('click', () => {
    feedbackPrompt.innerText = "Awesome!";
    feedbackButtons.classList.add('hidden');
    linkRate.classList.remove('hidden');
});

btnNo.addEventListener('click', () => {
    feedbackPrompt.innerText = "We're sorry to hear that!";
    feedbackButtons.classList.add('hidden');
    linkEmail.classList.remove('hidden');
});
