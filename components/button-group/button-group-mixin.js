import { FocusVisiblePolyfillMixin } from '../../mixins/focus-visible-polyfill-mixin.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';

export const ButtonGroupMixin = superclass => class extends LocalizeCoreElement(FocusVisiblePolyfillMixin(superclass)) {

	static get properties() {
		return {
		};
	}

	// constructor() {
	// 	super();
	// 	// this.primary = false;
	// 	// this.type = 'button';
	// }

};
