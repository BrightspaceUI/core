import { html, literal } from 'lit/static-html.js';
import { HeadingLevelController } from '../heading-stack.js';
import { LitElement } from 'lit';

class TestHeadingStack extends LitElement {

	constructor() {
		super();
		this._headingLevelController = new HeadingLevelController(this);
	}

	render() {
		let headingLevel;
		switch (this._headingLevelController.level) {
			case 1:
				headingLevel = literal`h1`;
				break;
			case 2:
				headingLevel = literal`h2`;
				break;
			case 3:
				headingLevel = literal`h3`;
				break;
			case 4:
				headingLevel = literal`h4`;
				break;
			case 5:
				headingLevel = literal`h5`;
				break;
			case 6:
				headingLevel = literal`h6`;
				break;
		}
		return html`
			<${headingLevel}>heading</${headingLevel}>
			<slot></slot>
		`;
	}

}
customElements.define('d2l-test-heading-stack', TestHeadingStack);
