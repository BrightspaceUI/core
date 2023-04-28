import '../list-item-content.js';
import '../list-item.js';
import '../list.js';
import { css, html, LitElement, nothing } from 'lit';

const propertyNames = ['Selectable', 'Draggable', 'Expandable'];

const styles = css`
	:host {
		display: block;
		width: 700px;
	}
	d2l-list:not([slot="nested"]) {
		border: solid 1px black;
		margin: 1rem;
		padding: 1rem;
	}
	d2l-list:not([slot="nested"]) > d2l-list-item > d2l-list-item-content {
		color: blue;
	}
	d2l-list-item {
		box-shadow: -1px 0 0 0 red;
	}
`;

const getText = (propertyValues) => {
	const text = [];
	text.primaryText = propertyValues.reduce((fullText, propertyValue, index) => {
		if (!propertyValue) return fullText;
		return fullText ? `${fullText} and ${propertyNames[index]}` : propertyNames[index];
	}, '');
	if (!text.primaryText) text.primaryText = 'No Controls';

	text.secondaryText = propertyValues.reduce((fullText, propertyValue, index) => {
		if (propertyValue) return fullText;
		return fullText ? `${fullText}, Not ${propertyNames[index]}` : `Not ${propertyNames[index]}`;
	}, '');

	return text;
};

const getListItems = (type, skipExpandable, nestedItems) => {
	const listItems = [];
	const expandableLength = skipExpandable ? 1 : 2;
	const nested = nestedItems ? html`<d2l-list slot="nested">${nestedItems}</d2l-list>` : nothing;

	for (let selectable = 0; selectable < 2; selectable++) {
		for (let draggable = 0; draggable < 2; draggable++) {
			for (let expandable = 0; expandable < expandableLength; expandable++) {
				const text = getText([selectable, draggable, expandable]);
				const key = `${type}-${selectable}-${draggable}-${expandable}`;
				listItems.push(html`
					<d2l-list-item key="${key}" label="${text.primaryText}" ?selectable="${!!selectable}" ?draggable="${!!draggable}" ?expandable="${!!expandable}" ?expanded="${!!expandable && nestedItems}">
						<d2l-list-item-content>
							<div>${type} - ${text.primaryText}</div>
							<div slot="supporting-info">${text.secondaryText}</div>
						</d2l-list-item-content>
						${nested}
					</d2l-list-item>
				`);
			}
		}
	}

	return listItems;
};

class NestedListIterationsSeparate extends LitElement {
	static get styles() {
		return styles;
	}

	render() {
		const childListItems = getListItems('Child', false);
		const childListItemsWithoutExpandable = getListItems('Child', true);
		const parentListItems = getListItems('Parent', false, childListItems);
		const parentListItemsWithoutExpandableChildren = getListItems('Parent', false, childListItemsWithoutExpandable);

		return html`
			<h2>No Expanding Children</h2>
			${parentListItemsWithoutExpandableChildren.map(listItem => html`
				<d2l-list>${listItem}</d2l-list>
			`)}
			<h2>With Expanding Children</h2>
			${parentListItems.map(listItem => html`
				<d2l-list>${listItem}</d2l-list>
			`)}
		`;
	}
}

class NestedListIterationsCombined extends LitElement {
	static get styles() {
		return styles;
	}

	render() {
		const childListItems = getListItems('Child', false);
		const childListItemsWithoutExpandable = getListItems('Child', true);
		const parentListItems = getListItems('Parent', false, childListItems);
		const parentListItemsWithoutExpandableChildren = getListItems('Parent (No Expanding Children)', false, childListItemsWithoutExpandable);

		return html`
			<h2>All In One List</h2>
			<d2l-list>
				${parentListItemsWithoutExpandableChildren}
				${parentListItems}
			</d2l-list>	
		`;
	}
}

customElements.define('d2l-nested-list-iterations-separate', NestedListIterationsSeparate);
customElements.define('d2l-nested-list-iterations-combined', NestedListIterationsCombined);
