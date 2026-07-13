import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';

export const RtlMixin = dedupeMixin(superclass => class extends superclass {

	static properties = {
		/**
		 * @ignore
		 */
		// eslint-disable-next-line lit/no-native-attributes
		dir: { type: String, reflect: true }
	};

	constructor() {
		super();
		this._localeSettings = getDocumentLocaleSettings();
		this.#handleLanguageChange();
	}

	connectedCallback() {
		super.connectedCallback();
		this._localeSettings.addChangeListener(this.#handleLanguageChange);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._localeSettings.removeChangeListener(this.#handleLanguageChange);
	}

	#handleLanguageChange = () => {
		const dir = document.documentElement.getAttribute('dir');
		// avoid reflecting "ltr" for better performance
		if (dir && (dir !== 'ltr' || this.dir === 'rtl')) {
			this.dir = dir;
		}
	};

});
