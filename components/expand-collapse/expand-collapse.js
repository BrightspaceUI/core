import { css, html, LitElement } from 'lit-element/lit-element.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { styleMap } from 'lit-html/directives/style-map.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const states = {
	COLLAPSING: 'collapsing', // in the process of collapsing
	COLLAPSED: 'collapsed', // fully collapsed
	EXPANDING: 'expanding', // in the process of expanding
	EXPANDED: 'expanded', // fully expanded
};

class ExpandCollapse extends LitElement {

	static get properties() {
		return {
			expanded: { type: Boolean, reflect: true },
			_height: { type: Number },
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
				height: 0;
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
		this._onContentResize = this._onContentResize.bind(this);
		this.expanded = false;
		this._state = states.COLLAPSED;
	}

	firstUpdated() {
		super.firstUpdated();

		const content = this._getContent();
		this._resizeObserver = new ResizeObserver(this._onContentResize);
		this._resizeObserver.observe(content);
	}

	updated(changedProperties) {
		if (changedProperties.has('expanded')) {
			this._expandedChanged(this.expanded);
		}
	}

	render() {
		const styles = {
			height: this.expanded ? `${this._height}px` : null
		};
		return html`
			<div class="d2l-expand-collapse-container" data-state=${this._state} @transitionend=${this._onTransitionEnd} style=${styleMap(styles)}>
				<div class="d2l-expand-collapse-content">
					<slot></slot>
				</div>
			</div>
		`;
	}

	async _expandedChanged(val) {
		if (val) {
			this._state = reduceMotion ? states.EXPANDED : states.EXPANDING;
			await this.updateComplete;
			const content = this._getContent();
			if (content) {
				this._height = content.scrollHeight;
			}
		} else {
			this._state = reduceMotion ? states.COLLAPSED : states.COLLAPSING;
			this._height = null;
		}
	}

	_getContent() {
		return this.shadowRoot.querySelector('.d2l-expand-collapse-content');
	}

	_onContentResize(e) {
		if (!this.expanded) {
			return;
		}
		const entry = e[0];
		if (entry.contentRect) {
			this._height = entry.contentRect.height;
		}
	}

	_onTransitionEnd() {
		if (this._state === states.EXPANDING) {
			this._state = states.EXPANDED;
		} else if (this._state === states.COLLAPSING) {
			this._state = states.COLLAPSED;
		}
	}

}
customElements.define('d2l-expand-collapse', ExpandCollapse);
