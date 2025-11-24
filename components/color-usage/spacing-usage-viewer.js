/* eslint-disable lit/no-template-arrow */

import '../tabs/tabs.js';
import '../tabs/tab.js';
import '../tabs/tab-panel.js';
import '../expand-collapse/expand-collapse-content.js';
import '../collapsible-panel/collapsible-panel.js';
import '../collapsible-panel/collapsible-panel-group.js';
import '../empty-state/empty-state-simple.js';
import '../alert/alert.js';
import '../button/button-subtle.js';
import '../table/table-col-sort-button.js';
import { bodyStandardStyles, heading2Styles, labelStyles } from '../typography/styles.js';
import { css, html, LitElement } from 'lit';
import { inputLabelStyles } from '../inputs/input-label-styles.js';
import { linkStyles } from '../link/link.js';
import { selectStyles } from '../inputs/input-select-styles.js';
import { tableStyles } from '../table/table-wrapper.js';

/**
 * A component for viewing spacing usage across different components.
 */
class SpacingUsageViewer extends LitElement {

	static get properties() {
		return {
			/**
			 * The selected component name
			 * @type {string}
			 */
			selectedComponent: { type: String, attribute: 'selected-component' },
			/**
			 * The selected spacing value
			 * @type {string}
			 */
			selectedValue: { type: String, attribute: 'selected-value' },
			/**
			 * The selected property filter (margin, padding, gap)
			 * @type {string}
			 */
			selectedProperty: { type: String, attribute: 'selected-property' },
			/**
			 * The path to the spacing data file (by component)
			 * @type {string}
			 */
			spacingDataFile: { type: String, attribute: 'spacing-data-file' },
			/**
			 * The path to the spacing summary file (by spacing value)
			 * @type {string}
			 */
			spacingSummaryFile: { type: String, attribute: 'spacing-summary-file' },
			/**
			 * Spacing data object (by component) - can be provided directly instead of loading from file
			 * @type {Object}
			 */
			spacingData: { type: Object, attribute: false },
			/**
			 * Whether to show the title and outer container (false when used as tab content)
			 * @type {boolean}
			 */
			showContainer: { type: Boolean, attribute: 'show-container' },
			_spacingData: { state: true },
			_spacingByValue: { state: true },
			_loading: { state: true },
			_error: { state: true },
			_expandedRows: { state: true },
			_selectedSummaryCategory: { state: true },
			_sortDesc: { state: true },
			_sortByValue: { state: true },
			_sortValueDesc: { state: true }
		};
	}

