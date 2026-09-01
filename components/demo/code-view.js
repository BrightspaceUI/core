import { html, LitElement } from 'lit';
import { formatCodeElement } from '../../helpers/prism.js';
import { styles } from './code-view-styles.js';
import { themeStyles } from './code-dark-plus-styles.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

class CodeView extends LitElement {

	static properties = {
		hideLanguage: { type: Boolean, reflect: true, attribute: 'hide-language' },
		language: { type: String, reflect: true },
		_code: { type: String }
	};

	static styles = [themeStyles, styles];

	constructor() {
		super();
		this.language = 'html';
	}

	attributeChangedCallback(name, oldval, newval) {
		if (name !== 'language' || oldval === newval) return;
		if (this.shadowRoot) this._updateCode(this.shadowRoot.querySelector('slot'));
		super.attributeChangedCallback(name, oldval, newval);
	}

	render() {
		return html`
			<div class="d2l-code-view-src"><slot @slotchange="${this._handleSlotChange}"></slot></div>
			<div data-language="${this.language}" class="d2l-code-view-code">${this._codeTemplate}</div>
		`;
	}

	forceUpdate() {
		if (this.shadowRoot) this._updateCode(this.shadowRoot.querySelector('slot'));
	}

	get _codeTemplate() {
		const code = this._code !== undefined ? unsafeHTML(this._code) : '';
		return html`<pre class="language-${this.language}"><code class="language-${this.language}">${code}</code></pre>`;
	}

	_formatCode(text) {

		if (!text) return text;

		let lines = text.replace(/\t/g, '  ').split('\n');

		// Shift indent left if possible, modified from:
		// https://github.com/PolymerElements/marked-element/blob/master/marked-element.js#L340-359
		const indent = lines.reduce((prev, line) => {

			// completely ignore blank lines
			if (/^\s*$/.test(line)) return prev;

			const lineIndent = line.match(/^(\s*)/)[0].length;
			if (prev === null) return lineIndent;
			return lineIndent < prev ? lineIndent : prev;

		}, null);

		// remove leading or trailing blank lines
		lines = lines.filter((line, index) => {
			if (index === 0 || index === lines.length - 1) return !/^\s*$/.test(line);
			return true;
		});

		return lines.map((l) => {
			return l.substr(indent);
		}).join('\n');
	}

	_handleSlotChange(e) {
		this._updateCode(e.target);
	}

	async _updateCode(slot) {

		if (!slot) return;

		const nodes = slot.assignedNodes();
		if (nodes.length === 0) {
			this._code = '';
			return;
		}

		// Legacy-Edge there may be more than one node so concat textContent
		let code = this._formatCode(nodes.reduce((code, node) => code + node.textContent, ''));

		try {
			const codeElement = document.createElement('code');
			codeElement.className = `language-${this.language}`;
			codeElement.textContent = code;
			await formatCodeElement(codeElement);
			code = codeElement.innerHTML;
		} catch (ex) {
			// eslint-disable-next-line no-console
			console.log(ex);
		} finally {
			this._code = code;
		}

	}

}

customElements.define('d2l-code-view', CodeView);
