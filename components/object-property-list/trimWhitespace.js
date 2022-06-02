import { Directive, directive } from 'lit/directive.js';
import { noChange } from 'lit';

class TrimWhitespace extends Directive {
	constructor(part) {
		super(part);
		const node = part.element || part.options.host;

		this._trimAndObserve(node);
		if (node.shadowRoot && this.constructor._depth === 'shallow') this._trimAndObserve(node.shadowRoot);
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

	_trimTextNodes(node, recurse) {
		if (node.nodeType === Node.TEXT_NODE && node.textContent) {
			const trimmed = node.textContent.trim();
			if (node.textContent !== trimmed) node.textContent = trimmed;
		} else {
			if (node.shadowRoot && recurse === 'deep') this._trimAndObserve(node.shadowRoot);
			if (recurse) node.childNodes?.forEach(childNode => this._trimTextNodes(childNode, recurse));
		}
	}
}

class TrimWhitespaceDeep extends TrimWhitespace {
	static _depth = 'deep';
}

export const trimWhitespace = directive(TrimWhitespace);
export const trimWhitespaceDeep = directive(TrimWhitespaceDeep);
