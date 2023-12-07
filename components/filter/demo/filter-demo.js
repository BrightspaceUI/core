import '../filter.js';
import '../filter-overflow-group.js';
import '../filter-dimension-set.js';
import '../filter-dimension-set-value.js';
import { html, LitElement } from 'lit';

class FilterDemo extends LitElement {

	firstUpdated(changedProps) {
		super.firstUpdated(changedProps);

		this.addEventListener('d2l-filter-change', () => {
			console.log('change!!!! ');
		})
		this.addEventListener('d2l-filter-dimension-search', () => {
			console.log('search')
		})
	}

	render() {
		return html`
				<d2l-filter-overflow-group max-to-show="1">
				<d2l-filter  id="filter1">
					<d2l-filter-dimension-set key="skill" text="Skill">
						<d2l-filter-dimension-set-value key="communication" text="Fall"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="leadership" text="Winter"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="management" text="Spring"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="planning" text="Summer"></d2l-filter-dimension-set-value>
					</d2l-filter-dimension-set>
				</d2l-filter>
				<d2l-filter  id="filter2">
					<d2l-filter-dimension-set key="type" text="Type" selection-single has-more search-type="manual">
						<d2l-filter-dimension-set-value key="certificate" text="Certificate"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="degree" text="Degree"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="diploma" text="Diploma"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="course" text="Course"></d2l-filter-dimension-set-value>
					</d2l-filter-dimension-set>
				</d2l-filter>
				<d2l-filter  id="filter3">
					<d2l-filter-dimension-set key="provider" text="Semester3">
						<d2l-filter-dimension-set-value key="mcmaster" text="McMaster"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="powered" text="PowerED"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="guelph" text="University of Guelph"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="manitoba" text="University of Manitoba"></d2l-filter-dimension-set-value>
					</d2l-filter-dimension-set>
				</d2l-filter>
				<d2l-filter  id="filter4" @d2l-filter-change="${this._handleChange}">
					<d2l-filter-dimension-set key="format" text="Format">
						<d2l-filter-dimension-set-value key="selfpaced" text="Self-Paced"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="instructor" text="Instructor Lead" selected></d2l-filter-dimension-set-value>
					</d2l-filter-dimension-set>
				</d2l-filter>
				<d2l-filter  id="filter5" @d2l-filter-change="${this._handleChange}" @d2l-filter-dimension-load-more="${this._handleLoadMore}">
					<d2l-filter-dimension-set key="language" text="Language" selection-single has-more >
						<d2l-filter-dimension-set-value key="english" text="English"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="french" text="French"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="spanish" text="Spanish"></d2l-filter-dimension-set-value>
					</d2l-filter-dimension-set>
				</d2l-filter>
				<d2l-filter  id="filter6" @d2l-filter-change="${this._handleChange}">
					<d2l-filter-dimension-set key="course" text="Course" select-all>
						<d2l-filter-dimension-set-value key="art" text="Art"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="astronomy" text="Astronomy" selected></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="biology" text="Biology"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="chemistry" text="Chemistry"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="drama" text="Drama"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="english" text="English"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="how-to" text="How To Write a How To Article With a Flashy Title"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="math" text="Math"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="physics" text="Physics"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="stats" text="Statistics"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="writerscraft" text="Writer's Craft"></d2l-filter-dimension-set-value>
					</d2l-filter-dimension-set>
					<d2l-filter-dimension-set key="duration" text="Duration">
						<d2l-filter-dimension-set-value key="lessthanthree" text="< 3 months"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="threetosix" text="3-6 months"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="sixtotwelve" text="6-12 months"></d2l-filter-dimension-set-value>
					</d2l-filter-dimension-set>
					<d2l-filter-dimension-set key="hoursperweek" text="SemesterNested" selection-single search-type="manual">
						<d2l-filter-dimension-set-value key="lessthanfive" text="< 5 hrs/week"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="fivetoten" text="5-10 hrs/week" selected></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="tentotwenty" text="10-20 hrs/week"></d2l-filter-dimension-set-value>
					</d2l-filter-dimension-set>
				</d2l-filter>
			</d2l-filter-overflow-group>`;
	}

	_handleChange(e) {
		console.log('change!!! ' + JSON.stringify(e.detail))
	}

	_handleLoadMore() {
		console.log('load more!')
	}
}


customElements.define('d2l-filter-demo', FilterDemo);
