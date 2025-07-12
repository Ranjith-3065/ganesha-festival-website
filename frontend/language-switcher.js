// language-switcher.js

function loadGoogleTranslate() {
  const script = document.createElement('script');
  script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  document.body.appendChild(script);
}

function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,kn',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
}

// Create and style the dropdown container
function createTranslateDropdown() {
  const div = document.createElement('div');
  div.id = 'google_translate_element';
  div.style.position = 'fixed';
  div.style.top = '15px';
  div.style.right = '20px';
  div.style.zIndex = '9999';
  div.style.background = '#fff3e0';
  div.style.padding = '6px 12px';
  div.style.borderRadius = '20px';
  div.style.boxShadow = '0 0 8px rgba(0,0,0,0.2)';
  div.style.fontFamily = "'Poppins', sans-serif";
  document.body.appendChild(div);

  const style = document.createElement('style');
  style.innerHTML = `
    .goog-te-combo {
      padding: 6px;
      font-size: 15px;
      border-radius: 8px;
      border: none;
      background: #fff3e0;
      color: #d35400;
      font-weight: 600;
      cursor: pointer;
    }
    .goog-te-combo:hover {
      background: #ffd180;
    }
    .goog-logo-link, .goog-te-gadget span {
      display: none !important;
    }
    .goog-te-gadget {
      color: transparent !important;
    }
    .goog-te-banner-frame.skiptranslate {
      display: none !important;
    }
    body {
      top: 0 !important;
    }
  `;
  document.head.appendChild(style);
}

window.addEventListener('DOMContentLoaded', () => {
  createTranslateDropdown();
  loadGoogleTranslate();
});
