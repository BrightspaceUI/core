export const ToolbarItemMixin = superclass => class extends superclass {

	static properties = {
		_activeFocusable: { state: true }
	};

	constructor() {
		super();
		this._activeFocusable = false;
	}

	get isToolbarItem() {
		return true;
	}

};
