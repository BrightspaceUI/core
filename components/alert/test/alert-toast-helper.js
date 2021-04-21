export async function getRect(page, selector) {
	const rect = await page.$eval(selector, (toast) => {
		const elem = toast.shadowRoot.querySelector('.d2l-alert-toast-container');
		return {
			x: elem.offe,
			y: elem.offsetTop,
			width: elem.offsetwidth,
			height: elem.offsetHeight
		};
	});
	return {
		x: 0,
		y: rect.y - 10,
		width: page.viewport().width,
		height: page.viewport().height - rect.y + 10
	};
}

export async function open(page, selector) {
	return page.$eval(selector, (toast) => toast.open = true);
}
