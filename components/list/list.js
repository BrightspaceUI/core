import { css, html, LitElement } from 'lit-element/lit-element.js';

class List extends LitElement {
	static get properties() {
		return {
			dividerMode: { type: String, attribute: 'divider-mode' },
			dividerExtend: {type: Boolean, attribute: 'divider-extend'}
		};
	}

	static get styles() {
		const layout = css`
			:host {
				display: block;
			}
			::slotted(d2l-list-item) {
				--d2l-list-item-divider-bottom: initial;
				--d2l-list-item-divider-top: initial;
			}
		`;

		const specialDividers = css`
			:host([divider-mode="none"]) {
				--d2l-list-item-divider-bottom: none;
				--d2l-list-item-divider-padding-bottom: 1px;
				--d2l-list-item-divider-padding-top: 1px;
				--d2l-list-item-divider-top: none;
			}
			:host([divider-mode="between"]) ::slotted(d2l-list-item:first-of-type),
			:host([divider-mode="between"]) ::slotted(d2l-list-item:last-of-type) {
				--d2l-list-item-divider-bottom: none;
				--d2l-list-item-divider-padding-bottom: 1px;
				--d2l-list-item-divider-padding-top: 1px;
				--d2l-list-item-divider-top: none;
			}
			:host([divider-extend]) {
				--d2l-list-item-content-padding: 0 18px;
			}
			:host(.d2l-list-divider-hover) ::slotted(d2l-list-item:hover) {
				--d2l-list-item-divider-bottom: initial;
				--d2l-list-item-divider-padding-bottom: initial;
				--d2l-list-item-divider-padding-top: initial;
				--d2l-list-item-divider-top: initial;
			}
		`;
		return [layout, specialDividers];
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
