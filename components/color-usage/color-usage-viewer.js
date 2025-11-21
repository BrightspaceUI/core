/* eslint-disable lit/no-template-arrow */

import '../colors/colors.js';
import '../tabs/tabs.js';
import '../tabs/tab.js';
import '../tabs/tab-panel.js';
import '../expand-collapse/expand-collapse-content.js';
import '../collapsible-panel/collapsible-panel.js';
import '../collapsible-panel/collapsible-panel-group.js';
import '../empty-state/empty-state-simple.js';
import '../alert/alert.js';
import '../button/button-subtle.js';
import { bodyStandardStyles, heading2Styles, labelStyles } from '../typography/styles.js';
import { css, html, LitElement } from 'lit';
import { inputLabelStyles } from '../inputs/input-label-styles.js';
import { linkStyles } from '../link/link.js';
import { selectStyles } from '../inputs/input-select-styles.js';
import { tableStyles } from '../table/table-wrapper.js';

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
		return [ bodyStandardStyles, heading2Styles, labelStyles, inputLabelStyles, linkStyles, selectStyles, tableStyles, css`
		:host {
			display: block;
			padding: 1rem;
		}

		.container {
			margin: 0 auto;
			max-width: 800px;
		}

		h1 {
			margin: 0 0 1.5rem 0;
		}

		.dropdown-container {
			margin-bottom: 2rem;
		}

		.color-list {
			list-style: none;
			margin: 0;
			padding: 0;
		}

		.color-item {
			background-color: var(--d2l-color-regolith);
			border: 1px solid var(--d2l-color-gypsum);
			border-radius: 0.3rem;
			margin-bottom: 1rem;
			padding: 1rem;
		}

		.color-name {
			align-items: center;
			display: flex;
			font-family: "Monaco", "Menlo", "Consolas", monospace;
			font-weight: 700;
			margin-bottom: 0.5rem;
		}

		.color-swatch {
			border: 1px solid var(--d2l-color-mica);
			border-radius: 0.2rem;
			display: inline-block;
			height: 1.5rem;
			margin-right: 0.25rem;
			width: 1.5rem;
		}

		.color-usage {
			color: var(--d2l-color-tungsten);
		}

		d2l-tabs {
			margin-bottom: 1.5rem;
		}

		.color-summary {
			background-color: var(--d2l-color-celestine-plus-2);
			border-left: 3px solid var(--d2l-color-celestine);
			font-style: italic;
			margin-bottom: 1rem;
			padding: 0.75rem;
		}

		.category-badge {
			border-radius: 0.25rem;
			display: inline-block;
			font-size: 0.7rem;
			font-weight: 600;
			padding: 0.15rem 0.4rem;
			text-transform: uppercase;
		}

		.category-badge.background {
			background-color: var(--d2l-color-celestine-plus-2);
			color: var(--d2l-color-celestine-minus-1);
		}

		.category-badge.foreground {
			background-color: var(--d2l-color-carnelian-plus-1);
			color: var(--d2l-color-carnelian-minus-1);
		}

		.category-badge.border {
			background-color: var(--d2l-color-amethyst-plus-2);
			color: var(--d2l-color-amethyst-minus-1);
		}

		.category-badge.shadow {
			background-color: var(--d2l-color-gypsum);
			color: var(--d2l-color-tungsten);
		}

		.category-badge.gradient {
			background-color: var(--d2l-color-tourmaline-plus-2);
			color: var(--d2l-color-tourmaline-minus-1);
		}

		.category-badge.other {
			background-color: var(--d2l-color-sylvite);
			border: 1px solid var(--d2l-color-mica);
			color: var(--d2l-color-tungsten);
		}

		.category-summary {
			align-items: center;
			display: flex;
			flex-wrap: wrap;
			gap: 0.5rem;
			margin-bottom: 1rem;
		}

		.category-summary strong {
			color: var(--d2l-color-tungsten);
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
			color: var(--d2l-color-ferrite);
			font-weight: 700;
		}

		.category-definitions-content dd {
			color: var(--d2l-color-tungsten);
			margin: 0;
		}

		.d2l-table td:first-child {
			color: var(--d2l-color-ferrite);
			font-family: "Monaco", "Menlo", "Consolas", monospace;
			font-weight: 600;
			text-align: left;
		}

		.d2l-table .check {
			color: var(--d2l-color-feedback-success);
			font-size: 1rem;
			font-weight: 700;
		}

		.d2l-table .check-cell {
			text-align: center;
		}

		.expanded-content td {
			padding: 0;
		}

		.component-details {
			padding: 1rem;
		}

		button.d2l-link {
			background: none;
			border: none;
			font-family: "Monaco", "Menlo", "Consolas", monospace;
			font-weight: 600;
		}
	` ];
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
					<h1 class="d2l-heading-2">Color Usage Viewer</h1>
					<d2l-alert type="default">Loading color data...</d2l-alert>
				</div>
			`;
		}

		if (this._error) {
			return html`
				<div class="container">
					<h1 class="d2l-heading-2">Color Usage Viewer</h1>
					<d2l-alert type="critical">${this._error}</d2l-alert>
				</div>
			`;
		}

		return html`
			<div class="container">
				<h1 class="d2l-heading-2">Color Usage Viewer</h1>
				
				<d2l-tabs text="View Mode">
					<d2l-tab id="summary-view" text="Summary" slot="tabs"></d2l-tab>
					<d2l-tab-panel labelled-by="summary-view" slot="panels">
						${this._renderSummaryTable()}
					</d2l-tab-panel>

					<d2l-tab id="component-view" text="By Component" slot="tabs"></d2l-tab>
					<d2l-tab-panel labelled-by="component-view" slot="panels">
						<div class="dropdown-container">
							<label>
								<span class="d2l-input-label">Select a component:</span>
								<select 
									id="component-select"
									class="d2l-input-select"
									@change="${this._handleComponentChange}"
									.value="${this.selectedComponent}">
									<option value="">-- Choose a component --</option>
									${this._getComponentNames().map(name => html`
										<option value="${name}" ?selected="${name === this.selectedComponent}">
											${name}
										</option>
									`)}
								</select>
							</label>
						</div>
					${this.selectedComponent ? html`
						<div class="dropdown-container">
							<label>
								<span class="d2l-input-label">Filter by category:</span>
								<select 
									id="category-filter"
									class="d2l-input-select"
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
							</label>
						</div>
					` : ''}
						${this._renderColorList()}
					</d2l-tab-panel>
					
					<d2l-tab id="color-view" text="By Color" slot="tabs"></d2l-tab>
					<d2l-tab-panel labelled-by="color-view" slot="panels">
					<div class="dropdown-container">
						<label>
							<span class="d2l-input-label">Select a color:</span>
							<select 
								id="color-select"
								class="d2l-input-select"
								@change="${this._handleColorChange}"
								.value="${this.selectedColor}">
								<option value="">-- Choose a color --</option>
								${this._getColorNames().map(name => html`
									<option value="${name}" ?selected="${name === this.selectedColor}">
										${name}
									</option>
								`)}
							</select>
						</label>
					</div>
						${this._renderComponentList()}
					</d2l-tab-panel>
				</d2l-tabs>
			</div>
		`;
	}

	_getColorDisplayName(colorValue) {
		// Extract the color name from CSS variable or hex value
		if (colorValue.startsWith('--d2l-color-')) {
			// Remove '--d2l-color-' prefix and format the name
			const name = colorValue.substring('--d2l-color-'.length);
			// Capitalize first letter of each word separated by hyphens
			return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
		} else if (colorValue.startsWith('#')) {
			// Map common hex colors to names
			const colorNames = {
				'#ffffff': 'White',
				'#000000': 'Black',
				'#ff0000': 'Red',
				'#00ff00': 'Green',
				'#0000ff': 'Blue'
			};
			return colorNames[colorValue.toLowerCase()] || colorValue;
		}
		return colorValue;
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
				<d2l-empty-state-simple description="Please select a component to view its color usage."></d2l-empty-state-simple>
			`;
		}

		let colors = this._colorData[this.selectedComponent];

		if (!colors || colors.length === 0) {
			return html`
				<d2l-empty-state-simple description="This component does not use any colors directly."></d2l-empty-state-simple>
			`;
		}

		// Filter by category if selected
		if (this.selectedCategory) {
			colors = colors.filter(item =>
				item.categories && item.categories.includes(this.selectedCategory)
			);

			if (colors.length === 0) {
				return html`
					<d2l-empty-state-simple description='No colors found for the "${this.selectedCategory}" category.'></d2l-empty-state-simple>
				`;
			}
		}

		return html`
			<d2l-collapsible-panel-group>
				${colors.map(item => {
					const colorInfo = this._colorsByUsage[item.color];
					return html`
					<d2l-collapsible-panel panel-title="${this._getColorDisplayName(item.color)}" expanded>
						<div slot="header" style="display: flex; align-items: center; gap: 0.5rem;">
							${this._renderColorSwatch(item.color)}
							<span style="font-family: 'Monaco', 'Menlo', 'Consolas', monospace; font-weight: 700;">${item.color}</span>
						${item.categories && item.categories.length > 0 ? html`
							${item.categories.map(cat => html`<span class="category-badge ${cat}">${cat}</span>`)}
						` : ''}
							${colorInfo?.resultantOnWhite ? html`
								<span style="margin-left: auto; color: var(--d2l-color-tungsten); font-size: 0.85rem;">
									→ ${colorInfo.resultantOnWhite} on white
								</span>
							` : ''}
						</div>
						${item.usage}
					</d2l-collapsible-panel>
				`;
				})}
			</d2l-collapsible-panel-group>
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
				<d2l-empty-state-simple description="Please select a color to view its usage across components."></d2l-empty-state-simple>
			`;
		}

		const colorInfo = this._colorsByUsage[this.selectedColor];

		if (!colorInfo || !colorInfo.usages || colorInfo.usages.length === 0) {
			return html`
				<d2l-empty-state-simple description="This color is not used by any components."></d2l-empty-state-simple>
			`;
		}

		return html`
			<div class="color-item">
				<div class="color-name">
				${this._renderColorSwatch(this.selectedColor)}
				<span>${this.selectedColor}</span>
				${colorInfo.resultantOnWhite ? html`
					<span style="margin-left: 0.5rem; color: var(--d2l-color-tungsten); font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.25rem;">
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
						${colorInfo.categories.map(cat => html`<span class="category-badge ${cat}">${cat}</span>`)}
					</div>
				` : ''}
			</div>
			<d2l-collapsible-panel-group>
				${colorInfo.usages.map(item => html`
					<d2l-collapsible-panel panel-title="${item.component}" expanded>
						<div slot="header" style="display: flex; align-items: center; gap: 0.5rem;">
							${item.categories && item.categories.length > 0 ? html`
								${item.categories.map(cat => html`<span class="category-badge ${cat}">${cat}</span>`)}
							` : ''}
						</div>
						${item.usage}
					</d2l-collapsible-panel>
				`)}
			</d2l-collapsible-panel-group>
		`;
	}

	_renderSummaryTable() {
		if (!this._colorData || !this._colorsByUsage) {
			return html`<d2l-empty-state-simple description="No data available."></d2l-empty-state-simple>`;
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
			<d2l-table-wrapper>
				<table class="d2l-table">
					<thead>
					<tr>
					<th>Color</th>
					${categories.map(cat => html`
						<th class="check-cell">
							<d2l-button-subtle
								text="${cat.charAt(0).toUpperCase() + cat.slice(1)}"
								icon="${this._selectedSummaryCategory === cat ? 'tier1:filter' : ''}"
								description="Click to filter by ${cat}"
								@click="${() => this._toggleSummaryCategory(cat)}">
							</d2l-button-subtle>
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
								<div style="display: inline-flex; align-items: center; gap: 0.5rem;">
									${this._renderColorSwatch(color)}
									<span>${color}</span>
								</div>
							${colorInfo?.resultantOnWhite ? html`
								<br>
								<span style="color: var(--d2l-color-tungsten); font-size: 0.75rem; font-family: 'Monaco', 'Menlo', 'Consolas', monospace; display: inline-flex; align-items: center; gap: 0.25rem;">
									→
										<span class="color-swatch" style="background-color: ${colorInfo.resultantOnWhite}; width: 0.9rem; height: 0.9rem; margin: 0;"></span>
										${colorInfo.resultantOnWhite} on white
									</span>
								` : ''}
								${hasComponents ? html`
										<br>
										<button
											class="d2l-link"
											@click="${() => this._toggleRow(color)}"
											aria-expanded="${isExpanded}">
											${isExpanded ? '▼ Hide' : '▶ Show'} components (${colorInfo.usages.length})
										</button>
									` : ''}
								</td>
								${categories.map(cat => html`
									<td class="check-cell">${usedCategories.has(cat) ? html`<span class="check">✓</span>` : ''}</td>
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
											<d2l-table-wrapper type="light">
												<table class="d2l-table">
													<thead>
														<tr>
															<th>Component</th>
															${categories.map(cat => html`
																<th class="check-cell">${cat.charAt(0).toUpperCase() + cat.slice(1)}</th>
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
																			class="d2l-link"
																			@click="${() => this._navigateToComponent(usage.component)}"
																			title="View ${usage.component} details">
																			${usage.component}
																		</button>
																	</td>
																	${categories.map(cat => html`
																		<td class="check-cell">${componentCategories.has(cat) ? html`<span class="check">✓</span>` : ''}</td>
																	`)}
																</tr>
															`;
														})}
													</tbody>
												</table>
											</d2l-table-wrapper>
											</div>
										</d2l-expand-collapse-content>
									</td>
								</tr>
							` : ''}
						`;
					})}
				</tbody>
			</table>
		</d2l-table-wrapper>
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
