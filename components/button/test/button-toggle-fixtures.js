import '../button-icon.js';
import '../button-subtle.js';
import '../button-toggle.js';
import { clickElem, html } from '@brightspace-ui/testing';

export async function clickActiveButton(elem) {
	return clickElem(getActiveButton(elem));
}

export function getActiveButton(elem) {
	return (elem.pressed) ? elem.querySelector('[slot="pressed"]') : elem.querySelector('[slot="not-pressed"]');
}

export const buttonToggleFixtures = {
	iconDisabled: html`
		<d2l-button-toggle>
			<d2l-button-icon slot="not-pressed" disabled icon="tier1:pin-hollow" text="Unpinned, click to pin."></d2l-button-icon>
			<d2l-button-icon slot="pressed" disabled icon="tier1:pin-filled" text="Pinned, click to unpin."></d2l-button-icon>
		</d2l-button-toggle>
	`,
	iconNotPressed: html`
		<d2l-button-toggle>
			<d2l-button-icon slot="not-pressed" icon="tier1:pin-hollow" text="Unpinned, click to pin."></d2l-button-icon>
			<d2l-button-icon slot="pressed" icon="tier1:pin-filled" text="Pinned, click to unpin."></d2l-button-icon>
		</d2l-button-toggle>
	`,
	iconPressed: html`
		<d2l-button-toggle pressed>
			<d2l-button-icon slot="not-pressed" icon="tier1:pin-hollow" text="Unpinned, click to pin."></d2l-button-icon>
			<d2l-button-icon slot="pressed" icon="tier1:pin-filled" text="Pinned, click to unpin."></d2l-button-icon>
		</d2l-button-toggle>
	`,
	subtleDisabled: html`
		<d2l-button-toggle>
			<d2l-button-subtle slot="not-pressed" disabled icon="tier1:lock-unlock" text="Unlocked" description="Click to lock."></d2l-button-subtle>
			<d2l-button-subtle slot="pressed" disabled icon="tier1:lock-locked" text="Locked" description="Click to unlock."></d2l-button-subtle>
		</d2l-button-toggle>
	`,
	subtleNotPressed: html`
		<d2l-button-toggle>
			<d2l-button-subtle slot="not-pressed" icon="tier1:lock-unlock" text="Unlocked" description="Click to lock."></d2l-button-subtle>
			<d2l-button-subtle slot="pressed" icon="tier1:lock-locked" text="Locked" description="Click to unlock."></d2l-button-subtle>
		</d2l-button-toggle>
	`,
	subtlePressed: html`
		<d2l-button-toggle pressed>
			<d2l-button-subtle slot="not-pressed" icon="tier1:lock-unlock" text="Unlocked" description="Click to lock."></d2l-button-subtle>
			<d2l-button-subtle slot="pressed" icon="tier1:lock-locked" text="Locked" description="Click to unlock."></d2l-button-subtle>
		</d2l-button-toggle>
	`
};
