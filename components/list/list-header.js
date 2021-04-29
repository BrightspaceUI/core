import '../colors/colors.js';
import '../inputs/input-checkbox.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { bodyCompactStyles } from '../typography/styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { listSelectionStates } from './list.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * A header for list components containing select-all, etc.
 */
class ListHeader extends RtlMixin(LocalizeCoreElement(LitElement)) {

	static get properties() {
		return {
			/**
			 * Id of the list associated with the header.
			 */
			listId: { type: String, attribute: 'list-id', reflect: true },
			/**
			 * Whether to render a header with reduced whitespace.
			 */
			slim: { type: Boolean },
			_selectionInfo: { type: Object }
		};
	}

	static get styles() {
		return [ bodyCompactStyles, css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-list-header-container {
				align-items: center;
				display: flex;
				margin-bottom: 6px;
				margin-top: 6px;
				min-height: 58px;
			}
			:host([slim]) .d2l-list-header-container {
				min-height: 36px;
			}
			d2l-input-checkbox {
				flex: none;
			}
			.d2l-list-header-summary {
				flex: auto;
				margin-left: 0.9rem;
			}
			:host([dir="rtl"]) .d2l-list-header-summary {
				margin-left: 0;
				margin-right: 0.9rem;
			}
			.d2l-list-header-actions {
				flex: none;
			}
		`];
	}

	constructor() {
		super();
		this._summaryId = getUniqueId();
		this._selectionInfo = { keys: [], state: listSelectionStates.none };
		this._handleListSelectionChange = this._handleListSelectionChange.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		// assumption: d2l-list and d2l-list-header are in same DOM context
		if (this.listId) {
			this._list = this.getRootNode({ composed: false }).querySelector(`#${this.listId}`);
			this._list.addEventListener('d2l-list-selection-change', this._handleListSelectionChange);
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this._list) {
			this._list.removeEventListener('d2l-list-selection-change', this._handleListSelectionChange);
			this._list = null;
		}
	}

	async firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		await this.updateComplete;
		this._updateSelectionState();
		this._updateActionsState();
	}

	render() {
		const summary = (this._selectionInfo.state === listSelectionStates.none ? this.localize('components.list-header.select-all')
			: this.localize('components.list-header.selected', 'count', this._selectionInfo.keys.length));
		return html`
			<div class="d2l-list-header-container">
				<d2l-input-checkbox
					aria-label="${this.localize('components.list-header.select-all')}"
					@change="${this._handleSelectAllChange}"
					?checked="${this._selectionInfo.state === listSelectionStates.all}"
					description="${ifDefined(this._selectionInfo.state !== listSelectionStates.none ? summary : undefined)}"
					?indeterminate="${this._selectionInfo.state === listSelectionStates.some}">
				</d2l-input-checkbox>
				<div
					aria-hidden="true"
					class="d2l-list-header-summary d2l-body-compact"
					id="${this._summaryId}">
					${summary}
				</div>
				<div class="d2l-list-header-actions">
					<slot></slot>
				</div>
			</div>
		`;
	}

	_handleListSelectionChange() {
		this._updateSelectionState();
		this._updateActionsState();
	}

	_handleSelectAllChange(e) {
		const checked = e.target.checked;
		if (!this._list) return;
		if (checked) this._list.selectAll(false);
		else this._list.unselectAll(false);
		this._selectionInfo = this._list.getSelectionInfo();
	}

	_updateActionsState() {
		if (!this._list) return;
		const actions = this.shadowRoot.querySelector('slot').assignedNodes({ flatten: true })
			.filter(node => node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('data-list-action'));
		if (actions.length === 0) return;
		const info = this._list.getSelectionInfo();
		actions.forEach(action => {
			action.disabled = (info.state === listSelectionStates.none);
		});
	}

	_updateSelectionState() {
		if (!this._list) return;
		this._selectionInfo = this._list.getSelectionInfo();
	}

}

customElements.define('d2l-list-header', ListHeader);
