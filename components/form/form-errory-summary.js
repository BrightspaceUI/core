import '../alert/alert.js';
import '../link/link.js';
import '../expand-collapse/expand-collapse-content.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { bodyStandardStyles } from '../typography/styles.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class FormErrorSummary extends LocalizeCoreElement(RtlMixin(LitElement)) {

	static get properties() {
		return {
			errors: { type: Object, attribute: false },
			_expanded: { type: Boolean, attribute: false }
		};
	}

	static get styles() {
		return [bodyStandardStyles, css`

			:host {
				display: block;
			}

			:host([hidden]) {
				display: none;
			}

			.d2l-form-error-summary-header {
				align-items: top;
				cursor: pointer;
				display: flex;
				justify-content: space-between;
				padding: 0.3rem 0.3rem 0.3rem 1.2rem;
			}

			:host([dir="rtl"]) .d2l-form-error-summary-header {
				padding-right: 1.2rem;
				padding-left: 0.3rem;
			}

			.d2l-form-error-summary-text {
				align-items: center;
				display: flex;
			}

			.d2l-form-error-summary-error-list {
				margin: 0 0 0 1.2rem;
				padding-bottom: 0.65rem;
				padding-top: 0.3rem;
			}

			:host([dir="rtl"]) .d2l-form-error-summary-error-list {
				margin-right: 1.2rem;
				margin-left: 0;
			}
		`];
	}

	constructor() {
		super();
		this.errors = [];
		this._expanded = true;
	}

	render() {
		const errorSummaryTerm = this.errors.length === 1 ? 'components.form-error-summary.singleError' : 'components.form-error-summary.multipleErrors';
		const errorSummary = html`
			<d2l-alert type="critical" no-padding aria-live="polite">
				<div class="d2l-form-error-summary-header" @click=${this._toggleExpandCollapse}>
					<div class="d2l-form-error-summary-text">${this.localize(errorSummaryTerm, {count: this.errors.length})}</div>
					<d2l-button-icon
						aria-expanded=${this._expanded ? 'true' : 'false'}
						icon=${this._expanded ? 'tier1:arrow-collapse-small' : 'tier1:arrow-expand-small' }
						@click=${this._toggleExpandCollapse}>
					</d2l-button-icon>
				</div>
				<d2l-expand-collapse-content ?expanded=${this._expanded}>
					<ul class="d2l-form-error-summary-error-list">
						${this.errors.map(error => html`
							<li>
								<d2l-link href=${error.href} @click=${error.onClick}>${error.message}</d2l-link>
							</li>
						`)}
					</ul>
				</d2l-expand-collapse-content>
			</d2l-alert>
		`;
		return this.errors.length > 0 ? errorSummary : html``;
	}

	async focus() {
		if (this.errors.length === 0) {
			super.focus();
			return;
		}
		await this.updateComplete;
		await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
		const firstItem = this.shadowRoot.querySelector('ul:first-child d2l-link');
		firstItem.focus();
	}

	_toggleExpandCollapse(e) {
		e.stopPropagation();
		this._expanded = !this._expanded;
	}
}

customElements.define('d2l-form-error-summary', FormErrorSummary);
