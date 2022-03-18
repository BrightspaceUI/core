import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ArrowKeysMixin } from '../../mixins/arrow-keys-mixin.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';

const ITEM_SPACING = 6;

class TagList extends ArrowKeysMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * REQUIRED: A description of the tag list for additional accessibility context
			 * @type {string}
			 */
			description: { type: String },
			/**
			 * @ignore
			 */
			role: { type: String, reflect: true },
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			.tag-list-container {
				display: flex;
				flex-wrap: wrap;
				margin: -${ITEM_SPACING}px -${ITEM_SPACING}px 0 0;
				padding: 0;
				position: relative;
			}
			::slotted(*) {
				margin: ${ITEM_SPACING}px ${ITEM_SPACING}px 0 0;
			}
		`;
	}

	constructor() {
		super();
		/** @ignore */
		this.role = 'application';
		/** @ignore */
		this.arrowKeysDirection = 'leftrightupdown';
		this._items = [];
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		requestAnimationFrame(() => {
			this._items = this._getTagListItems();
			if (this._items.length > 0) this._items[0].setAttribute('tabindex', 0);
		});
	}

	render() {
		const description = this.description ? html`<div id="d2l-tag-list-description" hidden>${this.description}</div>` : null;
		const list = html`
			<div role="list" class="tag-list-container" aria-describedby="${ifDefined(this.description && 'd2l-tag-list-description')}">
				<slot></slot>
			</div>
		`;
		return html`
			${this.arrowKeysContainer(list)}
			${description}
		`;
	}

	async arrowKeysFocusablesProvider() {
		return this._items;
	}

	focus() {
		if (this._items[0]) this._items[0].focus();
	}

	_getTagListItems() {
		const slot = this.shadowRoot && this.shadowRoot.querySelector('slot');
		if (!slot) return;
		const items = slot.assignedNodes({ flatten: true }).filter((node) => node.nodeType === Node.ELEMENT_NODE);

		return items.filter((item) => {
			const role = item.getAttribute('role');
			return (role === 'listitem');
		});
	}

}

customElements.define('d2l-tag-list', TagList);
