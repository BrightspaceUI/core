import '../../button/button-subtle.js';
import '../../collapsible-panel/collapsible-panel.js';
import '../../collapsible-panel/collapsible-panel-group.js';
import '../../collapsible-panel/collapsible-panel-summary-item.js';
import '../../demo/demo-page-settings.js';
import '../../inputs/input-checkbox.js';
import '../../inputs/input-date.js';
import '../../inputs/input-number.js';
import '../../inputs/input-text.js';
import '../../list/list.js';
import '../../list/list-controls.js';
import '../../list/list-item.js';
import '../../list/list-item-content.js';
import '../../list/list-item-nav.js';
import '../../selection/selection-action.js';
import '../../table/table-controls.js';
import '../page.js';
import { css, html, LitElement, nothing } from 'lit';
import { navStyles } from './temp-nav-styles.js';
import { selectStyles } from '../../inputs/input-select-styles.js';
import { tableStyles } from '../../table/table-wrapper.js';

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

	static styles = [navStyles, selectStyles, tableStyles, css`
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
			this.hasSupportingPanel = false;
		} else if (e.target.on && key === 'hasSupportingPanel' && this.hasSideNavPanel) {
			this.hasSideNavPanel = false;
		}
	}

	#handleWidthTypeChange(e) {
		this.widthType = e.target.value;
	}

	#renderDemoMainControls() {
		return this.demoMode ? html`
			<d2l-collapsible-panel panel-title="Demo Controls" expanded>
				<div class="demo-controls">
					<select class="d2l-input-select" name="width-type" aria-label="Width type" @change="${this.#handleWidthTypeChange}">
						<option value="normal" ?selected="${this.widthType === 'normal'}">Normal Width</option>
						<option value="wide" ?selected="${this.widthType === 'wide'}">Wide Width</option>
						<option value="fullscreen" ?selected="${this.widthType === 'fullscreen'}">Fullscreen</option>
					</select>
					<d2l-switch id="switch-nav-type" text="Immersive Nav" @change="${this.#handleNavTypeChange}"></d2l-switch>
					<d2l-switch id="switch-side-nav-panel" text="Side Nav Panel" data-key="hasSideNavPanel" @change="${this.#handleVisibilityChange}" ?on="${this.hasSideNavPanel}"></d2l-switch>
					<d2l-switch id="switch-supporting-panel" text="Supporting Panel" data-key="hasSupportingPanel" @change="${this.#handleVisibilityChange}" ?on="${this.hasSupportingPanel}"></d2l-switch>
					<d2l-switch id="switch-footer" text="Footer" data-key="hasFooter" @change="${this.#handleVisibilityChange}"></d2l-switch>
					<d2l-switch id="switch-allow-three-panels" text="Allow Three Panels" @change="${this.#handleAllowThreePanelsChange}"></d2l-switch>
				</div>
			</d2l-collapsible-panel>
		` : nothing;
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
			<div>
				<p>I'm in the <b>default</b> slot of the <b>d2l-page</b> component!</p>
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
			</div>
		`;
	}

	#renderSideNavPanel() {
		return this.hasSideNavPanel ? html`
			<div slot="side-nav">
				<p>I'm in the <b>side-nav</b> slot of the <b>d2l-page</b> component!</p>
				<d2l-list grid style="width: 100%;">
					<d2l-list-item-nav key="nav-1" label="Course Overview" action-href="javascript:void(0)" prevent-navigation>
						<d2l-list-item-content>
							<div>Course Overview</div>
						</d2l-list-item-content>
					</d2l-list-item-nav>
					<d2l-list-item-nav key="nav-2" label="Unit 1: Foundations" expandable expanded action-href="javascript:void(0)" prevent-navigation>
						<d2l-list-item-content>
							<div>Unit 1: Foundations</div>
							<div slot="secondary">3 items</div>
						</d2l-list-item-content>
						<d2l-list slot="nested" grid>
							<d2l-list-item-nav key="nav-2-1" label="Reading: Core Concepts" action-href="javascript:void(0)" prevent-navigation>
								<d2l-list-item-content>
									<div>Reading: Core Concepts</div>
								</d2l-list-item-content>
							</d2l-list-item-nav>
							<d2l-list-item-nav key="nav-2-2" label="Discussion: Key Takeaways" action-href="javascript:void(0)" prevent-navigation>
								<d2l-list-item-content>
									<div>Discussion: Key Takeaways</div>
								</d2l-list-item-content>
							</d2l-list-item-nav>
							<d2l-list-item-nav key="nav-2-3" label="Quiz: Chapter 1" action-href="javascript:void(0)" prevent-navigation>
								<d2l-list-item-content>
									<div>Quiz: Chapter 1</div>
								</d2l-list-item-content>
							</d2l-list-item-nav>
						</d2l-list>
					</d2l-list-item-nav>
					<d2l-list-item-nav key="nav-3" label="Unit 2: Applications" expandable action-href="javascript:void(0)" prevent-navigation>
						<d2l-list-item-content>
							<div>Unit 2: Applications</div>
							<div slot="secondary">4 items</div>
						</d2l-list-item-content>
						<d2l-list slot="nested" grid>
							<d2l-list-item-nav key="nav-3-1" label="Case Study Analysis" action-href="javascript:void(0)" prevent-navigation>
								<d2l-list-item-content>
									<div>Case Study Analysis</div>
								</d2l-list-item-content>
							</d2l-list-item-nav>
							<d2l-list-item-nav key="nav-3-2" label="Group Project" action-href="javascript:void(0)" prevent-navigation>
								<d2l-list-item-content>
									<div>Group Project</div>
								</d2l-list-item-content>
							</d2l-list-item-nav>
							<d2l-list-item-nav key="nav-3-3" label="Lab: Data Collection" action-href="javascript:void(0)" prevent-navigation>
								<d2l-list-item-content>
									<div>Lab: Data Collection</div>
								</d2l-list-item-content>
							</d2l-list-item-nav>
							<d2l-list-item-nav key="nav-3-4" label="Reflection Journal" action-href="javascript:void(0)" prevent-navigation>
								<d2l-list-item-content>
									<div>Reflection Journal</div>
								</d2l-list-item-content>
							</d2l-list-item-nav>
						</d2l-list>
					</d2l-list-item-nav>
					<d2l-list-item-nav key="nav-4" label="Unit 3: Research Methods" expandable action-href="javascript:void(0)" prevent-navigation>
						<d2l-list-item-content>
							<div>Unit 3: Research Methods</div>
							<div slot="secondary">5 items</div>
						</d2l-list-item-content>
						<d2l-list slot="nested" grid>
							<d2l-list-item-nav key="nav-4-1" label="Introduction to Research Design" action-href="javascript:void(0)" prevent-navigation>
								<d2l-list-item-content>
									<div>Introduction to Research Design</div>
								</d2l-list-item-content>
							</d2l-list-item-nav>
							<d2l-list-item-nav key="nav-4-2" label="Qualitative vs Quantitative" action-href="javascript:void(0)" prevent-navigation>
								<d2l-list-item-content>
									<div>Qualitative vs Quantitative</div>
								</d2l-list-item-content>
							</d2l-list-item-nav>
							<d2l-list-item-nav key="nav-4-3" label="Survey Design Workshop" action-href="javascript:void(0)" prevent-navigation>
								<d2l-list-item-content>
									<div>Survey Design Workshop</div>
								</d2l-list-item-content>
							</d2l-list-item-nav>
							<d2l-list-item-nav key="nav-4-4" label="Ethics in Research" action-href="javascript:void(0)" prevent-navigation>
								<d2l-list-item-content>
									<div>Ethics in Research</div>
								</d2l-list-item-content>
							</d2l-list-item-nav>
							<d2l-list-item-nav key="nav-4-5" label="Quiz: Research Methods" action-href="javascript:void(0)" prevent-navigation>
								<d2l-list-item-content>
									<div>Quiz: Research Methods</div>
								</d2l-list-item-content>
							</d2l-list-item-nav>
						</d2l-list>
					</d2l-list-item-nav>
				</d2l-list>
				<div style="align-items: end; display: flex; height: 150px;">End of Content</div>
			</div>
		` : nothing;
	}

	#renderSupportingPanel() {
		return this.hasSupportingPanel ? html`
			<div slot="supporting">
				<d2l-demo-page-settings panel-title="d2l-page"></d2l-demo-page-settings>
				<p>I'm in the <b>supporting</b> slot of the <b>d2l-page</b> component!</p>
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
			</div>
		` : nothing;
	}
}

customElements.define('d2l-page-demo', PageDemo);
