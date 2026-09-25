import { html, LitElement, nothing } from 'lit';
import { stateStyles, stateIllustratedStyles } from './state-styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { LoadingCompleteMixin } from '../../mixins/loading-complete/loading-complete-mixin.js';
import { loadSvg } from '../../generated/state/presetIllustrationLoader.js';
import { runAsync } from '../../directives/run-async/run-async.js';
import { StateMixin } from './state-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

const illustrationAspectRatio = 500 / 330;

/**
 * The `d2l-state-illustrated` component is an state component that displays a title and description with an illustration. An state action component can be placed inside of the default slot to add an optional action.
 * @slot - Slot for state actions
 * @slot illustration - Slot for custom SVG content if `illustration-name` property is not set
 */
export class StateIllustrated extends LoadingCompleteMixin(StateMixin(LitElement)) {

	static properties = {
		/**
		 * The name of the preset image you would like to display in the component
		 * @type {string}
		 */
		illustrationName: { type: String, attribute: 'illustration-name' },
		/**
		 * REQUIRED: A title for the state
		 * @type {string}
		 */
		titleText: { type: String, attribute: 'title-text', required: true },
		_contentHeight: { state: true },
		_titleSmall: { state: true }
	};

	static styles = [ stateStyles, stateIllustratedStyles];

	constructor() {
		super();
		this._contentHeight = 330;
		this._resizeObserver = new ResizeObserver(this._onResize.bind(this));
		this._titleSmall = false;
	}

	connectedCallback() {
		super.connectedCallback();
		this._resizeObserver.observe(this);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._resizeObserver.disconnect();
	}

	render() {
		const titleClass = {
			'd2l-state-title': true,
			'd2l-state-title-small': this._titleSmall,
			'd2l-state-title-large': !this._titleSmall,
		};

		return html`
			${this.#renderIllustration()}
			<p class="${classMap(titleClass)}">${this.titleText}</p>
			<p class="d2l-body-compact d2l-state-description" tabindex="-1">${this.description}</p>
			<slot class="action-slot" @slotchange=${this.#handleSlotChange}></slot>
		`;
	}

	_onResize(entries) {
		if (!entries || entries.length === 0) return;
		const entry = entries[0];

		const width = entry.contentRect.width;
		if (width === 0) return; // ignore until visible

		requestAnimationFrame(() => {
			this._contentHeight = Math.min(entry.contentRect.right / illustrationAspectRatio, 330);
			this._titleSmall = entry.contentRect.right <= 615;
		});
	}

	async #getIllustration(illustrationName) {
		if (!illustrationName) return;

		const svg = await loadSvg(illustrationName);
		if (!svg) setTimeout(() => {
			throw new Error(`<d2l-state-illustrated-${this._illustratedComponentType}>: Unable to retrieve requested illustration.`);
		});
		return svg ? html`${unsafeSVG(svg.val)}` : nothing;
	}

	#handleSlotChange(e) {
		const nodes = e.target.assignedNodes({ flatten: true });
		const stateActionButtons = nodes.filter(node => node.isStateActionButton);
		stateActionButtons.forEach(btn => btn._illustrated = true);
	}

	#renderIllustration() {
		if (!this.illustrationName) {
			this.resolveLoadingComplete();
			return html`<slot class="illustration-slot" name="illustration"></slot>`;
		}
		const illustrationContainerStyle = {
			height: `${this._contentHeight}px`,
		};
		const asyncVal = runAsync(
			this.illustrationName,
			() => this.#getIllustration(this.illustrationName),
			{
				success: illustration => {
					this.resolveLoadingComplete();
					return illustration;
				}
			},
			{ pendingState: false }
		);
		return html`<div style="${styleMap(illustrationContainerStyle)}">${asyncVal}</div>`;
	}

}

customElements.define('d2l-state-illustrated', StateIllustrated);
