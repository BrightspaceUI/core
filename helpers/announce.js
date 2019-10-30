let container;
let lastMessage;

export function announce(message) {
	if (!message) return;
	if (!container) {
		container = document.createElement('div');
		container.setAttribute('aria-live', 'polite');
		container.style.display = 'inline-block';
		container.style.position = 'fixed';
		container.style.clip = 'rect(0px,0px,0px,0px)';
		document.body.appendChild(container);
	}
	/* VO has strange hueristics for announcement - it will not announce
	duplicate message unless it is additive, but we prefer content to not grow */
	if (message !== lastMessage) {
		container.innerHTML = '';
	}
	requestAnimationFrame(() => {
		container.appendChild(document.createTextNode(message));
		lastMessage = message;
	});
}
