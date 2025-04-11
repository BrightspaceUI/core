export const interactiveElements = {
	// 'a' only if an href is present
	'button': true,
	'input': true,
	'select': true,
	'textarea': true
};

export const interactiveRoles = {
	'button': true,
	'checkbox': true,
	'combobox': true,
	'link': true,
	'listbox': true,
	'menuitem': true,
	'menuitemcheckbox': true,
	'menuitemradio': true,
	'option': true,
	'radio': true,
	'slider': true,
	'spinbutton': true,
	'switch': true,
	'tab:': true,
	'textbox': true,
	'treeitem': true
};

export function isInteractiveInComposedPath(composedPath, predicate, options) {
	const elems = options?.elements || interactiveElements;
	const roles = options?.roles || interactiveRoles;
	for (let i = 0; i < composedPath.length; i++) {
		const elem = composedPath[i];
		if (!elem.getAttribute) continue;

		if (!predicate(elem)) {
			break;
		}

		if (isInteractive(elem, elems, roles)) {
			return true;
		}
	}
	return false;
}

export function isInteractive(ele, elems, roles) {
	const nodeName = ele.nodeName.toLowerCase();
	const isInteractiveElem = elems[nodeName];
	if (isInteractiveElem) {
		return true;
	}
	const role = (ele.getAttribute('role') || '');
	return (nodeName === 'a' && ele.hasAttribute('href')) || roles[role];
}
