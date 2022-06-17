import { Directive, directive } from 'lit/directive.js';
import { noChange } from 'lit';

const isCustomElement = node => node?.tagName?.includes('-');

class TrimWhitespace extends Directive {
	constructor(part) {
		super(part);
		const node = part.element || part.parentNode?.host || part.parentNode;

		this._trimAndObserve(node);
		if (this.constructor._depth === 'shallow') this._trimAndObserveShadow(node);
	}

	render() {
		return noChange;
	}

	static _depth = 'shallow';
	_observer = new MutationObserver(this._observe.bind(this));

	_observe(records) {
		records.forEach(record => {
			record.addedNodes.forEach(node => this._trimTextNodes(node, this.constructor._depth));
			if (record.type === 'characterData') this._trimTextNodes(record.target);
		});
	}

	_trimAndObserve(node) {
		this._trimTextNodes(node, this.constructor._depth);
		this._observer.observe(node, { subtree: true, characterData: true, childList: true });
	}

	_trimAndObserveShadow(node) {
		if (node.shadowRoot) this._trimAndObserve(node.shadowRoot);
		else if (isCustomElement(node) && node.attachShadow) {
			const attachShadow = node.attachShadow.bind(node);
			node.attachShadow = (...args) => {
				const shadowRoot = attachShadow(...args);
				this._trimAndObserve(shadowRoot);
				return shadowRoot;
			};
		}
	}

	_trimTextNodes(node, recurse) {
		if (node.__d2l_no_trim || node.parentNode?.__d2l_no_trim) return;

		if (node.nodeType === Node.TEXT_NODE && node.textContent) {
			const trimmed = node.textContent.trim();
			if (node.textContent !== trimmed) node.textContent = trimmed;
		} else {
			if (recurse === 'deep') this._trimAndObserveShadow(node);
			if (recurse) node.childNodes?.forEach(childNode => this._trimTextNodes(childNode, recurse));
		}
	}
}

class TrimWhitespaceDeep extends TrimWhitespace {
	static _depth = 'deep';
}

class NoTrim extends Directive {
	constructor(part) {
		super(part);
		const node = part.element || part.parentNode;
		node.__d2l_no_trim = true;
	}

	render() {
		return noChange;
	}
}

export const trimWhitespace = directive(TrimWhitespace);
export const trimWhitespaceDeep = directive(TrimWhitespaceDeep);
export const noTrim = directive(NoTrim);
