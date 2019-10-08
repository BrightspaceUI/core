import { css, html, LitElement } from 'lit-element/lit-element.js';

class List extends LitElement {

	static get properties() {
		return {
			extendSeparators: { type: Boolean, reflect: true, attribute: 'extend-separators' },
			separators: { type: String, reflect: true }
		};
	}

	static get styles() {

		const layout = css`
			:host {
				display: block;
				--d2l-list-item-separator-bottom: initial;
				--d2l-list-item-separator-top: initial;
			}
		`;

		const specialSeparators = css`
			:host([separators="none"]) {
				--d2l-list-item-separator-bottom: none;
				--d2l-list-item-separator-padding-bottom: 1px;
				--d2l-list-item-separator-padding-top: 1px;
				--d2l-list-item-separator-top: none;
			}
			:host([separators="between"]) ::slotted([role="listitem"]:first-of-type),
			:host([separators="between"]) ::slotted([role="listitem"]:last-of-type) {
				--d2l-list-item-separator-bottom: none;
				--d2l-list-item-separator-padding-bottom: 1px;
				--d2l-list-item-separator-padding-top: 1px;
				--d2l-list-item-separator-top: none;
			}
			:host([extend-separators]) {
				--d2l-list-item-content-padding: 0 18px;
			}
		`;

		return [layout, specialSeparators];
	}

	render() {
		return html`
			<div role="list" class="d2l-list-container">
				<slot></slot>
			</div>
		`;
	}

}

customElements.define('d2l-list', List);
