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

class ExpandCollapse extends LitElement {

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

			.d2l-expand-collapse-container {
				display: none;
				overflow: hidden;
				transition: height 400ms cubic-bezier(0, 0.7, 0.5, 1);
			}

			.d2l-expand-collapse-container:not([data-state="collapsed"]) {
				display: block;
			}

			.d2l-expand-collapse-container[data-state="expanded"] {
				overflow: visible;
			}

			/* prevent margin colapse on slotted children */
			.d2l-expand-collapse-content:before,
			.d2l-expand-collapse-content:after {
				content: ' ';
				display: table;
			}

			@media (prefers-reduced-motion: reduce) {
				.d2l-expand-collapse-container {
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
			<div class="d2l-expand-collapse-container" data-state="${this._state}" @transitionend=${this._onTransitionEnd} style=${styleMap(styles)}>
				<div class="d2l-expand-collapse-content">
					<slot></slot>
				</div>
			</div>
		`;
	}

	async _expandedChanged(val, firstUpdate) {
		if (val) {
			if (reduceMotion || firstUpdate) {
				this._state = states.EXPANDED;
				this._height = 'auto';
			} else {
				this._state = states.PREEXPANDING;
				await this.updateComplete;
				await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
				if (this._state === states.PREEXPANDING) {
					this._state = states.EXPANDING;
					const content = this.shadowRoot.querySelector('.d2l-expand-collapse-content');
					this._height = `${content.scrollHeight}px`;
				}
			}
		} else {
			if (reduceMotion || firstUpdate) {
				this._state = states.COLLAPSED;
				this._height = '0';
			} else {
				this._state = states.PRECOLLAPSING;
				const content = this.shadowRoot.querySelector('.d2l-expand-collapse-content');
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
		} else if (this._state === states.COLLAPSING) {
			this._state = states.COLLAPSED;
		}
	}

}
customElements.define('d2l-expand-collapse', ExpandCollapse);
