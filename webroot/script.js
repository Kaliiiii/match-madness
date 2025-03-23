/** @typedef {import('../src/message.ts').DevvitSystemMessage} DevvitSystemMessage */
/** @typedef {import('../src/message.ts').WebViewMessage} WebViewMessage */

class App {
  constructor() {
    // Get references to the HTML elements
    this.output = /** @type {HTMLPreElement} */ (document.querySelector('#messageOutput'));
    this.increaseButton = /** @type {HTMLButtonElement} */ (
      document.querySelector('#btn-increase')
    );
    this.decreaseButton = /** @type {HTMLButtonElement} */ (
      document.querySelector('#btn-decrease')
    );
    this.usernameLabel = /** @type {HTMLSpanElement} */ (document.querySelector('#username'));
    this.counterLabel = /** @type {HTMLSpanElement} */ (document.querySelector('#counter'));
    this.counter = 0;

    // When the Devvit app sends a message with `postMessage()`, this will be triggered
    addEventListener('message', this.#onMessage);

    // This event gets called when the web view is loaded
    addEventListener('load', () => {
      postWebViewMessage({ type: 'webViewReady' });
    });

    this.increaseButton.addEventListener('click', () => {
      // Sends a message to the Devvit app
      postWebViewMessage({ type: 'setCounter', data: { newCounter: this.counter + 1 } });
    });

    this.decreaseButton.addEventListener('click', () => {
      // Sends a message to the Devvit app
      postWebViewMessage({ type: 'setCounter', data: { newCounter: this.counter - 1 } });
    });
  }

  /**
   * @arg {MessageEvent<DevvitSystemMessage>} ev
   * @return {void}
   */
  #onMessage = (ev) => {
    // Reserved type for messages sent via `context.ui.webView.postMessage`
    if (ev.data.type !== 'devvit-message') return;
    const { message } = ev.data.data;

    // Always output full message
    this.output.replaceChildren(JSON.stringify(message, undefined, 2));

    switch (message.type) {
      case 'initialData': {
        // Load initial data
        const { username, currentCounter } = message.data;
        this.usernameLabel.innerText = username;
        this.counter = currentCounter;
        this.counterLabel.innerText = `${this.counter}`;
        break;
      }
      case 'updateCounter': {
        const { currentCounter } = message.data;
        this.counter = currentCounter;
        this.counterLabel.innerText = `${this.counter}`;
        break;
      }
      default:
        /** to-do: @satisifes {never} */
        const _ = message;
        break;
    }
  };
}

/**
 * Sends a message to the Devvit app.
 * @arg {WebViewMessage} msg
 * @return {void}
 */
function postWebViewMessage(msg) {
  parent.postMessage(msg, '*');
}

/**
 * 
 * Drag and drop functions
 */

var draggedElement = null;
var items;

function handleDragStart(e) {
    // this.style.opacity = "0.4";
    draggedElement = this;

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("item", this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) 
        e.preventDefault();

    e.dataTransfer.dropEffect = "move";
    return false;
}

function handleDragEnter(e) {
    this.classList.add("dragover");
}

function handleDragLeave(e) {
    this.classList.remove("dragover");
}

function handleDrop(e) {
    if (e.stopPropagation)
        e.stopPropagation();

    if (draggedElement != this) {
        draggedElement.innerHTML = this.innerHTML;
        draggedElement.setAttribute("data-item", this.innerHTML);

        let replacedItem = e.dataTransfer.getData("item");
        this.innerHTML = replacedItem;
        this.setAttribute("data-item", replacedItem);
    }

    return false;
}

function handleDragEnd(e) {
    // this.style.opacity = "1";

    items.forEach(function(item) {
        item.classList.remove("dragover");
    });
}

new App();
