import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';

/**
 * @template {ReactiveElementClassType} S
 * @param {S} superclass
 */
const InternalRtlMixin = superclass => class extends superclass {
	static get properties() {
		return {
			/**
			 * @ignore
			 */
			// eslint-disable-next-line lit/no-native-attributes
			dir: { type: String, reflect: true }
		};
	}

	constructor(...args) {
		super(...args);
		this._localeSettings = getDocumentLocaleSettings();
		this._handleLanguageChange = this._handleLanguageChange.bind(this);
		this._handleLanguageChange();
	}

	connectedCallback() {
		super.connectedCallback();
		this._localeSettings.addChangeListener(this._handleLanguageChange);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._localeSettings.removeChangeListener(this._handleLanguageChange);
	}

	_handleLanguageChange() {
		const dir = document.documentElement.getAttribute('dir');
		// avoid reflecting "ltr" for better performance
		if (dir && (dir !== 'ltr' || this.dir === 'rtl')) {
			this.dir = dir;
		}
	}

};

export const RtlMixin = dedupeMixin(InternalRtlMixin);
