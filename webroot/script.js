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



function dragMoveListener(event) {
  var target = event.target;
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

function onDragEnter(event) {
  var draggableElement = event.relatedTarget;
  var dropzoneElement = event.target;
  dropzoneElement.classList.add("drop-target");
  draggableElement.classList.add("can-drop");
}

function onDragLeave(event) {
  event.target.classList.remove("drop-target");
  event.relatedTarget.classList.remove("can-drop");

  // let draggableElement = event.relatedTarget;
  // let dropzoneElement = event.target;

  // // Remove styling when draggable leaves
  // // dropzoneElement.classList.remove("drop-target");
  // // draggableElement.classList.remove("can-drop");

  // // If draggable was inside dropzone, move it back to the original flex container
  // if (!dropzoneElement.contains(draggableElement)) {
  //   let flexContainer = document.querySelector(".flex-container"); // Adjust if needed
  //   if (flexContainer) {
  //     flexContainer.appendChild(draggableElement);
  //   }

  //   // Reset position
  //   draggableElement.style.position = "relative";
  //   draggableElement.style.left = "0px";
  //   draggableElement.style.top = "0px";
  //   draggableElement.style.transform = "none";
  // }
}

function onDrop(event) {
  event.target.classList.remove("drop-target");
  // let draggableElement = event.relatedTarget;
  // let dropzoneElement = event.target;

  // if (dropzoneElement.children.length >= 2) {
  //   dropzoneElement.removeChild(dropzoneElement.firstElementChild);
  // }

  // Move the draggable inside the dropzone
  // dropzoneElement.appendChild(draggableElement);

  // Reset draggable position inside dropzone
  // draggableElement.style.position = 'relative';
  // draggableElement.style.left = '0px';
  // draggableElement.style.top = '0px';
  // draggableElement.style.transform = 'none';

  // Apply flexbox to avoid overlap
  // dropzoneElement.style.display = "flex";
  // dropzoneElement.style.alignItems = "center";
  // dropzoneElement.style.justifyContent = "center";
  // dropzoneElement.style.flexWrap = "wrap";
  // dropzoneElement.style.gap = "10px"; // Ensures spacing
}

document.addEventListener("DOMContentLoaded", event => {
  window.dragMoveListener = dragMoveListener;

  interact("#seasonpremiere").dropzone({
    // accept: ".draggable",
    // overlap: 0.75,
    // ondragenter: onDragEnter,
    // ondragleave: onDragLeave,
    // ondrop: onDrop
    accept: '.draggable',
    overlap: 0.75,
    // checker: function (
    //   dragEvent, event, dropped, dropzone, dropzoneElement, draggable, draggableElement
    // ) {
    //     // Allow drop only if max limit (2) is not reached
    //     return dropped && dropzoneElement.children.length < 2;
    // },
    ondragenter: onDragEnter,
    ondragleave: onDragLeave,
    ondrop: onDrop
});

interact("#casaamour").dropzone({
  accept: '.draggable',
  overlap: 0.75,
  ondragenter: onDragEnter,
  ondragleave: onDragLeave,
  ondrop: onDrop
});

interact("#hb").dropzone({
  accept: '.draggable',
  overlap: 0.75,
  ondragenter: onDragEnter,
  ondragleave: onDragLeave,
  ondrop: onDrop
});

interact("#finally").dropzone({
  accept: '.draggable',
  overlap: 0.75,
  ondragenter: onDragEnter,
  ondragleave: onDragLeave,
  ondrop: onDrop
});

  interact(".draggable").draggable({
      inertia: true,
      autoScroll: true,
      modifiers: [
          interact.modifiers.restrictRect({
              restriction: "body",
              endOnly: true
          })
      ],
      listeners: { 
          move: dragMoveListener
      }
  });
});

new App();
