export const isElement = (node) => node && node.nodeType === Node.ELEMENT_NODE;

export const isCustomElement = (node) => isElement(node) && node.nodeName.indexOf('-') !== -1;

export const isCustomFormElement = (node) => isCustomElement(node) && !!node.formAssociated;

export const getLabelText = (ele) => {
	if (ele.labels && ele.labels.length > 0) {
		return ele.labels[0].textContent.trim();
	}
	if (ele.hasAttribute('aria-label')) {
		return ele.getAttribute('aria-label');
	}
	if (ele.hasAttribute('aria-labelledby')) {
		const labelledby = ele.getAttribute('aria-labelledby');
		const ids = labelledby.split(' ');
		const root = ele.getRootNode();
		for (const id of ids) {
			const label = root.getElementById(id);
			if (label) {
				return label.textContent.trim();
			}
		}
	}
	if (ele.hasAttribute('title')) {
		return ele.getAttribute('title');
	}
	const tagName = ele.nodeName.toLowerCase();
	if (tagName === 'button' && ele.textContent) {
		return ele.textContent.trim();
	}
	if (tagName === 'input') {
		if (ele.type === 'button' || ele.type === 'submit' || ele.type === 'reset' && ele.value) {
			return ele.value;
		}
		if (ele.type === 'image') {
			return ele.alt;
		}
	}
	return null;
};
