import './list-item.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

class List extends LitElement {
	static get properties() {
		return {
			divider: { type: String }
		};
	}

	static get styles() {
		const layout = css`
			:host {
				display: block;
			}
			ul {
				list-style-type: none;
				padding: 0;
			}
			::slotted(*) {
				display: none;
			}
			::slotted(d2l-list-item) {
				display: list-item;
				box-sizing: content-box;
				margin: 1px 0;
				--d2l-list-item-divider-top: block;
				--d2l-list-item-divider-bottom: block;
			}
		`;

		const specialDividers = css`
			:host([divider="none"]) ::slotted(d2l-list-item) {
				--d2l-list-item-divider-top: none;
				--d2l-list-item-divider-bottom: none;
			}
			:host([divider="bottom"]) ::slotted(d2l-list-item) {
				--d2l-list-item-divider-top: none;
				--d2l-list-item-divider-bottom: block;
			}
			:host([divider="top"]) ::slotted(d2l-list-item) {
				--d2l-list-item-divider-bottom: none;
				--d2l-list-item-divider-top: block;
			}
			:host([divider="middle"]) ::slotted(d2l-list-item:first-of-type),
			:host([divider="middle"]) ::slotted(d2l-list-item:last-of-type) {
				--d2l-list-item-divider-bottom: none;
				--d2l-list-item-divider-top: none;
			}
			:host([divider-extend]) ::slotted(d2l-list-item) {
				--d2l-list-item-content-padding: 0 18px;
			}
			:host(.d2l-list-divider-hover) ::slotted(d2l-list-item:hover) {
				--d2l-list-item-divider-top: block;
				--d2l-list-item-divider-bottom: block;
			}
		`;
		return [layout, specialDividers];
	}

	render() {

		return html`
			<ul>
				<slot></slot>
			</ul>
		`;
	}
}

customElements.define('d2l-list', List);
