# Chrome Base64 Decoder

Chrome extension (Manifest V3) that decodes selected Base64 text from the right-click context menu.

## Install locally

1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this folder: `/Users/vorlenko/personal/chrome-base64-decoder`.

## Usage

1. Select Base64 text on any web page.
2. Right-click and choose **Decode Base64 selection**.
3. The decoded result appears in a prompt (easy to copy).

The decoder accepts both standard Base64 and URL-safe Base64 (`-` and `_`), and it ignores whitespace.
