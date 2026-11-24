import '../alert/alert.js';
import '../colors/colors.js';
import '../icons/icon.js';
import '../menu/menu-item.js';
import '../menu/menu-item-checkbox.js';
import './page-header-custom.js';
import { bodyCompactStyles, heading3Styles, labelStyles } from '../typography/styles.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { css, html, LitElement, nothing } from 'lit';
import { highlightBorderStyles, highlightLinkStyles } from './page-header-styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { getFocusRingStyles } from '../../helpers/focus.js';
import { getOverflowDeclarations } from '../../helpers/overflow.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { RequesterMixin } from '../../mixins/provider/provider-mixin.js';
import { waitForElem } from '../../helpers/internal/waitForElem.js';

const ACTION_GAP = 12;
const CONTAINER_GAP = 24;
const MINIMUM_TITLE_WIDTH = 30;

class PageHeaderImmersive extends RequesterMixin(LocalizeCoreElement(LitElement)) {

	static properties = {
		backHref: { attribute: 'back-href', type: String },
		backCustomText: { attribute: 'back-custom-text', type: String },
		titleText: { attribute: 'title-text', type: String },
		subtitleText: { attribute: 'subtitle-text', type: String },
		_actionChompIndex: { state: true },
		_error: { state: true },
		_hasActions: { state: true },
		_hasIterator: { state: true },
		_hasTitleSlot: { state: true },
		_recalculatingActions: { state: true },
		_titleOverflowing: { state: true }
	};

	static styles = [bodyCompactStyles, heading3Styles, labelStyles, highlightBorderStyles, highlightLinkStyles, offscreenStyles, css`
		:host {
			display: block;
		}
		:host([hidden]),
		.actions-iterator-wrapper[hidden],
		.actions[hidden],
		.iterator[hidden] {
			display: none;
		}
		.container {
			align-items: stretch;
			display: flex;
			gap: ${CONTAINER_GAP}px;
			height: 3.1rem;
		}
		.title {
			flex: 1 1 auto;
			min-width: ${MINIMUM_TITLE_WIDTH}px;
			padding-block: 5px;
		}
		.back,
		.actions-iterator-wrapper {
			flex: 0 0 auto;
		}
		.title,
		.actions-iterator-wrapper.has-title {
			border-inline-start: 1px solid var(--d2l-color-gypsum);
		}
		.title,
		.actions-iterator-wrapper.has-title {
			padding-inline-start: ${CONTAINER_GAP}px;
		}
		.title h1 {
			display: flex;
			flex-direction: column;
			height: 100%;
			justify-content: center;
			margin: 0;
		}
		${getFocusRingStyles('.title h1')}
		.title-overflow {
			mask-image: linear-gradient(to right, white calc(100% - 20px), transparent 100%);
		}
		.actions,
		.actions-iterator-wrapper {
			align-items: center;
			display: flex;
			gap: ${ACTION_GAP}px;
		}
		.actions {
			position: absolute;
		}
		.actions.defined {
			position: static;
		}		
		.iterator {
			align-items: center;
			display: flex;
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
			${getOverflowDeclarations({ textOverflow: 'clip' })}
		}
	`];

	constructor() {
		super();
		this._actionChompIndex = 100;
		this._error = false;
		this._hasActions = false;
		this._hasIterator = false;
		this._hasTitleSlot = false;
		this._recalculatingActions = true;
		this._titleOverflowing = false;
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
		this.#resizeObserver.observe(this.#refBack.value);
		this.#resizeObserver.observe(this.#refContainer.value);
		this.#resizeObserver.observe(this.#refIterator.value);
		this.#resizeObserver.observe(this.#refTitle.value);
	}

	render() {
		if (this._error) return this.#renderError();
		return html`
			<d2l-page-header-custom>
				<div class="container" slot="top" ${ref(this.#refContainer)}>
					${this.#renderBack()}
					${this.#renderTitle()}
					${this.#renderActionsIterator()}
				</div>
			</d2l-page-header-custom>
		`;
	}

	#actions = [];
	#actionsComplete = false;
	#backWidth = undefined;
	#containerWidth = undefined;
	#iteratorWidth = 0;
	#refBack = createRef();
	#refContainer = createRef();
	#refIterator = createRef();
	#refTitle = createRef();
	#resizeObserver = new ResizeObserver((entries) => this.#updateSizes(entries));

