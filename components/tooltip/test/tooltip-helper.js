const { oneEvent } = require('@brightspace-ui/visual-diff/helpers');

module.exports = {

	async hide(page, selector) {
		const hideEvent = oneEvent(page, selector, 'd2l-tooltip-hide');
		page.$eval(`${selector} d2l-tooltip`, tooltip => tooltip.hide());
		return hideEvent;
	},

	async show(page, selector) {
		const openEvent = oneEvent(page, selector, 'd2l-tooltip-show');
		page.$eval(`${selector} d2l-tooltip`, tooltip => tooltip.show());
		return openEvent;
	}

};
