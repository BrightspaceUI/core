import '../alert/alert.js';
import '../expand-collapse/expand-collapse-content.js';
import { css, html, LitElement, nothing } from 'lit';
import { linkStyles } from '../link/link.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';

class FormErrorSummary extends LocalizeCoreElement(LitElement) {

	static get properties() {
		return {
			errors: { type: Object, attribute: false },
			_expanded: { type: Boolean, attribute: false },
			_hasBottomMargin: { type: Boolean, attribute: '_has-bottom-margin', reflect: true },
			_hasErrors: { type: Boolean, attribute: '_has-errors', reflect: true },
		};
	}

	static get styles() {
		return [linkStyles, css`

			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			:host([_has-bottom-margin][_has-errors]) {
				margin-block-end: 1rem;
			}

			.d2l-form-error-summary-header {
				cursor: pointer;
				display: flex;
				justify-content: space-between;
				padding-block: 0.3rem;
				padding-inline: 1.2rem 0.3rem;
			}

			.d2l-form-error-summary-text {
				align-items: center;
				display: flex;
			}

			.d2l-form-error-summary-error-list {
				margin-block: 0;
				margin-inline: 1.2rem 0;
				padding-bottom: 0.6rem;
				padding-top: 0.3rem;
			}

			d2l-alert {
				max-width: none;
			}
		`];
	}

	constructor() {
		super();
		this.errors = [];
		this._expanded = true;
		this._hasBottomMargin = false;
	}

	render() {
		const errorSummary = html`
			<d2l-alert type="critical" no-padding aria-live="polite">
				<div class="d2l-form-error-summary-header" @click=${this._toggleExpandCollapse}>
					<div class="d2l-form-error-summary-text">${this.localize('components.form-error-summary.errorSummary', { count: this.errors.length })}</div>
					<d2l-button-icon
						expanded=${this._expanded ? 'true' : 'false'}
						icon=${this._expanded ? 'tier1:arrow-collapse-small' : 'tier1:arrow-expand-small' }
						text="${this.localize('components.form-error-summary.text')}"
						@click=${this._toggleExpandCollapse}>
					</d2l-button-icon>
				</div>
				<d2l-expand-collapse-content ?expanded=${this._expanded}>
					<ul class="d2l-form-error-summary-error-list">
						${this.errors.map(error => html`
							<li>
								<a class="d2l-link" href=${error.href} @click=${error.onClick}>${error.message}</a>
							</li>
						`)}
					</ul>
				</d2l-expand-collapse-content>
			</d2l-alert>
		`;
		return this.errors.length > 0 ? errorSummary : nothing;
	}

	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);
		if (changedProperties.has('errors')) {
			this._hasErrors = this.errors.length > 0;
		}
	}

	async focus() {
		if (this.errors.length === 0) {
			super.focus();
			return;
		}
		let focusEleSelector;
		if (this._expanded) {
			await this.updateComplete;
			await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
			focusEleSelector = 'ul:first-child a';
		} else {
			focusEleSelector = 'd2l-button-icon';
		}
		const focusEle = this.shadowRoot && this.shadowRoot.querySelector(focusEleSelector);
		if (focusEle) focusEle.focus();
	}

	_toggleExpandCollapse(e) {
		e.stopPropagation();
		this._expanded = !this._expanded;
	}
}

customElements.define('d2l-form-error-summary', FormErrorSummary);
