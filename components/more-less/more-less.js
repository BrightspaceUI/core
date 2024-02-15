import '../button/button-subtle.js';
import { css, html, LitElement } from 'lit';
import { getComposedChildren, isComposedAncestor } from '../../helpers/dom.js';
import { getComposedActiveElement } from '../../helpers/focus.js';
import { classMap } from 'lit/directives/class-map.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { styleMap } from 'lit/directives/style-map.js';

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * A component used to minimize the display of long content, while providing a way to reveal the full content.
 * @slot - Default content placed inside of the component
 */
class MoreLess extends LocalizeCoreElement(LitElement) {

	static get properties() {
		return {
			/**
			 * The gradient color of the blurring effect
			 * @type {string}
			 */
			blurColor: { type: String, attribute: 'blur-color' },

			/**
			 * Indicates whether element is in "more" state
			 * @type {boolean}
			 */
			expanded: { type: Boolean, reflect: true },

			/**
			 * The h-align property of the more-less button
			 * @type {'text'|''}
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
			__blurBackground: { state: true },
			__maxHeight: { state: true },
			__transitionAdded: { state: true }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}

			.d2l-more-less-content {
				overflow: hidden;
			}
			.d2l-more-less-transition {
				transition: max-height 400ms cubic-bezier(0, 0.7, 0.5, 1);
			}
			.d2l-more-less-blur {
				display: none;
			}
			:host(:not([expanded]):not([inactive])) .d2l-more-less-blur {
				bottom: 1em;
				content: "";
				display: block;
				height: 1em;
				margin-bottom: -0.75em;
				position: relative;
			}
			:host([inactive]) .d2l-more-less-toggle {
				display: none;
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

		this.__blurBackground = 'linear-gradient(rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 100%)';
		this.__transitionAdded = false;
		this.__maxHeight = this.height;

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

		this.__content && this.__content.removeEventListener('load', this.__bound_reactToChanges, true);
		this.__bound_reactToChanges = null;
		this.__bound_reactToMutationChanges = null;

		if (this.__contentSlot) {
			this.__contentSlot.removeEventListener('slotchange', this.__reactToChanges.bind(this));
			this.__contentSlot.removeEventListener('slotchange', this.__startObserving.bind(this));
		}
		this.__content && this.__content.removeEventListener('focusin', this.__focusIn.bind(this));
		this.__content && this.__content.removeEventListener('focusout', this.__focusOut.bind(this));
		this.shadowRoot.removeEventListener('transitionstart', this.__bound_transitionEvents);
		this.shadowRoot.removeEventListener('transitionend', this.__bound_transitionEvents);
		this.shadowRoot.removeEventListener('transitioncancel', this.__bound_transitionEvents);
		this.shadowRoot.removeEventListener('transitionrun', this.__bound_transitionEvents);
	}

	firstUpdated() {
		super.firstUpdated();

		this.__content = this.shadowRoot.querySelector('.d2l-more-less-content');
		this.__contentSlot = this.shadowRoot.querySelector('.d2l-more-less-content slot');
		this.__init_setupBlurColour();
		this.__init_setupListeners();

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
			<div id="${this.__contentId}" class=${classMap(contentClasses)} style=${styleMap({ maxHeight: `${this.__maxHeight}` })}>
				<slot></slot>
			</div>
			<div class="d2l-more-less-blur" style=${styleMap({ background: `${this.__blurBackground}` })}></div>
			<d2l-button-subtle
				class="d2l-more-less-toggle"
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
		this.__maxHeight = this.height;
	}

	__adjustToContent_makeInactive() {
		this.inactive = true;
		this.expanded = false;
		// Include 1px of given room to account for issues with Firefox rounding the content's scroll height
		this.__maxHeight = `${this.__content.scrollHeight + 1}px`;
	}

	__adjustToContent_resize(contentHeight) {
		// Include 1px of given room to account for issues with Firefox rounding the content's scroll height
		this.__maxHeight = `${contentHeight + 1}px`;
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

	__focusIn(e) {
		if (this.inactive || this.expanded) {
			return;
		}

		const target = e.composedPath()[0] || e.target;

		if (isSafari) {
			target.scrollIntoViewIfNeeded();
		}

		if (this.__content.scrollTop) {
			this.__content.scrollTo({ top: 0, behavior: 'instant' });
			this.__expand();
			if (reduceMotion) {
				target.scrollIntoView({ behavior: 'instant' });
			} else {
				setTimeout(() => target.getRootNode().activeElement === target && target.scrollIntoView({ behavior: 'smooth' }), 100);
			}
			this.__autoExpanded = true;
		}
	}

	__focusOut(e) {

		if (this.inactive
			|| !this.__autoExpanded
			|| isComposedAncestor(this.__content, e.relatedTarget)
		) {
			return;
		}

		const target = e.relatedTarget;

		this.__shrink();
		this.__autoExpanded = false;
		setTimeout(() => {
			const activeElement = getComposedActiveElement();
			if (target === activeElement || isComposedAncestor(target, activeElement)) {
				target.scrollIntoView({ behavior: 'instant' })
			}
		}, 400);
	}

	__init_measureBaseHeight() {
		this.__baseHeight = this.__content.offsetHeight;
		this.__adjustToContent();

		// react to images and whatnot loading
		this.__bound_reactToChanges = this.__bound_reactToChanges || this.__reactToChanges.bind(this);
		this.__content.addEventListener('load', this.__bound_reactToChanges, true);
	}

	__init_setBaseHeight() {
		this.__maxHeight = this.height;

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
		this.__maxHeight = this.height;
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
		this.dispatchEvent(new CustomEvent(e.type, { bubbles: true, composed: true, detail: e.detail }));
	}

}

customElements.define('d2l-more-less', MoreLess);
