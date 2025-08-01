import './breadcrumb.js';
import { css, html, LitElement } from 'lit';
import { getFlag } from '../../helpers/flags.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { overflowEllipsisDeclarations } from '../../helpers/overflow.js';

const overflowClipEnabled = getFlag('GAUD-7887-core-components-overflow-clipping', true);

/**
 * Help users understand where they are within the application, and provide useful clues about how the space is organized. They also provide a convenient navigation mechanism.
 * @slot - Breadcrumb items
 */
class Breadcrumbs extends LocalizeCoreElement(LitElement) {

	static get properties() {
		return {
			/**
			 * Renders in compact mode, displaying only the last item
			 * @type {boolean}
			 */
			compact: { type: Boolean, reflect: true }
		};
	}

	static get styles() {
		return css`
			:host {
				${overflowClipEnabled ? css`clip-path: rect(-1em 100% calc(100% + 1em) -1em);` : css``}
				display: block;
				font-size: 0.7rem;
				line-height: 1.05rem;
				position: relative;
				${overflowClipEnabled ? overflowEllipsisDeclarations : css`
					overflow: hidden;
					white-space: nowrap;
				`}
			}
			:host([hidden]) {
				display: none;
			}
			:host::after {
				background: linear-gradient(to var(--d2l-inline-end, right), rgba(255, 255, 255, 0), rgb(251, 252, 252));
				content: "";
				inset-block: 0;
				inset-inline-end: 0;
				pointer-events: none;
				position: absolute;
				width: 10px;
			}
			:host([compact]) ::slotted(d2l-breadcrumb:not(:last-of-type)),
			:host([compact]) ::slotted(d2l-breadcrumb-current-page) {
				display: none;
			}
		`;
	}

	constructor() {
		super();
		this.compact = false;
	}

	render() {
		return html`
			<nav aria-label="${this.localize('components.breadcrumbs.breadcrumb')}">
				<div role="list">
					<slot></slot>
				</div>
			</nav>
		`;
	}

}
customElements.define('d2l-breadcrumbs', Breadcrumbs);
