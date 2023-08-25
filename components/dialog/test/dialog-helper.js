import { focusWithKeyboard, oneEvent } from '@brightspace-ui/visual-diff';

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
