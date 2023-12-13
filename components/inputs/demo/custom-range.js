import '../input-date-time-range.js';
import { html, LitElement } from 'lit';

class CustomRangeDemo extends LitElement {

	render() {
		return html`
			<d2l-input-date-time-range child-labels-hidden label="Assignment Dates"></d2l-input-date-time-range>
		`;
	}

}
customElements.define('custom-range-demo', CustomRangeDemo);
