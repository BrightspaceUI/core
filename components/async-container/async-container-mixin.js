
export const asyncStates = {
	initial: 'initial',
	pending: 'pending',
	complete: 'complete'
};

export const AsyncContainerMixin = superclass => class extends superclass {

	static get properties() {
		return {
			asyncPendingDelay: { type: Number, attribute: 'async-pending-delay' },
			asyncState: { type: String }
		};
	}

	constructor() {
		super();
		this._initializeAsyncState();
		this.asyncPendingDelay = 0;
		if (!this.asyncContainer) {
			this.addEventListener('pending-state', this._handleAsyncItemState.bind(this));
		}
	}

	firstUpdated() {
		if (!this.asyncContainer) return;
		const container = this.asyncContainer();
		if (container) {
			container.addEventListener('pending-state', this._handleAsyncItemState.bind(this));
		}
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

		if (this.asyncState === asyncStates.initial) {
			if (this.asyncPendingDelay > 0) {
				if (this._asyncTimeoutId === null) {

					this._asyncTimeoutId = setTimeout(() => {
						this._asyncTimeoutId = null;
						if (this.asyncState === asyncStates.initial) {
							this.asyncState = asyncStates.pending;
						}
					}, this.asyncPendingDelay);

				}
			} else {
				this.asyncState = asyncStates.pending;
			}
		}

		try {
			await promise;
			if (this._asyncPromises.indexOf(promise) !== -1) this._asyncCounts.fulfilled++;
		} catch (error) {
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
