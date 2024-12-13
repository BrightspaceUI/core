
export const asyncStates = {
	initial: 'initial',
	pending: 'pending',
	complete: 'complete'
};

/**
 * @typedef {import('@open-wc/dedupe-mixin').Constructor<import('lit').ReactiveElement>} ReactiveElementConstructor
 * @typedef {ReactiveElementConstructor & Pick<typeof import('lit').ReactiveElement, keyof typeof import('lit').ReactiveElement>} ReactiveElementClassType
 */

/**
 * @template {ReactiveElementClassType} S
 * @param {S} superclass
 */
export const AsyncContainerMixin = superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * @ignore
			 */
			asyncPendingDelay: { type: Number, attribute: 'async-pending-delay' },
			/**
			 * @ignore
			 */
			asyncState: { type: String }
		};
	}

	constructor(...args) {
		super(...args);
		this._initializeAsyncState();
		this.asyncPendingDelay = 0;
		this._handleAsyncItemState = this._handleAsyncItemState.bind(this);
		if (!this.asyncContainerCustom) {
			this.addEventListener('pending-state', this._handleAsyncItemState);
		}
	}

	get asyncContainerCustom() {
		return false;
	}

	resetAsyncState() {
		this._initializeAsyncState();
	}

	async _handleAsyncItemState(e) {
		const promise = e.detail.promise;

		if (!promise) return;
		if (this.asyncState === asyncStates.complete) return;

		this._asyncPromises.push(promise);
		this._asyncCounts.pending++;

		if (this.asyncState === asyncStates.initial && this._asyncTimeoutId === null) {
			this._asyncTimeoutId = setTimeout(() => {
				this._asyncTimeoutId = null;
				if (this.asyncState === asyncStates.initial) {
					this.asyncState = asyncStates.pending;
				}
			}, this.asyncPendingDelay);
		}

		try {
			await promise;
			if (this._asyncPromises.indexOf(promise) !== -1) this._asyncCounts.fulfilled++;
		} catch {
			if (this._asyncPromises.indexOf(promise) !== -1) this._asyncCounts.rejected++;
		} finally {
			if (this._asyncPromises.indexOf(promise) !== -1) {
				this._asyncCounts.pending--;
				if (this._asyncCounts.pending === 0) this.asyncState = asyncStates.complete;
			}
		}

	}

	_initializeAsyncState() {
		if (this._asyncTimeoutId !== null) clearTimeout(this._asyncTimeoutId);
		this.asyncState = asyncStates.initial;
		this._asyncTimeoutId = null;
		this._asyncPromises = [];
		this._asyncCounts = {
			pending: 0,
			fulfilled: 0,
			rejected: 0
		};
	}

};
