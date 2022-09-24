import '../colors/colors.js';
import '../icons/icon.js';
import '../scroll-wrapper/scroll-wrapper.js';
import { css, html, LitElement } from 'lit';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

const RTL_MULTIPLIER = navigator.userAgent.indexOf('Edge/') > 0 ? 1 : -1; /* legacy-Edge doesn't reverse scrolling in RTL */
const SCROLL_AMOUNT = 0.8;

export const tableStyles = css`
	.d2l-table {
		border-collapse: separate; /* needed to override reset stylesheets */
		border-spacing: 0;
		font-size: 0.8rem;
		font-weight: 400;
		width: 100%;
	}

	.d2l-table > tbody,
	.d2l-table > tfoot {
		background-color: #ffffff;
	}

	/* all cells */
	.d2l-table > * > tr > * {
		border-bottom: var(--d2l-table-border);
		font-weight: inherit;
		height: var(--d2l-table-cell-height);
		padding: var(--d2l-table-cell-padding);
		text-align: left;
		vertical-align: middle;
	}
	d2l-table-wrapper[dir="rtl"] .d2l-table > * > tr > * {
		text-align: right;
	}

	/* default cells */
	d2l-table-wrapper[type="default"]:not([dir="rtl"]) .d2l-table > * > tr > *,
	d2l-table-wrapper[type="default"][dir="rtl"] .d2l-table > * > tr > .d2l-table-cell-first {
		border-right: var(--d2l-table-border);
	}
	d2l-table-wrapper[type="default"][dir="rtl"] .d2l-table > * > tr > *,
	d2l-table-wrapper[type="default"]:not([dir="rtl"]) .d2l-table > * > tr > .d2l-table-cell-first {
		border-left: var(--d2l-table-border);
	}
	d2l-table-wrapper[type="default"] .d2l-table-row-first > * {
		border-top: var(--d2l-table-border); /* add top border to default first row */
	}

	/* header cells */
	.d2l-table > thead > tr > th,
	.d2l-table > * > tr.d2l-table-header > th,
	.d2l-table > * > tr[header] > th {
		background-color: var(--d2l-table-header-background-color);
		font-size: 0.7rem;
		line-height: 0.9rem;
	}
	d2l-table-wrapper[type="default"] .d2l-table > thead > tr > th,
	d2l-table-wrapper[type="default"] .d2l-table > * > tr.d2l-table-header > th,
	d2l-table-wrapper[type="default"] .d2l-table > * > tr[header] > th {
		height: 27px; /* min-height to be 48px including border */
	}

	/* border radiuses */
	d2l-table-wrapper[type="default"]:not([dir="rtl"]) .d2l-table-row-first > .d2l-table-cell-first,
	d2l-table-wrapper[type="default"][dir="rtl"] .d2l-table-row-first > .d2l-table-cell-last {
		border-top-left-radius: var(--d2l-table-border-radius);
	}
	d2l-table-wrapper[type="default"]:not([dir="rtl"]) .d2l-table-row-first > .d2l-table-cell-last,
	d2l-table-wrapper[type="default"][dir="rtl"] .d2l-table-row-first > .d2l-table-cell-first {
		border-top-right-radius: var(--d2l-table-border-radius);
	}
	d2l-table-wrapper[type="default"]:not([dir="rtl"]) .d2l-table-row-last > .d2l-table-cell-first,
	d2l-table-wrapper[type="default"][dir="rtl"] .d2l-table-row-last > .d2l-table-cell-last {
		border-bottom-left-radius: var(--d2l-table-border-radius);
	}
	d2l-table-wrapper[type="default"]:not([dir="rtl"]) .d2l-table-row-last > .d2l-table-cell-last,
	d2l-table-wrapper[type="default"][dir="rtl"] .d2l-table-row-last > .d2l-table-cell-first {
		border-bottom-right-radius: var(--d2l-table-border-radius);
	}

	/* selected rows */
	.d2l-table > tbody > tr[selected] {
		background-color: var(--d2l-table-row-background-color-selected);
	}
	d2l-table-wrapper[type="default"]:not([dir="rtl"]) .d2l-table > tbody > tr[selected] > .d2l-table-cell-last,
	d2l-table-wrapper[type="default"][dir="rtl"] .d2l-table > tbody > tr[selected] > .d2l-table-cell-first {
		border-right-color: var(--d2l-table-row-border-color-selected);
	}
	d2l-table-wrapper[type="default"]:not([dir="rtl"]) .d2l-table > tbody > tr[selected] > .d2l-table-cell-first,
	d2l-table-wrapper[type="default"][dir="rtl"] .d2l-table > tbody > tr[selected] > .d2l-table-cell-last {
		border-left-color: var(--d2l-table-row-border-color-selected);
	}
	.d2l-table > tbody > tr[selected] > *,
	.d2l-table > * > tr.d2l-table-selected-previous > * {
		border-bottom-color: var(--d2l-table-row-border-color-selected);
	}
	.d2l-table > * > tr.d2l-table-selected-first > * {
		border-top: 1px solid var(--d2l-table-row-border-color-selected);
		padding: var(--d2l-table-cell-padding-alt);
	}

	/* no-column-border */
	d2l-table-wrapper[type="default"][no-column-border]:not([dir="rtl"]) .d2l-table > tbody > tr > *:not(.d2l-table-cell-last),
	d2l-table-wrapper[type="default"]:not([dir="rtl"]) .d2l-table[no-column-border] > tbody > tr > *:not(.d2l-table-cell-last) {
		border-right: none;
	}
	d2l-table-wrapper[type="default"][no-column-border][dir="rtl"] .d2l-table > tbody > tr > *:not(.d2l-table-cell-last),
	d2l-table-wrapper[type="default"][dir="rtl"] .d2l-table[no-column-border] > tbody > tr > *:not(.d2l-table-cell-last) {
		border-left: none;
	}

	/* sticky-headers */

	/* all header cells */
	d2l-table-wrapper[sticky-headers] .d2l-table > thead > tr > th,
	d2l-table-wrapper[sticky-headers] .d2l-table > * > tr.d2l-table-header > *,
	d2l-table-wrapper[sticky-headers] .d2l-table > * > tr[header] > * {
		position: -webkit-sticky;
		position: sticky;
		top: 0;
	}

	/* header cells that are also sticky */
	d2l-table-wrapper[sticky-headers] .d2l-table > thead > tr > th.d2l-table-sticky-cell,
	d2l-table-wrapper[sticky-headers] .d2l-table > thead > tr > th[sticky],
	d2l-table-wrapper[sticky-headers] .d2l-table > * > tr.d2l-table-header > .d2l-table-sticky-cell,
	d2l-table-wrapper[sticky-headers] .d2l-table > * > tr.d2l-table-header > [sticky],
	d2l-table-wrapper[sticky-headers] .d2l-table > * > tr[header] > .d2l-table-sticky-cell,
	d2l-table-wrapper[sticky-headers] .d2l-table > * > tr[header] > [sticky] {
		left: 0;
		z-index: 3;
	}
	d2l-table-wrapper[dir="rtl"][sticky-headers] .d2l-table > * > tr > .d2l-table-sticky-cell,
	d2l-table-wrapper[dir="rtl"][sticky-headers] .d2l-table > * > tr > [sticky] {
		right: 0;
	}

	/* first row: offset by size of border-radius so left/right border doesn't show through (default style only) */
	d2l-table-wrapper[sticky-headers][type="default"] .d2l-table > thead > tr > th,
	d2l-table-wrapper[sticky-headers][type="default"] .d2l-table > * > tr.d2l-table-header > *,
	d2l-table-wrapper[sticky-headers][type="default"] .d2l-table > * > tr[header] > * {
		top: -5px;
	}

	/* first column that's sticky: offset by size of border-radius so top/bottom border doesn't show through (default style only) */
	d2l-table-wrapper[sticky-headers][type="default"]:not([dir="rtl"]) .d2l-table > * > tr > .d2l-table-sticky-cell.d2l-table-cell-first,
	d2l-table-wrapper[sticky-headers][type="default"]:not([dir="rtl"]) .d2l-table > * > tr > [sticky].d2l-table-cell-first {
		left: -5px;
	}
	d2l-table-wrapper[sticky-headers][type="default"][dir="rtl"] .d2l-table > * > tr > .d2l-table-sticky-cell.d2l-table-cell-first,
	d2l-table-wrapper[sticky-headers][type="default"][dir="rtl"] .d2l-table > * > tr > [sticky].d2l-table-cell-first {
		right: -5px;
	}

	/* non-header sticky cells */
	d2l-table-wrapper[sticky-headers] .d2l-table > * > tr:not([selected]) {
		background-color: inherit; /* white background so sticky cells layer on top of non-sticky cells */
	}
	d2l-table-wrapper[sticky-headers] .d2l-table > tbody > tr:not([header]):not(.d2l-table-header) > .d2l-table-sticky-cell,
	d2l-table-wrapper[sticky-headers] .d2l-table > tbody > tr:not([header]):not(.d2l-table-header) > [sticky] {
		background-color: inherit;
		left: 0;
		position: -webkit-sticky;
		position: sticky;
		z-index: 1;
	}


	/*sticky-headers-horizontal-scroll*/
	d2l-table-wrapper[sticky-headers-horizontal-scroll] .d2l-table {
		table-layout: fixed;
	}

	d2l-table-wrapper[sticky-headers-horizontal-scroll] .d2l-table > thead {
		display: block;
		overflow-x: hidden;
	}

	d2l-table-wrapper[sticky-headers-horizontal-scroll] .d2l-table > tbody {
		display: block;
		overflow-x: auto;
	}

	d2l-table-wrapper[sticky-headers-horizontal-scroll] .d2l-table > thead > tr,
	d2l-table-wrapper[sticky-headers-horizontal-scroll] .d2l-table > tbody > tr {
		width: inherit;
	}

	d2l-table-wrapper[sticky-headers-horizontal-scroll] .d2l-table > tbody,
	d2l-table-wrapper[sticky-headers-horizontal-scroll] .d2l-table > tfoot {
		background-color: inherit;
	}

	d2l-table-wrapper[sticky-headers-horizontal-scroll] .d2l-table > * > tr:not([selected]) {
		background-color: #ffffff; /* white background so sticky cells layer on top of non-sticky cells */
	}

	d2l-table-wrapper[sticky-headers-horizontal-scroll] .d2l-table > thead {
		position: -webkit-sticky;
		position: sticky;
		top: 0;
		z-index: 2;
	}

	d2l-table-wrapper[sticky-headers-horizontal-scroll] .d2l-table > thead > tr > th[sticky]  {
		position: -webkit-sticky;
		position: sticky;
		left: 0;
		z-index: 3;
	}

	d2l-table-wrapper[sticky-headers-horizontal-scroll] .d2l-table > tbody > tr > th[sticky]  {
		position: -webkit-sticky;
		position: sticky;
		left: 0;
		z-index: 1;
		background-color:inherit;
	}

	/* first row: offset by size of border-radius so left/right border doesn't show through (default style only) */
	d2l-table-wrapper[sticky-headers-horizontal-scroll][type="default"] .d2l-table > thead{
		top: -5px;
	}

	/* hide wrapper visuals from print view */
	@media print {
		d2l-table-wrapper[sticky-headers-horizontal-scroll] .d2l-table > tbody {
			overflow-x: hidden;
		}

		d2l-table-wrapper[sticky-headers-horizontal-scroll] .d2l-table > thead,
		d2l-table-wrapper[sticky-headers-horizontal-scroll] .d2l-table > tbody > tr > th[sticky]  {
			position: static;
		}
	}
`;

