let timeoutId = null;
let container = null;
let messages = null;
let messageIndex = 0;

export function announce(message) {
	if (!message) return;
	if (messages === null) messages = {};
	if (!messages[message]) messages[message] = ++messageIndex;

	/* Reuse the existing aria-live container if possible, since multiple live regions
	announcing at the same time will cause one or more messages to be ignored, regardless
	of polite vs assertive when using VO. This will coelesce messages, however if a new
	announce call is made while the browser is announcing, it will be interupted. */
	if (timeoutId !== null) {
		clearTimeout(timeoutId);
		timeoutId = null;
	}
	if (!container) {
		container = document.createElement('div');
		container.setAttribute('aria-live', 'polite');
		container.style.display = 'inline-block';
		container.style.position = 'fixed';
		container.style.height = '0';
		container.style.clip = 'rect(0px,0px,0px,0px)';
		document.body.appendChild(container);
	}

	/* Need to give browser enough time to create the live region so that it will
	treat the change as an update. Firefox sometimes ignores changes if the region
	and update are made too quickly in succession. RequestAnimationFrame is not
	sufficient here. Also, for some strange reason, sometimes VO will not announce
	duplicate messages even if we remove the child so we also append a non-breaking space. */
	const elem = [...container.childNodes].find((c) => c.textContent === message);
	if (elem) {
		elem.parentNode.removeChild(elem);
		const newMessage = message.concat('\u00A0');
		messages[newMessage] = messages[message];
		delete messages[message];
		message = newMessage;
	}
	setTimeout(() => {
		container.appendChild(createMessageNode(message));
	}, 200);

	/* Need to purge old messages so that they are not discovered by screen readers
	using virtual cursor, but we need to give the browser ample time to hand off
	the change to the AT before removing it. ex. otherwise sometimes VO will not announce. */
	timeoutId = setTimeout(() => {
		container.parentNode.removeChild(container);
		container = null;
		timeoutId = null;
		messages = null;
		messageIndex = 0;
	}, 10000);

	return messages[message];
}

function createMessageNode(message) {
	const div = document.createElement('div');
	div.id = messages[message];
	div.style.display = 'inline-block';
	div.style.position = 'fixed';
	div.style.height = '0';
	div.style.clip = 'rect(0px,0px,0px,0px)';
	div.innerText = message;
	return div;
}

export function clearAnnounce(messageIndex) {
	if (messages === null) return;
	if (!container) return;

	container.setAttribute('aria-live', 'off');

	const childNode = [...container.childNodes].find((node) => node.id === `${messageIndex}`);
	if (childNode) {
		childNode.parentNode.removeChild(childNode);
		delete messages[messageIndex];
	}

	container.setAttribute('aria-live', 'polite');
}
