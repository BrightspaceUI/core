import './code-view.js';
import '../button/button-subtle.js';
import '../switch/switch.js';
import '../dropdown/dropdown.js';
import '../dropdown/dropdown-content.js';
import { css, html, LitElement } from 'lit';

function setIndent(text, indent = 0, skipFirstLine = false) {
	const lines = text.split('\n');
	const indentedLines = lines.filter((l, i) => l.trim() !== '' && !(skipFirstLine && i === 0));
	const minIndent = Math.min(...indentedLines.map(l => l.match(/^\s*/)[0].length));

	return lines.map((l, i) => `${' '.repeat(indent)}${skipFirstLine && i === 0 ? l : l.substring(minIndent)}`).join('\n');
}

class DemoSnippet extends LitElement {

	static get properties() {
		return {
			codeViewHidden: { type: Boolean, reflect: true, attribute: 'code-view-hidden' },
			fullWidth: { type: Boolean, reflect: true, attribute: 'full-width' },
			noPadding: { type: Boolean, reflect: true, attribute: 'no-padding' },
			overflowHidden: { type: Boolean, reflect: true, attribute: 'overflow-hidden' },
			_code: { type: String },
			_fullscreen: { state: true },
			_hasSkeleton: { type: Boolean, attribute: false },
			_settingsPeek: { state: true },
			_skeletonOn: { type: Boolean, reflect: false }
		};
	}

	static get styles() {
		return css`
			:host {
				background-color: var(--d2l-sem-background-color-base);
				border: 1px solid var(--d2l-sem-border-color-standard);
				border-radius: 6px;
				box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
				display: block;
				max-width: 900px;
			}
			:host([hidden]) {
				display: none;
			}
			:host([full-width]) {
				max-width: unset;
			}
			.d2l-demo-snippet-demo-wrapper {
				display: flex;
			}
			.d2l-demo-snippet-demo-wrapper.fullscreen {
				background-color: var(--d2l-sem-background-color-base);
				height: 100vh;
				inset: 0;
				overflow: auto;
				position: absolute;
				z-index: 2;
			}
			.d2l-demo-snippet-demo {
				flex: 1 1 auto;
				min-width: 0;
				position: relative;
			}
			:host([full-width]) .d2l-demo-snippet-demo-wrapper.fullscreen .d2l-demo-snippet-demo {
				width: 100vw;
			}
			:host([overflow-hidden]) .d2l-demo-snippet-demo {
				overflow: hidden;
			}
			.d2l-demo-snippet-demo-padding {
				padding: 18px;
			}
			:host([no-padding]) .d2l-demo-snippet-demo-padding,
			.d2l-demo-snippet-demo-wrapper.fullscreen .d2l-demo-snippet-demo-padding {
				padding: 0;
			}
			.d2l-demo-snippet-settings {
				border-inline-start: 1px solid var(--d2l-sem-border-color-standard);
				flex: 0 0 auto;
				padding: 6px;
			}
			.d2l-demo-snippet-demo-wrapper.fullscreen .d2l-demo-snippet-settings {
				position: sticky;
				top: 0;
			}
			d2l-dropdown.settings-dropdown {
				background-color: var(--d2l-sem-background-color-base);
				border-radius: 6px;
				outline: 1px solid var(--d2l-color-celestine-minus-1);
				position: fixed;
				right: 1rem;
				top: -0.25rem;
				translate: 0 -1.5rem;
				z-index: 9999; /* stack on top of sticky headers */
			}
			@media (prefers-reduced-motion: no-preference) {
				d2l-dropdown.settings-dropdown {
					transition: translate 0.15s, box-shadow 0.15s;
				}
			}
			d2l-dropdown.settings-dropdown.peek,
			d2l-dropdown.settings-dropdown:hover,
			d2l-dropdown.settings-dropdown:focus-within {
				box-shadow: 0 -1px 0 1px white;
				translate: 0;
			}
			d2l-code-view {
				border: none;
				border-top-left-radius: 0;
				border-top-right-radius: 0;
				margin: 0;
				max-width: 100%;
			}
			:host([code-view-hidden]) d2l-code-view {
				display: none;
			}
		`;
	}

	constructor() {
		super();
		this.fullWidth = false;
		this._fullscreen = false;
		this._hasSkeleton = false;
		this._skeletonOn = false;
	}

