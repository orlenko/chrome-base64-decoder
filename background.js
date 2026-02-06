const MENU_ID = "decode-base64-selection";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: "Decode Base64 selection",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== MENU_ID) {
    return;
  }

  const selectedText = (info.selectionText || "").trim();

  if (!selectedText) {
    await showAlert(tab?.id, "No text selected.");
    return;
  }

  let decodedText;
  try {
    decodedText = decodeBase64(selectedText);
  } catch (_error) {
    await showAlert(tab?.id, "Selected text is not valid Base64.");
    return;
  }

  await showDecodedPrompt(tab?.id, decodedText);
});

function normalizeBase64(raw) {
  const withoutWhitespace = raw.replace(/\s+/g, "");
  const standardAlphabet = withoutWhitespace.replace(/-/g, "+").replace(/_/g, "/");

  const remainder = standardAlphabet.length % 4;
  if (remainder === 1) {
    throw new Error("Invalid Base64 length.");
  }

  if (remainder === 0) {
    return standardAlphabet;
  }

  return standardAlphabet + "=".repeat(4 - remainder);
}

function decodeBase64(raw) {
  const normalized = normalizeBase64(raw);

  if (!/^[A-Za-z0-9+/=]+$/.test(normalized)) {
    throw new Error("Invalid Base64 alphabet.");
  }

  // Try UTF-8 decoding first so non-ASCII payloads render correctly.
  try {
    const binary = atob(normalized);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch (_error) {
    return atob(normalized);
  }
}

async function showDecodedPrompt(tabId, decodedText) {
  if (!tabId) {
    return;
  }

  await chrome.scripting.executeScript({
    target: { tabId },
    args: [decodedText],
    func: (value) => {
      const maxLength = 4000;
      const promptValue =
        value.length > maxLength
          ? `${value.slice(0, maxLength)}\n\n[Output truncated]`
          : value;

      window.prompt("Decoded Base64:", promptValue);
    },
  });
}

async function showAlert(tabId, message) {
  if (!tabId) {
    return;
  }

  await chrome.scripting.executeScript({
    target: { tabId },
    args: [message],
    func: (value) => {
      window.alert(value);
    },
  });
}
