// Modeled on: https://floating-ui.com/docs/tutorial

import {
	arrow,
	autoUpdate,
	computePosition,
	flip,
	hide,
	offset,
	shift,
} from 'https://cdn.jsdelivr.net/npm/@floating-ui/dom@1.0.3/+esm';

export function initFloatingUI(button, tooltip, arrowElement, options) {
	if (options?.strategy === 'fixed') tooltip.style.position = 'fixed';

	function update() {
		computePosition(button, tooltip, {
			placement: 'bottom',
			middleware: [
				offset(6),
				flip(),
				shift({ padding: 5 }),
				arrow({ element: arrowElement }),
				hide(),
			],
			...options,
		}).then(({ x, y, placement, middlewareData }) => {
			const { referenceHidden } = middlewareData.hide;
			Object.assign(tooltip.style, {
				left: `${x}px`,
				top: `${y}px`,
				visibility: referenceHidden ? 'hidden' : 'visible',
			});

			const { x: arrowX, y: arrowY } = middlewareData.arrow;

			const staticSide = {
				top: 'bottom',
				right: 'left',
				bottom: 'top',
				left: 'right',
			}[placement.split('-')[0]];

			Object.assign(arrowElement.style, {
				left: arrowX != null ? `${arrowX}px` : '',
				top: arrowY != null ? `${arrowY}px` : '',
				right: '',
				bottom: '',
				[staticSide]: '-4px',
			});
		});
	}

	function showTooltip() {
		tooltip.style.display = 'block';
		update();
	}

	function hideTooltip() {
		tooltip.style.display = '';
	}

	let cleanup;
	function toggle() {
		const isDisplayed = tooltip.style.display === 'block';
		tooltip.style.display = isDisplayed ? '' : 'block';

		if (isDisplayed) return cleanup();
		cleanup = autoUpdate(button, tooltip, update);
	}

	const activateOnHover = false;
	if (activateOnHover) {
		[
			['mouseenter', showTooltip],
			['mouseleave', hideTooltip],
			['focus', showTooltip],
			['blur', hideTooltip],
		].forEach(([event, listener]) => {
			button.addEventListener(event, listener);
		});
	} else {
		button.addEventListener('click', toggle);
	}
}
