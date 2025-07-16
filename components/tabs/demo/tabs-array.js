import '../tab.js';
import '../tabs.js';
import '../tab-panel.js';
import { html, LitElement } from 'lit';

class TabsArray extends LitElement {

	static get properties() {
		return {
			_tabs: { type: Array }
		};
	}

	constructor() {
		super();
		this._tabs = [{ text: 'Tab 1', selected: true }, { text: 'Tab 2' }, { text: 'Tab 3' }];
	}

	render() {
		return html`
			<d2l-tabs @d2l-tab-selected="${this._handleTabSelected}">
				${this._tabs.map((tab, index) => html`
					<d2l-tab text="${tab.text}" ?selected="${tab.selected}" slot="tabs" id="tab-${index}"></d2l-tab>
					<d2l-tab-panel labelled-by="tab-${index}" slot="panels">
						${tab.text} content goes here.
					</d2l-tab-panel>`
				)}
			</d2l-tabs>
		`;
	}

	_handleTabSelected(e) {
		const selectedTab = e.target;
		this._tabs = this._tabs.map(tab => {
			return {
				...tab,
				selected: tab.text === selectedTab.text
			};
		});
	}
}

customElements.define('d2l-tabs-array', TabsArray);
