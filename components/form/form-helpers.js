
const formElements = {
	button: true,
	fieldset: true,
	input: true,
	object: true,
	output: true,
	select: true,
	textarea: true
};

export const submitFormData = (method, location, formData) => {
	const form = document.createElement('form');
	form.method = method;
	form.location = location;
	for (const pair of formData) {
		const input = document.createElement('input');
		input.type = 'hidden';
		input.name = pair[0];
		input.value = pair[1];
		form.appendChild(input);
	}
	document.body.appendChild(form);
	form.submit();
};

export const installSubmitBehavior = (node, callback) => {
	if (!isSubmitElement(node)) {
		return;
	}
	node.addEventListener('click', callback);
};

export const uninstallSubmitBehavior = (node, callback) => {
	if (!isSubmitElement(node)) {
		return;
	}
	node.removeEventListener('click', callback);
};

export const isElement = (node) => node && node.nodeType === Node.ELEMENT_NODE;

export const isCustomElement = (node) => isElement(node) && node.nodeName.indexOf('-') !== -1;

export const isCustomFormElement = (node) => isCustomElement(node) && node.formAssociated;

export const isNativeFormElement = (node) => {
	if (!isElement(node)) {
		return false;
	}
	const nodeName = node.nodeName.toLowerCase();
	return formElements[nodeName];
};

export const isFormElement = (node) => isCustomFormElement(node) || isNativeFormElement(node);

export const isFormActionElement = (node, action) => {
	if (!isElement(node)) {
		return false;
	}
	const tagName = node.nodeName.toLowerCase();
	if (!isCustomElement(node) && tagName !== 'input' && tagName !== 'button') {
		return false;
	}
	return node.getAttribute('type') === action;
};

export const isSubmitElement = (node) => {
	return isFormActionElement(node, 'submit');
};

export const getFormElementData = (node, submitter) => {
	if (isCustomFormElement(node)) {
		return _getCustomFormElementData(node, submitter);
	} else if (isNativeFormElement(node)) {
		return _getNativeFormElementData(node, submitter);
	}
	return new FormData();

};

const _getCustomFormElementData = (node) => {
	if (node.formValue instanceof FormData) {
		return node.formValue;
	} else if (node.name && node.formValue !== null) {
		const eleData = new FormData();
		eleData.append(node.name, node.formValue);
		return eleData;
	}
};

const _getNativeFormElementData = (node) => {
	const eleData = new FormData();
	const tagName = node.nodeName.toLowerCase();
	if (tagName === 'input') {
		const type = node.getAttribute('type');
		if ((type === 'checkbox' || type === 'radio')) {
			if (node.checked) {
				eleData.append(node.name, node.value);
			}
		} else {
			eleData.append(node.name, node.value);
		}
	} else if (node.name && tagName !== 'output') {
		eleData.append(node.name, node.value);
	}
	return eleData;
};

export const findFormElements = (root, predicate) => {
	const eles = [];
	_findFormElementsHelper(root, eles, predicate);
	return eles;
};

const _findFormElementsHelper = (ele, eles, predicate) => {
	if (isNativeFormElement(ele) || isCustomFormElement(ele) || (predicate && predicate(ele))) {
		eles.push(ele);
	}
	for (const child of ele.children) {
		_findFormElementsHelper(child, eles, predicate);
	}
};

export const getLabel = (ele) => {
	if (isCustomFormElement(ele) && ele.label) {
		return ele.label;
	}
	if (ele.labels && ele.labels.length > 0) {
		return ele.labels[0].textContent;
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
				return label.textContent;
			}
		}
	}
	if (ele.hasAttribute('title')) {
		return ele.getAttribute('title');
	}
	const tagName = ele.nodeName.toLowerCase();
	if (tagName === 'button' && ele.textContent) {
		return ele.textContent;
	}
	if (ele.tagName === 'input') {
		if (ele.type === 'button' || ele.type === 'submit' || ele.type === 'reset' && ele.value) {
			return ele.value;
		}
	}
	return null;
};
