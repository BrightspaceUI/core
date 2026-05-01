import '../../collapsible-panel/collapsible-panel.js';
import '../page.js';
import { css, html, LitElement, nothing } from 'lit';
import { navStyles } from './temp-nav-styles.js';
import { selectStyles } from '../../inputs/input-select-styles.js';

/**
 * Component for d2l-page demos and tests
 */
class PageDemo extends LitElement {

	static properties = {
		demoMode: { type: Boolean, attribute: 'demo-mode' },
		hasFooter: { type: Boolean, attribute: 'has-footer' },
		hasSideNavPanel: { type: Boolean, attribute: 'has-side-nav-panel' },
		hasSupportingPanel: { type: Boolean, attribute: 'has-supporting-panel' },
		navType: { type: String, attribute: 'nav-type' },
		widthType: { type: String, attribute: 'width-type' },
		_allowThreePanels: { state: true }
	};

	static styles = [navStyles, selectStyles, css`
		.demo-controls {
			display: flex;
			flex-wrap: wrap;
			gap: 0.75rem;
		}
	`];

	constructor() {
		super();
		this._allowThreePanels = false; // Temp for dev/testing
		this.demoMode = false;
		this.hasFooter = false;
		this.hasSideNavPanel = false;
		this.hasSupportingPanel = false;
		this.navType = 'full';
		/** @type {'normal'|'wide'|'fullscreen'} */
		this.widthType = 'normal';
	}

	render() {
		return html`
			<d2l-page width-type="${this.widthType}">
				${this.navType === 'full' ? this.#renderFullNav() : this.#renderImmersiveNav()}
				${this.#renderSideNavPanel()}
				${this.#renderMainPanel()}
				${this.#renderSupportingPanel()}
				${this.#renderFooter()}
			</d2l-page>
		`;
	}

	#handleAllowThreePanelsChange(e) {
		this._allowThreePanels = e.target.on;
		if (!this._allowThreePanels && this.hasSideNavPanel && this.hasSupportingPanel) {
			this.shadowRoot.querySelector('#switch-supporting-panel').on = false;
			this.hasSupportingPanel = false;
		}
	}

	#handleNavTypeChange(e) {
		this.navType = e.target.on ? 'immersive' : 'full';
	}

	#handleVisibilityChange(e) {
		const key = e.target.dataset.key;
		this[key] = e.target.on;

		if (this._allowThreePanels) return;
		if (e.target.on && key === 'hasSideNavPanel' && this.hasSupportingPanel) {
			this.shadowRoot.querySelector('#switch-supporting-panel').on = false;
			this.hasSupportingPanel = false;
		} else if (e.target.on && key === 'hasSupportingPanel' && this.hasSideNavPanel) {
			this.shadowRoot.querySelector('#switch-side-nav-panel').on = false;
			this.hasSideNavPanel = false;
		}
	}

	#handleWidthTypeChange(e) {
		this.widthType = e.target.value;
	}

	#renderFooter() {
		return this.hasFooter ? html`
			<div slot="footer">
				I'm in the <b>footer</b> slot of the <b>d2l-page</b> component!
			</div>
		` : nothing;
	}

	#renderFullNav() {
		// Update with navigation components once available
		return html`
			<div slot="header" class="full-nav-wrapper">
				<div class="nav-band"></div>
				<div class="full-nav-header">
					<div class="full-nav-header-left">
						<span class="full-nav-logo">Logo</span>
						<div class="full-nav-separator"></div>
						<button class="nav-icon-btn">📚 Courses</button>
					</div>
					<div class="full-nav-header-spacer"></div>
					<div class="full-nav-header-right">
						<button class="nav-icon-btn" title="Alerts">🔔</button>
						<button class="nav-icon-btn" title="Settings">⚙️</button>
						<button class="nav-icon-btn" title="Profile">👤</button>
					</div>
				</div>
				<div class="full-nav-footer">
					<div class="full-nav-footer-inner">
						<a class="full-nav-footer-link" href="javascript:void(0)">Content</a>
						<a class="full-nav-footer-link" href="javascript:void(0)">Assignments</a>
						<a class="full-nav-footer-link" href="javascript:void(0)">Quizzes</a>
						<a class="full-nav-footer-link" href="javascript:void(0)">Grades</a>
						<a class="full-nav-footer-link" href="javascript:void(0)">Classlist</a>
					</div>
				</div>
				<div class="nav-shadow"></div>
			</div>
		`;
	}

	#renderImmersiveNav() {
		// Update with navigation components once available
		return html`
			<div id="immersive-nav" slot="header" class="immersive-wrapper">
				<div class="nav-band"></div>
				<div class="immersive-container">
					<div class="immersive-left">
						<a class="immersive-back-link" href="javascript:void(0)">
							<span class="immersive-back-icon">‹</span>
							Back to Course
						</a>
					</div>
					<div class="immersive-middle">
						Assignment 1 - Introduction to Economics
					</div>
					<div class="immersive-right">
						<button class="nav-icon-btn">‹ Prev</button>
						<button class="nav-icon-btn">Next ›</button>
					</div>
				</div>
				<div class="nav-shadow"></div>
			</div>
		`;
	}

	#renderMainPanel() {
		return html`
			<div style="height: 1000px;">
				${this.demoMode ? html`
					<d2l-collapsible-panel panel-title="Demo Controls" expanded>
						<div class="demo-controls">
							<select class="d2l-input-select" name="width-type" aria-label="Width type" @change="${this.#handleWidthTypeChange}">
								<option value="normal" ?selected="${this.widthType === 'normal'}">Normal Width</option>
								<option value="wide" ?selected="${this.widthType === 'wide'}">Wide Width</option>
								<option value="fullscreen" ?selected="${this.widthType === 'fullscreen'}">Fullscreen</option>
							</select>
							<d2l-switch id="switch-nav-type" text="Immersive Nav" @change="${this.#handleNavTypeChange}"></d2l-switch>
							<d2l-switch id="switch-side-nav-panel" text="Side Nav Panel" data-key="hasSideNavPanel" @change="${this.#handleVisibilityChange}"></d2l-switch>
							<d2l-switch id="switch-supporting-panel" text="Supporting Panel" data-key="hasSupportingPanel" @change="${this.#handleVisibilityChange}"></d2l-switch>
							<d2l-switch id="switch-footer" text="Footer" data-key="hasFooter" @change="${this.#handleVisibilityChange}"></d2l-switch>
							<d2l-switch id="switch-allow-three-panels" text="Allow Three Panels" @change="${this.#handleAllowThreePanelsChange}"></d2l-switch>
						</div>
					</d2l-collapsible-panel>
				` : nothing}
				<p>I'm in the <b>default</b> slot of the <b>d2l-page</b> component!</p>
			</div>
			<div>End of Content</div>
		`;
	}

	#renderSideNavPanel() {
		return this.hasSideNavPanel ? html`
			<div style="background-color: lavender; height: 1000px;" slot="side-nav">
				I'm in the <b>side-nav</b> slot of the <b>d2l-page</b> component!
			</div>
		` : nothing;
	}

	#renderSupportingPanel() {
		return this.hasSupportingPanel ? html`
			<div style="background-color: aliceblue; height: 1000px;" slot="supporting">
				I'm in the <b>supporting</b> slot of the <b>d2l-page</b> component!
			</div>
		` : nothing;
	}
}

customElements.define('d2l-page-demo', PageDemo);
