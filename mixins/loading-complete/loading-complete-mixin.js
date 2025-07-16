import { dedupeMixin } from '@open-wc/dedupe-mixin';

const timeoutMs = 30000;

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
			const timeout = setTimeout(() => {
				console.warn(`Failed to load ${this.localName} in ${timeoutMs}ms: resolveLoadingComplete was not called`);
			}, timeoutMs);

			this.#loadingCompleteResolve = () => {
				clearTimeout(timeout);
				resolve();
			};
		})
		: Promise.resolve();

});
