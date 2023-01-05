import '../colors/colors.js';
import '../icons/icon-custom.js';
import '../expand-collapse/expand-collapse-content.js';
import { css, html, LitElement } from 'lit';
import { heading1Styles, heading2Styles, heading3Styles, heading4Styles } from '../typography/styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

const normalizeHeadingNumber = (number) => {
	number = parseInt(number);
	if (number < 1) { return 1; }
	if (number > 4) { return 4; }
	return number;
};

const defaultHeading = 3;

/**
 * A container with a title that can be expanded/collapsed to show/hide content.
 * @slot header - Slot for supporting header content
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
			panelTitle: { attribute: 'panel-title', type: String, reflect: true },
			/**
			 * The semantic heading level (h1-h4)
			 * @type {'1'|'2'|'3'|'4'}
			 * @default "3"
			 */
			headingLevel: { attribute: 'heading-level', type: String, reflect: true },
			/**
			 * The heading style to use
			 * @type {'1'|'2'|'3'|'4'}
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
			 * Horizontal padding of the panel
			 * @type {'default'|'large'}
			 * @default "default"
			 */
			padding: { type: String, reflect: true },
			_focused: { state: true },
			_hasSummary: { state: true },
			_isScrolled: { state: true },
		};
	}

	static get styles() {
		return [heading1Styles, heading2Styles, heading3Styles, heading4Styles, offscreenStyles, css`
			:host {
				--d2l-collapsible-panel-focus-outline: solid 2px var(--d2l-color-celestine);
				--d2l-collapsible-panel-spacing-inline: 0.9rem;
				--d2l-collapsible-panel-header-spacing: 0.6rem;
				--d2l-collapsible-panel-transition-time: 0.2s;
				--d2l-collapsible-panel-arrow-time: 0.5s;
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			:host([padding="large"][type="inline"]) {
				--d2l-collapsible-panel-spacing-inline: 2rem;
			}
			.d2l-collapsible-panel {
				border: 1px solid var(--d2l-color-mica);
				border-radius: 0.4rem;
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
				border-left: none;
				border-radius: 0;
				border-right: none;
			}
			:host([heading-style="1"]) {
				--d2l-collapsible-panel-header-spacing: 1.2rem;
			}
			:host([heading-style="4"]) {
				--d2l-collapsible-panel-header-spacing: 0.3rem;
			}
			.d2l-collapsible-panel-header {
				border-radius: 0.4rem;
				cursor: pointer;
				padding: var(--d2l-collapsible-panel-header-spacing) 0;
			}
			.d2l-collapsible-panel.scrolled .d2l-collapsible-panel-header {
				background-color: white;
				box-shadow: 0 8px 12px -9px rgba(0, 0, 0, 0.3);
				position: sticky;
				top: 0;
			}
			.d2l-collapsible-panel.focused.scrolled .d2l-collapsible-panel-header {
				top: 2px;
			}
			.d2l-collapsible-panel-title {
				flex: 1;
				margin: 0.3rem;
				margin-inline-start: var(--d2l-collapsible-panel-spacing-inline);
				user-select: none;
			}
			.d2l-collapsible-panel.focused {
				outline: var(--d2l-collapsible-panel-focus-outline);
			}
			:host([expanded]) .d2l-collapsible-panel.focused .d2l-collapsible-panel-header {
				outline: var(--d2l-collapsible-panel-focus-outline);
			}
			:host([expanded]) .d2l-collapsible-panel {
				outline: none;
			}
			.d2l-collapsible-panel-header-primary {
				align-items: center;
				display: flex;
				justify-content: space-between;
			}
			.d2l-collapsible-panel-header-secondary {
				display: flex;
				margin-inline-start: var(--d2l-collapsible-panel-spacing-inline);
			}
			.d2l-collapsible-panel-header-secondary ::slotted(*) {
				cursor: default;
			}
			.d2l-collapsible-panel-header-actions {
				display: flex;
				gap: 0.3rem;
			}
			.d2l-collapsible-panel-header-actions::after {
				border-inline-end: 1px solid var(--d2l-color-mica);
				content: '';
				display: flex;
				margin: 0.3rem;
			}
			.d2l-collapsible-panel-opener {
				margin-inline-end: var(--d2l-collapsible-panel-spacing-inline);
			}
			.d2l-collapsible-panel-opener > d2l-icon-custom {
				height: 0.9rem;
				margin: 0.6rem;
				margin-inline-end: 0;
				position: relative;
				width: 0.9rem;
			}
			.d2l-collapsible-panel-opener > d2l-icon-custom svg {
				position: absolute;
				transform-origin: 0.4rem;
			}
			:host([expanded]) .d2l-collapsible-panel-opener > d2l-icon-custom svg {
				fill: var(--d2l-color-tungsten);
				transform: rotate(90deg);
			}
			@media (prefers-reduced-motion: no-preference) {
				.d2l-collapsible-panel-divider {
					transition: opacity var(--d2l-collapsible-panel-transition-time) ease-in-out;
				}
				.d2l-collapsible-panel-opener > d2l-icon-custom svg {
					animation: d2l-collapsible-panel-opener-close var(--d2l-collapsible-panel-arrow-time) ease-in-out;
				}
				:host([expanded]) .d2l-collapsible-panel-opener > d2l-icon-custom svg {
					animation: d2l-collapsible-panel-opener-open var(--d2l-collapsible-panel-arrow-time) ease-in-out;
				}
				/* stylelint-disable order/properties-alphabetical-order */
				@keyframes d2l-collapsible-panel-opener-open {
					0% { transform: rotate(0deg); }
					25% { transform: rotate(105deg); animation-timing-function: ease-in-out; }
					50% { transform: rotate(82deg); animation-timing-function: ease-in-out; }
					75% { transform: rotate(93deg); animation-timing-function: ease-in-out; }
					100% { transform: rotate(90deg); animation-timing-function: ease-in-out; }
				}
				@keyframes d2l-collapsible-panel-opener-close {
					0% { transform: rotate(90deg); }
					25% { transform: rotate(-15deg); animation-timing-function: ease-in-out; }
					50% { transform: rotate(8deg); animation-timing-function: ease-in-out; }
					75% { transform: rotate(-3deg); animation-timing-function: ease-in-out; }
					100% { transform: rotate(0deg); animation-timing-function: ease-in-out; }
				}
				/* stylelint-enable */
			}
			.d2l-collapsible-panel-divider {
				border-bottom: 1px solid var(--d2l-color-mica);
				margin-inline: var(--d2l-collapsible-panel-spacing-inline);
				opacity: 1;
			}
			:host([type=inline]) .d2l-collapsible-panel-divider {
				opacity: 0;
			}
			:host(:not([expanded])) .d2l-collapsible-panel:not(.has-summary) .d2l-collapsible-panel-divider {
				opacity: 0;
			}
			.d2l-collapsible-panel-summary,
			.d2l-collapsible-panel-content {
				padding: 0.9rem var(--d2l-collapsible-panel-spacing-inline);
			}
			:host([type=inline]) .d2l-collapsible-panel-summary,
			:host([type=inline]) .d2l-collapsible-panel-content {
				padding-top: 0;
			}
			:host([type="inline"]) .d2l-collapsible-panel-summary {
				margin-top: -0.3rem;
			}
			.d2l-collapsible-panel:not(.has-summary) .d2l-collapsible-panel-summary {
				display: none;
			}
		`];
	}

	constructor() {
		super();
		this.expanded = false;
		this.headingLevel = defaultHeading;
		this.headingStyle = defaultHeading;
		this.padding = 'default';
		this.type = 'default';
		this._focused = false;
		this._hasSummary = false;
		this._isScrolled = false;
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
				this._isScrolled = !entry.isIntersecting;
			});
			this._intersectionObserver.observe(this.shadowRoot.querySelector('.d2l-collapsible-panel-top-sentinel'));
		}
	}

	render() {
		const classes = {
			'd2l-collapsible-panel': true,
			'focused': this._focused,
			'has-summary': this._hasSummary,
			'scrolled': this._isScrolled,
		};
		const expandCollapseLabel = this.expandCollapseLabel || this.panelTitle;

		return html`
			<button
				aria-expanded="${this.expanded}"
				class="d2l-offscreen"
				type="button"
				@click="${this._toggleExpand}"
				@focus="${this._onFocus}"
				@blur="${this._onBlur}"
			>${expandCollapseLabel}</button>
			<div class="${classMap(classes)}" @click="${this._handlePanelClick}">
				<div class="d2l-collapsible-panel-top-sentinel"></div>
				${this._renderHeader()}
				<d2l-expand-collapse-content
					?expanded="${this.expanded}"
					@d2l-expand-collapse-content-collapse="${this._handleExpandCollapse}"
					@d2l-expand-collapse-content-expand="${this._handleExpandCollapse}"
				>
					<div class="d2l-collapsible-panel-content">
						<slot></slot>
					</div>
				</d2l-expand-collapse-content>
				<d2l-expand-collapse-content ?expanded="${!this.expanded}">
					<div class="d2l-collapsible-panel-summary">
						<slot name="summary" @slotchange="${this._handleSummarySlotChange}"></slot>
					</div>
				</d2l-expand-collapse-content>
			</div>
		`;
	}

	updated(changedProperties) {
		if (changedProperties.has('expanded')) {
			if (!this.expanded) {
				this._isScrolled = false;
			}
		}
	}

	_handleActionsClick(e) {
		const actions = this.shadowRoot.querySelector('.d2l-collapsible-panel-header-actions');
		if (e.target !== actions) {
			e.stopPropagation();
		}
	}

	_handleExpandCollapse(e) {
		const eventPromise = this.expanded ? e.detail.expandComplete : e.detail.collapseComplete;
		const event = `d2l-collapsible-panel-${this.expanded ? 'expand' : 'collapse' }`;

		this.dispatchEvent(new CustomEvent(
			event, { bubbles: false, composed: false, detail: { complete: eventPromise } }
		));
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

	_handleSummarySlotChange(e) {
		const content = e.target.assignedNodes({ flatten: true });
		this._hasSummary = content?.length > 0;
	}

	_onBlur() {
		this._focused = false;
	}

	_onFocus() {
		this._focused = true;
	}

	_renderHeader() {
		return html`
			<div class="d2l-collapsible-panel-header" @click="${this._handleHeaderClick}">
				<div class="d2l-collapsible-panel-header-primary">
					${this._renderPanelTitle()}
					<div class="d2l-collapsible-panel-header-actions" @click="${this._handleActionsClick}">
						<slot name="actions"></slot>
					</div>
					<div class="d2l-collapsible-panel-opener">
						<d2l-icon-custom size="tier1">
							<svg xmlns="http://www.w3.org/2000/svg" width="10" height="18" fill="none" viewBox="0 0 10 18">
								<path stroke="var(--d2l-color-tungsten)" stroke-linejoin="round" stroke-width="2" d="m9 9-8 8V1l8 8Z"/>
							</svg>
						</d2l-icon-custom>
					</div>
				</div>
				<div class="d2l-collapsible-panel-header-secondary" @click="${this._handleHeaderSecondaryClick}">
					<slot name="header"></slot>
				</div>
			</div>
			<div class="d2l-collapsible-panel-divider"></div>
		`;
	}

	_renderPanelTitle() {
		let headingStyle = (this.headingStyle === defaultHeading && this.headingLevel !== this.headingStyle) ? this.headingLevel : this.headingStyle;
		headingStyle = normalizeHeadingNumber(headingStyle);

		const titleClasses = {
			'd2l-collapsible-panel-title': true,
			[`d2l-heading-${headingStyle}`]: true,
		};

		const headingLevel = normalizeHeadingNumber(this.headingLevel);
		switch (headingLevel) {
			case 1: return html`<h1 class="${classMap(titleClasses)}">${this.panelTitle}</h1>`;
			case 2: return html`<h2 class="${classMap(titleClasses)}">${this.panelTitle}</h2>`;
			case 3: return html`<h3 class="${classMap(titleClasses)}">${this.panelTitle}</h3>`;
			case 4: return html`<h4 class="${classMap(titleClasses)}">${this.panelTitle}</h4>`;
		}
	}

	_toggleExpand() {
		this.expanded = !this.expanded;
	}
}

customElements.define('d2l-collapsible-panel', CollapsiblePanel);
