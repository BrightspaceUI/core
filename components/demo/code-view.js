import 'prismjs/prism.js';
import 'prismjs/components/prism-json.min.js';
import 'prismjs/components/prism-bash.min.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { styles } from './code-view-styles.js';
import { themeStyles } from './code-dark-plus-styles.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

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
	}

	render() {
		return html`
			<div class="d2l-code-view-src"><slot @slotchange="${this._handleSlotChange}"></slot></div>
			<div language="${this.language}" class="d2l-code-view-code">${this._codeTemplate}</div>
		`;
	}

	firstUpdated() {
		this._updateCode(this.shadowRoot.querySelector('slot'));
	}

	get _codeTemplate() {
		return html`<pre class="language-${this.language}"><code class="language-${this.language}">${unsafeHTML(this._code)}</code></pre>`;
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

	_getPrismGrammar(language) {
		switch (language) {
			case 'bash': return Prism.languages.bash;
			case 'css': return Prism.languages.css;
			case 'html': return Prism.languages.html;
			case 'javascript': return Prism.languages.javascript;
			case 'js': return Prism.languages.javascript;
			case 'json': return Prism.languages.json;
			case 'shell': return Prism.languages.bash;
			default: return Prism.languages.html;
		}
	}

	_handleSlotChange(e) {
		this._updateCode(e.target);
	}

	_updateCode(slot) {
		const nodes = slot.assignedNodes();
		if (nodes.length === 0) {
			this._code = '';
			return;
		}
		const code = Prism.highlight(
			this._formatCode(nodes[0].textContent),
			this._getPrismGrammar(this.language), this.language
		);
		this._code = code;
	}
}

customElements.define('d2l-code-view', CodeView);
