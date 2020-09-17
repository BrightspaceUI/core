import './code-view.js';
import '../button/button-icon.js';
import '../switch/switch.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

class DemoSnippet extends LitElement {

	static get properties() {
		return {
			codeViewHidden: { type: Boolean, reflect: true, attribute: 'code-view-hidden' },
			hasSkeleton: { type: Boolean, reflect: true, attribute: 'has-skeleton' },
			noPadding: { type: Boolean, reflect: true, attribute: 'no-padding' },
			_code: { type: String },
			_dir: { type: String, attribute: false },
			_skeletonOn: { type: Boolean, reflect: false }
		};
	}

	static get styles() {
		return css`
			:host {
				background-color: white;
				border: 1px solid var(--d2l-color-tungsten);
				border-radius: 6px;
				box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
				display: block;
				max-width: 900px;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-demo-snippet-demo-wrapper {
				display: flex;
			}
			.d2l-demo-snippet-demo {
				flex: 1 1 auto;
				padding: 18px;
				position: relative;
			}
			:host([no-padding]) .d2l-demo-snippet-demo {
				padding: 0;
			}
			.d2l-demo-snippet-settings {
				border-left: 1px solid var(--d2l-color-mica);
				flex: 0 0 auto;
				padding: 6px;
			}
			d2l-code-view {
				border: none;
				border-top-left-radius: 0;
				border-top-right-radius: 0;
				margin: 0;
			}
			:host([code-view-hidden]) d2l-code-view {
				display: none;
			}
		`;
	}

	constructor() {
		super();
		this.hasSkeleton = false;
		this._dir = document.documentElement.dir;
		this._skeletonOn = false;
	}

	firstUpdated() {
		this._updateCode(this.shadowRoot.querySelector('slot:not([name="_demo"])'));
	}

	render() {
		const dirAttr = this._dir === 'rtl' ? 'rtl' : 'ltr';
		const skeleton = this.hasSkeleton ? html`<d2l-switch text="Skeleton" ?on="${this._skeletonOn}" @change="${this._handleSkeletonChange}"></d2l-switch>` : null;
		return html`
			<div class="d2l-demo-snippet-demo-wrapper">
				<div class="d2l-demo-snippet-demo" dir="${dirAttr}">
					<slot name="_demo"></slot>
					<slot></slot>
				</div>
				<div class="d2l-demo-snippet-settings">
					<d2l-switch text="RTL" ?on="${dirAttr === 'rtl'}" @change="${this._handleDirChange}"></d2l-switch><br>
					${skeleton}
				</div>
			</div>
			<d2l-code-view language="html" hide-language>${this._code}</d2l-code-view>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((_, prop) => {
			if (prop === '_code') this.shadowRoot.querySelector('d2l-code-view').forceUpdate();
		});
	}

	forceCodeUpdate() {
		this._updateCode(this.shadowRoot.querySelector('slot:not([name="_demo"])'));
	}

	_applyAttr(name, value) {
		const query = this._isTemplate ? 'slot[name="_demo"]' : 'slot:not([name="_demo"])';
		const nodes = this.shadowRoot.querySelector(query).assignedNodes();
		if (nodes.length === 0) return;
		const doApply = (nodes, isRoot) => {
			for (let i = 0; i < nodes.length; i++) {
				if (nodes[i].nodeType === Node.ELEMENT_NODE) {
					/* only sprout dir on root or custom element so devs don't think that
					[dir="rtl"].some-class will work. they must use :host([dir="rtl"]) in their
					custom element's CSS since RTLMixin only sprouts [dir="rtl"] on host */
					if (isRoot || nodes[i].tagName.indexOf('-') !== -1) {
						if (typeof(value) === 'boolean') {
							if (value) {
								nodes[i].setAttribute(name, name);
							} else {
								nodes[i].removeAttribute(name);
							}
						} else {
							nodes[i].setAttribute(name, value);
						}
					}
					if (nodes[i].shadowRoot) {
						doApply(nodes[i].shadowRoot.children, false);
					}
					doApply(nodes[i].children, false);
				}
			}
		};
		doApply(nodes, true);
	}

	_formatCode(text) {

		if (!text) return text;

		// remove the leading and trailing template tags
		text = text.replace(/^[\t]*\n/, '').replace(/\n[\t]*$/, '');
		const templateMatch = text.match(/^[\t]*<template>[\n]*/);
		this._isTemplate = templateMatch && templateMatch.length > 0;
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
			} else if (scriptIndent && !this._isTemplate) {
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

	_handleDirChange(e) {
		this._dir = e.target.on ? 'rtl' : 'ltr';
		this._applyAttr('dir', this._dir);
		this.dispatchEvent(new CustomEvent(
			'd2l-dir-update', { bubbles: true, composed: true, detail: { dir: this._dir } }
		));
	}

	_handleSkeletonChange(e) {
		this._skeletonOn = e.target.on;
		this._applyAttr('skeleton', this._skeletonOn);
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
