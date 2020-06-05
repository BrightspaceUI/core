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

export const isFormElement = (node) => isCustomFormElement(node) || isNativeFormElement(node);
