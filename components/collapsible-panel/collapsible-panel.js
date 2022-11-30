import '../colors/colors.js';
import '../icons/icon.js';
import { css, html, LitElement } from 'lit';
import { heading1Styles, heading2Styles, heading3Styles, heading4Styles } from '../typography/styles.js';
import { hide, show } from '../../directives/animate/animate.js';
import { classMap } from 'lit/directives/class-map.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

// TODO: should we export/share this? I stole this from calendar
const keyCodes = {
	ENTER: 13,
	SPACE: 32,
};

/**
 * A container with a title that can be expanded/collapsed to show/hide content.
 * @slot header - Slot for header content, such as course image (no actionable elements)
 * @slot summary - Slot for the summary of the expanded content. Only accepts `d2l-collapsible-panel-summary-item`
 * @slot default - Slot for the expanded content
 * @slot actions - Slot for buttons and dropdown openers to be placed in top right corner of header
 * @fires d2l-collapsible-panel-expand - Dispatched when the panel is expanded
 * @fires d2l-collapsible-panel-collapse - Dispatched when the panel is collapsed
 */
class CollapsiblePanel extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * REQUIRED: The title of the panel
			 * @type {string}
			 */
			title: { type: String },
			/**
			 * The semantic heading level (h1-h5)
			 * @type {'1'|'2'|'3'|'4'|'5'}
			 * @default "3"
			 */
			headingLevel: { attribute: 'heading-level', type: String, reflect: true },
			/**
			 * The heading style to use
			 * @type {'1'|'2'|'3'|'4'|'5'}
			 * @default "3"
			 */
			headingStyle: { attribute: 'heading-style', type: String, reflect: true },
			/**
			 * Whether or not the panel is expanded
			 * @type {boolean}
			 */
			expanded: { type: Boolean, reflect: true },
			/**
			 * REQUIRED: Label describing the contents of the header.
			 * Used for screen readers.
			 * @type {string}
			 */
			expandCollapseLabel: { attribute: 'expand-collapse-label', type: String, reflect: true },
			/**
			 * Type of collapsible panel
			 * @type {'default'|'subtle'|'inline'}
			 * @default "default"
			 */
			type: { type: String, reflect: true },
			/**
			 * Whether or not the content should extend the full width.
			 * This is only valid when using the "inline" panel style.
			 * @type {boolean}
			 */
			fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
			_hasSummary: { type: Boolean, reflect: true },
			_scrolled: { type: Boolean, reflect: true }
		};
	}

	static get styles() {
		return [heading1Styles, heading2Styles, heading3Styles, heading4Styles, css`
			:host {
				display: block;
			}
			.d2l-collapsible-panel {
				border: 1px solid var(--d2l-color-mica);
				border-radius: 0.3rem;
				display: block;
			}
			:host(:not([expanded])) .d2l-collapsible-panel {
				cursor: pointer;
			}
			:host([type=subtle]) .d2l-collapsible-panel {
				background-color: white;
				border: none;
				box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.03);
			}
			:host([type=inline]) .d2l-collapsible-panel {
				border: none;
				border-bottom: 1px solid var(--d2l-color-mica);
				border-radius: 0;
				border-top: 1px solid var(--d2l-color-mica);
			}
			:host([type=inline]) .d2l-collapsible-panel-divider {
				display: none;
			}
			.d2l-collapsible-panel-header {
				cursor: pointer;
				padding: 0.6rem 0;
			}
			:host(:not([expanded])[_hasSummary][type=inline]) .d2l-collapsible-panel-header {
				padding-bottom: 0;
			}
			:host(:not([_hasSummary])) .d2l-collapsible-panel-header {
				padding-bottom: 0.6rem;
			}
			:host(:not([_hasSummary])[type=inline]) .d2l-collapsible-panel-header {
				padding-bottom: 0.6rem;
			}
			:host([type=inline][full-width]) .d2l-collapsible-panel-title {
				margin-inline-start: 0;
			}
			:host([_scrolled]) .d2l-collapsible-panel-header {
				background-color: white;
				border-radius: 8px; /* TODO: not sure */
				box-shadow: 0 8px 12px -9px rgba(0, 0, 0, 0.3);
				position: sticky;
				top: 0;
			}
			/* TODO: Might not be necessary -- this allows the focus ring to be fully visible on a sticky header */
			:host([_scrolled]) .d2l-collapsible-panel-header:focus-visible {
				top: 2px;
			}
			.d2l-collapsible-panel-header-secondary ::slotted(*) {
				cursor: default;
			}
			:host(:not([_hasSummary]):not([expanded])) .d2l-collapsible-panel-divider {
				border: none;
			}
			:host(:not([_hasSummary]):not([expanded])) .d2l-collapsible-panel-body,
			:host(:not([_hasSummary]):not([expanded])) .d2l-collapsible-panel-summary {
				padding: 0;
			}
			:host(:not([_hasSummary])) .d2l-collapsible-panel-summary {
				margin: 0;
			}
			:host([type=inline][full-width]) .d2l-collapsible-panel-body {
				padding-inline: 0;
			}
			:host([type=inline]) .d2l-collapsible-panel-body {
				padding-top: 0;
			}
			.d2l-collapsible-panel-header:focus-visible {
				border-radius: 8px;
				outline: solid 2px var(--d2l-color-celestine);
			}
			.d2l-collapsible-panel-opener {
				transition: transform 0.2s ease-out;
  				transform-origin: center;
				position: relative;
				/* stolen from d2l-button-icon */
				min-height: calc(2rem + 2px);
    			min-width: calc(2rem + 2px);
			}
			.d2l-collapsible-panel-opener .expand {
				opacity: 1;
			}
			.d2l-collapsible-panel-opener .collapse {
				opacity: 0;
				transform: rotate(-90deg);
				transform-origin: center;
			}
			:host([expanded]) .d2l-collapsible-panel-opener .expand {
				opacity: 0;
			}
			:host([expanded]) .d2l-collapsible-panel-opener .collapse {
				opacity: 1;
			}
			.d2l-collapsible-panel-opener > * {
				transition: opacity 0.2s ease-in-out;
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
			}
			:host([expanded]) .d2l-collapsible-panel-opener {
				transform: rotate(90deg);
			}
			:host([heading-style="4"]) .d2l-collapsible-panel-header {
				padding: 0.45rem 0 0.15rem;
			}
			.d2l-collapsible-panel-title {
				flex: 1;
				margin: 0;
				margin-inline: 0.9rem 0.3rem;
			}
			.d2l-collapsible-panel-header-secondary {
				display: flex;
				margin-inline-start: 0.9rem;
			}
			.d2l-collapsible-panel-header .actions {
				display: block;
				margin-inline-end: 0.3rem;
			}
			/* TODO: better way of spacing */
			/* .d2l-collapsible-panel-header d2l-button-icon {
				margin-inline-end: 0.3rem;
			} */
			.d2l-collapsible-panel-divider {
				border-bottom: 1px solid var(--d2l-color-mica);
				margin-inline: 0.9rem;
			}
			.d2l-collapsible-panel-header-primary {
				align-items: center;
				display: flex;
				justify-content: space-between;
			}
			.d2l-collapsible-panel-body {
				padding: 0.9rem;
			}
			.d2l-collapsible-panel-content,
			.d2l-collapsible-panel-summary {
				margin-top: 0.6rem;
			}
		`];
	}

	constructor() {
		super();
		this.headingLevel = undefined;
		this.expanded = false;
		this._hasSummary = false;
		this.type = 'default';
		this.fullWidth = false;
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this._intersectionObserver) this._intersectionObserver.disconnect();
	}

	firstUpdated() {
		if (typeof(IntersectionObserver) === 'function') {
			this._intersectionObserver = new IntersectionObserver(entries => {
				if (!this.expanded) return;

				const entry = entries[0];
				this._scrolled = !entry.isIntersecting;
			});
			this._intersectionObserver.observe(this.shadowRoot.querySelector('.d2l-collapsible-panel-top-sentinel'));
		}
	}

	render() {
		return html`
			<div class="d2l-collapsible-panel" @click="${this._handlePanelClick}">
				<div class="d2l-collapsible-panel-top-sentinel"></div>
				${this._renderHeader()}
					<div class="d2l-collapsible-panel-body">
						<div
							class="d2l-collapsible-panel-content"
							?hidden="${!this.expanded}"
							.animate="${ this.expanded ? show() : hide()}"
						>
							<slot name="content"></slot>
						</div>
						<div
							class="d2l-collapsible-panel-summary"
							?hidden="${this.expanded}"
							.animate="${ !this.expanded ? show() : hide()}"
						>
							<slot name="summary" @slotchange="${this._handleSummarySlotChange}"></slot>
						</div>
					</div>
			</div>
		`;
	}

	_handleActionsClick(e) {
		const actions = this.shadowRoot.querySelector('.d2l-collapsible-panel-header-actions');
		if (e.target !== actions) {
			e.stopPropagation();
		}
	}

	_handleHeaderClick(e) {
		if (this.expanded) {
			this._toggleExpand();
			e.stopPropagation();
		}
	}

	_handleHeaderSecondaryClick(e) {
		const header = this.shadowRoot.querySelector('.d2l-collapsible-panel-header-secondary');
		if (e.target !== header) {
			e.stopPropagation();
		}
	}

	_handlePanelClick(e) {
		if (!this.expanded) {
			this._toggleExpand();
			e.stopPropagation();
		}
	}

	_handleSummarySlotChange() {
		this._hasSummary = true;
	}

	_onKeyDown(e) {
		if (e.target.classList.contains('d2l-collapsible-panel-header') && (e.keyCode === keyCodes.ENTER || e.keyCode === keyCodes.SPACE)) {
			this._toggleExpand();
			e.preventDefault();
		}
	}

	_renderHeader() {
		const icon = 'tier1:arrow-expand';
		// const icon = `tier1:arrow-${this.expanded ? 'collapse' : 'expand'}`;

		return html`
			<div class="d2l-collapsible-panel-header" @click="${this._handleHeaderClick}" @keydown="${this._onKeyDown}" tabindex="0">
				<div class="d2l-collapsible-panel-header-primary">
					${this._renderHeading()}
					<div class="d2l-collapsible-panel-header-actions" @click="${this._handleActionsClick}">
						<slot name="actions" @slotchange="${this._handleActionsSlotChange}"></slot>
					</div>
					<div class="d2l-collapsible-panel-opener">
						<d2l-button-icon class="expand" icon="${icon}" tabindex="-1"></d2l-button-icon>
						<d2l-button-icon class="collapse" icon="tier1:arrow-collapse" tabindex="-1"></d2l-button-icon>
					</div>
				</div>
				<div class="d2l-collapsible-panel-header-secondary" @click="${this._handleHeaderSecondaryClick}">
					<slot name="header" @slotchange="${this._handleHeaderSlotChange}"></slot>
				</div>
			</div>
			<div class="d2l-collapsible-panel-divider"></div>
		`;
	}

	_renderHeading() {
		const titleClasses = {
			'd2l-collapsible-panel-title': true,
			[`d2l-heading-${this.headingLevel}`]: true,
		};

		if (!this.headingStyle) {
			return html`<h3 class="${classMap(titleClasses)}">${this.title}</h3>`;
		}

		if (this.headingLevel === 1) {
			return html`<h1 class="${classMap(titleClasses)}">${this.title}</h1>`;
		}
		if (this.headingLevel === 2) {
			return html`<h2 class="${classMap(titleClasses)}">${this.title}</h2>`;
		}
		if (this.headingLevel === 3) {
			return html`<h3 class="${classMap(titleClasses)}">${this.title}</h3>`;
		}
		if (this.headingLevel === 4) {
			return html`<h4 class="${classMap(titleClasses)}">${this.title}</h4>`;
		}
	}

	_toggleExpand() {
		const event = `d2l-collapsible-panel-${this.expanded ? 'collapse' : 'expand' }`;

		this.dispatchEvent(new CustomEvent(
			event, { bubbles: false, composed: false }
		));

		this.expanded = !this.expanded;

		if (!this.expanded) {
			this._scrolled = false;
		}
	}
}

customElements.define('d2l-collapsible-panel', CollapsiblePanel);
