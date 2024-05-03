import '../input-radio-spacer.js';
import { html, LitElement } from 'lit';
import { inlineHelpStyles } from '../input-inline-help.js';
import { radioStyles } from '../input-radio-styles.js';

class TestInputRadioSpacer extends LitElement {

	static get styles() {
		return [ radioStyles, inlineHelpStyles ];
	}

	render() {
		return html`
			<div>
				<label class="d2l-input-radio-label">
					<input type="radio" aria-describedby="desc1" name="myGroup" value="normal">
					Option 1
				</label>
				<d2l-input-radio-spacer id="desc1" class="d2l-input-inline-help">
					Additional content can go here and will line up nicely with the edge of the radio.
				</d2l-input-radio-spacer>
			</div>
			<div>
				<label class="d2l-input-radio-label">
					<input type="radio" aria-describedby="desc2" name="myGroup" value="normal">
					Option 1 (Deadlights jack lad schooner scallywag dance the hempen jig carouser broadside cable strike colors. Bring a spring upon her cable holystone blow the man down spanker.)
				</label>
				<d2l-input-radio-spacer id="desc2" class="d2l-input-inline-help">
					Trysail Sail ho Corsair red ensign hulk smartly boom jib rum gangway. Case shot Shiver me timbers gangplank crack Jennys tea cup ballast Blimey lee snow crow's nest rutters. Fluke jib scourge of the seven seas boatswain schooner gaff booty Jack Tar transom spirits.
				</d2l-input-radio-spacer>
			</div>
		`;
	}

	focus() {
		const elem = this.shadowRoot && this.shadowRoot.querySelector('input');
		if (elem) elem.focus();
	}

}

customElements.define('d2l-test-input-radio-spacer', TestInputRadioSpacer);
