const isCustomElement = node => node?.tagName?.includes('-');

const addShadowListener = (node, callback) => {
	if (!node.attachShadow) return;
	const attachShadow = node.attachShadow.bind(node);

	node.attachShadow = (...args) => {
		const shadowRoot = attachShadow(...args);
		callback(shadowRoot);
		return shadowRoot;
	};
};

export class TrimWhitespaceEngine {
	constructor(node, deep) {
		this.node = node;
		this.deep = !!deep;
		this._observer = new MutationObserver(this._observe.bind(this));
	}

	start() {
		this._trimAndObserve(this.node);
		if (!this.deep) this._trimAndObserveShadow(this.node);
	}

	stop() {
		this._observer.disconnect();
	}

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
		else if (isCustomElement(node)) addShadowListener(node, this._trimAndObserve.bind(this));
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
