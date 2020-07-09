export const isElement = (node) => node && node.nodeType === Node.ELEMENT_NODE;

export const isCustomElement = (node) => isElement(node) && node.nodeName.indexOf('-') !== -1;

export const isCustomFormElement = (node) => isCustomElement(node) && !!node.formAssociated;

export const tryGetLabelText = (ele) => {
	if (ele.labels && ele.labels.length > 0) {
		const labelText = [...ele.labels[0].childNodes]
			.filter(node => node.nodeType === Node.TEXT_NODE)
			.reduce((acc, node) => acc + node.textContent, '')
			.trim();
		if (labelText) {
			return labelText;
		}
	}
	if (ele.hasAttribute('aria-label')) {
		const labelText = ele.getAttribute('aria-label');
		if (labelText) {
			return labelText;
		}
	}
	if (ele.hasAttribute('aria-labelledby')) {
		const labelledby = ele.getAttribute('aria-labelledby');
		const ids = labelledby.split(' ');
		const root = ele.getRootNode();
		for (const id of ids) {
			const label = root.getElementById(id);
			if (label) {
				const labelText = label.textContent.trim();
				if (labelText) {
					return labelText;
				}
			}
		}
	}
	if (ele.hasAttribute('title')) {
		const labelText = ele.getAttribute('title');
		if (labelText) {
			return labelText;
		}
	}
	const tagName = ele.nodeName.toLowerCase();
	if (tagName === 'button' && ele.textContent) {
		const labelText = ele.textContent.trim();
		if (labelText) {
			return labelText;
		}
	}
	if (tagName === 'input') {
		if (ele.type === 'button' || ele.type === 'submit' || ele.type === 'reset' && ele.value) {
			const labelText = ele.value;
			if (labelText) {
				return labelText;
			}
		}
		if (ele.type === 'image') {
			const labelText = ele.alt;
			if (labelText) {
				return labelText;
			}
		}
	}
	return null;
};
