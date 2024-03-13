import { dedupeMixin } from '@open-wc/dedupe-mixin';

export const LoadingCompleteMixin = dedupeMixin((superclass) => class extends superclass {

	#loadingCompleteResolve;

	// eslint-disable-next-line sort-class-members/sort-class-members
	#loadingCompletePromise = !Object.prototype.hasOwnProperty.call(this.constructor.prototype, 'getLoadingComplete')
		? new Promise(resolve => this.#loadingCompleteResolve = resolve)
		: Promise.resolve();

	get loadingComplete() {
		return this.getLoadingComplete();
	}

	get resolveLoadingComplete() {
		return () => {
			if (this.#loadingCompleteResolve) {
				this.#loadingCompleteResolve();
				this.#loadingCompleteResolve = null;
			}
		};
	}

	async getLoadingComplete() {
		await super.getLoadingComplete?.();
		return this.#loadingCompletePromise;
	}

});
