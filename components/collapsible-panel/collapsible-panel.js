import '../colors/colors.js';
import '../icons/icon-custom.js';
import '../expand-collapse/expand-collapse-content.js';
import { css, html, LitElement } from 'lit';
import { heading1Styles, heading2Styles, heading3Styles, heading4Styles } from '../typography/styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { EventSubscriberController } from '../../controllers/subscriber/subscriberControllers.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getComposedActiveElement } from '../../helpers/focus.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { isComposedAncestor } from '../../helpers/dom.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

const normalizeHeadingStyle = (number) => {
	number = parseInt(number);
	if (number < 1) { return 1; }
	if (number > 4) { return 4; }
	return number;
};

const normalizeHeadingLevel = (number) => {
	number = parseInt(number);
	if (number < 1) { return 1; }
	if (number > 6) { return 6; }
	return number;
};

const defaultHeading = 3;

let tabPressed = false;
let tabListenerAdded = false;
function addTabListener() {
	if (tabListenerAdded) return;
	tabListenerAdded = true;
	document.addEventListener('keydown', e => {
		if (e.keyCode !== 9) return;
		tabPressed = true;
	});
	document.addEventListener('keyup', e => {
		if (e.keyCode !== 9) return;
		tabPressed = false;
	});
}

/**
 * A container with a title that can be expanded/collapsed to show/hide content.
 * @slot before - Slot for content to be placed at the left side of the header, aligned with the title and header slot
 * @slot header - Slot for supporting header content
 * @slot summary - Slot for the summary of the expanded content. Only accepts `d2l-collapsible-panel-summary-item`
 * @slot default - Slot for the expanded content
 * @slot actions - Slot for buttons and dropdown openers to be placed in top right corner of header
 * @fires d2l-collapsible-panel-expand - Dispatched when the panel is expanded
 * @fires d2l-collapsible-panel-collapse - Dispatched when the panel is collapsed
 */
