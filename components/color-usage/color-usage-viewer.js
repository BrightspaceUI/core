import '../colors/colors.js';
import '../tabs/tabs.js';
import '../tabs/tab.js';
import '../tabs/tab-panel.js';
import { css, html, LitElement } from 'lit';

/**
 * A component for viewing color usage across different components.
 */
class ColorUsageViewer extends LitElement {

	static get properties() {
		return {
			/**
			 * The selected component name
			 * @type {string}
			 */
			selectedComponent: { type: String, attribute: 'selected-component' },
			/**
			 * The selected color name
			 * @type {string}
			 */
			selectedColor: { type: String, attribute: 'selected-color' },
			_colorData: { state: true },
			_colorsByUsage: { state: true },
			_loading: { state: true },
			_error: { state: true }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
				padding: 1rem;
			}

			.container {
				max-width: 800px;
				margin: 0 auto;
			}

			h1 {
				color: #202122;
				font-size: 1.5rem;
				font-weight: 700;
				margin: 0 0 1.5rem 0;
			}

			.dropdown-container {
				margin-bottom: 2rem;
			}

			label {
				color: #565a5c;
				display: block;
				font-size: 0.875rem;
				font-weight: 700;
				margin-bottom: 0.5rem;
			}

			select {
				background-color: #ffffff;
				border: 1px solid #cdd5dc;
				border-radius: 0.3rem;
				font-size: 0.875rem;
				padding: 0.5rem;
				width: 100%;
				max-width: 400px;
			}

			select:focus {
				border-color: #006fbf;
				outline: 2px solid #006fbf;
				outline-offset: 0;
			}

			.color-list {
				list-style: none;
				margin: 0;
				padding: 0;
			}

			.color-item {
				background-color: #f9fafb;
				border: 1px solid #e3e9f1;
				border-radius: 0.3rem;
				margin-bottom: 1rem;
				padding: 1rem;
			}

			.color-name {
				align-items: center;
				display: flex;
				font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
				font-size: 0.9rem;
				font-weight: 700;
				margin-bottom: 0.5rem;
			}

			.color-swatch {
				border: 1px solid #cdd5dc;
				border-radius: 0.2rem;
				display: inline-block;
				height: 1.5rem;
				margin-right: 0.75rem;
				width: 1.5rem;
			}

			.color-usage {
				color: #565a5c;
				font-size: 0.8rem;
				line-height: 1.5;
			}

			.empty-state {
				color: #565a5c;
				font-size: 0.875rem;
				padding: 2rem;
				text-align: center;
			}

			.loading {
				color: #565a5c;
				font-size: 0.875rem;
				padding: 2rem;
				text-align: center;
			}

			.error {
				background-color: #fef4f4;
				border: 1px solid #f8cfcf;
				border-radius: 0.3rem;
				color: #cd2026;
				font-size: 0.875rem;
				padding: 1rem;
			}

			.no-colors {
				color: #565a5c;
				font-size: 0.875rem;
				font-style: italic;
			}

			.view-mode-selector {
				display: flex;
				gap: 1rem;
				margin-bottom: 1.5rem;
			}

			.view-mode-selector button {
				background-color: #f9fafb;
				border: 1px solid #cdd5dc;
				border-radius: 0.3rem;
				color: #565a5c;
				cursor: pointer;
				font-size: 0.875rem;
				padding: 0.5rem 1rem;
			}

			.view-mode-selector button:hover {
				background-color: #e3e9f1;
			}

			.view-mode-selector button.active {
				background-color: #006fbf;
				border-color: #006fbf;
				color: #ffffff;
			}

			d2l-tabs {
				margin-bottom: 1.5rem;
			}

			.color-summary {
				background-color: #e3f0fe;
				border-left: 3px solid #006fbf;
				font-size: 0.85rem;
				font-style: italic;
				margin-bottom: 1rem;
				padding: 0.75rem;
			}

			.component-list {
				list-style: none;
				margin: 0;
				padding: 0;
			}

			.component-item {
				background-color: #f9fafb;
				border: 1px solid #e3e9f1;
				border-radius: 0.3rem;
				margin-bottom: 0.75rem;
				padding: 0.75rem 1rem;
			}

			.component-name {
				color: #202122;
				font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
				font-size: 0.85rem;
				font-weight: 700;
				margin-bottom: 0.25rem;
			}

			.component-usage {
				color: #565a5c;
				font-size: 0.8rem;
				line-height: 1.5;
			}
		`;
	}

	constructor() {
		super();
		this.selectedComponent = '';
		this.selectedColor = '';
		this._colorData = null;
		this._colorsByUsage = null;
		this._loading = true;
		this._error = null;
	}

	connectedCallback() {
		super.connectedCallback();
		this._loadColorData();
	}

	render() {
		if (this._loading) {
			return html`
				<div class="container">
					<h1>Color Usage Viewer</h1>
					<div class="loading">Loading color data...</div>
				</div>
			`;
		}

		if (this._error) {
			return html`
				<div class="container">
					<h1>Color Usage Viewer</h1>
					<div class="error">${this._error}</div>
				</div>
			`;
		}

		return html`
			<div class="container">
				<h1>Color Usage Viewer</h1>
				
				<d2l-tabs text="View Mode">
					<d2l-tab id="component-view" text="By Component" slot="tabs" selected></d2l-tab>
					<d2l-tab-panel labelled-by="component-view" slot="panels">
						<div class="dropdown-container">
							<label for="component-select">Select a component:</label>
							<select 
								id="component-select" 
								@change="${this._handleComponentChange}"
								.value="${this.selectedComponent}">
								<option value="">-- Choose a component --</option>
								${this._getComponentNames().map(name => html`
									<option value="${name}" ?selected="${name === this.selectedComponent}">
										${name}
									</option>
								`)}
							</select>
						</div>
						${this._renderColorList()}
					</d2l-tab-panel>
					
					<d2l-tab id="color-view" text="By Color" slot="tabs"></d2l-tab>
					<d2l-tab-panel labelled-by="color-view" slot="panels">
						<div class="dropdown-container">
							<label for="color-select">Select a color:</label>
							<select 
								id="color-select" 
								@change="${this._handleColorChange}"
								.value="${this.selectedColor}">
								<option value="">-- Choose a color --</option>
								${this._getColorNames().map(name => html`
									<option value="${name}" ?selected="${name === this.selectedColor}">
										${name}
									</option>
								`)}
							</select>
						</div>
						${this._renderComponentList()}
					</d2l-tab-panel>
				</d2l-tabs>
			</div>
		`;
	}

	async _loadColorData() {
		try {
			const [colorDataResponse, colorsByUsageResponse] = await Promise.all([
				fetch('./color-usages.json'),
				fetch('./colors-by-usage.json')
			]);
			
			if (!colorDataResponse.ok) {
				throw new Error(`Failed to load color-usages.json: ${colorDataResponse.statusText}`);
			}
			if (!colorsByUsageResponse.ok) {
				throw new Error(`Failed to load colors-by-usage.json: ${colorsByUsageResponse.statusText}`);
			}
			
			this._colorData = await colorDataResponse.json();
			this._colorsByUsage = await colorsByUsageResponse.json();
			this._loading = false;
		} catch (error) {
			this._error = `Error loading color data: ${error.message}`;
			this._loading = false;
		}
	}

	_getComponentNames() {
		if (!this._colorData) return [];
		return Object.keys(this._colorData).sort();
	}

	_getColorNames() {
		if (!this._colorsByUsage) return [];
		return Object.keys(this._colorsByUsage).sort();
	}

	_handleComponentChange(e) {
		this.selectedComponent = e.target.value;
	}

	_handleColorChange(e) {
		this.selectedColor = e.target.value;
	}

	_renderColorList() {
		if (!this.selectedComponent) {
			return html`
				<div class="empty-state">
					Please select a component to view its color usage.
				</div>
			`;
		}

		const colors = this._colorData[this.selectedComponent];
		
		if (!colors || colors.length === 0) {
			return html`
				<div class="no-colors">
					This component does not use any colors directly.
				</div>
			`;
		}

		return html`
			<ul class="color-list">
				${colors.map(item => html`
					<li class="color-item">
						<div class="color-name">
							${this._renderColorSwatch(item.color)}
							<span>${item.color}</span>
						</div>
						<div class="color-usage">${item.usage}</div>
					</li>
				`)}
			</ul>
		`;
	}

	_renderColorSwatch(colorValue) {
		// Try to resolve the color value for display
		let displayColor = colorValue;
		
		// If it's a CSS variable, check if it's a d2l-color
		if (colorValue.startsWith('--')) {
			if (colorValue.startsWith('--d2l-color-')) {
				// Use the CSS variable to display the actual color
				return html`
					<span class="color-swatch" style="background-color: var(${colorValue});"></span>
				`;
			}
			// For other CSS variables, show a gradient placeholder
			return html`
				<span class="color-swatch" style="background: linear-gradient(135deg, #e3e9f1 0%, #cdd5dc 100%);"></span>
			`;
		}
		
		// For hex or rgb colors, show them directly
		return html`
			<span class="color-swatch" style="background-color: ${displayColor};"></span>
		`;
	}

	_renderComponentList() {
		if (!this.selectedColor) {
			return html`
				<div class="empty-state">
					Please select a color to view its usage across components.
				</div>
			`;
		}

		const colorInfo = this._colorsByUsage[this.selectedColor];
		
		if (!colorInfo || !colorInfo.usages || colorInfo.usages.length === 0) {
			return html`
				<div class="no-colors">
					This color is not used by any components.
				</div>
			`;
		}

		return html`
			<div class="color-item">
				<div class="color-name">
					${this._renderColorSwatch(this.selectedColor)}
					<span>${this.selectedColor}</span>
				</div>
				${colorInfo.summary ? html`
					<div class="color-summary">${colorInfo.summary}</div>
				` : ''}
			</div>
			<ul class="component-list">
				${colorInfo.usages.map(item => html`
					<li class="component-item">
						<div class="component-name">${item.component}</div>
						<div class="component-usage">${item.usage}</div>
					</li>
				`)}
			</ul>
		`;
	}

}

customElements.define('d2l-color-usage-viewer', ColorUsageViewer);
