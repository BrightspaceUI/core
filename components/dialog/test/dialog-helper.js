const { oneEvent } = require('@brightspace-ui/visual-diff/helpers');

module.exports = {

	async close(page, selector) {
		const closeEvent = this.getCloseEvent(page, selector);
		await page.$eval(selector, (dialog) => dialog.opened = false);
		return closeEvent;
	},

	getCloseEvent(page, selector) {
		return oneEvent(page, selector, 'd2l-dialog-close');
	},

	getOpenEvent(page, selector) {
		return oneEvent(page, selector, 'd2l-dialog-open');
	},

	getRect(page, selector) {
		return page.$eval(selector, (dialog) => {
			const elem = dialog.shadowRoot.querySelector('.d2l-dialog-outer');
			return {
				x: elem.offsetLeft - 10,
				y: elem.offsetTop - 10,
				width: elem.offsetWidth + 20,
				height: elem.offsetHeight + 20
			};
		});
	},

	async open(page, selector) {
		const openEvent = this.getOpenEvent(page, selector);
		await page.$eval(selector, (dialog) => dialog.opened = true);
		return openEvent;
	},

	async reset(page, selector) {
		await page.$eval(selector, (dialog) => {
			return new Promise((resolve) => {
				dialog.shadowRoot.querySelector('.d2l-dialog-content').scrollTo(0, 0);
				if (dialog._state) {
					dialog.addEventListener('d2l-dialog-close', () => resolve(), { once: true });
					dialog.opened = false;
				} else {
					resolve();
				}
			});
		});
		return page.click('#open');
	}

};
