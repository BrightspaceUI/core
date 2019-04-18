import 'prismjs/prism.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { codeStyles } from './code-dark-plus-styles.js';
import { styles } from './styles.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

class DemoSnippet extends LitElement {

	static get properties() {
		return {
			noPadding: { type: Boolean, reflect: true, attribute: 'no-padding' },
			_codeHTML: { type: String },
			_dirButton: { type: String }
		};
	}

	static get styles() {
		return [ codeStyles, styles ];
	}

	constructor() {
		super();
		this._dir = document.documentElement.dir;
		this._dirButton = this._dir === 'rtl' ? 'ltr' : 'rtl';
	}

	render() {
		return html`
			<div class="d2l-demo-snippet-demo" dir="${this._dir}">
				<div class="d2l-demo-snippet-actions">
					<button @click="${this._handleDirChange}" title="toggle dir">${this._dirButton}</button>
				</div>
				<slot @slotchange="${this._handleSlotChange}"></slot>
			</div>
			<div class="d2l-demo-snippet-code">${this._codeTemplate}</div>
		`;
	}

	firstUpdated() {
		this._updateCode(this.shadowRoot.querySelector('slot'));
	}

	get _codeTemplate() {
		return html`<pre class="language-html"><code class="language-html">${unsafeHTML(this._codeHTML)}</code></pre>`;
	}

	_fixCodeWhitespace(text) {

		if (!text) return text;

		// fix script whitespace (for some reason brower keeps <script> indent but not the rest)
		let lines = text.replace(/\t/g, '  ').replace(/<\/script>/g, '\n</script>').replace(/<script>/g, '<script>\n').split('\n');
		let scriptIndent = 0;
		lines = lines.map((l) => {
			if (l.indexOf('<script>') > -1) {
				scriptIndent = l.match(/^(\s*)/)[0].length;
				return l;
			} else if (l.indexOf('</script>') > -1) {
				const nl = this._repeat(' ', scriptIndent) + l ;
				scriptIndent = 0;
				return nl;
			} else if (scriptIndent) {
				return this._repeat(' ', scriptIndent + 2) + l;
			} else {
				return l;
			}
		});

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

	_handleDirChange() {
		this._dir = this._dir === 'rtl' ? 'ltr' : 'rtl';
		this._dirButton = this._dir === 'rtl' ? 'ltr' : 'rtl';
		const nodes = this.shadowRoot.querySelector('slot').assignedNodes();
		if (nodes.length === 0) return;
		const applyDir = (nodes) => {
			for (let i = 0; i < nodes.length; i++) {
				if (nodes[i].nodeType === Node.ELEMENT_NODE) {
					nodes[i].setAttribute('dir', this._dir);
					if (nodes[i].shadowRoot) {
						applyDir(nodes[i].shadowRoot.children);
					}
					applyDir(nodes[i].children);
				}
			}
		};
		applyDir(nodes);
	}

	_handleSlotChange(e) {
		this._updateCode(e.target);
	}

	_repeat(value, times) {
		if (!value || !times) return '';
		if (!''.repeat) return Array(times).join(value); // for IE11
		return value.repeat(times);
	}

	_updateCode(slot) {
		const nodes = slot.assignedNodes();
		if (nodes.length === 0) {
			this._codeHTML = '';
			return;
		}
		const tempContainer = document.createElement('div');
		for (let i = 0; i < nodes.length; i++) {
			tempContainer.appendChild(nodes[i].cloneNode(true));
		}

		const html = Prism.highlight(
			this._fixCodeWhitespace(tempContainer.innerHTML)
				.replace(/ class=""/g, '') // replace empty class attributes (class="")
				.replace(/_[^=]*="[^"]*"/, '') // replace private reflected properties (_attr="value")
				.replace(/=""/g, ''), // replace empty strings for boolean attributes (="")
			Prism.languages.html, 'html'
		);

		this._codeHTML = html;
	}

}

customElements.define('d2l-demo-snippet', DemoSnippet);
