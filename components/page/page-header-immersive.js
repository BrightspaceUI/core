import '../alert/alert.js';
import '../colors/colors.js';
import '../icons/icon.js';
import './page-header-custom.js';
import { bodyCompactStyles, heading3Styles, labelStyles } from '../typography/styles.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { css, html, LitElement } from 'lit';
import { highlightBorderStyles, highlightLinkStyles } from './page-header-styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { overflowEllipsisDeclarations } from '../../helpers/overflow.js';
import { RequesterMixin } from '../../mixins/provider/provider-mixin.js';

const CONTAINER_GAP = 24;
const MINIMUM_TITLE_WIDTH = 100;

class PageHeaderImmersive extends RequesterMixin(LocalizeCoreElement(LitElement)) {

	static properties = {
		backHref: { attribute: 'back-href', type: String },
		backCustomText: { attribute: 'back-custom-text', type: String },
		titleText: { attribute: 'title-text', type: String },
		subtitleText: { attribute: 'subtitle-text', type: String },
		_error: { state: true },
		_hasActions: { state: true },
		_hasTitleSlot: { state: true },
		_titleHidden: { state: true }
	};

	static styles = [bodyCompactStyles, heading3Styles, labelStyles, highlightBorderStyles, highlightLinkStyles, offscreenStyles, css`
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
			gap: ${CONTAINER_GAP}px;
			height: 3.1rem;
		}
		.title {
			flex: 0 1 auto;
			min-width: 0;
			width: 100%;
		}
		.title-wrapper {
			height: 100%;
		}
		.back,
		.actions {
			flex: 0 0 auto;
		}
		.title,
		.actions.has-title {
			border-inline-start: 1px solid var(--d2l-color-gypsum);
		}
		.title.has-title,
		.actions.has-title {
			padding-inline-start: ${CONTAINER_GAP}px;
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
		@media (max-width: 360px) {
			.back-text-short {
				display: none;
			}
		}
		d2l-alert {
			margin: 10px auto;
		}
		.title-text {
			${overflowEllipsisDeclarations}
		}
	`];

	constructor() {
		super();
		this._error = false;
		this._hasActions = false;
		this._hasTitleSlot = false;
		this._titleHidden = false;
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

	disconnectedCallback() {
		super.disconnectedCallback();
		this.#resizeObserver.disconnect();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		if (this.#refTitle.value !== undefined) {
			this.#resizeObserver.observe(this.#refTitle.value);
		}
	}

	render() {
		if (this._error) return this.#renderError();
		const actionsClasses = {
			'actions': true,
			'has-title': this.#hasVisibleTitle()
		};
		return html`
			<d2l-page-header-custom>
				<div class="container" slot="top">
					${this.#renderBack()}
					${this.#renderTitle()}
					<div class="${classMap(actionsClasses)}" ?hidden="${!this._hasActions}">
						<slot name="actions" @slotchange="${this.#handleActionsSlotChange}"></slot>
					</div>
				</div>
			</d2l-page-header-custom>
		`;
	}

	#refTitle = createRef();
	#resizeObserver = new ResizeObserver((entries) => this.#updateSizes(entries));

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

	#handleTitleSlotChange(e) {
		this._hasTitleSlot = e.target.assignedNodes({ flatten: true })?.length > 0;
	}

	#hasTitle() {
		return this._hasTitleSlot || this.titleText || this.subtitleText;
	}

	#hasVisibleTitle() {
		return !this._titleHidden && this.#hasTitle();
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
		const titleClasses = {
			'title': true,
			'has-title': this.#hasVisibleTitle()
		};
		const wrapperClasses = {
			'title-wrapper': true,
			'd2l-offscreen': this._titleHidden
		};
		return html`
			<div class="${classMap(titleClasses)}" ${ref(this.#refTitle)}>
				<div class="${classMap(wrapperClasses)}">
					<slot name="title" @slotchange="${this.#handleTitleSlotChange}">${heading}</slot>
				</div>
			</div>
		`;
	}

	#updateSizes(entries) {
		entries.forEach(entry => {
			if (entry.target === this.#refTitle.value) {
				if (this.#hasTitle()) {
					if (this._titleHidden) {
						const extraSpace = this._hasActions ? (CONTAINER_GAP * 2 + 1) : (CONTAINER_GAP + 1);
						this._titleHidden = entry.contentRect.width - extraSpace < MINIMUM_TITLE_WIDTH;
					} else {
						this._titleHidden = entry.contentRect.width < MINIMUM_TITLE_WIDTH;
					}
				}
			}
		});
	}

}
customElements.define('d2l-page-header-immersive', PageHeaderImmersive);