class CollapsiblePanel extends SkeletonMixin(FocusMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * REQUIRED: The title of the panel
			 * @type {string}
			 */
			panelTitle: { attribute: 'panel-title', type: String, reflect: true },
			/**
			 * The semantic heading level (h1-h6)
			 * @type {'1'|'2'|'3'|'4'|'5'|'6'}
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
			 * ACCESSIBILITY: Label describing the contents of the header for screen reader users
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
			paddingType: { attribute: 'padding-type', type: String, reflect: true },
			/**
			 * Disables sticky positioning for the header
			 * @type {boolean}
			 */
			noSticky: { attribute: 'no-sticky', type: Boolean },
			_focused: { state: true },
			_hasBefore: { state: true },
			_hasSummary: { state: true },
			_isLastPanelInGroup: { state: true },
			_scrolled: { state: true },
		};
	}

	static get styles() {
		return [super.styles, heading1Styles, heading2Styles, heading3Styles, heading4Styles, css`
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
			:host([padding-type="large"][type="inline"]) {
				--d2l-collapsible-panel-spacing-inline: 2rem;
			}
			.d2l-collapsible-panel {
				border: 1px solid var(--d2l-color-mica);
				border-radius: 0.4rem;
			}
			:host(:not([expanded]):not([skeleton])) .d2l-collapsible-panel {
				cursor: pointer;
			}
			:host([type="subtle"]) .d2l-collapsible-panel {
				background-color: white;
				border: none;
				box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.03);
			}
			:host([type="inline"]) .d2l-collapsible-panel {
				border-left: none;
				border-radius: 0;
				border-right: none;
				outline-offset: -2px;
			}
			:host([type="inline"]) .d2l-collapsible-panel.no-bottom-border {
				border-bottom: none;
			}
			:host([heading-style="1"]) {
				--d2l-collapsible-panel-header-spacing: 1.2rem;
			}
			:host([heading-style="4"]) {
				--d2l-collapsible-panel-header-spacing: 0.3rem;
			}
			.d2l-collapsible-panel-before {
				grid-row: 1/-1;
			}
			.d2l-collapsible-panel.has-before .d2l-collapsible-panel-before {
				margin: 0.3rem 0;
				margin-inline-start: var(--d2l-collapsible-panel-spacing-inline);
			}
			.d2l-collapsible-panel-header {
				border-radius: 0.4rem;
				cursor: pointer;
				display: grid;
				grid-template-columns: auto 1fr;
				grid-template-rows: auto auto;
				padding: var(--d2l-collapsible-panel-header-spacing) 0;
			}
			:host(:not([skeleton])) .d2l-collapsible-panel-header {
				cursor: pointer;
			}
			:host([type="inline"]) .d2l-collapsible-panel-header {
				border-radius: 0;
				outline-offset: -2px;
			}
			.d2l-collapsible-panel.scrolled .d2l-collapsible-panel-header {
				background-color: white;
				box-shadow: 0 8px 12px -9px rgba(0, 0, 0, 0.3);
				position: sticky;
				top: 0;
				z-index: 11; /* must be greater greater than list-items with open dropdowns or tooltips */
			}
			.d2l-collapsible-panel.focused.scrolled .d2l-collapsible-panel-header {
				top: 2px;
			}
			.d2l-collapsible-panel-title {
				flex: 1;
				margin: 0.3rem;
				margin-inline-start: var(--d2l-collapsible-panel-spacing-inline);
				overflow-wrap: anywhere;
				user-select: none;
			}
			.d2l-collapsible-panel.has-before .d2l-collapsible-panel-title {
				margin-inline-start: 0.75rem;
			}

			.d2l-collapsible-panel.focused,
			:host([expanded]) .d2l-collapsible-panel.focused .d2l-collapsible-panel-header {
				outline: var(--d2l-collapsible-panel-focus-outline);
			}
			@supports selector(:has(a, b)) {
				.d2l-collapsible-panel.focused,
				:host([expanded]) .d2l-collapsible-panel.focused .d2l-collapsible-panel-header {
					outline: none;
				}
				.d2l-collapsible-panel.focused:has(:focus-visible),
				:host([expanded]) .d2l-collapsible-panel.focused:has(:focus-visible) .d2l-collapsible-panel-header {
					outline: var(--d2l-collapsible-panel-focus-outline);
				}
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
				margin-inline-end: var(--d2l-collapsible-panel-spacing-inline);
				margin-inline-start: var(--d2l-collapsible-panel-spacing-inline);
			}
			.d2l-collapsible-panel.has-before .d2l-collapsible-panel-header-secondary {
				margin-inline-start: 0.75rem;
			}
			.d2l-collapsible-panel-header-secondary ::slotted(*) {
				cursor: default;
			}
			.d2l-collapsible-panel-header-actions {
				align-self: self-start;
				display: flex;
				gap: 0.3rem;
			}
			.d2l-collapsible-panel-header-actions::after {
				border-inline-end: 1px solid var(--d2l-color-mica);
				content: "";
				display: flex;
				margin: 0.3rem;
			}
			.d2l-collapsible-panel-opener {
				background-color: transparent;
				border: none;
				color: inherit;
				cursor: pointer;
				font-family: inherit;
				font-size: inherit;
				font-weight: inherit;
				letter-spacing: inherit;
				line-height: inherit;
				outline: none;
				padding-block: 0;
				padding-inline: 0;
				text-align: inherit;
			}
			d2l-icon-custom {
				align-self: self-start;
				height: 0.9rem;
				margin: 0.6rem;
				margin-inline-end: var(--d2l-collapsible-panel-spacing-inline);
				position: relative;
				transform: var(--d2l-mirror-transform, ${document.dir === 'rtl' ? css`scale(-1, 1)` : css`none`}); /* stylelint-disable-line @stylistic/string-quotes, @stylistic/function-whitespace-after */
				transform-origin: center;
				width: 0.9rem;
			}
			d2l-icon-custom svg {
				position: absolute;
				transform-origin: 0.4rem;
			}
			:host([expanded]) d2l-icon-custom svg {
				fill: currentColor;
				transform: rotate(90deg);
			}
			@media (prefers-reduced-motion: no-preference) {
				.d2l-collapsible-panel-divider {
					transition: opacity var(--d2l-collapsible-panel-transition-time) ease-in-out;
				}
				d2l-icon-custom svg {
					animation: d2l-collapsible-panel-opener-close var(--d2l-collapsible-panel-arrow-time) ease-in-out;
				}
				:host([expanded]) d2l-icon-custom svg {
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
		this.paddingType = 'default';
		this.type = 'default';
		this.noSticky = false;
		this._focused = false;
		this._group = undefined;
		this._groupSubscription = new EventSubscriberController(this, 'collapsible-panel-group', {
			onSubscribe: (registry) => {
				this._group = registry;
				this._group._updatePanelAttributes();
			}
		});
		this._hasSummary = false;
		this._isLastPanelInGroup = true;
		this._scrolled = false;
	}

	static get focusElementSelector() {
		return '.d2l-collapsible-panel-opener';
	}

	connectedCallback() {
		super.connectedCallback();
		addTabListener();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this._intersectionObserver) this._intersectionObserver.disconnect();
	}

	render() {
		const classes = {
			'd2l-collapsible-panel': true,
			'focused': this._focused,
			'has-summary': this._hasSummary,
			'has-before': this._hasBefore,
			'scrolled': this._scrolled,
			'no-bottom-border': this.type === 'inline' && !this._isLastPanelInGroup,
		};

		return html`
			<div class="${classMap(classes)}" @click="${this._handlePanelClick}">
				<div class="d2l-collapsible-panel-top-sentinel"></div>
				${this._renderHeader()}
				<d2l-expand-collapse-content
					?expanded="${this.expanded}"
					@d2l-expand-collapse-content-collapse="${this._handleExpandCollapse}"
					@d2l-expand-collapse-content-expand="${this._handleExpandCollapse}">
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
		super.updated(changedProperties);

		if (changedProperties.has('expanded')) {
			if (!this.expanded) {
				this._scrolled = false;
			}
		}

		if (changedProperties.has('noSticky')) {
			this._stickyObserverUpdate();
		}

		if (changedProperties.has('type')) {
			this._group?._updatePanelAttributes();
		}
	}

	_handleActionsClick(e) {
		const actions = this.shadowRoot.querySelector('.d2l-collapsible-panel-header-actions');
		if (e.target !== actions) {
			e.stopPropagation();
		}
	}

	_handleBeforeSlotChange(e) {
		const content = e.target.assignedNodes({ flatten: true });

		this._hasBefore = content?.length > 0;
	}

	_handleExpandCollapse(e) {
		const eventPromise = this.expanded ? e.detail.expandComplete : e.detail.collapseComplete;
		const event = this.expanded ? 'd2l-collapsible-panel-expand' : 'd2l-collapsible-panel-collapse';

		this.dispatchEvent(new CustomEvent(
			event, { bubbles: false, composed: false, detail: { complete: eventPromise } }
		));
	}

	_handleHeaderSecondaryClick(e) {
		const header = this.shadowRoot.querySelector('.d2l-collapsible-panel-header-secondary');
		if (e.target !== header) {
			e.stopPropagation();
		}
	}

	_handlePanelClick(e) {
		const content = this.shadowRoot.querySelector('.d2l-collapsible-panel-content');
		if (e.target !== content && !isComposedAncestor(content, e.target)) this._toggleExpand();
	}

	_handleSummarySlotChange(e) {
		const content = e.target.assignedNodes({ flatten: true });
		this._hasSummary = content?.length > 0;
	}

	_onBlur() {
		setTimeout(() => {
			// don't remove focus if the button still ends up in focus
			if (getComposedActiveElement() === this.shadowRoot.querySelector('button')) return;
			this._focused = false;
		}, 10);
	}

	_onFocus() {
		if (!tabPressed) return;
		this._focused = true;
	}

	_renderHeader() {
		return html`
			<div class="d2l-collapsible-panel-header">
				<div class="d2l-collapsible-panel-before">
					<slot name="before" @slotchange="${this._handleBeforeSlotChange}"></slot>
				</div>
				<div class="d2l-collapsible-panel-header-primary">
					${this._renderPanelTitle()}
					<div class="d2l-collapsible-panel-header-actions" @click="${this._handleActionsClick}">
						<slot name="actions"></slot>
					</div>
					<d2l-icon-custom size="tier1" class="d2l-skeletize" aria-hidden="true">
						<svg xmlns="http://www.w3.org/2000/svg" width="10" height="18" fill="none" viewBox="0 0 10 18">
							<path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="m9 9-8 8V1l8 8Z"/>
						</svg>
					</d2l-icon-custom>
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
		headingStyle = normalizeHeadingStyle(headingStyle);

		const titleClasses = {
			'd2l-collapsible-panel-title': true,
			'd2l-skeletize': true,
			[`d2l-heading-${headingStyle}`]: true,
		};

		const button = html`
			<button
				class="d2l-collapsible-panel-opener"
				aria-expanded="${this.expanded}"
				type="button"
				@focus="${this._onFocus}"
				@blur="${this._onBlur}"
				aria-label="${ifDefined(this.expandCollapseLabel)}">${this.panelTitle}</button>
		`;

		const headingLevel = normalizeHeadingLevel(this.headingLevel);
		switch (headingLevel) {
			case 1: return html`<h1 class="${classMap(titleClasses)}">${button}</h1>`;
			case 2: return html`<h2 class="${classMap(titleClasses)}">${button}</h2>`;
			case 3: return html`<h3 class="${classMap(titleClasses)}">${button}</h3>`;
			case 4: return html`<h4 class="${classMap(titleClasses)}">${button}</h4>`;
			case 5: return html`<h5 class="${classMap(titleClasses)}">${button}</h5>`;
			case 6: return html`<h6 class="${classMap(titleClasses)}">${button}</h6>`;
		}
	}

	_stickyObserverDisconnect() {
		if (this._intersectionObserver) {
			this._intersectionObserver.disconnect();
			this._intersectionObserver = undefined;
			this._scrolled = false;
		}
	}

	_stickyObserverUpdate() {
		this._stickyObserverDisconnect();

		if (!this.noSticky && typeof(IntersectionObserver) === 'function') {
			this._intersectionObserver = new IntersectionObserver(entries => {
				if (!this.expanded) return;

				const entry = entries[0];
				this._scrolled = !entry.isIntersecting;
			});
			this._intersectionObserver.observe(this.shadowRoot.querySelector('.d2l-collapsible-panel-top-sentinel'));
		}
	}

	_toggleExpand() {
		if (this.skeleton) return;
		this.expanded = !this.expanded;
		this.focus();
	}

}

customElements.define('d2l-collapsible-panel', CollapsiblePanel);
