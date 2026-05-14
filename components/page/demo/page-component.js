import '../../button/button-icon.js';
import '../../button/button-subtle.js';
import '../../button/button.js';
import '../../collapsible-panel/collapsible-panel.js';
import '../../collapsible-panel/collapsible-panel-group.js';
import '../../collapsible-panel/collapsible-panel-summary-item.js';
import '../../demo/demo-page-settings.js';
import '../../dialog/dialog.js';
import '../../filter/filter.js';
import '../../filter/filter-dimension-set.js';
import '../../filter/filter-dimension-set-value.js';
import '../../icons/icon.js';
import '../../inputs/input-checkbox.js';
import '../../inputs/input-date.js';
import '../../inputs/input-fieldset.js';
import '../../inputs/input-group.js';
import '../../inputs/input-number.js';
import '../../inputs/input-text.js';
import '../../list/list.js';
import '../../list/list-controls.js';
import '../../list/list-item.js';
import '../../list/list-item-content.js';
import '../../list/list-item-nav.js';
import '../../selection/selection-action.js';
import '../../switch/switch-visibility.js';
import '../../switch/switch.js';
import '../../table/table-controls.js';
import '../page.js';
import '../page-footer.js';
import '../page-main.js';
import '../page-side-nav.js';
import '../page-supporting.js';
import './page-header-full.js';
import { css, html, LitElement, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { inputLabelStyles } from '../../inputs/input-label-styles.js';
import { pageHeaderImmersiveActionsDemo } from '../test/page-header-immersive-fixtures.js';
import { selectStyles } from '../../inputs/input-select-styles.js';
import { tableStyles } from '../../table/table-wrapper.js';

class PageDemo extends LitElement {

	static properties = {
		demoMode: { type: Boolean, attribute: 'demo-mode' },
		hasFooter: { type: Boolean, attribute: 'has-footer' },
		hasImmersiveHeaderActions: { type: Boolean, attribute: 'has-immersive-header-actions' },
		hasMainHeader: { type: Boolean, attribute: 'has-main-header' },
		hasSideNavHeader: { type: Boolean, attribute: 'has-side-nav-header' },
		hasSupportingHeader: { type: Boolean, attribute: 'has-supporting-header' },
		header: { type: String, attribute: 'header' },
		immersiveHeaderTitleType: { type: String, attribute: 'immersive-header-title-type' },
		layout: { type: String, attribute: 'layout' },
		widthType: { type: String, attribute: 'width-type' },
		_demoDialogOpened: { state: true }
	};

	static styles = [inputLabelStyles, selectStyles, tableStyles, css`
		d2l-demo-page-settings {
			margin-block: 0.6rem;
		}
		.horizontal-fields {
			display: flex;
			gap: 1rem;
		}
	`];

	constructor() {
		super();
		const urlParams = new URLSearchParams(window.location.search);
		this.demoMode = false;
		this.hasFooter = urlParams.has('hasFooter');
		this.hasImmersiveHeaderActions = urlParams.has('hasImmersiveHeaderActions');
		this.hasMainHeader = urlParams.has('hasMainHeader');
		this.hasSideNavHeader = urlParams.has('hasSideNavHeader');
		this.hasSupportingHeader = urlParams.has('hasSupportingHeader');
		this.header = urlParams.get('header') || 'full';
		this.immersiveHeaderTitleType = urlParams.get('immersiveHeaderTitleType') || 'title-subtitle';
		this.layout = urlParams.get('layout') || 'main-only';
		this.widthType = urlParams.get('widthType') || 'normal';
		this._demoDialogOpened = false;
	}

	render() {
		return html`
			<d2l-page width-type="${this.widthType}">
				${this.#renderHeader()}
				${this.#renderSideNavPanel()}
				${this.#renderMainPanel()}
				${this.#renderSupportingPanel()}
				${this.#renderFooter()}
			</d2l-page>
		`;
	}

	#handleDialogClose() {
		this._demoDialogOpened = false;
	}

	#handleDialogOpen() {
		this._demoDialogOpened = true;
	}

	#handleHeaderChange(e) {
		this.header = e.target.value;
		this.#updateUrlParam('header', this.header);
	}

	#handleImmersiveHeaderTitleTypeChange(e) {
		this.immersiveHeaderTitleType = e.target.value;
		this.#updateUrlParam('immersiveHeaderTitleType', this.immersiveHeaderTitleType);
	}

	#handleLayoutChange(e) {
		this.layout = e.target.value;
		this.#updateUrlParam('layout', this.layout);
	}

	#handleVisibilityChange(e) {
		const key = e.target.dataset.key;
		this[key] = e.target.on;
		this.#updateUrlParamBool(key, e.target.on);
	}

	#handleWidthTypeChange(e) {
		this.widthType = e.target.value;
		this.#updateUrlParam('widthType', this.widthType);
	}

	#renderDemoHeaderControls() {
		let typeSpecificControls = nothing;
		if (this.header === 'immersive') {
			typeSpecificControls = html`
				<label>
					<span class="d2l-input-label">Title</span>
					<select class="d2l-input-select" @change="${this.#handleImmersiveHeaderTitleTypeChange}">
						<option value="title-subtitle" ?selected="${this.immersiveHeaderTitleType === 'title-subtitle'}">Title &amp; Subtitle</option>
						<option value="title-only" ?selected="${this.immersiveHeaderTitleType === 'title-only'}">Title Only</option>
						<option value="none" ?selected="${this.immersiveHeaderTitleType === 'none'}">None</option>
					</select>
				</label>
				<d2l-input-fieldset label="Actions">
					<d2l-switch text="On" data-key="hasImmersiveHeaderActions" @change="${this.#handleVisibilityChange}" ?on="${this.hasImmersiveHeaderActions}"></d2l-switch>
				</d2l-input-fieldset>
			`;
		}
		return html`
			<d2l-input-fieldset label="Header" label-style="heading">
				<div class="horizontal-fields">
					<label>
						<span class="d2l-input-label">Type</span>
						<select class="d2l-input-select" @change="${this.#handleHeaderChange}">
							<option value="full" ?selected="${this.header === 'full'}">Full</option>
							<option value="immersive" ?selected="${this.header === 'immersive'}">Immersive</option>
						</select>
					</label>
					${typeSpecificControls}
				</div>
			</d2l-input-fieldset>
		`;
	}

	#renderDemoMainControls() {
		if (!this.demoMode) return nothing;
		return html`
			<d2l-collapsible-panel panel-title="Demo Settings" expanded heading-style="3">
				<d2l-input-group>
					<d2l-input-fieldset label="Page" label-style="heading">
						<div class="horizontal-fields">
							<label>
								<span class="d2l-input-label">Width Type</span>
								<select class="d2l-input-select" @change="${this.#handleWidthTypeChange}">
									<option value="normal" ?selected="${this.widthType === 'normal'}">Normal</option>
									<option value="wide" ?selected="${this.widthType === 'wide'}">Wide</option>
									<option value="fullscreen" ?selected="${this.widthType === 'fullscreen'}">Fullscreen</option>
								</select>
							</label>
							<label>
								<span class="d2l-input-label">Layout</span>
								<select class="d2l-input-select" @change="${this.#handleLayoutChange}">
									<option value="main" ?selected="${this.layout === 'main-only'}">Main Only</option>
									<option value="side-nav" ?selected="${this.layout === 'side-nav'}">Side Nav</option>
									<option value="supporting" ?selected="${this.layout === 'supporting'}">Supporting</option>
								</select>
							</label>
							<d2l-input-fieldset label="Footer">
								<d2l-switch text="On" data-key="hasFooter" @change="${this.#handleVisibilityChange}" ?on="${this.hasFooter}"></d2l-switch>
							</d2l-input-fieldset>
							<d2l-input-fieldset label="Panel Headers">
								<d2l-switch id="switch-main-header" text="Main" data-key="hasMainHeader" @change="${this.#handleVisibilityChange}" ?on="${this.hasMainHeader}"></d2l-switch>
								${this.layout === 'side-nav' ? html`<d2l-switch text="Side Nav" data-key="hasSideNavHeader" @change="${this.#handleVisibilityChange}" ?on="${this.hasSideNavHeader}"></d2l-switch>` : nothing}
								${this.layout === 'supporting' ? html`<d2l-switch text="Supporting" data-key="hasSupportingHeader" @change="${this.#handleVisibilityChange}" ?on="${this.hasSupportingHeader}"></d2l-switch>` : nothing}
							</d2l-input-fieldset>
						</div>
					</d2l-input-fieldset>
					${this.#renderDemoHeaderControls()}
				</d2l-input-group>
				<d2l-demo-page-settings panel-title="Environment Settings"></d2l-demo-page-settings>
			</d2l-collapsible-panel>
		`;
	}

	#renderFooter() {
		return this.hasFooter ? html`
			<d2l-page-footer slot="footer">
				<d2l-button primary>Save and Close</d2l-button>
				<d2l-button>Save</d2l-button>
				<d2l-switch-visibility></d2l-switch-visibility>
				<d2l-button slot="end">Clear</d2l-button>
				<d2l-button-icon slot="end" icon="d2l-tier1:chevron-right" text="Next"></d2l-button-icon>
			</d2l-page-footer>
		` : nothing;
	}

	#renderHeader() {
		if (this.header === 'full') {
			return html`<d2l-page-header-full-demo slot="header"></d2l-page-header-full-demo>`;
		}
		const titleText = this.immersiveHeaderTitleType === 'none' ? undefined : 'Assignment 1';
		const subtitleText = this.immersiveHeaderTitleType === 'title-subtitle' ? 'Introduction to Economics' : undefined;
		return html`
			<d2l-page-header-immersive slot="header" title-text="${ifDefined(titleText)}" subtitle-text="${ifDefined(subtitleText)}">
				${this.hasImmersiveHeaderActions ? pageHeaderImmersiveActionsDemo : nothing}
			</d2l-page-header-immersive>
		`;
	}


	#renderMainPanel() {
		return html`
			<d2l-page-main>
				${this.hasMainHeader ? html`
					<d2l-switch-visibility slot="header-start"></d2l-switch-visibility>
					<d2l-filter slot="header-end">
						<d2l-filter-dimension-set key="type" text="Activity Type" select-all>
							<d2l-filter-dimension-set-value key="assignments" text="Assignments" selected></d2l-filter-dimension-set-value>
							<d2l-filter-dimension-set-value key="quizzes" text="Quizzes" selected></d2l-filter-dimension-set-value>
							<d2l-filter-dimension-set-value key="discussions" text="Discussions"></d2l-filter-dimension-set-value>
							<d2l-filter-dimension-set-value key="content" text="Content Topics"></d2l-filter-dimension-set-value>
						</d2l-filter-dimension-set>
					</d2l-filter>
					<d2l-button slot="header-end" primary @click="${this.#handleDialogOpen}">New Assignment</d2l-button>
				` : nothing	}
				
				${this.#renderDemoMainControls()}

				<h3>List with Sticky Controls (extend-separators)</h3>
				<d2l-list extend-separators>
					<d2l-list-controls slot="controls">
						<d2l-selection-action icon="tier1:bookmark-hollow" text="Bookmark" requires-selection></d2l-selection-action>
						<d2l-selection-action icon="tier1:gear" text="Settings"></d2l-selection-action>
					</d2l-list-controls>
					<d2l-list-item key="item-1" label="Introduction to Economics" selectable>
						<d2l-list-item-content>
							<div>Introduction to Economics</div>
							<div slot="secondary">Chapter 1 — Fundamentals</div>
							<div slot="supporting-info">Due: May 15, 2026</div>
						</d2l-list-item-content>
					</d2l-list-item>
					<d2l-list-item key="item-2" label="Supply and Demand" selectable>
						<d2l-list-item-content>
							<div>Supply and Demand</div>
							<div slot="secondary">Chapter 2 — Market Forces</div>
							<div slot="supporting-info">Due: May 22, 2026</div>
						</d2l-list-item-content>
					</d2l-list-item>
					<d2l-list-item key="item-3" label="Market Equilibrium" selectable>
						<d2l-list-item-content>
							<div>Market Equilibrium</div>
							<div slot="secondary">Chapter 3 — Price Discovery</div>
							<div slot="supporting-info">Due: May 29, 2026</div>
						</d2l-list-item-content>
					</d2l-list-item>
				</d2l-list>

				<h3>List with Sticky Controls (no extend-separators)</h3>
				<d2l-list>
					<d2l-list-controls slot="controls">
						<d2l-selection-action icon="tier1:plus-default" text="Add"></d2l-selection-action>
						<d2l-selection-action icon="tier1:delete" text="Delete" requires-selection></d2l-selection-action>
					</d2l-list-controls>
					<d2l-list-item key="assign-1" label="Assignment 1" selectable>
						<d2l-list-item-content>
							<div>Assignment 1: Research Proposal</div>
							<div slot="secondary">Weight: 20%</div>
							<div slot="supporting-info">Submissions: 14/30</div>
						</d2l-list-item-content>
					</d2l-list-item>
					<d2l-list-item key="assign-2" label="Assignment 2" selectable>
						<d2l-list-item-content>
							<div>Assignment 2: Literature Review</div>
							<div slot="secondary">Weight: 30%</div>
							<div slot="supporting-info">Submissions: 8/30</div>
						</d2l-list-item-content>
					</d2l-list-item>
					<d2l-list-item key="assign-3" label="Assignment 3" selectable>
						<d2l-list-item-content>
							<div>Assignment 3: Final Paper</div>
							<div slot="secondary">Weight: 50%</div>
							<div slot="supporting-info">Submissions: 0/30</div>
						</d2l-list-item-content>
					</d2l-list-item>
				</d2l-list>

				<h3>Table with Sticky Controls</h3>
				<d2l-table-wrapper>
					<d2l-table-controls slot="controls">
						<d2l-selection-action icon="tier1:download" text="Export"></d2l-selection-action>
						<d2l-selection-action icon="tier1:email" text="Email" requires-selection></d2l-selection-action>
					</d2l-table-controls>
					<table class="d2l-table">
						<thead>
							<tr>
								<th>Course</th>
								<th>Enrolled</th>
								<th>Completion Rate</th>
								<th>Avg Grade</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<th scope="row">Introduction to Biology</th>
								<td>145</td>
								<td>87%</td>
								<td>B+</td>
							</tr>
							<tr>
								<th scope="row">Advanced Chemistry</th>
								<td>62</td>
								<td>79%</td>
								<td>B</td>
							</tr>
							<tr>
								<th scope="row">World History</th>
								<td>98</td>
								<td>92%</td>
								<td>A-</td>
							</tr>
						</tbody>
					</table>
				</d2l-table-wrapper>

				<h3>Sticky Table</h3>
				<d2l-table-wrapper sticky-headers sticky-headers-scroll-wrapper>
					<table class="d2l-table">
						<thead>
							<tr>
								<th>Student</th>
								<th>Assignment 1</th>
								<th>Assignment 2</th>
								<th>Final Exam</th>
								<th>Total</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<th scope="row">Alice Johnson</th>
								<td>92</td>
								<td>88</td>
								<td>95</td>
								<td>91.7</td>
							</tr>
							<tr>
								<th scope="row">Bob Smith</th>
								<td>85</td>
								<td>79</td>
								<td>82</td>
								<td>82.0</td>
							</tr>
							<tr>
								<th scope="row">Carol Davis</th>
								<td>78</td>
								<td>91</td>
								<td>87</td>
								<td>85.3</td>
							</tr>
							<tr>
								<th scope="row">David Lee</th>
								<td>95</td>
								<td>93</td>
								<td>90</td>
								<td>92.7</td>
							</tr>
							<tr>
								<th scope="row">Emily Chen</th>
								<td>88</td>
								<td>84</td>
								<td>91</td>
								<td>87.7</td>
							</tr>
						</tbody>
					</table>
				</d2l-table-wrapper>
				<div style="align-items: end; display: flex; height: 500px;">End of Content</div>
				<d2l-dialog id="demo-dialog" title-text="New Assignment" ?opened="${this._demoDialogOpened}" @d2l-dialog-close="${this.#handleDialogClose}">
					<div style="display: flex; flex-direction: column; gap: 0.75rem;">
						<d2l-input-text label="Assignment Name" value=""></d2l-input-text>
						<d2l-input-number label="Points" value="100"></d2l-input-number>
						<d2l-input-date label="Due Date"></d2l-input-date>
						<d2l-input-checkbox>Allow late submissions</d2l-input-checkbox>
					</div>
					<d2l-button slot="footer" primary data-dialog-action="create">Create</d2l-button>
					<d2l-button slot="footer" data-dialog-action>Cancel</d2l-button>
				</d2l-dialog>
			</d2l-page-main>
		`;
	}

	#renderSideNavPanel() {
		if (this.layout !== 'side-nav') return nothing;
		return html`
			<d2l-page-side-nav slot="side-nav">
				${this.hasSideNavHeader ? html`
					<d2l-button-subtle slot="header-start" text="Add Topic" icon="tier1:plus-default"></d2l-button-subtle>
					<d2l-button-icon slot="header-end" text="Collapse All" icon="tier1:arrow-collapse"></d2l-button-icon>
					<d2l-button-icon slot="header-end" text="Reorder" icon="tier1:dragger"></d2l-button-icon>
				` : nothing}
				<d2l-list grid drag-multiple style="width: 100%;">
					<d2l-list-item-nav key="nav-1" label="Course Overview" color="#006fbf" draggable drag-handle-text="Course Overview" drop-nested action-href="javascript:void(0)" prevent-navigation>
						<d2l-list-item-content>
							<div><d2l-icon style="margin-right: 0.7rem;" icon="tier2:content"></d2l-icon>Course Overview</div>
						</d2l-list-item-content>
					</d2l-list-item-nav>
					<d2l-list-item-nav key="nav-2" label="Unit 1: Foundations" color="#29a6ff" expandable expanded draggable drag-handle-text="Unit 1: Foundations" drop-nested action-href="javascript:void(0)" prevent-navigation>
						<d2l-list-item-content>
							<div>Unit 1: Foundations</div>
							<div slot="secondary">3 items</div>
						</d2l-list-item-content>
						<d2l-list slot="nested" grid>
							<d2l-list-item-nav key="nav-2-1" label="Reading: Core Concepts" draggable drag-handle-text="Reading: Core Concepts" drop-nested action-href="javascript:void(0)" prevent-navigation>
								<d2l-list-item-content>
									<div><d2l-icon style="margin-right: 0.7rem;" icon="tier2:file-document"></d2l-icon>Reading: Core Concepts</div>
								</d2l-list-item-content>
							</d2l-list-item-nav>
							<d2l-list-item-nav key="nav-2-2" label="Discussion: Key Takeaways" draggable drag-handle-text="Discussion: Key Takeaways" drop-nested action-href="javascript:void(0)" prevent-navigation>
								<d2l-list-item-content>
									<div><d2l-icon style="margin-right: 0.7rem;" icon="tier2:discuss"></d2l-icon>Discussion: Key Takeaways</div>
								</d2l-list-item-content>
							</d2l-list-item-nav>
							<d2l-list-item-nav key="nav-2-3" label="Quiz: Chapter 1" draggable drag-handle-text="Quiz: Chapter 1" drop-nested action-href="javascript:void(0)" prevent-navigation>
								<d2l-list-item-content>
									<div><d2l-icon style="margin-right: 0.7rem;" icon="tier2:quiz"></d2l-icon>Quiz: Chapter 1</div>
								</d2l-list-item-content>
							</d2l-list-item-nav>
						</d2l-list>
					</d2l-list-item-nav>
					<d2l-list-item-nav key="nav-3" label="Unit 2: Applications" color="#990006" expandable draggable drag-handle-text="Unit 2: Applications" drop-nested action-href="javascript:void(0)" prevent-navigation>
						<d2l-list-item-content>
							<div>Unit 2: Applications</div>
							<div slot="secondary">4 items</div>
						</d2l-list-item-content>
						<d2l-list slot="nested" grid>
							<d2l-list-item-nav key="nav-3-1" label="Case Study Analysis" draggable drag-handle-text="Case Study Analysis" drop-nested action-href="javascript:void(0)" prevent-navigation>
								<d2l-list-item-content>
									<div><d2l-icon style="margin-right: 0.7rem;" icon="tier2:file-document"></d2l-icon>Case Study Analysis</div>
								</d2l-list-item-content>
							</d2l-list-item-nav>
							<d2l-list-item-nav key="nav-3-2" label="Group Project" draggable drag-handle-text="Group Project" drop-nested action-href="javascript:void(0)" prevent-navigation>
								<d2l-list-item-content>
									<div><d2l-icon style="margin-right: 0.7rem;" icon="tier2:group"></d2l-icon>Group Project</div>
								</d2l-list-item-content>
							</d2l-list-item-nav>
							<d2l-list-item-nav key="nav-3-3" label="Lab: Data Collection" draggable drag-handle-text="Lab: Data Collection" drop-nested action-href="javascript:void(0)" prevent-navigation>
								<d2l-list-item-content>
									<div><d2l-icon style="margin-right: 0.7rem;" icon="tier2:file-document"></d2l-icon>Lab: Data Collection</div>
								</d2l-list-item-content>
							</d2l-list-item-nav>
							<d2l-list-item-nav key="nav-3-4" label="Reflection Journal" draggable drag-handle-text="Reflection Journal" drop-nested action-href="javascript:void(0)" prevent-navigation>
								<d2l-list-item-content>
									<div><d2l-icon style="margin-right: 0.7rem;" icon="tier2:notebook"></d2l-icon>Reflection Journal</div>
								</d2l-list-item-content>
							</d2l-list-item-nav>
						</d2l-list>
					</d2l-list-item-nav>
					<d2l-list-item-nav key="nav-4" label="Unit 3: Research Methods" color="#168622" expandable draggable drag-handle-text="Unit 3: Research Methods" drop-nested action-href="javascript:void(0)" prevent-navigation>
						<d2l-list-item-content>
							<div>Unit 3: Research Methods</div>
							<div slot="secondary">5 items</div>
						</d2l-list-item-content>
						<d2l-list slot="nested" grid>
							<d2l-list-item-nav key="nav-4-1" label="Introduction to Research Design" draggable drag-handle-text="Introduction to Research Design" drop-nested action-href="javascript:void(0)" prevent-navigation>
								<d2l-list-item-content>
									<div><d2l-icon style="margin-right: 0.7rem;" icon="tier2:file-document"></d2l-icon>Introduction to Research Design</div>
								</d2l-list-item-content>
							</d2l-list-item-nav>
							<d2l-list-item-nav key="nav-4-2" label="Qualitative vs Quantitative" draggable drag-handle-text="Qualitative vs Quantitative" drop-nested action-href="javascript:void(0)" prevent-navigation>
								<d2l-list-item-content>
									<div><d2l-icon style="margin-right: 0.7rem;" icon="tier2:file-document"></d2l-icon>Qualitative vs Quantitative</div>
								</d2l-list-item-content>
							</d2l-list-item-nav>
							<d2l-list-item-nav key="nav-4-3" label="Survey Design Workshop" draggable drag-handle-text="Survey Design Workshop" drop-nested action-href="javascript:void(0)" prevent-navigation>
								<d2l-list-item-content>
									<div><d2l-icon style="margin-right: 0.7rem;" icon="tier2:file-document"></d2l-icon>Survey Design Workshop</div>
								</d2l-list-item-content>
							</d2l-list-item-nav>
							<d2l-list-item-nav key="nav-4-4" label="Ethics in Research" draggable drag-handle-text="Ethics in Research" drop-nested action-href="javascript:void(0)" prevent-navigation>
								<d2l-list-item-content>
									<div><d2l-icon style="margin-right: 0.7rem;" icon="tier2:file-document"></d2l-icon>Ethics in Research</div>
								</d2l-list-item-content>
							</d2l-list-item-nav>
							<d2l-list-item-nav key="nav-4-5" label="Quiz: Research Methods" draggable drag-handle-text="Quiz: Research Methods" drop-nested action-href="javascript:void(0)" prevent-navigation>
								<d2l-list-item-content>
									<div><d2l-icon style="margin-right: 0.7rem;" icon="tier2:quiz"></d2l-icon>Quiz: Research Methods</div>
								</d2l-list-item-content>
							</d2l-list-item-nav>
						</d2l-list>
					</d2l-list-item-nav>
				</d2l-list>
				<div style="align-items: end; display: flex; height: 150px;">End of Content</div>
			</d2l-page-side-nav>
		`;
	}

	#renderSupportingPanel() {
		if (this.layout !== 'supporting') return nothing;
		return html`
			<d2l-page-supporting slot="supporting">
				${this.hasSupportingHeader ? html`
					<d2l-button-subtle slot="header-start" text="Preview" icon="tier1:preview"></d2l-button-subtle>
					<d2l-button-icon slot="header-end" text="Full Screen" icon="tier1:fullscreen"></d2l-button-icon>
					<d2l-button-icon slot="header-end" text="Dismiss" icon="tier1:close-small"></d2l-button-icon>
				` : nothing}
				<d2l-collapsible-panel-group>
					<d2l-collapsible-panel panel-title="Availability Dates and Conditions" expanded>
						<d2l-collapsible-panel-summary-item slot="summary" text="Available: May 1 – Jun 30, 2026"></d2l-collapsible-panel-summary-item>
						<div style="display: flex; flex-direction: column; gap: 0.75rem;">
							<d2l-input-date label="Start Date" value="2026-05-01"></d2l-input-date>
							<d2l-input-date label="End Date" value="2026-06-30"></d2l-input-date>
							<d2l-input-checkbox checked>Has start date</d2l-input-checkbox>
							<d2l-input-checkbox checked>Has end date</d2l-input-checkbox>
							<d2l-button-subtle text="Manage Release Conditions"></d2l-button-subtle>
						</div>
					</d2l-collapsible-panel>
					<d2l-collapsible-panel panel-title="Grading and Assessment">
						<d2l-collapsible-panel-summary-item slot="summary" text="Weight: 20% | Rubric attached"></d2l-collapsible-panel-summary-item>
						<div style="display: flex; flex-direction: column; gap: 0.75rem;">
							<d2l-input-text label="Grade Item Name" value="Assignment 1: Research Proposal"></d2l-input-text>
							<d2l-input-number label="Points" value="100"></d2l-input-number>
							<d2l-input-number label="Weight (%)" value="20"></d2l-input-number>
							<select class="d2l-input-select" aria-label="Grade scheme">
								<option selected>Percentage</option>
								<option>Letter Grade</option>
								<option>Pass/Fail</option>
							</select>
							<d2l-input-checkbox checked>Include in final grade calculation</d2l-input-checkbox>
							<d2l-button-subtle text="Attach Rubric"></d2l-button-subtle>
						</div>
					</d2l-collapsible-panel>
					<d2l-collapsible-panel panel-title="Submission and Completion">
						<d2l-collapsible-panel-summary-item slot="summary" text="Individual submission, 1 attempt"></d2l-collapsible-panel-summary-item>
						<div style="display: flex; flex-direction: column; gap: 0.75rem;">
							<select class="d2l-input-select" aria-label="Submission type">
								<option selected>Individual submission</option>
								<option>Group submission</option>
							</select>
							<d2l-input-number label="Attempts allowed" value="1" min="1" max="10"></d2l-input-number>
							<d2l-input-checkbox>Allow learners to retract submissions</d2l-input-checkbox>
							<d2l-input-checkbox checked>Notify instructor on submission</d2l-input-checkbox>
							<select class="d2l-input-select" aria-label="Accepted file types">
								<option selected>All file types</option>
								<option>PDF only</option>
								<option>Documents (.doc, .docx, .pdf)</option>
								<option>Images (.png, .jpg, .gif)</option>
							</select>
							<d2l-input-text label="Completion message" value="Thank you for your submission!"></d2l-input-text>
						</div>
					</d2l-collapsible-panel>
				</d2l-collapsible-panel-group>
				<div style="align-items: end; display: flex; height: 150px;">End of Content</div>
			</d2l-page-supporting>
		`;
	}

	#updateUrlParam(key, value) {
		const url = new URL(window.location.href);
		url.searchParams.set(key, value);
		window.history.replaceState({}, '', url.toString());
	}

	#updateUrlParamBool(key, on) {
		const url = new URL(window.location.href);
		if (on) {
			this.#updateUrlParam(key, '1');
		} else {
			url.searchParams.delete(key);
			window.history.replaceState({}, '', url.toString());
		}
	}
}

customElements.define('d2l-page-demo', PageDemo);
