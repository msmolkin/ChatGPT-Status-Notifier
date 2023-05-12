// When the options button is clicked, open the options page
document.querySelector('#optionsButton').addEventListener('click', () => {
  browser.runtime.openOptionsPage();
});
