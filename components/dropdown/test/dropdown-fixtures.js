import '../dropdown.js';
import '../dropdown-button.js';
import '../dropdown-content.js';
import { defineCE, html, sendKeysElem } from '@brightspace-ui/testing';
import { LitElement, nothing } from 'lit';

export const asyncDropdownTag = defineCE(class extends LitElement {
	static properties = {
		openerType: { attribute: 'opener-type', type: String },
		_loaded: { state: true }
	};
	constructor() {
		super();
		this.openerType = 'dropdown-button';
		this._loaded = false;
	}
	render() {
		const content = !this._loaded ? nothing : html`<button>Loading Complete, focus here</button>`;
		const dropdownContent = html`<d2l-dropdown-content async @d2l-dropdown-async-load="${this.#handleDropdownAsyncLoad}" class="vdiff-target">${content}</d2l-dropdown-content>`;
		if (this.openerType === 'dropdown-button') {
			return html`
				<d2l-dropdown-button class="vdiff-target" text="Open">
					${dropdownContent}
				</d2l-dropdown-button>
			`;
		} else if (this.openerType === 'button') {
			return html`
				<d2l-dropdown>
					<button type="button" class="d2l-dropdown-opener">Open</button>
					${dropdownContent}
				</d2l-dropdown>
			`;
		}
	}
	finishLoading() {
		this.#loadingResolve?.();
	}
	getContent() {
		return this.shadowRoot.querySelector('d2l-dropdown-content');
	}
	getOpener() {
		return this.openerType === 'dropdown-button' ?
			this.shadowRoot.querySelector('d2l-dropdown-button') :
			this.shadowRoot.querySelector('.d2l-dropdown-opener');
	}
	async openKeyboard() {
		await sendKeysElem(this.getOpener(), 'press', 'Enter');
	}
	async reset() {
		this._loaded = false;
		this.#loadingPromise = new Promise(resolve => this.#loadingResolve = resolve);
		this.#resetCallback?.();
		await this.updateComplete;
	}
	#loadingResolve;
	#loadingPromise = new Promise(resolve => this.#loadingResolve = resolve);
	#resetCallback;
	async #handleDropdownAsyncLoad(e) {
		this.#resetCallback = e.detail.reset;
		await this.#loadingPromise;
		this._loaded = true;
		e.detail.complete();
	}
});
