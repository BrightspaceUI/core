export function waitForHeight(elem) {
	return new Promise((resolve) => {
		function check() {
			const content = elem.shadowRoot.querySelector('.d2l-more-less-content');
			if (content.style.maxHeight === '') {
				setTimeout(() => check(), 10);
			} else {
				// Need the second timeout here to give the transition a chance to finish
				setTimeout(() => resolve(), 400);
			}
		}
		check();
	});
}
