import '../alert/alert.js';
import '../colors/colors.js';
import '../icons/icon.js';
import './page-header-custom.js';
import { bodyCompactStyles, heading3Styles, labelStyles } from '../typography/styles.js';
import { css, html, LitElement } from 'lit';
import { highlightBorderStyles, highlightLinkStyles } from './page-header-styles.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { overflowEllipsisDeclarations } from '../../helpers/overflow.js';
import { RequesterMixin } from '../../mixins/provider/provider-mixin.js';

class PageHeaderImmersive extends RequesterMixin(LocalizeCoreElement(LitElement)) {

	static get properties() {
		return {
			backHref: { attribute: 'back-href', type: String },
			backCustomText: { attribute: 'back-custom-text', type: String },
			titleText: { attribute: 'title-text', type: String },
			subtitleText: { attribute: 'subtitle-text', type: String },
			_error: { state: true },
			_hasActions: { state: true }
		};
	}

	static get styles() {
		return [bodyCompactStyles, heading3Styles, labelStyles, highlightBorderStyles, highlightLinkStyles, css`
			:host {
				display: block;
			}
			:host([hidden]),
			.actions[hidden] {
				display: none;
			}
			.container {
				align-items: stretch;
				display: flex;
				gap: 24px;
				height: 3.1rem;
			}
			.title {
				flex: 0 1 auto;
				min-width: 0;
				width: 100%;
			}
			.back,
			.actions {
				flex: 0 0 auto;
			}
			.title,
			.actions {
				border-inline-start: 1px solid var(--d2l-color-gypsum);
				padding-inline-start: 24px;
			}
			.title h1 {
				display: flex;
				flex-direction: column;
				height: 100%;
				justify-content: center;
				margin: 0;
			}
			.actions {
				align-items: center;
				display: flex;
				gap: 0.6rem;
			}
			.title h1 .d2l-heading-3 {
				margin: 0;
			}
			.back-text-short {
				display: none;
			}
			@media (max-width: 615px) {
				.back-text-long {
					display: none;
				}
				.back-text-short {
					display: inline;
				}
			}
			d2l-alert {
				margin: 10px auto;
			}
			.title-text {
				${overflowEllipsisDeclarations}
			}
		`];
	}

	constructor() {
		super();
		this._error = false;
		this._hasActions = false;
	}

	connectedCallback() {
		super.connectedCallback();
		const configurePageHeader = this.requestInstance('d2l-page-header-configure');
		if (configurePageHeader) {
			configurePageHeader({ sticky: true });
		} else {
			this._error = true;
		}
	}

	render() {
		if (this._error) return this.#renderError();
		return html`
			<d2l-page-header-custom>
				<div class="container" slot="top">
					${this.#renderBack()}
					${this.#renderTitle()}
					<div class="actions" ?hidden="${!this._hasActions}">
						<slot name="actions" @slotchange="${this.#handleActionsSlotChange}"></slot>
					</div>
				</div>
			</d2l-page-header-custom>
		`;
	}

	#handleActionsSlotChange(e) {
		this._hasActions = e.target.assignedNodes({ flatten: true })?.length > 0;
	}

	#handleBackClick() {
		this.dispatchEvent(
			new CustomEvent(
				'd2l-page-header-immersive-back-click',
				{ bubbles: false, composed: false }
			)
		);
	}

	#renderBack() {
		const href = this.backHref || 'javascript:void(0);';
		const commonText = this.localizeCommon('navigation:back:title');
		const longText = this.backCustomText || commonText;
		return html`
			<div class="back d2l-body-compact">
				<a class="d2l-page-header-highlight-link" href="${href}" aria-label="${longText}" @click="${this.#handleBackClick}">
					<span class="d2l-page-header-highlight-border"></span>
					<d2l-icon icon="tier1:chevron-left"></d2l-icon>
					<span class="back-text-long">${longText}</span>
					<span class="back-text-short">${commonText}</span>
				</a>
			</div>
		`;
	}

	#renderError() {
		return html`
			<d2l-alert type="critical">&lt;d2l-page-header-immersive&gt; must be rendered inside a &lt;d2l-page&gt;'s header slot.</d2l-alert>
		`;
	}

	#renderTitle() {
		const title = this.titleText ? html`<div class="title-text d2l-heading-3">${this.titleText}</div>` : '';
		const subtitle = this.subtitleText ? html`<div class="title-text d2l-label-text">${this.subtitleText}</div>` : '';
		const heading = (title || subtitle) && html`<h1>${title}${subtitle}</h1>`;
		return html`
			<div class="title">
				<slot name="title">${heading}</slot>
			</div>
		`;
	}

}
customElements.define('d2l-page-header-immersive', PageHeaderImmersive);
