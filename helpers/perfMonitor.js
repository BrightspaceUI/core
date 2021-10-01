export class PerfMonitor {

	constructor(host) {
		this.constructedTime = window.performance.now();
		this.host = host;
	}

	hostUpdated() {
		if (!window.d2lPerfTestInProgress || this.renderedTime !== undefined) return;
		setTimeout(async() => {
			await this.host.updateComplete;
			this.renderedTime = window.performance.now();
			this.host.dispatchEvent(
				new CustomEvent(
					'd2l-component-perf',
					{ bubbles: true, composed: true, detail: { value: Math.round(this.renderedTime - this.constructedTime) } })
			);
		});
	}

}
