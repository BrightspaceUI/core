/**
 * Mixin to be applied to custom form element containers. This allows the findFormElements
 * helper to know how to look in the shadow DOM of elements with this mixin applied.
 * When applied to a custom element, form elements within will participate in the form.
 */
export const FormElementContainerMixin = superClass => class extends superClass {
	get isCustomFormElementContainer() {
		return true;
	}
};
