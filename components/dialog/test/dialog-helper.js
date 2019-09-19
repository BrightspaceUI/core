const getEvent = (page, selector, name) => {
	return page.$eval(selector, (elem, name) => {
		return new Promise((resolve) => {
			elem.addEventListener(name, resolve, { once: true });
		});
	}, name);
};

module.exports = {

	async close(page, selector) {
		const closeEvent = this.getCloseEvent(page, selector);
		await page.$eval(selector, (dialog) => dialog.opened = false);
		return closeEvent;
	},

	getCloseEvent(page, selector) {
		return getEvent(page, selector, 'd2l-dialog-close');
	},

	getOpenEvent(page, selector) {
		return getEvent(page, selector, 'd2l-dialog-open');
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