	#handleActionsSlotChange(e) {
		const nodes = e.target.assignedNodes({ flatten: true });
		this.#recalculateActions(nodes);
	}

	#handleBackClick() {
		this.dispatchEvent(
			new CustomEvent(
				'd2l-page-header-immersive-back-click',
				{ bubbles: false, composed: false }
			)
		);
	}

	#handleIteratorSlotChange(e) {
		this._hasIterator = e.target.assignedNodes({ flatten: true })?.length > 0;
	}

	#handleTitleSlotChange(e) {
		this._hasTitleSlot = e.target.assignedNodes({ flatten: true })?.length > 0;
	}

	#hasTitle() {
		return !!(this._hasTitleSlot || this.titleText || this.subtitleText);
	}

	async #recalculateAction(node) {
		await waitForElem(node);

		const isSwitch = (node.tagName === 'D2L-SWITCH' || node.tagName === 'D2L-SWITCH-VISIBILITY');
		const expectedResizeCount = isSwitch ? 3 : 1;
		let count = 0;
		return new Promise(resolve => {
			const observer = new ResizeObserver((entries) => {
				// TODO: handle action being completely hidden
				const width = Math.ceil(entries[0].contentRect.width);
				count++;
				if (count === 1) {
					node.dataset.width = width;
					if (isSwitch) {
						node.textPosition = 'hidden';
					}
				} else if (count === 2 && isSwitch) {
					node.dataset.slimWidth = width;
					node.textPosition = 'end';
				}
				if (count === expectedResizeCount) {
					observer.disconnect();
					resolve();
				}
			});
			observer.observe(node);
		});
	}

	async #recalculateActions(nodes) {
		console.log('actions slot changed, recalculating action sizes...');
		this.#actionsComplete = false;
		this.#actions = nodes || [];
		this._hasActions = this.#actions.length > 0;
		this._recalculatingActions = true;
		const promises = [];
		this.#actions.forEach((node) => {
			promises.push(this.#recalculateAction(node));
		});
		await Promise.all(promises);
		this.#actionsComplete = true;
		await this.#recalculateEverything();
	}

	async #recalculateEverything() {
		if (!this.#actionsComplete || this.#containerWidth === undefined || this.#backWidth === undefined || this.#iteratorWidth === undefined) {
			console.log('recalculateEverything skipped, prerequisites not met', this.#actionsComplete, this.#containerWidth, this.#backWidth, this.#iteratorWidth);
			return;
		}
		if (this.#actions.length === 0) {
			this._recalculatingActions = false;
			return;
		}

		const actionGaps = (this.#iteratorWidth > 0) ? 1 : 0;
		const containerGaps = (this.#hasTitle()) ? 4 : 2;
		const borders = (this.#hasTitle()) ? 2 : 1;
		const available = ((this.#containerWidth - this.#backWidth - this.#iteratorWidth) - (actionGaps * ACTION_GAP + containerGaps * CONTAINER_GAP + borders)) * 0.5;
		//console.log(`actionGaps: ${actionGaps}, containerGaps: ${containerGaps}, borders: ${borders}`);

		let actionsTotal = 0;
		let gap = 0;
		for (let i = 0; i < this.#actions.length; i++) {
			const action = this.#actions[i];
			const actionWidth = parseFloat(action.dataset.width) || 0;
			actionsTotal += actionWidth + gap;
			gap = ACTION_GAP;
		}

		//console.log('initial actions', actionsTotal, available);

		// first try to slim down
		let actionSlimIndex = 100;
		if (actionsTotal > available) {
			for (let i = this.#actions.length - 1; i >= 0; i--) {
				const action = this.#actions[i];
				const actionWidth = parseFloat(action.dataset.width) || 0;
				const slimWidth = parseFloat(action.dataset.slimWidth) || 0;
				if (slimWidth > 0 && actionWidth > slimWidth) {
					actionsTotal -= (actionWidth - slimWidth);
					action.setAttribute('text-position', 'hidden');
					if (actionsTotal <= available || i === 0) {
						actionSlimIndex = i;
						break;
					}
				}
			}
			console.log('actions after slimming', actionsTotal, available);
		}
		for (let i = 0; i < actionSlimIndex && i < this.#actions.length; i++) {
			const action = this.#actions[i];
			if (action.hasAttribute('data-slim-width')) {
				action.setAttribute('text-position', 'end');
			}
		}

		// then try to chomp
		this._actionChompIndex = 100;
		if (actionsTotal > available) {
			for (let i = this.#actions.length - 1; i >= 0; i--) {
				const action = this.#actions[i];
				const actionWidth = action.hasAttribute('data-slim-width') ? parseFloat(action.dataset.slimWidth) : parseFloat(action.dataset.width);
				actionsTotal = actionsTotal - (actionWidth + ACTION_GAP);
				action.setAttribute('hidden', 'hidden');
				if (actionsTotal <= available || i === 1) {
					this._actionChompIndex = i;
					break;
				}
			}
			console.log(`actions (${actionsTotal}) exceed available (${available}), chomping to ${this._actionChompIndex}`);
		} else {
			console.log(`actions (${actionsTotal}) less than available (${available}), un-chomping`);
		}
		for (let i = 0; i < this._actionChompIndex && i < this.#actions.length; i++) {
			const action = this.#actions[i];
			action.removeAttribute('hidden');
		}

		this._recalculatingActions = false;
	}

	#renderActionsIterator() {
		const actionsClasses = {
			'actions': true,
			'defined': (!this._recalculatingActions)
		};
		const actionsIteratorWrapperClasses = {
			'actions-iterator-wrapper': true,
			'has-title': this.#hasTitle()
		};
		const overflowItems = this.#actions.slice(this._actionChompIndex)
			.map((action) => {
				if (action.tagName === 'D2L-BUTTON-ICON') {
					return html`<d2l-menu-item text="${action.text}"></d2l-menu-item>`;
				} else if (action.tagName === 'D2L-SWITCH-VISIBILITY' || action.tagName === 'D2L-SWITCH') {
					return html`<d2l-menu-item-checkbox text="${action.text}" ?selected="${action.on}"></d2l-menu-item-checkbox>`;
				} else {
					throw 'Unknown action type';
				}
			});
		const overflowMenu = html`
			<d2l-dropdown-more text="more actions" ?hidden="${this._actionChompIndex >= this.#actions.length}">
				<d2l-dropdown-menu class="vdiff-target">
					<d2l-menu label="more actions">
						${overflowItems}
					</d2l-menu>
				</d2l-dropdown-menu>
			</d2l-dropdown-more>
		`;
		return html`
			<div class="${classMap(actionsIteratorWrapperClasses)}" ?hidden="${!this._hasActions && !this._hasIterator}">
				<div class="${classMap(actionsClasses)}" ?hidden="${!this._hasActions}">
					<slot name="actions" @slotchange="${this.#handleActionsSlotChange}"></slot>
					${overflowMenu}
				</div>
				<div class="iterator" ?hidden="${!this._hasIterator}" ${ref(this.#refIterator)}>
					<slot name="iterator" @slotchange="${this.#handleIteratorSlotChange}"></slot>
				</div>
			</div>
		`;
	}

	#renderBack() {
		const href = this.backHref || 'javascript:void(0);';
		const commonText = this.localizeCommon('navigation:back:title');
		const longText = this.backCustomText || commonText;
		return html`
			<div class="back d2l-body-compact" ${ref(this.#refBack)}>
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
		const headingClasses = {
			'title-overflow': this._titleOverflowing
		};
		const title = this.titleText ? html`<div class="title-text d2l-heading-3">${this.titleText}</div>` : '';
		const subtitle = this.subtitleText ? html`<div class="title-text d2l-label-text">${this.subtitleText}</div>` : '';
		const heading = (title || subtitle) && html`
			<h1 id="title-heading" tabindex="${ifDefined(this._titleOverflowing ? 0 : undefined)}">
				<div class="${classMap(headingClasses)}">${title}${subtitle}</div>
			</h1>
		`;
		const overflow = this._titleOverflowing ? html`<d2l-tooltip for="title-heading" for-type="label">${this.titleText}<br>${this.subtitleText}</d2l-tooltip>` : nothing;
		return html`
			<div id="title" class="title" ${ref(this.#refTitle)}>
				<slot name="title" @slotchange="${this.#handleTitleSlotChange}">${heading}</slot>
				${overflow}
			</div>
		`;
	}

	#updateSizes(entries) {
		entries.forEach(entry => {
			if (entry.target === this.#refBack.value) {
				this.#backWidth = Math.ceil(entry.contentRect.width);
			} else if (entry.target === this.#refContainer.value) {
				this.#containerWidth = Math.floor(entry.contentRect.width);
			} else if (entry.target === this.#refIterator.value) {
				this.#iteratorWidth = Math.ceil(entry.contentRect.width);
			} else if (entry.target === this.#refTitle.value) {
				const title = this.#refTitle.value.querySelector('.d2l-heading-3');
				const subtitle = this.#refTitle.value.querySelector('.d2l-label-text');
				this._titleOverflowing = title.scrollWidth > title.clientWidth || subtitle.scrollWidth > subtitle.clientWidth;
				//console.log('title', title.scrollWidth, title.clientWidth, title.scrollWidth > title.clientWidth, subtitle.scrollWidth > subtitle.clientWidth);
			}
		});
		console.log('resize', {
			back: this.#backWidth,
			container: this.#containerWidth,
			iterator: this.#iteratorWidth
		});
		this.#recalculateEverything();
	}

}
customElements.define('d2l-page-header-immersive', PageHeaderImmersive);
