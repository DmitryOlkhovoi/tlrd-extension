# Privacy Policy for TLDR - Page Summarizer

**Effective date:** March 21, 2026

TLDR - Page Summarizer (the “Extension”) is a browser extension that summarizes the currently open web page and allows users to ask follow-up questions about that page’s content.

This Privacy Policy explains what data the Extension processes, how that data is used, and what choices users have.

## 1. What the Extension does

The Extension works only when a user explicitly interacts with it. After the user clicks the Extension and requests a summary, the Extension reads the content of the active tab, generates a summary, and can answer follow-up questions about that same page.

The Extension uses the following Chrome permissions:

- `activeTab` to access the currently active tab after a user action
- `scripting` to inject the packaged content script into the active tab
- `storage` to store user settings locally in the browser

## 2. What data is processed

The Extension may process the following data:

### Website content
When the user requests a summary, the Extension extracts readable text content from the currently open web page. This may include:

- page title
- page URL
- visible page text

### User-provided settings
The Extension stores certain settings locally in the user’s browser, including:

- OpenAI API key entered by the user
- selected UI language
- temporary session data needed to pass page content to the summary view

## 3. How data is used

The Extension uses processed data only to provide its core functionality:

- generating a TLDR summary of the current page
- answering follow-up questions about the current page
- remembering local user preferences such as language and API key

The Extension does **not** use website content for advertising, profiling, unrelated analytics, or sale of data.

## 4. When data is sent to third parties

When the user requests a summary or asks a follow-up question, relevant page content and prompt data are sent to the OpenAI API in order to generate the requested response.

This happens only after a direct user action.

Users are responsible for their own use of the OpenAI API and for reviewing OpenAI’s terms and privacy practices as applicable to their API usage.

## 5. Data storage

- The user’s API key and language preference are stored locally using Chrome extension storage.
- Temporary page content may be stored in session storage while the Extension opens the summary interface.
- The Extension does not maintain its own external database for user data.

## 6. Data sharing

The Extension does not sell personal data.

The Extension does not share user data with third parties except as necessary to provide the requested AI functionality through the OpenAI API.

## 7. Remote code

The Extension does not use remote code. All executable code is packaged with the Extension.

## 8. User control

Users can control data usage by:

- choosing whether to activate the Extension on a page
- removing their stored API key from browser storage
- uninstalling the Extension at any time
- avoiding use of the Extension on pages containing data they do not wish to send to an AI provider

## 9. Security

The Extension is designed to minimize data handling and to keep user settings in local browser storage. However, no method of electronic storage or transmission is completely secure, and users should avoid using the Extension on highly sensitive pages unless they understand and accept the risks of sending content to a third-party AI service.

## 10. Children’s privacy

The Extension is not intended for children under 13.

## 11. Changes to this Privacy Policy

This Privacy Policy may be updated from time to time. The latest version should be published at the URL provided in the Chrome Web Store listing or project repository.

## 12. Contact

Project repository:

- https://github.com/DmitryOlkhovoi/tlrd-extension

If you want to provide a dedicated contact email, replace this section with your preferred contact address.
