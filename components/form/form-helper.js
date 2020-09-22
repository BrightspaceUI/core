
const formElements = {
	button: true,
	fieldset: true,
	input: true,
	object: true,
	output: true,
	select: true,
	textarea: true
};

export const isElement = (node) => node && node.nodeType === Node.ELEMENT_NODE;

export const isCustomElement = (node) => isElement(node) && node.nodeName.indexOf('-') !== -1;

export const isCustomFormElement = (node) => isCustomElement(node) && !!node.formAssociated;

export const isNativeFormElement = (node) => {
	if (!isElement(node)) {
		return false;
	}
	const nodeName = node.nodeName.toLowerCase();
	return !!formElements[nodeName];
};

const _findFormElementsHelper = (ele, eles, isFormElementPredicate, visitChildrenPredicate) => {
	if (isNativeFormElement(ele) || isCustomFormElement(ele) || isFormElementPredicate(ele)) {
		eles.push(ele);
	}
	if (visitChildrenPredicate(ele)) {
		for (const child of ele.children) {
			_findFormElementsHelper(child, eles, isFormElementPredicate, visitChildrenPredicate);
		}
	}
};

export const findFormElements = (root, isFormElementPredicate = () => false, visitChildrenPredicate = () => true) => {
	const eles = [];
	_findFormElementsHelper(root, eles, isFormElementPredicate, visitChildrenPredicate);
	return eles;
};

const _tryGetLabelElement = ele => {
	if (ele.labels && ele.labels.length > 0) {
		return ele.labels[0];
	}
	const rootNode = ele.getRootNode();
	if (!rootNode || rootNode === document) {
		return null;
	}
	const parent = ele.parentElement;
	if (parent && ele.parentElement.tagName === 'LABEL') {
		return parent;
	}
	if (ele.id) {
		const rootNode = ele.getRootNode();
		return rootNode.querySelector(`label[for="${ele.id}"]`);
	}
	return null;
};

export const tryGetLabelText = (ele) => {
	const labelElement = _tryGetLabelElement(ele);
	if (labelElement) {
		const labelText = [...labelElement.childNodes]
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

const _getCustomFormElementData = (node) => {
	if (node.formValue instanceof Object) {
		return { ...node.formValue };
	}
	if (node.name) {
		return { [node.name]: node.formValue };
	}
	return {};
};

const _hasFormData = (node, submitter) => {
	if (node.disabled) {
		return false;
	}
	const tagName = node.nodeName.toLowerCase();
	if (tagName === 'button' && node !== submitter) {
		return false;
	}
	if (tagName === 'input') {
		const type = node.getAttribute('type');
		if ((type === 'checkbox' || type === 'radio') && !node.checked) {
			return false;
		}
		if (type === 'submit' && node !== submitter) {
			return false;
		}
		if (type === 'reset') {
			return false;
		}
	}
	if (tagName === 'object' || tagName === 'output') {
		return false;
	}
	return true;
};

// https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#constructing-form-data-set
export const getFormElementData = (node, submitter) => {

	const eleData = {};
	if (!_hasFormData(node, submitter)) {
		return eleData;
	}
	const tagName = node.nodeName.toLowerCase();
	if (isCustomFormElement(node)) {
		return _getCustomFormElementData(node);
	}
	const name = node.getAttribute('name');
	if (!name) {
		return eleData;
	}
	const type = node.getAttribute('type');
	if (tagName === 'input' && type === 'file') {
		eleData[name] = node.files;
		return eleData;
	}
	eleData[name] = node.value;
	return eleData;
};

export const flattenMap = (map) => {

	const flattened = new Map();
	for (const [key, val] of map) {
		if (val instanceof Map) {
			const subMap = flattenMap(val);
			for (const [nestedKey, nestedVal] of subMap) {
				flattened.set(nestedKey, nestedVal);
			}
		} else {
			flattened.set(key, val);
		}
	}
	return flattened;
};

