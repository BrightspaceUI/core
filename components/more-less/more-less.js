import '../button/button-subtle.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { getComposedActiveElement } from '../../helpers/focus.js';
import { getFlag } from '../../helpers/flags.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { isComposedAncestor } from '../../helpers/dom.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { overflowHiddenDeclarations } from '../../helpers/overflow.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { styleMap } from 'lit/directives/style-map.js';

const transitionDur = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 400;
const overflowClipEnabled = getFlag('GAUD-7887-core-components-overflow-clipping', true);
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

/**
 * A component used to minimize the display of long content, while providing a way to reveal the full content.
 * @slot - Default content placed inside of the component
 */
class MoreLess extends LocalizeCoreElement(LitElement) {

	static get properties() {
		return {
			/**
			 * Indicates whether element is in "more" state
			 * @type {boolean}
			 */
			expanded: { type: Boolean, reflect: true },

			/**
			 * Aligns the leading edge of more/less button text if value is set to "text" for left-aligned layouts, the trailing edge of text if value is set to "text-end" for right-aligned layouts
			 * @type {'text'|'text-end'|''}
			 */
			hAlign: { type: String, attribute: 'h-align' },

			/**
			 * The maximum height of the content when in "less" state
			 * @type {string}
			 */
			height: { type: String },

			/**
			 * Whether the component is active or inactive
			 * @type {boolean}
			 */
			inactive: { type: Boolean, reflect: true },
			__maxHeight: { state: true },
			__transitionAdded: { state: true }
		};
	}

	static get styles() {
		return css`
			:host {
				${overflowClipEnabled ? css`display: flow-root;` : css`display: block;`}
			}

			.d2l-more-less-content {
				${overflowClipEnabled ? css`
					display: flow-root;
					margin: -1em -1em 0;
					padding: 1em 1em 0;
					${overflowHiddenDeclarations}
				` : css`
					overflow: hidden;
				`}
			}
			.d2l-more-less-transition {
				transition: max-height ${transitionDur}ms cubic-bezier(0, 0.7, 0.5, 1);
			}
			:host(:not([expanded]):not([inactive])) .d2l-more-less-content {
				-webkit-mask-image: linear-gradient(to top, transparent, #000000 1em);
				mask-image: linear-gradient(to top, transparent, #000000 1em);
			}
			:host([inactive]) .d2l-more-less-toggle {
				display: none;
			}

			.force-margin-scroll {
				height: 1px;
				margin-top: -1px;
			}

			@media (prefers-reduced-motion: reduce) {
				.d2l-more-less-transition {
					transition: none;
				}
			}
		`;
	}

	constructor() {
		super();

		this.expanded = false;
		this.height = '4em';
		this.inactive = false;

		this.__transitionAdded = false;
		this.__maxHeight = this.height;

		this.__baseHeight = 0;
		this.__contentId = getUniqueId();
		this.__content = null;
		this.__autoExpanded = false;
		this.__shift = false;
		this.__bound_transitionEvents = null;

		this.__resizeObserver = new ResizeObserver(this.__reactToChanges.bind(this));
		this.__mutationObserver = new MutationObserver(this.__reactToChanges.bind(this));
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.__resizeObserver.disconnect();
		this.__mutationObserver.disconnect();

		this.shadowRoot.removeEventListener('transitionstart', this.__bound_transitionEvents);
		this.shadowRoot.removeEventListener('transitionend', this.__bound_transitionEvents);
		this.shadowRoot.removeEventListener('transitioncancel', this.__bound_transitionEvents);
		this.shadowRoot.removeEventListener('transitionrun', this.__bound_transitionEvents);
	}

	firstUpdated() {
		super.firstUpdated();

		this.__content = this.shadowRoot.querySelector('.d2l-more-less-content');
		this.__reactToChanges();
		this.__resizeObserver.observe(this.__content);

		this.__bound_transitionEvents = this.__transitionEvents.bind(this);
		this.shadowRoot.addEventListener('transitionstart', this.__bound_transitionEvents);
		this.shadowRoot.addEventListener('transitionend', this.__bound_transitionEvents);
		this.shadowRoot.addEventListener('transitioncancel', this.__bound_transitionEvents);
		this.shadowRoot.addEventListener('transitionrun', this.__bound_transitionEvents);
	}

