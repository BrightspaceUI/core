import { getUniqueId } from './uniqueId.js';

let timeoutId = null;
let container = null;
const messages = new Map();

export function announce(message) {
	if (!message) return;
	const msgId = getUniqueId();

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
		message = message.concat('\u00A0');
	}
	setTimeout(() => {
		const txtNode = document.createTextNode(message);
		messages.set(msgId, txtNode);
		container.appendChild(txtNode);
	}, 200);

	/* Need to purge old messages so that they are not discovered by screen readers
	using virtual cursor, but we need to give the browser ample time to hand off
	the change to the AT before removing it. ex. otherwise sometimes VO will not announce. */
	timeoutId = setTimeout(reset, 10000);

	return msgId;
}

export function clearAnnounce(msgId) {
	if (!msgId || !messages.has(msgId) || container == null) return;

	const txtNode = messages.get(msgId);
	if (txtNode) {
		txtNode.parentNode.removeChild(txtNode);
		messages.delete(msgId);
	}
}

function reset() {
	container.parentNode.removeChild(container);
	messages.clear();
	container = null;
	timeoutId = null;
}

function clearAllAnnounce() {
	if (container === null) return;
	if (timeoutId !== null) clearTimeout(timeoutId);
	reset();
}

document.addEventListener('d2l-navigation', clearAllAnnounce);
