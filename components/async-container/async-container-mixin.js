
export const asyncStates = {
	initial: 'initial',
	pending: 'pending',
	success: 'success',
	failure: 'failure'
};

export const AsyncContainerMixin = superclass => class extends superclass {

	static get properties() {
		return {
			asyncState: { type: String }
		};
	}

	constructor() {
		super();
		this._initializeAsyncState();
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
		if (this.asyncState === asyncStates.success
			|| this.asyncState === asyncStates.failure) return;

		this._asyncPromises.push(promise);
		this._asyncCounts.pending++;
		this.asyncState = asyncStates.pending;

		try {
			await promise;
			if (this._asyncPromises.indexOf(promise) !== -1) this._asyncCounts.fulfilled++;
		} catch (error) {
			if (this._asyncPromises.indexOf(promise) !== -1) this._asyncCounts.rejected++;
		} finally {
			if (this._asyncPromises.indexOf(promise) !== -1) {
				this._asyncCounts.pending--;
				if (this._asyncCounts.pending === 0) {
					if (this._asyncCounts.rejected > 0) {
						this.asyncState = asyncStates.failure;
					} else if (this._asyncCounts.pending === 0)  {
						this.asyncState = asyncStates.success;
					}
				}
			}
		}

	}

	_initializeAsyncState() {
		this.asyncState = asyncStates.initial;
		this._asyncPromises = [];
		this._asyncCounts = {
			pending: 0,
			fulfilled: 0,
			rejected: 0
		};
	}

};
