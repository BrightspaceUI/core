let timeoutId = null;
let container = null;
let messageQueueHead = null;
let messageQueueTail = null;

export function announce(message) {
	if (!message) return;

	/* Reuse the existing aria-live container if possible, since multiple live regions
	announcing at the same time will cause one or more messages to be ignored, regardless
	of polite vs assertive when using VO. This will coelesce messages, however if a new
	announce call is made while the browser is announcing, it will be interupted. */
	if (!container) {
		container = document.createElement('div');
		container.setAttribute('aria-live', 'polite');
		container.style.display = 'inline-block';
		container.style.position = 'fixed';
		container.style.height = '0';
		container.style.clip = 'rect(0px,0px,0px,0px)';
		document.body.appendChild(container);
	}

	const next = { next:null, message:message };

	if (!messageQueueHead) {
		messageQueueHead = next;
		messageQueueTail = next;
		clearTimeout(timeoutId); // timeOut to remove element
		timeoutId = null;
	} else {
		messageQueueTail.next = next;
		messageQueueTail = next;
	}

	if (!timeoutId) timeoutId = setTimeout(announceFromQueue, 200);
}

function announceFromQueue() {
	// Clear old messages and announce
	container.innerHTML = '';
	container.appendChild(document.createTextNode(messageQueueHead.message));
	messageQueueHead = messageQueueHead.next;

	if (!messageQueueHead) {
		messageQueueTail = null;
		timeoutId = setTimeout(() => {
			container.parentNode.removeChild(container);
			container = null;
			timeoutId = null;
		}, 10000);
	} else {
		timeoutId = setTimeout(announceFromQueue, 200);
	}
}
