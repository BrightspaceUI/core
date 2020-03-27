export class AsyncStateEvent extends CustomEvent {
	constructor(promise) {
		super('pending-state', {
			composed: true,
			bubbles: true,
			detail: { promise }
		});
	}
};
