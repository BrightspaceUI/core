import { html, LitElement } from 'lit';
import { ProviderMixin, requestInstance } from '../../mixins/provider-mixin.js';

export class HeadingLevelController {

	constructor(host) {
		this._host = host;
		host.addController(this);
		this.level = 1;
	}

	hostConnected() {
		let level = requestInstance(this._host, 'd2l-heading-level')();
		if (level === undefined) {
			level = 1;
		}
		this.level = level;
	}

}

class HeadingStack extends ProviderMixin(LitElement) {

	constructor() {
		super();
		const headingLevelController = new HeadingLevelController(this);
		this.provideInstance('d2l-heading-level', () => {
			let level = headingLevelController.level;
			if (level < 6) {
				level++;
			}
			return level;
		});
	}

	render() {
		return html`<slot></slot>`;
	}

}
customElements.define('d2l-heading-stack', HeadingStack);
