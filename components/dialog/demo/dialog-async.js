import '../../button/button.js';
import '../../list/list.js';
import '../../list/list-item.js';
import '../../list/list-item-content.js';
import '../../loading-spinner/loading-spinner.js';
import '../../dialog/dialog.js';
import { css, html, LitElement, noChange } from 'lit';
import { guard } from 'lit/directives/guard.js';
import { LoadingCompleteMixin } from '../../../mixins/loading-complete/loading-complete-mixin.js';
import { until } from 'lit/directives/until.js';

class DialogAsync extends LoadingCompleteMixin(LitElement) {

	static get styles() {
		return css`
			.content-button {
				padding-block: 1rem;
			}
			.d2l-dialog-content-loading {
				text-align: center;
			}
		`;
	}

	static get properties() {
		return {
			href: { type: String }
		};
	}

	constructor() {
		super();
		this.href = null;
	}

	firstUpdated() {
		super.firstUpdated();
		this._observer ??= new MutationObserver(async() => {
			await this.#handleContentLoad();
			if (this.#listLoaded) this._observer.disconnect();
		});
		this._observer.observe(this.shadowRoot.querySelector('.content'), { childList: true, subtree: true });

		this.#dialog = this.shadowRoot.querySelector('d2l-dialog');
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._observer?.disconnect();
	}

	render() {
		const loadingSpinner = html`
			<div class="d2l-dialog-content-loading">
				<d2l-loading-spinner size="100"></d2l-loading-spinner>
			</div>
		`;
		return html`
			<d2l-button @click="${this._handleOpenButtonClick}">Show Dialog</d2l-button>
			<d2l-dialog title-text="Dialog Title">
				<div class="content">
					${guard([this.href], () => until(this._getContent(this.href), loadingSpinner, noChange))}
				</div>
				<d2l-button slot="footer" primary data-dialog-action="ok">Click Me!</d2l-button>
				<d2l-button slot="footer" data-dialog-action>Cancel</d2l-button>
			</d2l-dialog>
		`;
	}

	_handleOpenButtonClick() {
		this.href = 'some-href';
		this.#dialog.opened = true;
	}

	_getContent(href) {
		return new Promise((resolve) => {
			if (!href) return;
			setTimeout(() => {
				resolve(html`
					<d2l-button class="content-button">Focus on me!</d2l-button>
					<d2l-list>
						<d2l-list-item>
							<d2l-list-item-content>
								<div>Introductory Earth Sciences</div>
								<div slot="supporting-info">This course explores the geological process of the Earth's interior and surface. These include volcanism, earthquakes, mountains...</div>
							</d2l-list-item-content>
						</d2l-list-item>
						<d2l-list-item>
							<d2l-list-item-content>
								<div>Engineering Materials for Energy Systems</div>
								<div slot="supporting-info">This course explores the geological processes of the Earth's interior and surface. These include volcanism, earthquakes, mountain...</div>
							</d2l-list-item-content>
						</d2l-list-item>
					</d2l-list>
					`);
			}, 1000);
		});
	}

	async #handleContentLoad() {
		const list = this.shadowRoot.querySelector('d2l-list');
		if (!list) return;

		await this.#dialog.waitForUpdateComplete;
		this.#dialog.resize();
		this.shadowRoot.querySelector('.content-button').focus();
		this.#listLoaded = true;
	}

	#dialog = null;
	#listLoaded = false;

}

customElements.define('d2l-dialog-demo-async', DialogAsync);
