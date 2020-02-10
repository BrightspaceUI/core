const getEvent = (page, selector, name) => {
	return page.$eval(selector, (elem, name) => {
		return new Promise((resolve) => {
			elem.addEventListener(name, resolve, { once: true });
		});
	}, name);
};

module.exports = {

	getOpenEvent(page, selector) {
		return getEvent(page, selector, 'd2l-dropdown-open');
	},

	async open(page, selector) {
		const openEvent = this.getOpenEvent(page, selector);
		await page.$eval(selector, (dropdown) => {
			return new Promise((resolve) => {
				dropdown.querySelector('d2l-dropdown-content').addEventListener('animationend', () => resolve(), { once: true });
				dropdown.toggleOpen();
			});
		});
		return openEvent;
	},

};
