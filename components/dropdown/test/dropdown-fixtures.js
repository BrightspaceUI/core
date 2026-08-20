import '../dropdown-button.js';
import '../dropdown-content.js';
import { defineCE, html, sendKeysElem } from '@brightspace-ui/testing';
import { LitElement, nothing } from 'lit';

export const asyncDropdownTag = defineCE(class extends LitElement {
	static properties = {
		_loaded: { state: true }
	};
	constructor() {
		super();
		this._loaded = false;
	}
	render() {
		const content = !this._loaded ? nothing : html`<button>Loading Complete, focus here</button>`;
		return html`
			<d2l-dropdown-button class="vdiff-target" text="Open">
				<d2l-dropdown-content async @d2l-dropdown-async-load="${this.#handleDropdownAsyncLoad}">${content}</d2l-dropdown-content>
			</d2l-dropdown-button>
		`;
	}
	getContent() {
		return this.shadowRoot.querySelector('d2l-dropdown-content');
	}
	getOpener() {
		return this.shadowRoot.querySelector('d2l-dropdown-button');
	}
	async openKeyboard() {
		await sendKeysElem(this.getOpener(), 'press', 'Enter');
	}
	async reset() {
		this._loaded = false;
		this.#resetCallback?.();
		await this.updateComplete;
	}
	#resetCallback;
	async #handleDropdownAsyncLoad(e) {
		this.#resetCallback = e.detail.reset;
		await new Promise(resolve => setTimeout(resolve, 200));
		this._loaded = true;
		e.detail.complete();
	}
});
