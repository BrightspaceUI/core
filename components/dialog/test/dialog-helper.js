import { focusWithKeyboard, oneEvent } from '@brightspace-ui/visual-diff';

export async function close(page, selector) {
	const closeEvent = getCloseEvent(page, selector);
	await page.$eval(selector, (dialog) => dialog.opened = false);
	return closeEvent;
}

export function getCloseEvent(page, selector) {
	return oneEvent(page, selector, 'd2l-dialog-close');
}

export function getOpenEvent(page, selector) {
	return oneEvent(page, selector, 'd2l-dialog-open');
}

export function getRect(page, selector) {
	return page.$eval(selector, (dialog) => {
		const elem = dialog.shadowRoot.querySelector('.d2l-dialog-outer');
		return {
			x: elem.offsetLeft - 10,
			y: elem.offsetTop - 10,
			width: elem.offsetWidth + 20,
			height: elem.offsetHeight + 20
		};
	});
}

export async function open(page, selector) {
	const openEvent = getOpenEvent(page, selector);
	await page.$eval(selector, (dialog) => dialog.opened = true);
	return openEvent;
}

export async function openDropdown(page, selector) {
	await page.$eval(selector, (dropdown) => {
		return new Promise((resolve) => {
			dropdown.addEventListener('d2l-dropdown-open', () => setTimeout(resolve, 50), { once: true });
			dropdown.toggleOpen();
		});
	});
}

export async function openFilter(page, selector) {
	await page.$eval(selector, (filter) => {
		return new Promise((resolve) => {
			filter.shadowRoot.querySelector('d2l-dropdown-button-subtle').addEventListener('d2l-dropdown-open', () => setTimeout(resolve, 50), { once: true });
			filter.opened = true;
		});
	});
}

export async function reset(page, selector) {
	await page.$eval(selector, (dialog) => {
		return new Promise((resolve) => {
			dialog._fullscreenWithin = 0;
			dialog.shadowRoot.querySelector('.d2l-dialog-content').scrollTo(0, 0);
			if (dialog._state) {
				dialog.addEventListener('d2l-dialog-close', () => resolve(), { once: true });
				dialog.opened = false;
			} else {
				resolve();
			}
		});
	});
	return focusWithKeyboard(page, '#open');
}

export async function resetDropdown(page, selector) {
	await page.$eval(selector, (dropdown) => {
		return new Promise((resolve) => {
			const content = dropdown.querySelector('[dropdown-content]');
			content.scrollTo(0);
			if (content.opened) {
				content.addEventListener('d2l-dropdown-close', () => resolve(), { once: true });
				content.opened = false;
			} else {
				resolve();
			}
		});
	});
}

export async function resetFilter(page, selector) {
	await page.$eval(selector, (filter) => {
		return new Promise((resolve) => {
			const content = filter.shadowRoot.querySelector('[dropdown-content]');
			content.scrollTo(0);
			if (filter.opened) {
				filter.shadowRoot.querySelector('d2l-dropdown-button-subtle').addEventListener('d2l-dropdown-close', () => resolve(), { once: true });
				filter.opened = false;
			} else {
				resolve();
			}
		});
	});
}
