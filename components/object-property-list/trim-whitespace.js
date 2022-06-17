import { Directive, directive } from 'lit/directive.js';
import { noChange } from 'lit';

const isCustomElement = node => node?.tagName?.includes('-');

class NoChangeDirective extends Directive {
	render() { return noChange; }
}

class TrimWhitespace extends NoChangeDirective {
	constructor(part, deep) {
		super(part);
		this.deep = !!deep;
		const node = part.element || part.parentNode?.host || part.parentNode;

		this._trimAndObserve(node);
		if (!this.deep) this._trimAndObserveShadow(node);
	}

	_observer = new MutationObserver(this._observe.bind(this));

	_observe(records) {
		records.forEach(record => {
			record.addedNodes.forEach(node => this._trimTextNodes(node, true));
			if (record.type === 'characterData') this._trimTextNodes(record.target);
		});
	}

	_trimAndObserve(node) {
		this._trimTextNodes(node, true);
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
		} else if (recurse) {
			if (this.deep) this._trimAndObserveShadow(node);
			node.childNodes?.forEach(childNode => this._trimTextNodes(childNode, true));
		}
	}
}

class TrimWhitespaceDeep extends TrimWhitespace {
	constructor(part) {
		super(part, true);
	}
}

class NoTrim extends NoChangeDirective {
	constructor(part) {
		super(part);
		const node = part.element || part.parentNode;
		node.__d2l_no_trim = true;
	}
}

export const trimWhitespace = directive(TrimWhitespace);
export const trimWhitespaceDeep = directive(TrimWhitespaceDeep);
export const noTrim = directive(NoTrim);
