export class SelectionInfoController {

	static get properties() {
		return {
			keys: { type: Object },
			state: { type: String }
		};
	}

	constructor(host) {
		this._host = host;
		this._keys = [];
		this._provider = null;
		this._state = 'none';
	}

	get keys() {
		return this._keys;
	}
	set keys(value) {
		this._keys = value;
		this._host.requestUpdate();
	}

	get state() {
		return this._state;
	}
	set state(value) {
		this._state = value;
		this._host.requestUpdate();
	}

	hostConnected() {
		const evt = new CustomEvent('d2l-selection-subscriber-subscribe', {
			bubbles: true,
			composed: true,
			detail: {
				controller: this
			}
		});
		this._host.dispatchEvent(evt);
		this._provider = evt.detail.provider;
	}

	hostDisconnected() {
		if (!this._provider) return;
		this._provider.unsubscribeObserver(this._host);
		this._provider = null;
	}

}
