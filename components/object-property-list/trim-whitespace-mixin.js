import { Directive, directive } from 'lit/directive.js';
import { noChange } from 'lit';

const isCustomElement = node => node?.tagName?.includes('-');

export const TrimWhitespaceMixin = superclass => class extends superclass {
	static get properties() {
		return {
			trimWhitespaceDeep: { type: Boolean, attribute: 'trim-whitespace-deep', reflect: true },
		};
	}

	constructor() {
		super();
		this._trimObserver = new MutationObserver(this._trimObserverCallback.bind(this));
	}

	connectedCallback() {
		super.connectedCallback();
		this._trimAndObserve(this);
		if (!this.trimWhitespaceDeep) this._trimAndObserveShadow(this);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._trimObserver.disconnect();
	}

	_trimAndObserve(node) {
		this._trimTextNodes(node, true);
		this._trimObserver.observe(node, { subtree: true, characterData: true, childList: true });
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

	_trimObserverCallback(records) {
		records.forEach(record => {
			record.addedNodes.forEach(node => this._trimTextNodes(node, true));
			if (record.type === 'characterData') this._trimTextNodes(record.target);
		});
	}

	_trimTextNodes(node, recurse) {
		if (node.__d2l_no_trim || node.parentNode?.__d2l_no_trim) return;

		if (node.nodeType === Node.TEXT_NODE && node.textContent) {
			const trimmed = node.textContent.trim();
			if (node.textContent !== trimmed) node.textContent = trimmed;
		} else if (recurse) {
			if (this.trimWhitespaceDeep) this._trimAndObserveShadow(node);
			node.childNodes?.forEach(childNode => this._trimTextNodes(childNode, true));
		}
	}

};

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

export const noTrim = directive(NoTrim);
