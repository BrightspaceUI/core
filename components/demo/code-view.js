import 'prismjs/prism.js';
import { html, LitElement } from 'lit';
import { styles } from './code-view-styles.js';
import { themeStyles } from './code-dark-plus-styles.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

class CodeView extends LitElement {

	static get properties() {
		return {
			hideLanguage: { type: Boolean, reflect: true, attribute: 'hide-language' },
			language: { type: String, reflect: true },
			_code: { type: String }
		};
	}

	static get styles() {
		return [ themeStyles, styles ];
	}

	constructor() {
		super();
		this.language = 'html';
		this._dependenciesPromise = Promise.resolve();
	}

	attributeChangedCallback(name, oldval, newval) {
		if (name !== 'language' || oldval === newval) return;
		const language = this._getLanguage(newval);
		if (Prism.languages[language]) {
			this._dependenciesPromise = Promise.resolve();
		} else {
			this._dependenciesPromise = import(`../../node_modules/prismjs/components/prism-${language}.min.js`);
		}
		if (this.shadowRoot) this._updateCode(this.shadowRoot.querySelector('slot'));
		super.attributeChangedCallback(name, oldval, newval);
	}

	firstUpdated() {
		this._updateCode(this.shadowRoot.querySelector('slot'));
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

	_getLanguage(language) {
		const aliases = { shell: 'bash' };
		return aliases[language] ? aliases[language] : language;
	}

	_getPrismGrammar(language) {
		language = this._getLanguage(language);
		if (Prism.languages[language]) return Prism.languages[language];
		else return Prism.languages.html;
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
			await this._dependenciesPromise;
			code = Prism.highlight(code, this._getPrismGrammar(this.language), this.language);
		} catch (ex) {
			// eslint-disable-next-line no-console
			console.log(ex);
		} finally {
			this._code = code;
		}

	}

}

customElements.define('d2l-code-view', CodeView);
