import { css, html, LitElement } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

export const states = {
	PRECOLLAPSING: 'precollapsing', // setting up the styles so the collapse transition will run
	COLLAPSING: 'collapsing', // in the process of collapsing
	COLLAPSED: 'collapsed', // fully collapsed
	PREEXPANDING: 'preexpanding', // setting up the styles so the expand transition will run
	EXPANDING: 'expanding', // in the process of expanding
	EXPANDED: 'expanded', // fully expanded
};

/**
 * A component used to minimize the display of long content, while providing a way to reveal the full content.
 * @slot - Default content placed inside of the component
 * @fires d2l-expand-collapse-content-expand - Dispatched when the content starts to expand. The `detail` contains an `expandComplete` promise that can be waited on to determine when the content has finished expanding.
 * @fires d2l-expand-collapse-content-collapse - Dispatched when the content starts to collapse. The `detail` contains a `collapseComplete` promise that can be waited on to determine when the content has finished collapsing.
 */
class ExpandCollapseContent extends LitElement {

	static get properties() {
		return {
			/**
			 * Specifies the expanded/collapsed state of the content
			 * @type {boolean}
			 */
			expanded: { type: Boolean, reflect: true },
			_height: { type: String },
			_state: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				--d2l-expand-collapse-content-transition-duration: 0.2s;
				--d2l-expand-collapse-content-transition-function: cubic-bezier(0.4, 0.4, 0.25, 1);
				display: block;
			}

			:host([hidden]) {
				display: none;
			}

			.d2l-expand-collapse-content-container {
				display: block;
				opacity: 0;
				overflow: hidden;
				transition:
					height var(--d2l-expand-collapse-content-transition-duration) var(--d2l-expand-collapse-content-transition-function),
					opacity var(--d2l-expand-collapse-content-transition-duration) var(--d2l-expand-collapse-content-transition-function);
			}

			.d2l-expand-collapse-content-container[data-state="collapsed"] {
				display: none;
			}

			.d2l-expand-collapse-content-container[data-state="expanded"] {
				overflow: visible;
			}


			.d2l-expand-collapse-content-container[data-state="expanded"],
			.d2l-expand-collapse-content-container[data-state="expanding"] {
				opacity: 1;
			}

			/* prevent margin colapse on slotted children */
			.d2l-expand-collapse-content-inner::before,
			.d2l-expand-collapse-content-inner::after {
				content: " ";
				display: table;
			}

			@media (prefers-reduced-motion: reduce) {
				.d2l-expand-collapse-content-container {
					transition: none;
				}
			}
		`;
	}

	constructor() {
		super();
		this.expanded = false;
		this._height = '0';
		this._state = states.COLLAPSED;
		this._reduceMotion = reduceMotion;
	}

	render() {
		const styles = { height: this._height };
		return html`
			<div class="d2l-expand-collapse-content-container" data-state="${this._state}" @transitionend=${this.#resolveTransition} style=${styleMap(styles)}>
				<div class="d2l-expand-collapse-content-inner">
					<slot></slot>
				</div>
			</div>
		`;
	}

	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);
		if (changedProperties.has('expanded')) {
			if (!this.hasUpdated) this.#resolveTransition();
			else this._expandedChanged();
		}
	}

	async _expandedChanged() {
		const eventPromise = new Promise(resolve => this._eventPromiseResolve = resolve);
		this.dispatchEvent(new CustomEvent(
			this.expanded ? 'd2l-expand-collapse-content-expand' : 'd2l-expand-collapse-content-collapse',
			{ bubbles: true, detail: { [this.expanded ? 'expandComplete' : 'collapseComplete']: eventPromise } }
		));
		if (this._reduceMotion) {
			this.#resolveTransition();
		} else if (this.expanded) {
			this._state = states.PREEXPANDING;
			await this.updateComplete;
			await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
			if (this._state === states.PREEXPANDING) {
				this._state = states.EXPANDING;
				const contentHeight = this.#getContentHeight();
				if (contentHeight) this._height = `${contentHeight}px`;
				if (contentHeight === 0) this.#resolveTransition();
			}
		} else {
			this._state = states.PRECOLLAPSING;
			this._height = `${this.#getContentHeight()}px`;
			await this.updateComplete;
			await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
			if (this._state === states.PRECOLLAPSING) {
				this._state = states.COLLAPSING;
				this._height = '0';
			}
		}
	}

	#getContentHeight() {
		return this.shadowRoot?.querySelector('.d2l-expand-collapse-content-inner')?.scrollHeight ?? 0;
	}

	#resolveTransition() {
		this._state = this.expanded ? states.EXPANDED : states.COLLAPSED;
		this._height = this.expanded ? 'auto' : '0';
		this._eventPromiseResolve && this._eventPromiseResolve();
	}
}
customElements.define('d2l-expand-collapse-content', ExpandCollapseContent);
