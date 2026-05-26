/**
 * When applied to a custom element, form elements within will participate in the form.
 */
export const FormElementContainerMixin = superClass => class extends superClass {
	get isCustomFormElementContainer() {
		return true;
	}
};
