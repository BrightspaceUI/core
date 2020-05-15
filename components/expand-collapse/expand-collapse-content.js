import { css, html, LitElement } from 'lit-element/lit-element.js';
import { styleMap } from 'lit-html/directives/style-map.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const states = {
	PRECOLLAPSING: 'precollapsing', // setting up the styles so the collapse transition will run
	COLLAPSING: 'collapsing', // in the process of collapsing
	COLLAPSED: 'collapsed', // fully collapsed
	PREEXPANDING: 'preexpanding', // setting up the styles so the expand transition will run
	EXPANDING: 'expanding', // in the process of expanding
	EXPANDED: 'expanded', // fully expanded
};

class ExpandCollapseContent extends LitElement {

	static get properties() {
		return {
			expanded: { type: Boolean, reflect: true },
			_height: { type: String },
			_state: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}

			:host([hidden]) {
				display: none;
			}

			.d2l-expand-collapse-content-container {
				display: none;
				overflow: hidden;
				transition: height 400ms cubic-bezier(0, 0.7, 0.5, 1);
			}

			.d2l-expand-collapse-content-container:not([data-state="collapsed"]) {
				display: block;
			}

			.d2l-expand-collapse-content-container[data-state="expanded"] {
				overflow: visible;
			}

			/* prevent margin colapse on slotted children */
			.d2l-expand-collapse-content-inner:before,
			.d2l-expand-collapse-content-inner:after {
				content: ' ';
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
		this._isFirstUpdate = true;
		this._state = states.COLLAPSED;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('expanded')) {
			this._expandedChanged(this.expanded, this._isFirstUpdate);
			this._isFirstUpdate = false;
		}
	}

	render() {
		const styles = { height: this._height };
		return html`
			<div class="d2l-expand-collapse-content-container" data-state="${this._state}" @transitionend=${this._onTransitionEnd} style=${styleMap(styles)}>
				<div class="d2l-expand-collapse-content-inner">
					<slot></slot>
				</div>
			</div>
		`;
	}

	async _expandedChanged(val, firstUpdate) {
		const eventPromise = new Promise(resolve => this._eventPromiseResolve = resolve);
		if (val) {
			if (!firstUpdate) {
				this.dispatchEvent(new CustomEvent(
					'd2l-expand-collapse-content-expand',
					{ bubbles: true, detail: { expandComplete: eventPromise } }
				));
			}
			if (reduceMotion || firstUpdate) {
				this._state = states.EXPANDED;
				this._height = 'auto';
				this._eventPromiseResolve();
			} else {
				this._state = states.PREEXPANDING;
				await this.updateComplete;
				await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
				if (this._state === states.PREEXPANDING) {
					this._state = states.EXPANDING;
					const content = this.shadowRoot.querySelector('.d2l-expand-collapse-content-inner');
					this._height = `${content.scrollHeight}px`;
				}
			}
		} else {
			if (!firstUpdate) {
				this.dispatchEvent(new CustomEvent(
					'd2l-expand-collapse-content-collapse',
					{ bubbles: true, detail: { collapseComplete: eventPromise } }
				));
			}
			if (reduceMotion || firstUpdate) {
				this._state = states.COLLAPSED;
				this._height = '0';
				this._eventPromiseResolve();
			} else {
				this._state = states.PRECOLLAPSING;
				const content = this.shadowRoot.querySelector('.d2l-expand-collapse-content-inner');
				this._height = `${content.scrollHeight}px`;
				await this.updateComplete;
				await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
				if (this._state === states.PRECOLLAPSING) {
					this._state = states.COLLAPSING;
					this._height = '0';
				}
			}
		}
	}

	_onTransitionEnd() {
		if (this._state === states.EXPANDING) {
			this._state = states.EXPANDED;
			this._height = 'auto';
			this._eventPromiseResolve();
		} else if (this._state === states.COLLAPSING) {
			this._state = states.COLLAPSED;
			this._eventPromiseResolve();
		}
	}

}
customElements.define('d2l-expand-collapse-content', ExpandCollapseContent);