	render() {
		const skeleton = this._hasSkeleton ? html`<d2l-switch text="Skeleton" ?on="${this._skeletonOn}" @change="${this._handleSkeletonChange}"></d2l-switch>` : null;
		const switches = html`
			<d2l-switch text="Fullscreen" ?on="${this._fullscreen}" @change="${this._handleFullscreenChange}"></d2l-switch><br />
			${skeleton}`;
		const settings = this.fullWidth && this._fullscreen ? html`
			<d2l-dropdown class="settings-dropdown ${this._settingsPeek ? 'peek' : ''}">
				<d2l-button-subtle primary icon="tier1:gear" text="Settings" class="d2l-dropdown-opener"></d2l-button-subtle>
				<d2l-dropdown-content>${switches}</d2l-dropdown-content>
			</d2l-dropdown>` : html`<div class="d2l-demo-snippet-settings">${switches}</div>`;

		return html`
			<div class="d2l-demo-snippet-demo-wrapper ${this._fullscreen ? 'fullscreen' : ''}">
				<div class="d2l-demo-snippet-demo">
					<div class="d2l-demo-snippet-demo-padding">
						<slot name="_demo"></slot>
						<slot @slotchange="${this._handleSlotChange}"></slot>
					</div>
				</div>
				${settings}
			</div>
			<d2l-code-view language="html" hide-language>${this._code}</d2l-code-view>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((_, prop) => {
			if (prop === '_code') {
				if (this.shadowRoot) this.shadowRoot.querySelector('d2l-code-view').forceUpdate();
			}
		});
	}

	_formatCode(text) {

		if (!text) return text;

		// remove the leading and trailing template tags
		text = text.replace(/^(\t*\n)*/, '').replace(/(\n\t*)*$/, '');
		this._isTemplate = /^\s*<template>/.test(text);
		text = text.replace(/^[\t]*<template>[\n]*/, '').replace(/[\n]*[\t]*<\/template>$/, '');

		// fix script whitespace
		text = setIndent(text.replace(/\t/g, '  '))
			.replace(/( *)<script( type="module")?>([^\n]+?)<\/script>/g, '$1<script$2>\n$1  $3\n$1</script>') // convert single line scripts to multi-line
			.replace(/( *)<\/script>/g, '\n$1</script>')
			.replace(/<script( type="module")?>/g, '<script$1>\n')
			.replace(/(\n *)?<script data-demo-hide(.+?)<\/script>/gis, '');

		const startTags = new Set([...text.matchAll(/<[^/](.*?)>/g)].map(m => m[0]));
		for (const tag of startTags) {
			const formattedTag = tag
				.replace(/ class=""/g, '') // replace empty class attributes (class="")
				.replace(/\s+_[^\s/>"'=]*(=(?<q>['"]).*?(?<!\\)\k<q>)?/g, '') // replace private reflected properties (_attr, _attr="value", but not target="_blank")
				.replace(/=""/g, ''); // replace empty strings for boolean attributes (="")
			text = text.replace(tag, formattedTag);
		}

		return text;

	}

	_getDemoNodes() {
		const query = this._isTemplate ? '[slot="_demo"], [slot="_demo"] *' : '*';
		const elements = Array.from(this.querySelectorAll(query));
		return elements;
	}

	async _handleFullscreenChange(e) {
		this._fullscreen = e.target.on;
		this._settingsPeek = this._fullscreen;
		const event = new CustomEvent('d2l-demo-snippet-fullscreen-toggle', { bubbles: true, composed: true });
		this.dispatchEvent(event);
		await this.updateComplete;
		await new Promise(r => setTimeout(r, 1000));
		this._settingsPeek = false;
	}

	_handleSkeletonChange(e) {
		this._skeletonOn = e.target.on;
		const nodes = this._getDemoNodes();
		for (const node of nodes) {
			if (node.nodeType !== Node.ELEMENT_NODE) continue;
			if (node.tagName.indexOf('-') === -1) continue;
			if (this._skeletonOn) {
				node.setAttribute('skeleton', '');
			} else {
				node.removeAttribute('skeleton');
			}
		}
	}

	_handleSlotChange(e) {
		// this._updateCode(e.target);
		this._updateHasSkeleton();
	}

	_removeImportedDemo() {
		if (!this.shadowRoot) return;
		const nodes = this.shadowRoot.querySelector('slot[name="_demo"]').assignedNodes();
		for (let i = nodes.length - 1; i >= 0; i--) {
			nodes[i].parentNode.removeChild(nodes[i]);
		}
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

	_updateHasSkeleton() {
		const nodes = this._getDemoNodes();

		this._hasSkeleton = nodes.some(n => n.nodeType === Node.ELEMENT_NODE && n.tagName.indexOf('-') !== -1 && n.skeleton !== undefined);

	}

}

customElements.define('d2l-demo-snippet', DemoSnippet);
