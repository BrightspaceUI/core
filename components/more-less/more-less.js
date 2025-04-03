import '../button/button-subtle.js';
import { css, html, LitElement } from 'lit';
import { getComposedChildren, isComposedAncestor } from '../../helpers/dom.js';
import { classMap } from 'lit/directives/class-map.js';
import { getComposedActiveElement } from '../../helpers/focus.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { styleMap } from 'lit/directives/style-map.js';

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const transitionDur = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 400;

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
				display: block;
			}

			.d2l-more-less-content {
				overflow: hidden;
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
			<d2l-button-subtle
				class="d2l-more-less-toggle"
				icon="${this.__computeIcon()}"
				aria-controls="${this.__contentId}"
				control-expanded="${this.__computeAriaExpanded()}"
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

	async __focusIn(e) {
		if (this.inactive || this.expanded) {
			return;
		}

		const target = e.composedPath()[0] || e.target;

		if (isSafari) {
			target.scrollIntoViewIfNeeded?.();
			setTimeout(() => this.__content.scrollTo({ top: 0, behavior: 'instant' }), 1);
		}

		if (this.__content.scrollTop) {
			this.__content.scrollTo({ top: 0, behavior: 'instant' });
			this.__expand();
			this.__autoExpanded = true;
			await (transitionDur && new Promise(r => setTimeout(r, transitionDur)));
			if (target.getRootNode().activeElement === target) {
				target.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' });
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
		this.__content.scrollTo({ top: 0, behavior: 'instant' });
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
