import '../button/button-subtle.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getComposedChildren, isComposedAncestor } from '../../helpers/dom.js';
import { classMap} from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeMixin } from '../../mixins/localize-mixin.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { styleMap } from 'lit-html/directives/style-map.js';

class MoreLess extends LocalizeMixin(LitElement)  {

	static get properties() {
		return {
			blurColor: { type: String, attribute: 'blur-color' }, // The gradient color of the blurring effect. Must be hex color code.
			expanded: { type: Boolean, reflect: true }, // Indicates whether element is in "more" state.
			hAlign: { type: String, attribute: 'h-align' }, // The h-align property of the more-less button.
			height: { type: String }, // The maximum height of the content when in "less" state.
			inactive: { type: Boolean, reflect: true }, // Whether the component is active or inactive.
			__blurBackground: { type: String },
			__contentHeight: { type:String },
			__langResources: { type: Object },
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
		this.__langResources = {
			'ar': {
				more: 'المزيد',
				less: 'أقل'
			},
			'en': {
				more: 'more',
				less: 'less'
			},
			'es': {
				more: 'más',
				less: 'menos'
			},
			'fr': {
				more: 'plus',
				less: 'moins'
			},
			'ja': {
				more: 'より多い',
				less: 'より少ない'
			},
			'ko': {
				more: '더 보기',
				less: '축소'
			},
			'nl': {
				more: 'meer',
				less: 'minder'
			},
			'pt': {
				more: 'mais',
				less: 'menos'
			},
			'sv': {
				more: 'mer',
				less: 'mindre'
			},
			'tr': {
				more: 'diğer',
				less: 'daha az'
			},
			'zh': {
				more: '更多',
				less: '更少'
			},
			'zh-tw': {
				more: '較多',
				less: '較少'
			}
		};

		this.height = '4em';

		this.__baseHeight = 0;
		this.__resizeObserver = null;
		this.__content = null;
		this.__contentSlot = null;
		this.__autoExpanded = false;
		this.__shift = false;
		this.__bound_reactToChanges = null;
		this.__bound_reactToMutationChanges = null;
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
	}

	render() {
		const contentClasses = {
			'more-less-content': true,
			'more-less-transition': this.__transitionAdded
		};

		return html`
			<div class=${classMap(contentClasses)} style=${styleMap({ height: `${this.__contentHeight}` })}>
				<slot></slot>
			</div>
			<div class="more-less-blur" style=${styleMap({ background: `${this.__blurBackground}`})}></div>
			<d2l-button-subtle
				class="more-less-toggle"
				icon="${this.__computeIcon()}"
				aria-hidden="true"
				@click="${this.__toggleOnClick}"
				text="${this.__computeText()}"
				h-align="${ifDefined(this.hAlign)}">
			</d2l-button-subtle>
		`;
	}

	getLanguage(langs) {
		for (let i = 0; i < langs.length; i++) {
			if (this.__langResources[langs[i]]) {
				return langs[i];
			}
		}

		return null;
	}

	async getLangResources(lang) {
		const proto = this.constructor.prototype;
		this.checkLocalizationCache(proto);

		const namespace = `more-less:${lang}`;

		if (proto.__localizationCache.requests[namespace]) {
			return proto.__localizationCache.requests[namespace];
		}

		const result = this.__langResources[lang];

		proto.__localizationCache.requests[namespace] = result;
		return result;
	}

	__init_setBaseHeight() {
		this.__contentHeight = this.height;

		requestAnimationFrame(() => {
			this.__init_measureBaseHeight();
		});
	}

	__init_measureBaseHeight() {
		this.__baseHeight = this.__content.offsetHeight;
		this.__adjustToContent();

		// react to images and whatnot loading
		this.__bound_reactToChanges = this.__bound_reactToChanges || this.__reactToChanges.bind(this);
		this.__content.addEventListener('load', this.__bound_reactToChanges, true);
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

	__computeText() {
		return this.localize(this.expanded ? 'less' : 'more');
	}

	__computeIcon() {
		return this.expanded ? 'd2l-tier1:chevron-up' : 'd2l-tier1:chevron-down';
	}

	__toggleOnClick() {
		if (this.expanded) {
			this.__shrink();
		} else {
			this.__expand();
		}

		this.__autoExpanded = false;
	}

	__shrink() {
		this.__transitionAdded = true;
		this.__contentHeight = this.height;
		this.expanded = false;
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

	__adjustToContent_makeInactive() {
		this.inactive = true;
		this.expanded = false;
		this.__contentHeight = null;
	}

	__adjustToContent_resize(contentHeight) {
		this.__contentHeight = `${contentHeight}px`;
	}

	__adjustToContent_makeActive() {
		this.inactive = false;
		this.__contentHeight = this.height;
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

	__isOwnMutation(mutation) {
		return mutation.target === this.__content
			&& (mutation.type === 'style' || mutation.type === 'attributes');
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

}

customElements.define('d2l-more-less', MoreLess);
