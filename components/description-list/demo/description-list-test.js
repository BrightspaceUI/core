import '../../colors/colors.js';
import { css, html, LitElement } from 'lit';
import { descriptionListStyles } from '../description-list-wrapper.js';

class TestDescriptionList extends LitElement {
	static get properties() {
		return {
			/**
			 * Type of test
			 * @type {'default'|'long'|'activity-display'|'slotted'|'bulk-course-import'}
			 */
			type: { type: String, reflect: true },
		};
	}

	static get styles() {
		return [descriptionListStyles, css`
			.user {
				align-items: center;
				display: flex;
				gap: 0.5rem;
			}
			.avatar {
				align-items: center;
				background-color: var(--d2l-color-cinnabar-minus-1);
				border-radius: 0.25rem;
				color: white;
				display: flex;
				font-size: 0.7rem;
				font-weight: 700;
				height: 1.5rem;
				justify-content: center;
				width: 1.5rem;
			}
		`];
	}

	constructor() {
		super();
		this.type = 'default';
	}

	render() {
		if (this.type === 'default') {
			return html`
				<d2l-dl-wrapper>
					<dl>
						<dt>Course Name</dt>
						<dd>Brightspace 101B</dd>

						<dt>Course Code</dt>
						<dd>BSPC 101B</dd>

						<dt>Start Date</dt>
						<dd>June 14 2022</dd>

						<dt>Semester</dt>
						<dd>2022 Summer</dd>
					</dl>
				</d2l-dl-wrapper>
			`;
		}

		if (this.type === 'long') {
			return html`
				<d2l-dl-wrapper breakpoint="300">
					<dl>
						<dt>Course Code That Represents The Course as a Short String</dt>
						<dd>A short string that represents the course, often with important information such as section or room number.</dd>

						<dt>Availability Dates</dt>
						<dd>The start and end date for the course. Learners can't access courses outside these dates.</dd>
					</dl>
				</d2l-dl-wrapper>
			`;
		}

		if (this.type === 'activity-display') {
			return html`
				<d2l-dl-wrapper>
					<dl>
						<dt>Submission type</dt>
						<dd>File submission</dd>

						<dt>Files allowed per submission</dt>
						<dd>Unlimited</dd>

						<dt>File extension</dt>
						<dd>PDF</dd>

						<dt>Allowed Submissions</dt>
						<dd>Only one submission allowed</dd>
					</dl>
				</d2l-dl-wrapper>
			`;
		}

		if (this.type === 'bulk-course-import') {
			return html`
				<d2l-dl-wrapper>
					<dl>
						<dt>Course code</dt>
						<dd>fd6b9fd8-29bd-44ef-8322-d6b379b71411</dd>

						<dt>Course name</dt>
						<dd>Telkom MOMP Course 1</dd>

						<dt>Course ID</dt>
						<dd>250003</dd>
					</dl>
				</d2l-dl-wrapper>
			`;
		}

		if (this.type === 'slotted') {
			return html`
				<d2l-dl-wrapper>
					<dl style="align-items: center">
						<dt>User</dt>
						<dd><div class="user"><div class="avatar">JS</div>John Smith</div></dd>

						<dt>Submitted</dt>
						<dd>Dec 30, 2021 5:34 PM</dd>
					</dl>
				</d2l-dl-wrapper>
			`;
		}
	}
}

customElements.define('d2l-test-dl', TestDescriptionList);
