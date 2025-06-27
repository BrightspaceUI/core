import '../sort.js';
import '../sort-item.js';
import { html } from 'lit';

export const sortFixtures = {
	closed: html`
		<d2l-sort>
			<d2l-sort-item text="Most Relevant" value="relevant" selected></d2l-sort-item>
			<d2l-sort-item text="Recently Updated" value="updated"></d2l-sort-item>
			<d2l-sort-item text="Highest Rated" value="rating"></d2l-sort-item>
		</d2l-sort>
	`,
	disabled: html`
		<d2l-sort disabled>
			<d2l-sort-item text="Most Relevant" value="relevant" selected></d2l-sort-item>
			<d2l-sort-item text="Recently Updated" value="updated"></d2l-sort-item>
			<d2l-sort-item text="Highest Rated" value="rating"></d2l-sort-item>
		</d2l-sort>
	`,
	opened: html`
		<d2l-sort opened>
			<d2l-sort-item text="Most Relevant" value="relevant" selected></d2l-sort-item>
			<d2l-sort-item text="Recently Updated" value="updated"></d2l-sort-item>
			<d2l-sort-item text="Highest Rated" value="rating"></d2l-sort-item>
		</d2l-sort>
	`
};
