import { dedupeMixin } from '@open-wc/dedupe-mixin';

export const LoadingCompleteMixin = dedupeMixin((superclass) => class extends superclass {

	#loadingCompleteResolve;

	// eslint-disable-next-line sort-class-members/sort-class-members
	#loadingCompletePromise = this.getLoadingComplete === this.#getLoadingComplete
		? new Promise(resolve => this.#loadingCompleteResolve = resolve)
		: Promise.resolve();

	get getLoadingComplete() {
		return this.#getLoadingComplete;
	}

	get loadingComplete() {
		return this.getLoadingComplete();
	}

	get resolveLoadingComplete() {
		return this.#resolveLoadingComplete.bind(this);
	}

	async #getLoadingComplete() {
		await super.getLoadingComplete?.();
		return this.#loadingCompletePromise;
	}

	#resolveLoadingComplete() {
		if (this.#loadingCompleteResolve) {
			this.#loadingCompleteResolve();
			this.#loadingCompleteResolve = null;
		}
	}

});
