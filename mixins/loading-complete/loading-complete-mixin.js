import { dedupeMixin } from '@open-wc/dedupe-mixin';

/**
 * @template {ReactiveElementConstructor & (new (...args: any[]) => { getLoadingComplete?(): Promise<any> })} S
 * @param {S} superclass
 */
export const InternalLoadingCompleteMixin = (superclass) => class extends superclass {
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
		? new Promise(resolve => this.#loadingCompleteResolve = resolve)
		: Promise.resolve();

};

export const LoadingCompleteMixin = dedupeMixin(InternalLoadingCompleteMixin);
