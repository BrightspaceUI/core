import '../button/button.js';
import '../colors/colors.js';
import '../icons/icon.js';
import '../icons/icon-custom.js';
import '../offscreen/offscreen.js';
import '../expand-collapse/expand-collapse-content.js';
import { css, html, LitElement } from 'lit';
import { heading1Styles, heading2Styles, heading3Styles, heading4Styles } from '../typography/styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

const defaultHeading = 3;

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
			 * Whether or not the content should extend the full width.
			 * This is only valid when using the "inline" panel style.
			 * @type {boolean}
			 */
			fullWidth: { attribute: 'full-width', type: Boolean, reflect: true },
		};
	}

	static get styles() {
		return [heading1Styles, heading2Styles, heading3Styles, heading4Styles, css`
			:host {
				--d2l-collapsible-panel-focus-outline: solid 2px var(--d2l-color-celestine);
				--d2l-collapsible-panel-spacing-inline: 0.9rem;
				--d2l-collapsible-panel-header-spacing: 0.6rem;
				--d2l-collapsible-panel-transition-time: 0.2s;
				--d2l-expand-collapse-content-timing-function: ease-in-out;
				--d2l-expand-collapse-content-transition-duration: 0.2s;
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
			:host([heading-style="1"]) {
				--d2l-collapsible-panel-header-spacing: 1.2rem;
			}
			:host([heading-style="4"]) {
				--d2l-collapsible-panel-header-spacing: 0.3rem;
			}
			:host([type=inline][full-width]) {
				--d2l-collapsible-panel-spacing-inline: 0;
			}
			.d2l-collapsible-panel-header {
				border-radius: 8px;
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
				margin: 0;
				margin-inline: var(--d2l-collapsible-panel-spacing-inline) 0.3rem;
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
			}
			.d2l-collapsible-panel-header-actions::after {
				border-inline-end: 1px solid var(--d2l-color-mica);
				content: '';
				display: flex;
				margin: 0.3rem;
			}
			.d2l-collapsible-panel-opener {
				margin-inline-end: 0.3rem;
			}
			.d2l-collapsible-panel-opener > d2l-icon-custom {
				margin: 0.6rem;
				transform-origin: center;
			}
			.d2l-collapsible-panel-opener > d2l-icon-custom svg {
				fill: transparent;
			}
			:host([expanded]) .d2l-collapsible-panel-opener > d2l-icon-custom svg {
				fill: var(--d2l-color-tungsten);
			}
			@media (prefers-reduced-motion: no-preference) {
				.d2l-collapsible-panel-opener > d2l-icon-custom {
					animation: d2l-collapsible-panel-opener-close var(--d2l-collapsible-panel-transition-time) ease-in-out;
				}
				:host([expanded]) .d2l-collapsible-panel-opener > d2l-icon-custom {
					animation: d2l-collapsible-panel-opener-open var(--d2l-collapsible-panel-transition-time) ease-in-out;
				}
				.d2l-collapsible-panel-opener > d2l-icon-custom svg {
					transition: fill var(--d2l-collapsible-panel-transition-time) ease-in-out;
				}
				@keyframes d2l-collapsible-panel-opener-open {
					0% { transform: rotate(0deg); }
					60% { transform: rotate(90deg); }
					70% { transform: rotate(100deg); }
					100% { transform: rotate(90deg); }
				}
				@keyframes d2l-collapsible-panel-opener-close {
					0% { transform: rotate(90deg); }
					60% { transform: rotate(0deg); }
					70% { transform: rotate(-10deg); }
					100% { transform: rotate(0deg); }
				}
			}
			:host([expanded]) .d2l-collapsible-panel-opener > d2l-icon-custom {
				transform: rotate(90deg);
			}
			.d2l-collapsible-panel-divider {
				border-bottom: 1px solid var(--d2l-color-mica);
				margin-inline: var(--d2l-collapsible-panel-spacing-inline);
				opacity: 1;
				transition: opacity var(--d2l-collapsible-panel-transition-time) ease-in-out;
			}
			:host([type=inline]) .d2l-collapsible-panel-divider {
				opacity: 0;
			}
			:host(:not([expanded])) .d2l-collapsible-panel:not(.has-summary) .d2l-collapsible-panel-divider {
				opacity: 0;
			}
			d2l-expand-collapse-content {
				opacity: 0;
				transition: opacity var(--d2l-collapsible-panel-transition-time) ease-in-out;
			}
			d2l-expand-collapse-content[expanded] {
				opacity: 1;
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
		this.fullWidth = false;
		this.headingLevel = defaultHeading;
		this.headingStyle = defaultHeading;
		this.type = 'default';
	}

	connectedCallback() {
		super.connectedCallback();

		if (!this.expandCollapseLabel) {
			this.expandCollapseLabel = this.title;
		}

		if (this.headingStyle === defaultHeading && this.headingLevel !== this.headingStyle) {
			this.headingStyle = this.headingLevel;
		}
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
				const element = this.shadowRoot.querySelector('.d2l-collapsible-panel');
				if (entry.isIntersecting) {
					element.classList.remove('scrolled');
				} else {
					element.classList.add('scrolled');
				}
			});
			this._intersectionObserver.observe(this.shadowRoot.querySelector('.d2l-collapsible-panel-top-sentinel'));
		}
	}

	render() {
		return html`
			<d2l-offscreen>
				<button
					aria-label="${this.expandCollapseLabel}"
					aria-expanded="${this.expanded}"
					type="button"
					@click="${this._toggleExpand}"
					@focus="${this._onFocus}"
					@blur="${this._onBlur}"
				></button>
			</d2l-offscreen>
			<div class="d2l-collapsible-panel" @click="${this._handlePanelClick}">
				<div class="d2l-collapsible-panel-top-sentinel"></div>
				${this._renderHeader()}
				<d2l-expand-collapse-content ?expanded="${this.expanded}">
					<div class="d2l-collapsible-panel-content">
						<slot name="content"></slot>
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
		const element = this.shadowRoot.querySelector('.d2l-collapsible-panel');
		element.classList.add('has-summary');
	}

	_onBlur() {
		const element = this.shadowRoot.querySelector('.d2l-collapsible-panel');
		element.classList.remove('focused');
	}

	_onFocus() {
		const element = this.shadowRoot.querySelector('.d2l-collapsible-panel');
		element.classList.add('focused');
	}

	_renderHeader() {
		return html`
			<div class="d2l-collapsible-panel-header" @click="${this._handleHeaderClick}">
				<div class="d2l-collapsible-panel-header-primary">
					${this._renderHeading()}
					<div class="d2l-collapsible-panel-header-actions" @click="${this._handleActionsClick}">
						<slot name="actions" @slotchange="${this._handleActionsSlotChange}"></slot>
					</div>
					<div class="d2l-collapsible-panel-opener">
						<d2l-icon-custom size="tier1">
							<svg xmlns="http://www.w3.org/2000/svg" width="10" height="18" fill="none" viewBox="0 0 10 18">
								<path stroke="#494c4e" stroke-linejoin="round" stroke-width="2" d="m9 9-8 8V1l8 8Z"/>
							</svg>
						</d2l-icon-custom>
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
			[`d2l-heading-${this.headingStyle}`]: true,
		};

		const headingLevel = parseInt(this.headingLevel);
		if (headingLevel === 1) {
			return html`<h1 class="${classMap(titleClasses)}">${this.title}</h1>`;
		}
		if (headingLevel === 2) {
			return html`<h2 class="${classMap(titleClasses)}">${this.title}</h2>`;
		}
		if (headingLevel === 3) {
			return html`<h3 class="${classMap(titleClasses)}">${this.title}</h3>`;
		}
		if (headingLevel === 4) {
			return html`<h4 class="${classMap(titleClasses)}">${this.title}</h4>`;
		}
	}

	_toggleExpand() {
		this.expanded = !this.expanded;

		if (!this.expanded) {
			const element = this.shadowRoot.querySelector('.d2l-collapsible-panel');
			element.classList.remove('scrolled');
		}

		const event = `d2l-collapsible-panel-${this.expanded ? 'expand' : 'collapse' }`;

		this.dispatchEvent(new CustomEvent(
			event, { bubbles: false, composed: false }
		));
	}
}

customElements.define('d2l-collapsible-panel', CollapsiblePanel);
