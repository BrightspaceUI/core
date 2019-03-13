let _i18nextInitialized = false;
/**
 * Localize mixin
 *
 * @polymer
 * @mixinFunction
 **/
export const localize = i18next => baseElement => class extends baseElement {
	connectedCallback() {
		if (!_i18nextInitialized) {
			i18next.on('initialized', options => {
				_i18nextInitialized = true;
				if (super.connectedCallback) {
					super.connectedCallback();
				}
			});
		}
	}
};
