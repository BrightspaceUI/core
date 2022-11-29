import { html, LitElement } from 'lit';

export class BuildInfo extends LitElement {
	static get properties() {
		return {
			_buildDate: { state: true },
			_buildVersion: { state: true },
		};
	}

	constructor() {
		super();

		// These window vars will be automatically replaced when building.
		const buildDate = Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto' }).format(new Date());
		this._buildDate = window.__buildDate__ ?? buildDate;
		this._buildVersion = window.__buildVersion__ ?? 'Local dev';
	}

	render() {
		return html`
			<ul>
				<li><b>Build version:</b> ${this._buildVersion}</li>
				<li><b>Build date:</b> ${this._buildDate}</li>
			</ul>
		`;
	}
}

customElements.define('d2l-build-info', BuildInfo);
