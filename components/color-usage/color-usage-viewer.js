import '../colors/colors.js';
import '../tabs/tabs.js';
import '../tabs/tab.js';
import '../tabs/tab-panel.js';
import '../expand-collapse/expand-collapse-content.js';
import '../collapsible-panel/collapsible-panel.js';
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
			/**
			 * The selected category filter
			 * @type {string}
			 */
			selectedCategory: { type: String, attribute: 'selected-category' },
			_colorData: { state: true },
			_colorsByUsage: { state: true },
			_loading: { state: true },
			_error: { state: true },
			_expandedRows: { state: true },
			_selectedSummaryCategory: { state: true }
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

			.category-badges {
				display: flex;
				flex-wrap: wrap;
				gap: 0.25rem;
				margin-top: 0.5rem;
			}

			.category-badge {
				border-radius: 0.25rem;
				display: inline-block;
				font-size: 0.7rem;
				font-weight: 600;
				padding: 0.15rem 0.4rem;
				text-transform: uppercase;
			}

			.category-background {
				background-color: #e3f0fe;
				color: #004489;
			}

			.category-foreground {
				background-color: #fef4e9;
				color: #8b5a00;
			}

			.category-border {
				background-color: #f0e6ff;
				color: #49286d;
			}

			.category-shadow {
				background-color: #e8e8e8;
				color: #494c4e;
			}

			.category-gradient {
				background-color: #ffe6f5;
				color: #7d3f6b;
			}

			.category-other {
				background-color: #f9fafb;
				border: 1px solid #cdd5dc;
				color: #565a5c;
			}

			.category-summary {
				align-items: center;
				display: flex;
				flex-wrap: wrap;
				gap: 0.5rem;
				margin-bottom: 1rem;
			}

			.category-summary strong {
				color: #565a5c;
				font-size: 0.8rem;
				font-weight: 700;
			}

			d2l-collapsible-panel {
				margin-bottom: 1.5rem;
			}

			.category-definitions-content dl {
				display: grid;
				gap: 0.5rem;
				grid-template-columns: auto 1fr;
				margin: 0;
			}

			.category-definitions-content dt {
				color: #202122;
				font-size: 0.8rem;
				font-weight: 700;
			}

			.category-definitions-content dd {
				color: #565a5c;
				font-size: 0.8rem;
				line-height: 1.5;
				margin: 0;
			}

			.summary-table {
				border-collapse: collapse;
				width: 100%;
			}

			.summary-table th,
			.summary-table td {
				border: 1px solid #cdd5dc;
				padding: 0.5rem;
				text-align: left;
			}

			.summary-table th {
				background-color: #f9fafb;
				color: #565a5c;
				font-size: 0.75rem;
				font-weight: 700;
				text-align: center;
			}

			.summary-table th:first-child {
				text-align: left;
			}

			.summary-table th button {
				background: none;
				border: none;
				color: #565a5c;
				cursor: pointer;
				font-size: 0.75rem;
				font-weight: 700;
				padding: 0;
				text-decoration: none;
				width: 100%;
			}

			.summary-table th button:hover {
				color: #006fbf;
			}

			.summary-table th button:focus {
				outline: 2px solid #006fbf;
				outline-offset: 2px;
			}

			.summary-table th button.active {
				color: #006fbf;
				font-weight: 700;
			}

			.summary-table td {
				font-size: 0.8rem;
				text-align: center;
			}

			.summary-table td:first-child {
				color: #202122;
				font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
				font-size: 0.85rem;
				font-weight: 600;
				text-align: left;
			}

			.summary-table .check {
				color: #46a661;
				font-size: 1rem;
				font-weight: 700;
			}

			.summary-table tbody tr:hover {
				background-color: #f9fafb;
			}

			.summary-table .expand-button {
				background: none;
				border: none;
				color: #006fbf;
				cursor: pointer;
				font-size: 0.8rem;
				padding: 0;
				text-decoration: underline;
			}

			.summary-table .expand-button:hover {
				color: #004489;
			}

			.summary-table .expand-button:focus {
				outline: 2px solid #006fbf;
				outline-offset: 2px;
			}

			.summary-table .expanded-content {
				background-color: #f9fafb;
			}

			.summary-table .expanded-content td {
				padding: 0;
			}

			.component-details {
				padding: 1rem;
			}

			.component-details table {
				border-collapse: collapse;
				width: 100%;
			}

			.component-details th,
			.component-details td {
				border: 1px solid #cdd5dc;
				padding: 0.4rem;
				text-align: left;
			}

			.component-details th {
				background-color: #ffffff;
				color: #565a5c;
				font-size: 0.7rem;
				font-weight: 700;
				text-align: center;
			}

			.component-details th:first-child {
				text-align: left;
			}

			.component-details td {
				font-size: 0.75rem;
				text-align: center;
			}

		.component-details td:first-child {
			color: #202122;
			font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
			font-size: 0.8rem;
			font-weight: 600;
			text-align: left;
		}

		.component-link {
			background: none;
			border: none;
			color: #006fbf;
			cursor: pointer;
			font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
			font-size: 0.8rem;
			font-weight: 600;
			padding: 0;
			text-align: left;
			text-decoration: underline;
		}

		.component-link:hover {
			color: #004489;
		}

		.component-link:focus {
			outline: 2px solid #006fbf;
			outline-offset: 2px;
		}
	`;
	}

	constructor() {
		super();
		this.selectedComponent = '';
		this.selectedColor = '';
		this.selectedCategory = '';
		this._colorData = null;
		this._colorsByUsage = null;
		this._loading = true;
		this._error = null;
		this._expandedRows = new Set();
		this._selectedSummaryCategory = '';
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
					<d2l-tab id="summary-view" text="Summary" slot="tabs"></d2l-tab>
					<d2l-tab-panel labelled-by="summary-view" slot="panels">
						${this._renderSummaryTable()}
					</d2l-tab-panel>

					<d2l-tab id="component-view" text="By Component" slot="tabs"></d2l-tab>
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
						${this.selectedComponent ? html`
							<div class="dropdown-container">
								<label for="category-filter">Filter by category:</label>
								<select 
									id="category-filter" 
									@change="${this._handleCategoryChange}"
									.value="${this.selectedCategory}">
									<option value="">All categories</option>
									<option value="background">Background</option>
									<option value="foreground">Foreground (text/icons)</option>
									<option value="border">Border</option>
									<option value="shadow">Shadow</option>
									<option value="gradient">Gradient</option>
									<option value="other">Other</option>
								</select>
							</div>
						` : ''}
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

	_getColorNames() {
		if (!this._colorsByUsage) return [];
		return Object.keys(this._colorsByUsage).sort();
	}
	_getComponentNames() {
		if (!this._colorData) return [];
		return Object.keys(this._colorData)
			.filter(name => this._colorData[name] && this._colorData[name].length > 0)
			.sort();
	}
	_handleCategoryChange(e) {
		this.selectedCategory = e.target.value;
	}
	_handleColorChange(e) {
		this.selectedColor = e.target.value;
	}
	_handleComponentChange(e) {
		this.selectedComponent = e.target.value;
	}
	async _loadColorData() {
		try {
			const [colorDataResponse, colorsByUsageResponse] = await Promise.all([
				fetch('./color-usages-by-component.json'),
				fetch('./colors-summary.json')
			]);

			if (!colorDataResponse.ok) {
				throw new Error(`Failed to load color-usages-by-component.json: ${colorDataResponse.statusText}`);
			}
			if (!colorsByUsageResponse.ok) {
				throw new Error(`Failed to load colors-summary.json: ${colorsByUsageResponse.statusText}`);
			}

			this._colorData = await colorDataResponse.json();
			this._colorsByUsage = await colorsByUsageResponse.json();
			this._loading = false;
		} catch (error) {
			this._error = `Error loading color data: ${error.message}`;
			this._loading = false;
		}
	}

	_navigateToComponent(componentName) {
		this.selectedComponent = componentName;
		// Switch to the By Component tab
		const tabs = this.shadowRoot.querySelector('d2l-tabs');
		if (tabs) {
			const componentTab = this.shadowRoot.querySelector('#component-view');
			if (componentTab) {
				componentTab.selected = true;
			}
		}
	}
	_renderColorList() {
		if (!this.selectedComponent) {
			return html`
				<div class="empty-state">
					Please select a component to view its color usage.
				</div>
			`;
		}

		let colors = this._colorData[this.selectedComponent];

		if (!colors || colors.length === 0) {
			return html`
				<div class="no-colors">
					This component does not use any colors directly.
				</div>
			`;
		}

		// Filter by category if selected
		if (this.selectedCategory) {
			colors = colors.filter(item =>
				item.categories && item.categories.includes(this.selectedCategory)
			);

			if (colors.length === 0) {
				return html`
					<div class="no-colors">
						No colors found for the "${this.selectedCategory}" category.
					</div>
				`;
			}
		}

		return html`
			<ul class="color-list">
				${colors.map(item => {
					const colorInfo = this._colorsByUsage[item.color];
					return html`
					<li class="color-item">
						<div class="color-name">
							${this._renderColorSwatch(item.color)}
							<span>${item.color}</span>
							${colorInfo?.resultantOnWhite ? html`
								<span style="margin-left: 0.5rem; color: #565a5c; font-size: 0.85rem;">
									→ ${colorInfo.resultantOnWhite} on white
								</span>
							` : ''}
						</div>
						<div class="color-usage">
							${item.usage}
							${item.categories && item.categories.length > 0 ? html`
								<div class="category-badges">
									${item.categories.map(cat => html`
										<span class="category-badge category-${cat}">${cat}</span>
									`)}
								</div>
							` : ''}
						</div>
					</li>
				`;
				})}
			</ul>
		`;
	}

	_renderColorSwatch(colorValue) {
		// Try to resolve the color value for display
		const displayColor = colorValue;

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
				${colorInfo.resultantOnWhite ? html`
					<span style="margin-left: 0.5rem; color: #565a5c; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.25rem;">
						→
						<span class="color-swatch" style="background-color: ${colorInfo.resultantOnWhite}; width: 1rem; height: 1rem; margin: 0;"></span>
						${colorInfo.resultantOnWhite} on white
					</span>
				` : ''}
				</div>
				${colorInfo.summary ? html`
					<div class="color-summary">${colorInfo.summary}</div>
				` : ''}
				${colorInfo.categories && colorInfo.categories.length > 0 ? html`
					<div class="category-summary">
						<strong>Used for:</strong>
						${colorInfo.categories.map(cat => html`
							<span class="category-badge category-${cat}">${cat}</span>
						`)}
					</div>
				` : ''}
			</div>
			<ul class="component-list">
				${colorInfo.usages.map(item => html`
					<li class="component-item">
						<div class="component-name">${item.component}</div>
						<div class="component-usage">
							${item.usage}
							${item.categories && item.categories.length > 0 ? html`
								<div class="category-badges">
									${item.categories.map(cat => html`
										<span class="category-badge category-${cat}">${cat}</span>
									`)}
								</div>
							` : ''}
						</div>
					</li>
				`)}
				</ul>
			`;
	}

	_renderSummaryTable() {
		if (!this._colorData || !this._colorsByUsage) {
			return html`<div class="empty-state">No data available</div>`;
		}

		const categories = ['background', 'foreground', 'border', 'shadow', 'gradient', 'other'];
		const colors = this._getColorNames();

		// Build a map of color -> categories used
		const colorCategories = new Map();
		colors.forEach(colorName => {
			const colorInfo = this._colorsByUsage[colorName];
			const usedCategories = new Set();
			if (colorInfo && colorInfo.categories && colorInfo.categories.length > 0) {
				colorInfo.categories.forEach(cat => usedCategories.add(cat));
			}
			colorCategories.set(colorName, usedCategories);
		});

		// Filter colors by selected category if one is active
		const filteredColors = this._selectedSummaryCategory
			? colors.filter(color => {
				const usedCategories = colorCategories.get(color);
				return usedCategories && usedCategories.has(this._selectedSummaryCategory);
			})
			: colors;

		return html`
			<d2l-collapsible-panel panel-title="Category Definitions">
				<div class="category-definitions-content">
					<dl>
						<dt>Background:</dt>
						<dd>Colors used for backgrounds, including component backgrounds and container fills.</dd>
						
						<dt>Foreground:</dt>
						<dd>Colors used for text, icons, and other foreground elements including fills and strokes.</dd>
						
						<dt>Border:</dt>
						<dd>Colors used for borders and outlines around elements.</dd>
						
						<dt>Shadow:</dt>
						<dd>Colors used in box shadows and drop shadows for depth and elevation effects.</dd>
						
						<dt>Gradient:</dt>
						<dd>Colors used as part of gradient fills or backgrounds.</dd>
						
						<dt>Other:</dt>
						<dd>Colors that don't fit into the above categories or have miscellaneous usage.</dd>
					</dl>
				</div>
			</d2l-collapsible-panel>
			<table class="summary-table">
				<thead>
					<tr>
						<th>Color</th>
						${categories.map(cat => html`
							<th>
								<button 
									class="${this._selectedSummaryCategory === cat ? 'active' : ''}"
									@click="${() => this._toggleSummaryCategory(cat)}"
									title="Click to filter by ${cat}">
									${cat.charAt(0).toUpperCase() + cat.slice(1)}
								</button>
							</th>
						`)}
					</tr>
				</thead>
				<tbody>
					${filteredColors.map(color => {
						const usedCategories = colorCategories.get(color);
						const isExpanded = this._expandedRows.has(color);
						const colorInfo = this._colorsByUsage[color];
						const hasComponents = colorInfo && colorInfo.usages && colorInfo.usages.length > 0;

						return html`
							<tr>
								<td>
								${color}
								${colorInfo?.resultantOnWhite ? html`
									<br>
									<span style="color: #565a5c; font-size: 0.75rem; font-family: 'Monaco', 'Menlo', 'Consolas', monospace; display: inline-flex; align-items: center; gap: 0.25rem;">
										→
										<span class="color-swatch" style="background-color: ${colorInfo.resultantOnWhite}; width: 0.9rem; height: 0.9rem; margin: 0;"></span>
										${colorInfo.resultantOnWhite} on white
									</span>
								` : ''}
								${hasComponents ? html`
										<br>
										<button
											class="expand-button"
											@click="${() => this._toggleRow(color)}"
											aria-expanded="${isExpanded}">
											${isExpanded ? '▼ Hide' : '▶ Show'} components (${colorInfo.usages.length})
										</button>
									` : ''}
								</td>
								${categories.map(cat => html`
									<td>${usedCategories.has(cat) ? html`<span class="check">✓</span>` : ''}</td>
								`)}
							</tr>
							${isExpanded && hasComponents ? html`
								<tr class="expanded-content">
									<td colspan="${categories.length + 1}">
										<d2l-expand-collapse-content expanded>
											<div class="component-details">
												${colorInfo.summary ? html`
													<div class="color-summary">${colorInfo.summary}</div>
												` : ''}
												<table>
													<thead>
														<tr>
															<th>Component</th>
															${categories.map(cat => html`
																<th>${cat.charAt(0).toUpperCase() + cat.slice(1)}</th>
															`)}
														</tr>
													</thead>
													<tbody>
														${colorInfo.usages.map(usage => {
															const componentCategories = new Set(usage.categories || []);
															return html`
																<tr>
																	<td>
																		<button 
																			class="component-link"
																			@click="${() => this._navigateToComponent(usage.component)}"
																			title="View ${usage.component} details">
																			${usage.component}
																		</button>
																	</td>
																	${categories.map(cat => html`
																		<td>${componentCategories.has(cat) ? html`<span class="check">✓</span>` : ''}</td>
																	`)}
																</tr>
															`;
														})}
													</tbody>
												</table>
											</div>
										</d2l-expand-collapse-content>
									</td>
								</tr>
							` : ''}
						`;
					})}
				</tbody>
			</table>
		`;
	}

	_toggleRow(color) {
		if (this._expandedRows.has(color)) {
			this._expandedRows.delete(color);
		} else {
			this._expandedRows.add(color);
		}
		this._expandedRows = new Set(this._expandedRows);
	}

	_toggleSummaryCategory(category) {
		if (this._selectedSummaryCategory === category) {
			this._selectedSummaryCategory = '';
		} else {
			this._selectedSummaryCategory = category;
		}
	}

}

customElements.define('d2l-color-usage-viewer', ColorUsageViewer);
