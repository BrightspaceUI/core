import { dedupeMixin } from '@open-wc/dedupe-mixin';

export const LoadingCompleteMixin = dedupeMixin((superclass) => class extends superclass {
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

	#loadingCompleteResolve;

	#loadingCompletePromise = !Object.prototype.hasOwnProperty.call(this.constructor.prototype, 'getLoadingComplete')
		? new Promise(resolve => {
			const TIMEOUT_MS = 1000 * 30;

			const timeout = setTimeout(() => {
				console.warn(`Failed to resolve ${this.localName} in ${TIMEOUT_MS}ms: resolveLoadingComplete was not called`);
			}, TIMEOUT_MS);

			this.#loadingCompleteResolve = () => {
				clearTimeout(timeout);
				resolve();
			};
		})
		: Promise.resolve();

});
