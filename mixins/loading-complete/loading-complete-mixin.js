export const LoadingCompleteMixin = (superclass) => class extends superclass {

	constructor() {
		super();
		this._loadingCompletePromise = new Promise(resolve => {
			this._loadingCompleteResolve = resolve;
		});
	}

	getLoadingComplete() {
		return this._loadingCompletePromise;
	}

	loadingComplete() {
		if (this._loadingCompleteResolve) {
			this._loadingCompleteResolve();
			this._loadingCompleteResolve = null;
		}
	}

};
