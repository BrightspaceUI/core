import './code-view.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { styles } from './demo-snippet-styles.js';

class DemoSnippet extends LitElement {

	static get properties() {
		return {
			codeViewHidden: { type: Boolean, reflect: true, attribute: 'code-view-hidden' },
			noPadding: { type: Boolean, reflect: true, attribute: 'no-padding' },
			_code: { type: String },
			_dirButton: { type: String }
		};
	}

	static get styles() {
		return [ styles ];
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
					<button id="d2l-demo-snippet-toggle-dir" @click="${this._handleDirChange}" title="toggle dir">${this._dirButton}</button>
				</div>
				<slot name="_demo"></slot>
				<slot></slot>
			</div>
			<d2l-code-view language="html" hide-language>${this._code}</d2l-code-view>
		`;
	}

	firstUpdated() {
		this._updateCode(this.shadowRoot.querySelector('slot:not([name="_demo"])'));
	}

	_formatCode(text) {

		if (!text) return text;

		// remove the leading and trailing template tags
		text = text.replace(/^[\t]*\n/, '').replace(/\n[\t]*$/, '');
		const templateMatch = text.match(/^[\t]*<template>[\n]*/);
		const isTemplate = templateMatch && templateMatch.length > 0;
		text = text.replace(/^[\t]*<template>[\n]*/, '').replace(/[\n]*[\t]*<\/template>$/, '');

		// fix script whitespace (for some reason brower keeps <script> indent but not the rest)
		let lines = text.replace(/\t/g, '  ').replace(/<\/script>/g, '\n</script>').replace(/<script>/g, '<script>\n').replace(/<script type="module">/g, '<script type="module">\n').split('\n');
		let scriptIndent = 0;
		lines = lines.map((l) => {
			if (l.indexOf('<script') > -1) {
				scriptIndent = l.match(/^(\s*)/)[0].length;
				return l;
			} else if (l.indexOf('</script>') > -1) {
				const nl = this._repeat(' ', scriptIndent) + l ;
				scriptIndent = 0;
				return nl;
			} else if (scriptIndent && !isTemplate) {
				return this._repeat(' ', scriptIndent + 2) + l;
			} else {
				return l;
			}
		});

		return lines.join('\n')
			.replace(/ class=""/g, '')      // replace empty class attributes (class="")
			.replace(/_[^=]*="[^"]*"/, '')  // replace private reflected properties (_attr="value")
			.replace(/=""/g, '');           // replace empty strings for boolean attributes (="")
	}

	_handleDirChange() {
		this._dir = this._dir === 'rtl' ? 'ltr' : 'rtl';
		this._dirButton = this._dir === 'rtl' ? 'ltr' : 'rtl';
		const nodes = this.shadowRoot.querySelector('slot').assignedNodes();
		if (nodes.length === 0) return;
		const applyDir = (nodes, isRoot) => {
			for (let i = 0; i < nodes.length; i++) {
				if (nodes[i].nodeType === Node.ELEMENT_NODE) {
					/* only sprout dir on root or custom element so devs don't think that
					[dir="rtl"].some-class will work. they must use :host([dir="rtl"]) in their
					custom element's CSS since RTLMixin only sprouts [dir="rtl"] on host */
					if (isRoot || nodes[i].tagName.indexOf('-') !== -1) {
						nodes[i].setAttribute('dir', this._dir);
					}
					if (nodes[i].shadowRoot) {
						applyDir(nodes[i].shadowRoot.children, false);
					}
					applyDir(nodes[i].children, false);
				}
			}
		};
		applyDir(nodes, true);
		this.dispatchEvent(new CustomEvent(
			'd2l-dir-update', { bubbles: true, composed: true, detail: { dir: this._dir } }
		));
	}

	_removeImportedDemo() {
		const nodes = this.shadowRoot.querySelector('slot[name="_demo"]').assignedNodes();
		for (let i = nodes.length - 1; i === 0; i--) {
			nodes[i].parentNode.removeChild(nodes[i]);
		}
	}

	_repeat(value, times) {
		if (!value || !times) return '';
		if (!''.repeat) return Array(times).join(value); // for IE11
		return value.repeat(times);
	}

	_updateCode(slot) {
		this._removeImportedDemo();
		const nodes = slot.assignedNodes();
		if (nodes.length === 0) {
			this._code = '';
			return;
		}
		const tempContainer = document.createElement('div');
		for (let i = 0; i < nodes.length; i++) {
			if (nodes[i].tagName === 'TEMPLATE') {
				const demoContainer = document.createElement('div');
				demoContainer.setAttribute('slot', '_demo');
				demoContainer.appendChild(document.importNode(nodes[i].content, true));
				/* must insert before template, else getPreviousFocusable (in consumer code)
				will walk composed dom from template, thereby returning last focusable in
				element due to order of slots */
				this.insertBefore(demoContainer, nodes[i]);
			}

			tempContainer.appendChild(nodes[i].cloneNode(true));
		}
		const textNode = document.createTextNode(this._formatCode(tempContainer.innerHTML));
		this._code = textNode.textContent;
	}

}

customElements.define('d2l-demo-snippet', DemoSnippet);
