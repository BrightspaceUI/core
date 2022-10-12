import '../colors/colors.js';
//import { ListItemLinkMixin } from './list-item-link-mixin.js';
import { ListItemRoleMixin } from './list-item-role-mixin.js';
import { ListItemCheckboxMixin } from './list-item-checkbox-mixin.js';
import { css, html, LitElement, nothing } from 'lit';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class ListItemCustom1 extends ListItemCheckboxMixin(ListItemRoleMixin(RtlMixin(LitElement))) {

	static get properties() {
		return {
			status: { type: String, reflect: true }
		};
	}

	static get styles() {

		const styles = [ css`
			:host {
				display: block;
			}
			:host[hidden] {
				display: none;
			}
			.layout {
				display: flex;
				gap: 1rem;
				padding: 0.5rem 0.5rem 0.5rem 0;
			}
			.status {
				flex: none;
				width: 0.25rem;
			}
			:host([status="open"]) .status {
				background-color: var(--d2l-color-celestine);
			}
			:host([status="closed"]) .status {
				background-color: var(--d2l-color-citrine);
			}
			.selection {
				flex: none;
			}
			.content {
				flex: auto;
			}
		`];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
	}

	render() {
		return html`
			<div class="layout">
				<div class="status"></div>
				<div class="selection">
					${this._renderCheckbox()}
				</div>
				<div class="content">
					<slot></slot>
				</div>
			</div>
		`;
	}

}

customElements.define('d2l-list-item-custom-1', ListItemCustom1);

import './list-item-generic-layout.js';

class ListItemCustom2 extends ListItemCheckboxMixin(ListItemRoleMixin(RtlMixin(LitElement))) {

	static get properties() {
		return {
			status: { type: String, reflect: true }
		};
	}

	static get styles() {

		const styles = [ css`
			:host {
				display: block;
			}
			:host[hidden] {
				display: none;
			}
			.layout {
				display: flex;
				gap: 1rem;
				padding: 0.5rem 0.5rem 0.5rem 0;
			}
			.status {
				flex: none;
				width: 0.25rem;
			}
			:host([status="open"]) .status {
				background-color: var(--d2l-color-celestine);
			}
			:host([status="closed"]) .status {
				background-color: var(--d2l-color-citrine);
			}
		`];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
	}

	render() {
		return html`
			<div class="layout">
				<div class="status"></div>
				<d2l-list-item-generic-layout>
					${this.selectable ? html`<div slot="control">${this._renderCheckbox()}</div>` : nothing }
					<div slot="content"><slot></slot></div>
					<div slot="actions"><slot name="actions"></slot></div>
				</d2l-list-item-generic-layout>
			</div>
		`;
	}

}

customElements.define('d2l-list-item-custom-2', ListItemCustom2);

import { ListItemMixin } from './list-item-mixin.js';

class ListItemCustom3 extends ListItemMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
			status: { type: String, reflect: true }
		};
	}

	static get styles() {

		const styles = [ css`
			:host {
				display: block;
			}
			:host[hidden] {
				display: none;
			}
			.layout {
				display: flex;
				gap: 1rem;
			}
			d2l-list-item-generic-layout {
				flex: auto;
			}
			.status {
				flex: none;
				width: 0.25rem;
			}
			:host([status="open"]) .status {
				background-color: var(--d2l-color-celestine);
			}
			:host([status="closed"]) .status {
				background-color: var(--d2l-color-citrine);
			}
		`];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
	}

	render() {
		return html`
			<div class="layout">
				<div class="status"></div>
				${this._renderListItem()}
			</div>
		`;
	}

}

customElements.define('d2l-list-item-custom-3', ListItemCustom3);

import { ListItemLinkMixin } from './list-item-link-mixin.js';

class ListItemCustom4 extends ListItemLinkMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
			status: { type: String, reflect: true }
		};
	}

	static get styles() {

		const styles = [ css`
			:host {
				display: block;
			}
			:host[hidden] {
				display: none;
			}
		`];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
	}

	render() {
		return html`
			${this._renderListItem()}
		`;
	}

}

customElements.define('d2l-list-item-custom-4', ListItemCustom4);

class ListItemCustom5 extends ListItemLinkMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
			status: { type: String, reflect: true }
		};
	}

	static get styles() {

		const styles = [ css`
			:host {
				display: block;
			}
			:host[hidden] {
				display: none;
			}
		`];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
	}

	//_renderListItem({ illustration, content, actions, nested } = {}) {

	render() {
		return html`
			${this._renderListItem()}
		`;
	}

}

customElements.define('d2l-list-item-custom-5', ListItemCustom5);