	render() {
		const contentClasses = {
			'd2l-more-less-content': true,
			'd2l-more-less-transition': this.__transitionAdded
		};
		return html`
			<div
				id="${this.__contentId}"
				class=${classMap(contentClasses)}
				style=${styleMap({ maxHeight: `${this.__maxHeight}` })}
				@focusin="${this.__focusIn}"
				@focusout="${this.__focusOut}">
				<slot></slot>
				<div class="force-margin-scroll"></div>
			</div>
			<d2l-button-subtle
				class="d2l-more-less-toggle"
				icon="${this.__computeIcon()}"
				aria-controls="${this.__contentId}"
				expanded="${this.__computeAriaExpanded()}"
				@click="${this.__toggleOnClick}"
				text="${this.__computeText()}"
				h-align="${ifDefined(this.hAlign)}">
			</d2l-button-subtle>
		`;
	}

	__adjustToContent() {
		if (this.__baseHeight === 0) {
			this.__init_setBaseHeight();
			return;
		}

		const contentHeight = this.__content.scrollHeight;
		const currentHeight = this.__content.offsetHeight;

		if (contentHeight <= this.__baseHeight) {
			if (!this.inactive) {
				this.inactive = true;
				this.expanded = false;
				this.__adjustToContent_resize();
			}
			return;
		}

		if (this.expanded && contentHeight !== currentHeight) {
			this.__adjustToContent_resize();
			return;
		}

		if (this.inactive) {
			this.__adjustToContent_makeActive();
		}
	}

	__adjustToContent_makeActive() {
		this.inactive = false;
		this.__maxHeight = this.height;
	}

	__adjustToContent_resize() {
		// Include 1px of given room to account for issues with Firefox rounding the content's scroll height
		this.__maxHeight = `${this.__content.scrollHeight + 1}px`;
	}

	__computeAriaExpanded() {
		return this.expanded ? 'true' : 'false';
	}

	__computeIcon() {
		return this.expanded ? 'tier1:chevron-up' : 'tier1:chevron-down';
	}

	__computeText() {
		return this.localize(this.expanded ? 'components.more-less.less' : 'components.more-less.more');
	}

	__expand() {
		this.__transitionAdded = true;
		this.__maxHeight = `${this.__content.scrollHeight}px`;
		this.expanded = true;
	}

	async __focusIn(e) {
		if (this.inactive || this.expanded) {
			return;
		}

		const target = e.composedPath()[0] || e.target;

		if (overflowClipEnabled) {
			const em = parseInt(getComputedStyle(this.__content).getPropertyValue('font-size'));
			const { y: contentY, height: contentHeight } = this.__content.getBoundingClientRect();
			const { y: targetY, height: targetHeight } = target.getBoundingClientRect();

			if (targetY + targetHeight > contentY + contentHeight - em) {
				this.__expand();
				this.__autoExpanded = true;
				await (transitionDur && new Promise(r => setTimeout(r, transitionDur)));
			}
		} else {
			if (isSafari) {
				target.scrollIntoViewIfNeeded?.();
				setTimeout(() => this.__content.scrollTo({ top: 0, behavior: 'instant' }), 1);
			}

			if (this.__content.scrollTop) {
				this.__content.scrollTo({ top: 0, behavior: 'instant' });
				this.__expand();
				this.__autoExpanded = true;
				await (transitionDur && new Promise(r => setTimeout(r, transitionDur)));
			}
		}
	}

	async __focusOut({ relatedTarget }) {

		if (this.inactive
			|| !this.__autoExpanded
			|| isComposedAncestor(this.__content, relatedTarget)
		) {
			return;
		}

		this.__shrink();
		this.__autoExpanded = false;

		relatedTarget && await new Promise(r => relatedTarget.addEventListener('focus', r, { once: true }));
		const target = getComposedActiveElement();

		await (transitionDur && new Promise(r => setTimeout(r, transitionDur)));
		const activeElement = getComposedActiveElement();
		if (target === activeElement) {
			target.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' });
		}
	}

	__init_measureBaseHeight() {
		this.__baseHeight = this.__content.offsetHeight;
		this.__adjustToContent();
	}

	__init_setBaseHeight() {
		this.__maxHeight = this.height;

		requestAnimationFrame(() => {
			this.__init_measureBaseHeight();
		});
	}

	__reactToChanges() {
		this.__transitionAdded = true;
		this.__adjustToContent();
	}

	__shrink() {
		this.__transitionAdded = true;
		this.__maxHeight = this.height;
		this.expanded = false;
		this.__content.scrollTo({ top: 0, behavior: 'instant' });
	}

	__toggleOnClick() {
		if (this.expanded) {
			this.__shrink();
		} else {
			this.__expand();
		}

		this.__autoExpanded = false;
	}

	__transitionEvents(e) {
		this.dispatchEvent(new CustomEvent(e.type, { bubbles: true, composed: true, detail: e.detail }));
	}

}

customElements.define('d2l-more-less', MoreLess);