	static get styles() {
		return [ bodyStandardStyles, heading2Styles, labelStyles, inputLabelStyles, linkStyles, selectStyles, tableStyles, css`
		h1 {
			margin: 0 0 1.5rem 0;
		}

		.dropdown-container {
			margin-bottom: 2rem;
		}

		.spacing-item {
			background-color: var(--d2l-color-regolith);
			border: 1px solid var(--d2l-color-gypsum);
			border-radius: 0.3rem;
			margin-bottom: 1rem;
			padding: 1rem;
		}

		.spacing-value {
			align-items: center;
			display: flex;
			font-family: "Monaco", "Menlo", "Consolas", monospace;
			font-weight: 700;
			margin-bottom: 0.5rem;
		}

		.spacing-visual {
			background-color: var(--d2l-color-celestine-plus-2);
			border: 1px solid var(--d2l-color-celestine);
			border-radius: 0.2rem;
			display: inline-block;
			height: 1.5rem;
			margin-right: 0.5rem;
		}

		.spacing-usage {
			color: var(--d2l-color-tungsten);
		}

		d2l-tabs {
			margin-bottom: 1.5rem;
		}

		.property-badge {
			border-radius: 0.25rem;
			display: inline-block;
			font-size: 0.7rem;
			font-weight: 600;
			padding: 0.15rem 0.4rem;
			text-transform: uppercase;
		}

		.property-badge.margin {
			background-color: var(--d2l-color-carnelian-plus-1);
			color: var(--d2l-color-carnelian-minus-1);
		}

		.property-badge.padding {
			background-color: var(--d2l-color-celestine-plus-2);
			color: var(--d2l-color-celestine-minus-1);
		}

		.property-badge.gap {
			background-color: var(--d2l-color-amethyst-plus-2);
			color: var(--d2l-color-amethyst-minus-1);
		}

		.property-badge.border {
			background-color: var(--d2l-color-olivine-plus-1);
			color: var(--d2l-color-olivine-minus-1);
		}

		.property-badge.border-radius {
			background-color: var(--d2l-color-citrine-plus-1);
			color: var(--d2l-color-citrine-minus-1);
		}

		.property-badge.other {
			background-color: var(--d2l-color-sylvite);
			border: 1px solid var(--d2l-color-mica);
			color: var(--d2l-color-tungsten);
		}

		.property-summary {
			align-items: center;
			display: flex;
			flex-wrap: wrap;
			gap: 0.5rem;
			margin-bottom: 1rem;
		}

		.property-summary strong {
			color: var(--d2l-color-tungsten);
			font-weight: 700;
		}

		d2l-collapsible-panel {
			margin-bottom: 1.5rem;
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
		this.spacingDataFile = './spacing-usages-by-component.json';
		this.spacingSummaryFile = './spacing-summary.json';
		this.spacingData = null;
		this.showContainer = true;
		this.selectedComponent = '';
		this.selectedValue = '';
		this.selectedProperty = '';
		this._spacingData = null;
		this._spacingByValue = null;
		this._loading = true;
		this._error = null;
		this._expandedRows = new Set();
		this._selectedSummaryCategory = '';
		this._sortDesc = false;
		this._sortByValue = false;
		this._sortValueDesc = false;
	}

	connectedCallback() {
		super.connectedCallback();
		if (!this.spacingData) {
			this._loadSpacingData();
		} else {
			this._spacingData = this.spacingData;
			this._loading = false;
		}
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		
		if (changedProperties.has('spacingData') && this.spacingData) {
			this._spacingData = this.spacingData;
			this._loading = false;
		}
	}

	render() {
		const content = this._renderContent();
		
		if (!this.showContainer) {
			return content;
		}
		
		return html`
			<div class="container">
				<h1 class="d2l-heading-2">Spacing Usage Viewer</h1>
				${content}
			</div>
		`;
	}

	_renderContent() {
		if (this._loading) {
			return html`<d2l-alert type="default">Loading spacing data...</d2l-alert>`;
		}

		if (this._error) {
			return html`<d2l-alert type="critical">${this._error}</d2l-alert>`;
		}

		return html`
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
								<span class="d2l-input-label">Filter by property:</span>
								<select 
									id="property-filter"
									class="d2l-input-select"
									@change="${this._handlePropertyChange}"
									.value="${this.selectedProperty}">
									<option value="">All properties</option>
									<option value="margin">Margin</option>
									<option value="padding">Padding</option>
									<option value="gap">Gap</option>
								</select>
							</label>
						</div>
					` : ''}
					${this._renderSpacingList()}
				</d2l-tab-panel>

				<d2l-tab id="value-view" text="By Spacing Value" slot="tabs"></d2l-tab>
				<d2l-tab-panel labelled-by="value-view" slot="panels">
					<div class="dropdown-container">
						<label>
							<span class="d2l-input-label">Select a spacing value:</span>
							<select 
								id="value-select"
								class="d2l-input-select"
								@change="${this._handleValueChange}"
								.value="${this.selectedValue}">
								<option value="">-- Choose a spacing value --</option>
								${this._getSpacingValues().map(value => html`
									<option value="${value}" ?selected="${value === this.selectedValue}">
										${value}
									</option>
								`)}
							</select>
						</label>
					</div>
					${this._renderComponentListForValue()}
				</d2l-tab-panel>
			</d2l-tabs>
		`;
	}

	_getComponentNames() {
		if (!this._spacingData) return [];
		return Object.keys(this._spacingData)
			.filter(name => this._spacingData[name] && this._spacingData[name].length > 0)
			.sort();
	}

	_getSpacingValues() {
		if (!this._spacingByValue) return [];
		return Object.keys(this._spacingByValue).sort((a, b) => {
			// Sort by numeric value if possible
			const parseValue = (val) => {
				const match = val.match(/^([\d.]+)(rem|px|em|%)$/);
				if (!match) return Infinity;
				const num = parseFloat(match[1]);
				const unit = match[2];
				// Normalize to rem for comparison
				if (unit === 'px') return num / 16;
				if (unit === 'em') return num;
				if (unit === '%') return num / 100;
				return num;
			};
			return parseValue(a) - parseValue(b);
		});
	}

	_handleComponentChange(e) {
		this.selectedComponent = e.target.value;
	}

	_handlePropertyChange(e) {
		this.selectedProperty = e.target.value;
	}

	_handleValueChange(e) {
		this.selectedValue = e.target.value;
	}

	async _loadSpacingData() {
		try {
			const [spacingDataResponse, spacingByValueResponse] = await Promise.all([
				fetch(this.spacingDataFile),
				fetch(this.spacingSummaryFile)
			]);

			if (!spacingDataResponse.ok) {
				throw new Error(`Failed to load ${this.spacingDataFile}: ${spacingDataResponse.statusText}`);
			}
			if (!spacingByValueResponse.ok) {
				throw new Error(`Failed to load ${this.spacingSummaryFile}: ${spacingByValueResponse.statusText}`);
			}

			this._spacingData = await spacingDataResponse.json();
			this._spacingByValue = await spacingByValueResponse.json();
			this._loading = false;
		} catch (error) {
			this._error = `Error loading spacing data: ${error.message}`;
			this._loading = false;
		}
	}

	_renderSpacingList() {
		if (!this.selectedComponent) {
			return html`
				<d2l-empty-state-simple description="Please select a component to view its spacing usage."></d2l-empty-state-simple>
			`;
		}

		let spacings = this._spacingData[this.selectedComponent];

		if (!spacings || spacings.length === 0) {
			return html`
				<d2l-empty-state-simple description="This component does not use any spacing values directly."></d2l-empty-state-simple>
			`;
		}

		// Filter by property if selected
		if (this.selectedProperty) {
			spacings = spacings.filter(item =>
				item.categories && item.categories.includes(this.selectedProperty)
			);

			if (spacings.length === 0) {
				return html`
					<d2l-empty-state-simple description='No spacing values found for the "${this.selectedProperty}" property.'></d2l-empty-state-simple>
				`;
			}
		}

		return html`
			<d2l-collapsible-panel-group>
				${spacings.map(item => html`
					<d2l-collapsible-panel panel-title="${item.spacing}" expanded>
						<div slot="header" style="display: flex; align-items: center; gap: 0.5rem;">
							${this._renderSpacingVisual(item.spacing)}
							<span style="font-family: 'Monaco', 'Menlo', 'Consolas', monospace; font-weight: 700;">${item.spacing}</span>
							${item.categories && item.categories.length > 0 ? html`
								${item.categories.map(cat => html`<span class="property-badge ${cat}">${cat}</span>`)}
							` : ''}
						</div>
						${item.usages && item.usages.length > 0 ? html`
							<div class="property-summary">
								<strong>Used in:</strong>
								${item.usages.map((usage, index) => html`
									<code>${usage}</code>${index < item.usages.length - 1 ? ', ' : ''}
								`)}
							</div>
						` : html`
							<div class="property-summary">
								<span>No usage details available</span>
							</div>
						`}
					</d2l-collapsible-panel>
				`)}
			</d2l-collapsible-panel-group>
		`;
	}

	_renderSpacingVisual(value) {
		// Convert value to pixels for visual representation
		const parseValue = (val) => {
			const match = val.match(/^([\d.]+)(rem|px|em|%)$/);
			if (!match) return 16;
			const num = parseFloat(match[1]);
			const unit = match[2];
			if (unit === 'px') return num;
			if (unit === 'rem' || unit === 'em') return num * 16;
			return 16; // Default for % and unknown
		};
		
		const pixels = Math.min(parseValue(value), 100); // Cap at 100px for display
		
		return html`
			<span class="spacing-visual" style="width: ${pixels}px;"></span>
		`;
	}

	_renderComponentListForValue() {
		if (!this.selectedValue) {
			return html`
				<d2l-empty-state-simple description="Please select a spacing value to view where it's used."></d2l-empty-state-simple>
			`;
		}

		const spacingInfo = this._spacingByValue[this.selectedValue];

		if (!spacingInfo || !spacingInfo.usages || spacingInfo.usages.length === 0) {
			return html`
				<d2l-empty-state-simple description="This spacing value is not used in any components."></d2l-empty-state-simple>
			`;
		}

		return html`
			<div class="spacing-item">
				<div class="spacing-value">
					${this._renderSpacingVisual(this.selectedValue)}
					<span>${this.selectedValue}</span>
				</div>
				${spacingInfo.summary ? html`
					<div class="color-summary">${spacingInfo.summary}</div>
				` : ''}
				${spacingInfo.categories && spacingInfo.categories.length > 0 ? html`
					<div class="category-summary">
						<strong>Used for:</strong>
						${spacingInfo.categories.map(cat => html`<span class="property-badge ${cat}">${cat}</span>`)}
					</div>
				` : ''}
			</div>
			<d2l-collapsible-panel-group>
				${spacingInfo.usages.map(item => html`
					<d2l-collapsible-panel panel-title="${item.component}" expanded>
						<div slot="header" style="display: flex; align-items: center; gap: 0.5rem;">
							${item.categories && item.categories.length > 0 ? html`
								${item.categories.map(cat => html`<span class="property-badge ${cat}">${cat}</span>`)}
							` : ''}
						</div>
						${item.usages && item.usages.length > 0 ? html`
							<div class="property-summary">
								<strong>Used in:</strong>
								${item.usages.map((usage, index) => html`
									<code>${usage}</code>${index < item.usages.length - 1 ? ', ' : ''}
								`)}
							</div>
						` : ''}
					</d2l-collapsible-panel>
				`)}
			</d2l-collapsible-panel-group>
		`;
	}

	_renderSummaryTable() {
		if (!this._spacingData || !this._spacingByValue) {
			return html`<d2l-empty-state-simple description="No spacing data available."></d2l-empty-state-simple>`;
		}

		const categories = ['margin', 'padding', 'gap', 'border'];
		const spacingValues = this._getSpacingValues();

		// Build a map of spacing -> categories used
		const spacingCategories = new Map();
		spacingValues.forEach(spacingValue => {
			const info = this._spacingByValue[spacingValue];
			if (info && info.categories) {
				const cats = new Set(info.categories);
				// Combine border and border-radius into 'border'
				if (cats.has('border-radius')) {
					cats.add('border');
					cats.delete('border-radius');
				}
				spacingCategories.set(spacingValue, cats);
			}
		});

		// Filter spacing values by selected category if one is active
		const filteredSpacings = this._selectedSummaryCategory
			? spacingValues.filter(spacing => {
				const cats = spacingCategories.get(spacing);
				return cats && cats.has(this._selectedSummaryCategory);
			})
			: spacingValues;

		// Sort spacing values
		const sortedSpacings = [...filteredSpacings].sort((a, b) => {
			if (this._sortByValue) {
				// Sort by spacing value (numeric)
				const parseValue = (val) => {
					const match = val.match(/^([\d.]+)(rem|px|em|%)$/);
					if (!match) return Infinity;
					const num = parseFloat(match[1]);
					const unit = match[2];
					// Normalize to rem for comparison
					if (unit === 'px') return num / 16;
					if (unit === 'em') return num;
					if (unit === '%') return num / 100;
					return num;
				};
				const aVal = parseValue(a);
				const bVal = parseValue(b);
				if (this._sortValueDesc) {
					return bVal - aVal;
				}
				return aVal - bVal;
			} else {
				// Sort by usage count
				const aInfo = this._spacingByValue[a];
				const bInfo = this._spacingByValue[b];
				const aCount = aInfo && aInfo.usages ? aInfo.usages.length : 0;
				const bCount = bInfo && bInfo.usages ? bInfo.usages.length : 0;
				
				if (this._sortDesc) {
					return bCount - aCount;
				}
				return aCount - bCount;
			}
		});

		return html`
			<d2l-table-wrapper>
				<table class="d2l-table">
					<thead>
						<tr>
							<th>
								<d2l-table-col-sort-button
									?desc="${this._sortValueDesc}"
									?nosort="${!this._sortByValue}"
									source-type="numbers"
									@click="${this._handleSortByValue}">
									Spacing Value
								</d2l-table-col-sort-button>
							</th>
						<th>
							<d2l-table-col-sort-button 
								?desc="${this._sortDesc}"
								?nosort="${this._sortByValue}"
								source-type="numbers"
								@click="${this._handleSortByUsages}">
								Usages
							</d2l-table-col-sort-button>
						</th>
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
						${sortedSpacings.map(spacing => {
							const info = this._spacingByValue[spacing];
							const cats = spacingCategories.get(spacing) || new Set();
							const isExpanded = this._expandedRows.has(spacing);
							const usageCount = info && info.usages ? info.usages.length : 0;
							
						return html`
							<tr>
								<td>
									<div style="display: flex; align-items: center; gap: 0.3rem;">
										${this._renderSpacingVisual(spacing)}
										${spacing}
									</div>
									<button 
										class="d2l-link"
										@click="${() => this._toggleRow(spacing)}"
										aria-expanded="${isExpanded}">
										${isExpanded ? '▼ Hide' : '▶ Show'} components
									</button>
								</td>
									<td>${usageCount}</td>
									${categories.map(cat => html`
										<td class="check-cell">
											${cats.has(cat) ? html`<span class="check">✓</span>` : ''}
										</td>
									`)}
								</tr>
								${isExpanded ? html`
									<tr class="expanded-content">
										<td colspan="${categories.length + 2}">
											<d2l-expand-collapse-content expanded>
												<div class="component-details">
												${info && info.summary ? html`
													<div class="color-summary">${info.summary}</div>
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
															${info && info.usages && info.usages.length > 0 ? info.usages.map(usage => {
																const componentCategories = new Set(usage.categories || []);
																// Combine border and border-radius into 'border'
																if (componentCategories.has('border-radius')) {
																	componentCategories.add('border');
																	componentCategories.delete('border-radius');
																}
																return html`
																	<tr>
																		<td>${usage.component}</td>
																		${categories.map(cat => html`
																			<td class="check-cell">${componentCategories.has(cat) ? html`<span class="check">✓</span>` : ''}</td>
																		`)}
																	</tr>
																`;
															}) : ''}
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

	_toggleRow(spacing) {
		if (this._expandedRows.has(spacing)) {
			this._expandedRows.delete(spacing);
		} else {
			this._expandedRows.add(spacing);
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

	_handleSortByUsages() {
		this._sortByValue = false;
		this._sortDesc = !this._sortDesc;
	}

	_handleSortByValue() {
		this._sortByValue = true;
		this._sortValueDesc = !this._sortValueDesc;
	}

}

customElements.define('d2l-spacing-usage-viewer', SpacingUsageViewer);
