import '../button/button-subtle.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getComposedChildren, isComposedAncestor } from '../../helpers/dom.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { styleMap } from 'lit-html/directives/style-map.js';

/**
 * The `d2l-more-less` element can be used to minimize the display of long content, while providing a way to reveal the full content.
 * @slot - Default content placed inside of the component
 * @fires d2l-more-less-render - Dispatched when the component finishes rendering
 */
class MoreLess extends LocalizeCoreElement(LitElement) {

	static get properties() {
		return {
			/**
			 * The gradient color of the blurring effect.
			 * @type {"hex color code"}
			 */
			blurColor: { type: String, attribute: 'blur-color' },

			/**
			 * Indicates whether element is in "more" state.
			 */
			expanded: { type: Boolean, reflect: true },

			/**
			 * The h-align property of the more-less button.
			 * @type {""|"text"}
			 */
			hAlign: { type: String, attribute: 'h-align' },

			/**
			 * The maximum height of the content when in "less" state.
			 */
			height: { type: String },

			/**
			 * Whether the component is active or inactive.
			 */
			inactive: { type: Boolean, reflect: true },
			__blurBackground: { type: String },
			__contentHeight: { type: String },
			__transitionAdded: { type: Boolean }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}

			.more-less-content {
				overflow: hidden;
			}
			.more-less-transition {
				transition: height 400ms cubic-bezier(0, 0.7, 0.5, 1);
			}
			.more-less-blur {
				display: none;
			}
			:host(:not([expanded]):not([inactive])) .more-less-blur {
				display: block;
				content: "";
				position: relative;
				height: 1em;
				bottom: 1em;
				margin-bottom: -0.75em;
			}
			:host([inactive]) .more-less-toggle {
				display: none;
			}`;
	}

	constructor() {
		super();

		this.__blurBackground = 'linear-gradient(rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 100%)';
		this.__transitionAdded = false;

		this.expanded = false;
		this.height = '4em';

		this.__baseHeight = 0;
		this.__contentId = getUniqueId();
		this.__resizeObserver = null;
		this.__content = null;
		this.__contentSlot = null;
		this.__autoExpanded = false;
		this.__shift = false;
		this.__bound_reactToChanges = null;
		this.__bound_reactToMutationChanges = null;
		this.__bound_transitionEvents = null;
	}

	disconnectedCallback() {
		super.disconnectedCallback();

		if (this.__resizeObserver) {
			this.__resizeObserver.disconnect();
			this.__resizeObserver = null;
		}
		if (this.__mutationObserver) {
			this.__mutationObserver.disconnect();
			this.__mutationObserver = null;
		}

		this.__content.removeEventListener('load', this.__bound_reactToChanges, true);
		this.__bound_reactToChanges = null;
		this.__bound_reactToMutationChanges = null;

		if (this.__contentSlot) {
			this.__contentSlot.removeEventListener('slotchange', this.__reactToChanges.bind(this));
			this.__contentSlot.removeEventListener('slotchange', this.__startObserving.bind(this));
		}
		this.__content.removeEventListener('focusin', this.__focusIn.bind(this));
		this.__content.removeEventListener('focusout', this.__focusOut.bind(this));
		this.shadowRoot.removeEventListener('transitionstart', this.__bound_transitionEvents);
		this.shadowRoot.removeEventListener('transitionend', this.__bound_transitionEvents);
		this.shadowRoot.removeEventListener('transitioncancel', this.__bound_transitionEvents);
		this.shadowRoot.removeEventListener('transitionrun', this.__bound_transitionEvents);
	}

	firstUpdated() {
		super.firstUpdated();

		this.__content = this.shadowRoot.querySelector('.more-less-content');
		this.__contentSlot = this.shadowRoot.querySelector('.more-less-content slot');
		if (this.__content.offsetParent !== null) {
			this.__init_setBaseHeight();
		}
		this.__init_setupBlurColour();
		this.__init_setupListeners();

		this.__bound_transitionEvents = this.__transitionEvents.bind(this);
		this.shadowRoot.addEventListener('transitionstart', this.__bound_transitionEvents);
		this.shadowRoot.addEventListener('transitionend', this.__bound_transitionEvents);
		this.shadowRoot.addEventListener('transitioncancel', this.__bound_transitionEvents);
		this.shadowRoot.addEventListener('transitionrun', this.__bound_transitionEvents);
	}

	render() {
		requestAnimationFrame(
			() => this.dispatchEvent(new CustomEvent('d2l-more-less-render', {
				bubbles: false,
				composed: false
			}))
		);
		const contentClasses = {
			'more-less-content': true,
			'more-less-transition': this.__transitionAdded
		};
		return html`
			<div id="${this.__contentId}" class=${classMap(contentClasses)} style=${styleMap({ height: `${this.__contentHeight}` })}>
				<slot></slot>
			</div>
			<div class="more-less-blur" style=${styleMap({ background: `${this.__blurBackground}`})}></div>
			<d2l-button-subtle
				class="more-less-toggle"
				icon="${this.__computeIcon()}"
				aria-controls="${this.__contentId}"
				aria-expanded="${this.__computeAriaExpanded()}"
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
				this.__adjustToContent_makeInactive();
			}
			return;
		}

		if (this.expanded && contentHeight !== currentHeight) {
			this.__adjustToContent_resize.bind(this, contentHeight)();
			return;
		}

		if (this.inactive) {
			this.__adjustToContent_makeActive();
		}
	}

	__adjustToContent_makeActive() {
		this.inactive = false;
		this.__contentHeight = this.height;
	}

	__adjustToContent_makeInactive() {
		this.inactive = true;
		this.expanded = false;
		this.__contentHeight = 'unset';
	}

	__adjustToContent_resize(contentHeight) {
		this.__contentHeight = `${contentHeight}px`;
	}

	__computeAriaExpanded() {
		return this.expanded ? 'true' : 'false';
	}

	__computeIcon() {
		return this.expanded ? 'd2l-tier1:chevron-up' : 'd2l-tier1:chevron-down';
	}

	__computeText() {
		return this.localize(this.expanded ? 'components.more-less.less' : 'components.more-less.more');
	}

	__expand() {
		this.__transitionAdded = true;
		this.__contentHeight = `${this.__content.scrollHeight}px`;
		this.expanded = true;
	}

	__focusIn() {
		if (this.inactive || this.expanded) {
			return;
		}

		this.__expand();
		this.__autoExpanded = true;
	}

	__focusOut(e) {
		if (this.inactive
			|| !this.__autoExpanded
			|| isComposedAncestor(this.__content, e.relatedTarget)
		) {
			return;
		}

		this.__shrink();
		this.__autoExpanded = false;
	}

	__init_measureBaseHeight() {
		this.__baseHeight = this.__content.offsetHeight;
		this.__adjustToContent();

		// react to images and whatnot loading
		this.__bound_reactToChanges = this.__bound_reactToChanges || this.__reactToChanges.bind(this);
		this.__content.addEventListener('load', this.__bound_reactToChanges, true);
	}

	__init_setBaseHeight() {
		this.__contentHeight = this.height;

		requestAnimationFrame(() => {
			this.__init_measureBaseHeight();
		});
	}

	__init_setupBlurColour() {
		if (!this.blurColor
			|| this.blurColor[0] !== '#'
			|| (this.blurColor.length !== 4 && this.blurColor.length !== 7)
		) {
			return;
		}

		let hex = this.blurColor.substring(1);

		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		if (hex.length === 3) {
			const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
			hex = hex.replace(shorthandRegex, (m, r, g, b) => {
				return r + r + g + g + b + b;
			});
		}

		const bigint = parseInt(hex, 16);
		const r = (bigint >> 16) & 255;
		const g = (bigint >> 8) & 255;
		const b = bigint & 255;

		this.__blurBackground =
			`linear-gradient(rgba(${r}, ${g}, ${b}, 0) 0%, rgb(${r}, ${g}, ${b}) 100%)`;
	}

	__init_setupListeners() {
		this.__startObserving();
		if (this.__contentSlot) {
			this.__contentSlot.addEventListener('slotchange', this.__reactToChanges.bind(this));
			this.__contentSlot.addEventListener('slotchange', this.__startObserving.bind(this));
		}
		this.__content.addEventListener('focusin', this.__focusIn.bind(this));
		this.__content.addEventListener('focusout', this.__focusOut.bind(this));
	}

	__isOwnMutation(mutation) {
		return mutation.target === this.__content
			&& (mutation.type === 'style' || mutation.type === 'attributes');
	}

	__reactToChanges() {
		if (!this.__transitionAdded) {
			this.__reactToChanges_setupTransition();
		} else {
			this.__adjustToContent();
		}
	}

	__reactToChanges_setupTransition() {
		this.__transitionAdded = true;
		this.__adjustToContent();
	}

	__reactToMutationChanges(mutations) {
		if (mutations
			&& Array.isArray(mutations)
			&& mutations.every(this.__isOwnMutation.bind(this))
		) {
			return;
		}

		this.__reactToChanges();
	}

	__shrink() {
		this.__transitionAdded = true;
		this.__contentHeight = this.height;
		this.expanded = false;
	}

	__startObserving() {
		this.__bound_reactToChanges = this.__bound_reactToChanges || this.__reactToChanges.bind(this);
		this.__bound_reactToMutationChanges = this.__bound_reactToMutationChanges || this.__reactToMutationChanges.bind(this);
		this.__resizeObserver = this.__resizeObserver || new ResizeObserver(this.__bound_reactToChanges);
		this.__resizeObserver.disconnect();
		this.__mutationObserver = this.__mutationObserver || new MutationObserver(this.__bound_reactToMutationChanges);
		this.__mutationObserver.disconnect();

		if (this.__contentSlot) {
			const children = getComposedChildren(this.__contentSlot);
			for (let i = 0; i < children.length; ++i) {
				this.__resizeObserver.observe(children[i]);
				this.__mutationObserver.observe(children[i], {
					childList: true,
					subtree: true,
					characterData: true,
					attributes: true
				});
			}
		}
		this.__resizeObserver.observe(this.__content);
		this.__mutationObserver.observe(this.__content, {
			childList: true,
			subtree: true,
			characterData: true,
			attributes: true
		});
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
		this.dispatchEvent(new CustomEvent(e.type, { bubbles: true, composed: true, detail: e.detail}));
	}

}

customElements.define('d2l-more-less', MoreLess);
