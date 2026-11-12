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
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { overflowEllipsisDeclarations } from '../../helpers/overflow.js';
import { RequesterMixin } from '../../mixins/provider/provider-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';
import { waitForElem } from '../../helpers/internal/waitForElem.js';

const ACTION_GAP = 12;
const CONTAINER_GAP = 24;
const MINIMUM_TITLE_WIDTH = 100;

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
		_titleHidden: { state: true }
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
			min-width: 0;
		}
		.title-wrapper {
			height: 100%;
		}
		.back,
		.actions-iterator-wrapper {
			flex: 0 0 auto;
		}
		.title,
		.actions-iterator-wrapper.has-title {
			border-inline-start: 1px solid var(--d2l-color-gypsum);
		}
		.title.has-title,
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
			${overflowEllipsisDeclarations}
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
		//this.#resizeObserver.observe(this.#refActions.value);
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
	#actionsWidth = undefined;
	#backWidth = undefined;
	#containerWidth = undefined;
	#iteratorWidth = 0;
	#titleWidth = 0;
	#refActions = createRef();
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

	#hasVisibleTitle() {
		return !this._titleHidden && this.#hasTitle();
	}

	async #recalculateAction(node) {
		await waitForElem(node);

		return new Promise(resolve => {
			const observer = new ResizeObserver((entries) => {
				// TODO: handle action being completely hidden
				const width = Math.ceil(entries[0].contentRect.width);
				node.dataset.width = width;
				observer.disconnect();
				resolve();
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
		await this.updateComplete;
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
		const containerGaps = (this.#hasVisibleTitle()) ? 3 : 2;
		const borders = (this.#hasVisibleTitle()) ? 2 : 1;
		const available = (this.#containerWidth - this.#backWidth - this.#iteratorWidth) - (actionGaps * ACTION_GAP + containerGaps * CONTAINER_GAP + borders);
		//console.log(`actionGaps: ${actionGaps}, containerGaps: ${containerGaps}, borders: ${borders}, hasVisibleTitle: ${this.#hasVisibleTitle()}`);

		let actionsTotal = 0;
		let gap = 0;
		for (let i = 0; i < this.#actions.length; i++) {
			const action = this.#actions[i];
			const actionWidth = parseFloat(action.dataset.width) || 0;
			actionsTotal += actionWidth + gap;
			gap = ACTION_GAP;
		}

		this._actionChompIndex = 100;
		if (actionsTotal > available) {
			actionsTotal += (42 + ACTION_GAP); // make room for overflow menu
			for (let i = this.#actions.length - 1; i >= 0; i--) {
				const action = this.#actions[i];
				const actionWidth = parseFloat(action.dataset.width) || 0;
				actionsTotal -= (actionWidth + ACTION_GAP);
				action.setAttribute('hidden', 'hidden');
				if (actionsTotal <= available || i === 0) {
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
		const actionsStyle = {
			width: this.#actionsWidth !== undefined ? `${this.#actionsWidth}px` : 'auto'
		};
		const actionsClasses = {
			'actions': true,
			'defined': (!this._recalculatingActions)
		};
		const actionsIteratorWrapperClasses = {
			'actions-iterator-wrapper': true,
			'has-title': this.#hasVisibleTitle()
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
				<div class="${classMap(actionsClasses)}" ?hidden="${!this._hasActions}" style="${styleMap(actionsStyle)}" ${ref(this.#refActions)}>
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
			if (entry.target === this.#refActions.value) {
				//this.#actionsWidth = entry.contentRect.width;
				//console.log('actionsWidth', entry.contentRect.width);
			} else if (entry.target === this.#refBack.value) {
				this.#backWidth = Math.ceil(entry.contentRect.width);
			} else if (entry.target === this.#refContainer.value) {
				this.#containerWidth = Math.floor(entry.contentRect.width);
			} else if (entry.target === this.#refIterator.value) {
				this.#iteratorWidth = Math.ceil(entry.contentRect.width);
			} else if (entry.target === this.#refTitle.value) {
				if (this.#hasTitle()) {
					if (this._titleHidden) {
						const extraSpace = (this._hasActions || this._hasIterator) ? (CONTAINER_GAP * 2 + 1) : (CONTAINER_GAP + 1);
						this._titleHidden = entry.contentRect.width - extraSpace < MINIMUM_TITLE_WIDTH;
					} else {
						this._titleHidden = entry.contentRect.width < MINIMUM_TITLE_WIDTH;
					}
				}
				this.#titleWidth = Math.ceil(entry.contentRect.width);
			}
		});
		//const availableWidth = this.#containerWidth - (this.#backWidth + this.#titleWidth + this.#iteratorWidth);
		console.log('resize', {
			/*available: availableWidth,*/
			back: this.#backWidth,
			container: this.#containerWidth,
			iterator: this.#iteratorWidth,
			title: this.#titleWidth
		});
		this.#recalculateEverything();
	}

}
customElements.define('d2l-page-header-immersive', PageHeaderImmersive);