/**
 * Wraps a native <table> element, providing styling and scroll buttons for overflow.
 * @slot - Content to wrap
 */
export class TableWrapper extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Hides the column borders on "default" table type
			 * @type {boolean}
			 */
			noColumnBorder: {
				attribute: 'no-column-border',
				reflect: true,
				type: Boolean
			},
			/**
			 * Whether the header row is sticky. Useful for long tables to "stick" the header row in place as the user scrolls.
			 * @type {boolean}
			 */
			stickyHeaders: {
				attribute: 'sticky-headers',
				reflect: true,
				type: Boolean
			},
			/**
			 * Type of table style to apply. The "light" style has fewer borders and tighter padding.
			 * @type {'default'|'light'}
			 */
			type: {
				reflect: true,
				type: String
			},
			stickyHeadersHorizontalScroll: {
				attribute: 'sticky-headers-horizontal-scroll',
				reflect: true,
				type: Boolean
			},
			_hScrollbar: {
				attribute: 'h-scrollbar',
				reflect: true,
				type: Boolean
			},
			_scrollbarLeft: {
				attribute: 'scrollbar-left',
				reflect: true,
				type: Boolean
			},
			_scrollbarRight: {
				attribute: 'scrollbar-right',
				reflect: true,
				type: Boolean
			}
		};
	}

	static get styles() {
		return css`
			:host {
				--d2l-table-border: 1px solid var(--d2l-table-border-color);
				--d2l-table-border-color: var(--d2l-color-mica);
				--d2l-table-border-radius: 0.3rem;
				--d2l-table-cell-height: 41px; /* min-height to be 62px including border */
				--d2l-table-cell-padding: 0.5rem 1rem;
				--d2l-table-cell-padding-alt: calc(0.5rem - 1px) 1rem 0.5rem 1rem;
				--d2l-table-header-background-color: var(--d2l-color-regolith);
				--d2l-table-row-border-color-selected: var(--d2l-color-celestine);
				--d2l-table-row-background-color-selected: var(--d2l-color-celestine-plus-2);
				display: block;
				width: 100%;
			}
			:host([hidden]) {
				display: none;
			}
			:host([type="light"]) {
				--d2l-table-cell-height: 1.15rem; /* min-height to be 48px including border */
				--d2l-table-cell-padding: 0.6rem;
				--d2l-table-cell-padding-alt: calc(0.6rem - 1px) 0.6rem 0.6rem 0.6rem;
				--d2l-table-border-color: var(--d2l-color-gypsum);
				--d2l-table-header-background-color: #ffffff;
			}

			/*scroll-wrapper*/

			.d2l-scroll-wrapper-actions {
				position: -webkit-sticky;
				position: sticky;
				top: 0;
				bottom: 100px;
				z-index: 4;
			}

			:host([dir="rtl"]) .d2l-scroll-wrapper-button-left,
			.d2l-scroll-wrapper-button-right {
				left: auto;
				right: -10px;
			}

			:host([dir="rtl"]) .d2l-scroll-wrapper-button-right,
			.d2l-scroll-wrapper-button-left {
				left: -10px;
				right: auto;
			}

			.d2l-scroll-wrapper-button {
				background-color: var(--d2l-color-regolith);
				border: 1px solid var(--d2l-color-mica);
				border-radius: 50%;
				box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
				cursor: pointer;
				display: inline-block;
				height: 18px;
				line-height: 0;
				padding: 10px;
				position: absolute;
				top:4px;
				width: 18px;
			}

			.d2l-scroll-wrapper-button:hover {
				background-color: var(--d2l-color-sylvite);
			}

			:host([scrollbar-right]) .d2l-scroll-wrapper-button-right {
				display: none;
			}

			:host([scrollbar-left]) .d2l-scroll-wrapper-button-left {
				display: none;
			}

			:host([h-scrollbar][sticky-headers-horizontal-scroll]) {
				border-left: 1px dashed var(--d2l-color-mica);
				border-right: 1px dashed var(--d2l-color-mica);
			}

			:host(:not([dir="rtl"])[scrollbar-left]) {
				border-left: none;
			}

			:host(:not([dir="rtl"])[scrollbar-right]) {
				border-right: none;
			}

			/* hide wrapper visuals from print view */
			@media print {
				.d2l-scroll-wrapper-actions {
					display: none;
				}

				:host([h-scrollbar][sticky-headers-horizontal-scroll]) {
					border-left: none;
					border-right: none;
				}
			}
		`;
	}

	constructor() {
		super();
		this.noColumnBorder = false;
		this.stickyHeaders = false;
		this.stickyHeadersHorizontalScroll = false;
		this.type = 'default';
		this._tableIntersectionObserver = null;
		this._tableMutationObserver = null;
		this._container = null;
		this._hScrollbar = false;
		this._resizeObserver = null;
		this._scrollbarLeft = false;
		this._scrollbarRight = false;
		this._scrollActionsIntersectionObserver = null;
	}

	disconnectedCallback() {
		super.disconnectedCallback();

		if (this._tableMutationObserver) this._tableMutationObserver.disconnect();
		if (this._tableIntersectionObserver) this._tableIntersectionObserver.disconnect();
		if (this._resizeObserver) this._resizeObserver.disconnect();
		if (this._scrollActionsIntersectionObserver) this._scrollActionsIntersectionObserver.disconnect();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (this.stickyHeadersHorizontalScroll) {
			const head =  this.querySelector('thead');
			const body = this.querySelector('tbody');
			this._container = head ?? body;
			this._hScrollbar = true;

			if (head && body) {
				this._syncHorisontalScrollers(head, body);
			}

			if (this._container) {
				this._container.addEventListener('scroll', () => this._checkScrollThresholds());
				this._resizeObserver = new ResizeObserver(() => requestAnimationFrame(() => this.checkScrollbar()));
				this._resizeObserver.observe(this._container);

				const options = {
					root: this,
					rootMargin: '0px 0px -40px 0px',
					threshold: 0.5
				};
				this._scrollActionsIntersectionObserver = new IntersectionObserver(this._handleIntersectActions, options);
				this._scrollActionsIntersectionObserver.observe(this.shadowRoot.querySelector('.d2l-scroll-wrapper-actions'));
			}
		}
	}

	render() {
		const slot = html`<slot @slotchange="${this._handleSlotChange}"></slot>`;
		if (this.stickyHeaders) {
			return slot;
		} else if (this.stickyHeadersHorizontalScroll) {
			const actions = html`
				<div class="d2l-scroll-wrapper-actions">
					<div class="d2l-scroll-wrapper-button d2l-scroll-wrapper-button-left" @click="${this._scrollLeft}">
						<d2l-icon icon="tier1:chevron-left"></d2l-icon>
					</div>
					<div class="d2l-scroll-wrapper-button d2l-scroll-wrapper-button-right" @click="${this._scrollRight}">
						<d2l-icon icon="tier1:chevron-right"></d2l-icon>
					</div>
				</div>`;
			return html`
				${actions}
				${slot}`;
		}
		else {
			return html`<d2l-scroll-wrapper>${slot}</d2l-scroll-wrapper>`;
		}
	}

	updated(changedProperties) {
		// hack: grades/groups/outcomes in the LE use this CSS class on the
		// body to apply special CSS to the page when tables are sticky
		// Ideally they should be adding this class to the body.
		if (changedProperties.has('stickyHeaders')) {
			if (this.stickyHeaders) {
				document.body.classList.add('d2l-table-sticky-headers');
			}
		}
	}

	checkScrollbar() {
		if (!this._container) return;
		this._hScrollbar = this._container.offsetWidth !== this._container.scrollWidth;
		this._checkScrollThresholds();
	}

	scrollDistance(distance, smooth) {
		if (!this._container) return;
		if (this.dir === 'rtl') distance = distance * RTL_MULTIPLIER;
		if (this._container.scrollBy) {
			this._container.scrollBy({ left: distance, behavior: smooth ? 'smooth' : 'auto' });
		} else {
			// legacy-Edge doesn't support scrollBy
			this._container.scrollLeft = distance;
		}
	}

	async _applyClassNames(table) {

		// wait until start of next frame to read
		await new Promise(resolve => {
			requestAnimationFrame(resolve);
		});

		// offsetParent causes reflow/paint so do them all at once
		const rows = Array.from(table.rows);
		let firstRow = null;
		let lastRow = null;
		rows.forEach((r) => {
			if (r.offsetParent === null) return;
			firstRow = firstRow || r;
			lastRow = r;
		});

		const topHeader = table.querySelector('tr.d2l-table-header:first-child th:not([rowspan]), tr[header]:first-child th:not([rowspan]), thead tr:first-child th:not([rowspan])');
		const topHeaderHeight = topHeader ? topHeader.clientHeight : -1;

		let prevRow = null;
		let skipFirst = 0;
		rows.forEach((r) => {

			const isHeader = r.parentNode.tagName === 'THEAD' || r.classList.contains('d2l-table-header') || r.hasAttribute('header');
			const isSelected = r.hasAttribute('selected');

			let firstNonHeaderRow = !isHeader;
			if (prevRow) {
				const isPrevRowHeader = prevRow.parentNode.tagName === 'THEAD' || prevRow.hasAttribute('header');
				firstNonHeaderRow = firstNonHeaderRow && isPrevRowHeader;
				prevRow.classList.toggle('d2l-table-selected-previous', isSelected && !isPrevRowHeader);
			}

			r.classList.toggle('d2l-table-row-first', r === firstRow);
			r.classList.toggle('d2l-table-row-last', r === lastRow);
			r.classList.toggle('d2l-table-selected-first', firstNonHeaderRow && isSelected);

			Array.from(r.cells).forEach((c, index) => {
				c.classList.toggle('d2l-table-cell-first', index === 0 && skipFirst === 0);
				if (index === 0 && skipFirst === 0 && c.hasAttribute('rowspan')) {
					skipFirst = parseInt(c.getAttribute('rowspan'));
				}
				c.classList.toggle('d2l-table-cell-last', index === r.cells.length - 1);
			});

			prevRow = r;
			skipFirst = Math.max(0, --skipFirst);

		});

		if ((this.stickyHeaders || this.stickyHeadersHorizontalScroll) && topHeaderHeight > -1) {
			const offset = this.type === 'default' ? -3 : 1; // default: -5px top + 2px border, light: 0 top + 1px border
			const ths = Array.from(table.querySelectorAll('tr.d2l-table-header:not(:first-child) th, tr[header]:not(:first-child) th, thead tr:not(:first-child) th'));
			ths.forEach((th) => {
				th.style.top = `${topHeaderHeight + offset}px`;
			});
		}

		if (this.stickyHeadersHorizontalScroll) {
			const head =  table.querySelector('thead');
			const body = table.querySelector('tbody');

			if (head && body) {
				this._syncColumnWidths(head, body);
			}
		}
	}

	_checkScrollThresholds() {
		if (!this._container) return;

		const lowerScrollValue = this._container.scrollWidth - this._container.offsetWidth - Math.abs(this._container.scrollLeft);
		this._scrollbarLeft = (this._container.scrollLeft === 0);
		this._scrollbarRight = (lowerScrollValue < 1);

	}

	_handleIntersectActions(entries) {
		entries.forEach((entry) => {

			for (let i = 0; i < entry.target.children.length; i++) {
				entry.target.children[i].style.display = entry.isIntersecting ? '' : 'none';
			}
		});
	}

	_handleSlotChange(e) {

		const table = e.target.assignedNodes({ flatten: true }).find(
			node => (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'TABLE' && node.classList.contains('d2l-table'))
		);
		if (!table) return;

		// observes mutations to <table>'s direct children and also
		// its subtree (rows or cells added/removed to any descendant)
		if (this._tableMutationObserver === null) {
			this._tableMutationObserver = new MutationObserver(() => this._applyClassNames(table, 0));
		} else {
			this._tableMutationObserver.disconnect();
		}
		this._tableMutationObserver.observe(table, {
			attributes: true, /* required for legacy-Edge, otherwise attributeFilter throws a syntax error */
			attributeFilter: ['selected'],
			childList: true,
			subtree: true
		});

		// observes when visibility of <table> changes to catch cases
		// where table is initially hidden (which would cause first/last
		// row classes to be unset) but then becomes shown
		if (typeof(IntersectionObserver) === 'function') {
			if (this._tableIntersectionObserver === null) {
				this._tableIntersectionObserver = new IntersectionObserver((entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							this._applyClassNames(table);
						}
					});
				});
			} else {
				this._tableIntersectionObserver.disconnect();
			}
			this._tableIntersectionObserver.observe(table);
		}

		this._applyClassNames(table);

	}

	_scrollLeft() {
		if (!this._container) return;
		const scrollDistance = this._container.clientWidth * SCROLL_AMOUNT * -1;
		this.scrollDistance(scrollDistance, true);
	}

	_scrollRight() {
		if (!this._container) return;
		const scrollDistance = this._container.clientWidth * SCROLL_AMOUNT;
		this.scrollDistance(scrollDistance, true);
	}

	_syncColumnWidths(head, body) {

		const firstRowHead = head.rows.length > 0 ? head.rows[0] : undefined;
		const firstRowBody = body.rows.length > 0 ? body.rows[0] : undefined;

		if (!firstRowHead
			|| !firstRowBody
			|| firstRowHead.cells.length !== firstRowBody.cells.length) {
			return;
		}

		const setWidth = function(cell1, cell2) {
			const elementStyles = getComputedStyle(cell1);
			cell2.style.minWidth = elementStyles.width;
		};

		for (let i = 0; i < firstRowHead.cells.length; i++) {
			const headCell = firstRowHead.cells[i];
			const bodyCell = firstRowBody.cells[i];

			if (headCell.clientWidth > bodyCell.clientWidth) {
				setWidth(headCell, bodyCell);
			} else if (headCell.clientWidth < bodyCell.clientWidth) {
				setWidth(bodyCell, headCell);
			}
		}
	}

	_syncHorisontalScrollers(scroller1, scroller2) {

		let isSyncingScroll1 = false;
		let isSyncingScroll2 = false;

		scroller1.addEventListener('scroll', (event) => {

			if (!isSyncingScroll1) {
				isSyncingScroll2 = true;
				scroller2.scrollLeft = event.target.scrollLeft;
			}
			isSyncingScroll1 = false;
		});

		scroller2.addEventListener('scroll', (event) => {

			if (!isSyncingScroll2) {
				isSyncingScroll1 = true;
				scroller1.scrollLeft = event.target.scrollLeft;
			}
			isSyncingScroll2 = false;
		});
	}
}

customElements.define('d2l-table-wrapper', TableWrapper);
