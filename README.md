# AI Chat Status Notifier

This repository hosts the code for the Firefox Addon, "AI Chat Status Notifier". The addon notifies users when ChatGPT, Claude, or Gemini has finished typing in the chat. It is ideal for those who use AI chat interfaces regularly and want real-time updates on the typing status constraint-free.

![Addon Screenshot while GPT is typing](<images/screenshot typing.png>)
![Addon Screenshot when GPT isn't typing](<images/screenshot idle.png>)

## Features

- Real-time notification when ChatGPT, Claude, or Gemini finishes typing
- Support for multiple AI tabs simultaneously, even when actively running in the background
- Easy to use and lightweight
- Maintains your privacy - no data is stored or transmitted

## Origin Story

This project is a derivative of the [ChatGPT Search](https://github.com/msmolkin/ChatGPT-Search) project. While developing that project, a simpler idea for an addon took shape. Initially, the entire code was incorporated into the ChatGPT Search project, but it quickly became evident that my projects were becoming too multifaceted, always incorporating numerous features.

I decided to split this functionality out into its own project, resulting in the ChatGPT Status Notifier. Despite having fewer moving parts, this status notifier is likely to be more relevant to a wider audience and gain more traction. It's also easier to understand and modify. I hope you enjoy it!

**Side Note:** You might have noticed that the code for this project is, dare I say, flawless. Yes, I take pride in the quality of my work. My code is always this perfect — well-commented, well-structured, and well... just well. But don't let that intimidate you. I believe that great code should inspire, not dishearten. So feel free to dive in, learn, and contribute to this perfection. I welcome it. Many people are good at pointing out flaws, but few are good at providing good solutions. So, please, don't hesitate to submit a pull request or open an issue if you find a flaw or have a suggestion.

## Installation

To install the AI Chat Status Notifier Firefox Addon:

1. Visit the [Mozilla Addon Page](https://addons.mozilla.org/en-US/firefox/addon/chatgpt-status-notifier/) for ChatGPT Status Notifier.
2. Click on the "Add to Firefox" button and follow the prompts.

## Building from Source

There is no build process required. Simply clone the repository and run `npm run build` or use the `build` script to package the extension into a zip file.

You can then load the extension in Firefox by going to `about:debugging#/runtime/this-firefox` and clicking "Load Temporary Add-on...".

The build script will create a zip file in the `build` directory.

You can also load the extension in Firefox by going to `about:debugging#/runtime/this-firefox` and clicking "Load Temporary Add-on...".

1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging`
3. Click on "This Firefox"
4. Click on "Load Temporary Add-on"
5. Open the downloaded or cloned folder and select any file inside the folder

## Automatic Publishing via GitHub Actions

This repository is configured to automatically publish new updates to the Mozilla Add-on store whenever new commits are pushed to the `main` branch. 

## Usage

After successfully installing the ChatGPT Status Notifier, follow these steps to pin it to your Firefox toolbar and start using it:

1. Click the "Extensions" button (puzzle piece icon) in the upper-right corner of the Firefox window.

2. In the dropdown menu that appears, you should see the "ChatGPT Status Notifier" listed.

3. Right-click on the icon for the "ChatGPT Status Notifier," or click on the little gear next to it.

4. In the context menu that appears, select "Pin to Toolbar".

The icon for the AI Chat Status Notifier should now appear in your toolbar, allowing you to see when an AI is typing.

Once pinned, navigate to [ChatGPT](https://chatgpt.com/), [Claude](https://claude.ai/), or [Gemini](https://gemini.google.com/). Whenever the AI finishes typing, you'll see via the addon icon in your toolbar.

Remember to ensure that the addon is enabled in your Firefox Extensions settings for it to function correctly.

> **Note on Languages:** If you use these AI platforms in a language other than English and the extension doesn't seem to recognize when the AI is typing, please let us know! The extension relies on certain background text elements, and we'd love to add support for your language.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/msmolkin/ChatGPT-Status-Notifier/issues) or [email me](mailto:github@smolkin.org).

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Michael - [Twitter](https://twitter.com/MichaelSmolkin) - github@smolkin.org

Project Link: [https://github.com/msmolkin/ChatGPT-Status-Notifier](https://github.com/msmolkin/ChatGPT-Status-Notifier)