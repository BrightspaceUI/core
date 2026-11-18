import { html, LitElement } from 'lit';
import { tableStyles } from '../table-wrapper.js';

// Same table found in the d2l-page demo
export class TableNoScrollWidthDemo extends LitElement {
	static styles = tableStyles;
	render() {
		return html`
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
						<tr><th scope="row">Alice Johnson</th><td>92</td><td>88</td><td>95</td><td>91.7</td></tr>
						<tr><th scope="row">Bob Smith</th><td>85</td><td>79</td><td>82</td><td>82.0</td></tr>
						<tr><th scope="row">Carol Davis</th><td>78</td><td>91</td><td>87</td><td>85.3</td></tr>
						<tr><th scope="row">David Lee</th><td>95</td><td>93</td><td>90</td><td>92.7</td></tr>
						<tr><th scope="row">Emily Chen</th><td>88</td><td>84</td><td>91</td><td>87.7</td></tr>
					</tbody>
				</table>
			</d2l-table-wrapper>
		`;
	}
}

customElements.define('d2l-table-no-scroll-width-demo', TableNoScrollWidthDemo);
