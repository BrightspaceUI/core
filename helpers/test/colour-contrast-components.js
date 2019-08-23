import { html, LitElement } from 'lit-element/lit-element.js';

class ColourContrastTest extends LitElement {

	getBackgroundColour(rating) {
		const background = this.shadowRoot.querySelector(`#background-${rating}`);
		return getComputedStyle(background).getPropertyValue('background-color');
	}

	getForegroundColour(rating) {
		const foreground =  this.shadowRoot.querySelector(`#foreground-${rating}`);
		return getComputedStyle(foreground).getPropertyValue('color');
	}

	render() {
		return html`
			<div>
				<div id="background-AAA" style="background-color: #0000FF">
					<p id="foreground-AAA" style="color: #FFFFFF"></p>
				</div>
				<div id="background-AA" style="background-color: #FFFFFF">
					<p id="foreground-AA" style="color: #929292"></p>
				</div>
				<div id="background-F" style="background-color: #BBBBBB">
					<p id="foreground-F" style="color: #FFFFFF"></p>
				</div>
			</div>
		`;
	}

}

customElements.define('d2l-test-colour-contrast', ColourContrastTest);
