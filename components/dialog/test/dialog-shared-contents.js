import '../../button/button.js';
import '../../dropdown/dropdown-button-subtle.js';
import '../../dropdown/dropdown-content.js';
import '../../filter/filter.js';
import '../../filter/filter-dimension-set.js';
import '../../filter/filter-dimension-set-value.js';
import '../../tabs/tab.js';
import '../../tabs/tab-panel.js';
import { getUseNewTabsStructureFlag } from '../../tabs/tabs.js';
import { html } from '@brightspace-ui/testing';

const base = html`
	<div id="top">Top</div>
	<div>Line 1</div>
	<div>Line 2</div>
	<div>Line 3</div>
	<div>Line 4</div>
`;

export const wrapping = html`
	<p>Deadlights jack lad schooner scallywag dance the hempen jig carouser broadside cable strike colors. Bring a spring upon her cable holystone blow the man down spanker</p>
`;

export const general = html`
	${base}
	<div id="bottom">Bottom</div>
`;

export const long = html`
	${base}
	<div>Line 5</div>
	<div>Line 6</div>
	<div>Line 7</div>
	<div>Line 8</div>
	<div>Line 9</div>
	<div>Line 10</div>
	<div>Line 11</div>
	<div>Line 12</div>
	<div>Line 13</div>
	<div id="bottom">Bottom</div>
`;

export const footer = html`
	<d2l-button slot="footer" primary>Primary</d2l-button>
	<d2l-button slot="footer" id="cancel">Cancel</d2l-button>
`;

export const dropdowns = html`
	<d2l-dropdown-button-subtle id="mobile-left" text="Left">
		<d2l-dropdown-content mobile-tray="left">
			<p>Deadlights jack lad schooner scallywag dance the hempen jig carouser broadside cable strike colors. Bring a spring upon her cable holystone blow the man down spanker</p>
			<p>Shiver me timbers to go on account lookout wherry doubloon chase. Belay yo-ho-ho keelhaul squiffy black spot yardarm spyglass sheet transom heave to.</p>
			<p>Trysail Sail ho Corsair red ensign hulk smartly boom jib rum gangway. Case shot Shiver me timbers gangplank crack Jennys tea cup ballast Blimey lee snow crow's nest rutters. Fluke jib scourge of the seven seas boatswain schooner gaff booty Jack Tar transom spirits.</p>
		</d2l-dropdown-content>
	</d2l-dropdown-button-subtle>
	<d2l-dropdown-button-subtle id="mobile-bottom" text="Bottom">
		<d2l-dropdown-content mobile-tray="bottom">
			<p>Deadlights jack lad schooner scallywag dance the hempen jig carouser broadside cable strike colors. Bring a spring upon her cable holystone blow the man down spanker</p>
			<p>Shiver me timbers to go on account lookout wherry doubloon chase. Belay yo-ho-ho keelhaul squiffy black spot yardarm spyglass sheet transom heave to.</p>
		</d2l-dropdown-content>
	</d2l-dropdown-button-subtle>
`;

export const filter = html`
	<d2l-filter>
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
	</d2l-filter>
`;

// Clean up when removing GAUD-8299-core-tabs-use-new-structure flag.
export const tabs = getUseNewTabsStructureFlag() ? html`
	<d2l-tabs>
		<d2l-tab id="s18" text="S18" slot="tabs"></d2l-tab>
		<d2l-tab id="w18" text="W18" slot="tabs"></d2l-tab>
		<d2l-tab id="f17" text="F17" slot="tabs"></d2l-tab>
		<d2l-tab id="s17" text="S17" slot="tabs"></d2l-tab>
		<d2l-tab id="w17" text="W17" slot="tabs"></d2l-tab>
		<d2l-tab id="f16" text="F16" slot="tabs"></d2l-tab>
		<d2l-tab id="s16" text="S16" slot="tabs"></d2l-tab>
		<d2l-tab id="w16" text="W16" slot="tabs"></d2l-tab>
		<d2l-tab id="f15" text="F15" slot="tabs"></d2l-tab>
		<d2l-tab id="s15" text="S15" slot="tabs"></d2l-tab>
		<d2l-tab id="w15" text="W15" slot="tabs"></d2l-tab>
		<d2l-tab id="f14" text="F14" slot="tabs"></d2l-tab>
		<d2l-tab id="s14" text="S14" slot="tabs"></d2l-tab>
		<d2l-tab id="w14" text="W14" slot="tabs"></d2l-tab>
		<d2l-tab id="f13" text="F13" slot="tabs"></d2l-tab>
		<d2l-tab id="s13" text="S13" slot="tabs"></d2l-tab>
		<d2l-tab id="w13" text="W13" slot="tabs"></d2l-tab>
		<d2l-tab id="f12" text="F12" slot="tabs"></d2l-tab>
		<d2l-tab id="s12" text="S12" slot="tabs"></d2l-tab>
		<d2l-tab id="w12" text="W12" slot="tabs"></d2l-tab>
		<d2l-tab id="f11" text="F11" slot="tabs"></d2l-tab>
		<d2l-tab id="s11" text="S11" slot="tabs"></d2l-tab>
		<d2l-tab-panel labelled-by="s18" slot="panels" id="s18-panel">Tab content for S18</d2l-tab-panel>
		<d2l-tab-panel labelled-by="w18" slot="panels" id="w18-panel">Tab content for W18</d2l-tab-panel>
		<d2l-tab-panel labelled-by="f17" slot="panels" id="f17-panel">Tab content for F17</d2l-tab-panel>
		<d2l-tab-panel labelled-by="s17" slot="panels" id="s17-panel">Tab content for S17</d2l-tab-panel>
		<d2l-tab-panel labelled-by="w17" slot="panels" id="w17-panel">Tab content for W17</d2l-tab-panel>
		<d2l-tab-panel labelled-by="f16" slot="panels" id="f16-panel">Tab content for F16</d2l-tab-panel>
		<d2l-tab-panel labelled-by="s16" slot="panels" id="s16-panel">Tab content for S16</d2l-tab-panel>
		<d2l-tab-panel labelled-by="w16" slot="panels" id="w16-panel">Tab content for W16</d2l-tab-panel>
		<d2l-tab-panel labelled-by="f15" slot="panels" id="f15-panel">Tab content for F15</d2l-tab-panel>
		<d2l-tab-panel labelled-by="s15" slot="panels" id="s15-panel">Tab content for S15</d2l-tab-panel>
		<d2l-tab-panel labelled-by="w15" slot="panels" id="w15-panel">Tab content for W15</d2l-tab-panel>
		<d2l-tab-panel labelled-by="f14" slot="panels" id="f14-panel">Tab content for F14</d2l-tab-panel>
		<d2l-tab-panel labelled-by="s14" slot="panels" id="s14-panel">Tab content for S14</d2l-tab-panel>
		<d2l-tab-panel labelled-by="w14" slot="panels" id="w14-panel">Tab content for W14</d2l-tab-panel>
		<d2l-tab-panel labelled-by="f13" slot="panels" id="f13-panel">Tab content for F13</d2l-tab-panel>
		<d2l-tab-panel labelled-by="s13" slot="panels" id="s13-panel">Tab content for S13</d2l-tab-panel>
		<d2l-tab-panel labelled-by="w13" slot="panels" id="w13-panel">Tab content for W13</d2l-tab-panel>
		<d2l-tab-panel labelled-by="f12" slot="panels" id="f12-panel">Tab content for F12</d2l-tab-panel>
		<d2l-tab-panel labelled-by="s12" slot="panels" id="s12-panel">Tab content for S12</d2l-tab-panel>
		<d2l-tab-panel labelled-by="w12" slot="panels" id="w12-panel">Tab content for W12</d2l-tab-panel>
		<d2l-tab-panel labelled-by="f11" slot="panels" id="f11-panel">Tab content for F11</d2l-tab-panel>
		<d2l-tab-panel labelled-by="s11" slot="panels" id="s11-panel">Tab content for S11</d2l-tab-panel>
	</d2l-tabs>` : html`
	<d2l-tabs>
		<d2l-tab-panel text="S18">Tab content for S18</d2l-tab-panel>
		<d2l-tab-panel text="W18">Tab content for W18</d2l-tab-panel>
		<d2l-tab-panel text="F17">Tab content for F17</d2l-tab-panel>
		<d2l-tab-panel text="S17">Tab content for S17</d2l-tab-panel>
		<d2l-tab-panel text="W17">Tab content for W17</d2l-tab-panel>
		<d2l-tab-panel text="F16">Tab content for F16</d2l-tab-panel>
		<d2l-tab-panel text="S16">Tab content for S16</d2l-tab-panel>
		<d2l-tab-panel text="W16">Tab content for W16</d2l-tab-panel>
		<d2l-tab-panel text="F15">Tab content for F15</d2l-tab-panel>
		<d2l-tab-panel text="S15">Tab content for S15</d2l-tab-panel>
		<d2l-tab-panel text="W15">Tab content for W15</d2l-tab-panel>
		<d2l-tab-panel text="F14">Tab content for F14</d2l-tab-panel>
		<d2l-tab-panel text="S14">Tab content for S14</d2l-tab-panel>
		<d2l-tab-panel text="W14">Tab content for W14</d2l-tab-panel>
		<d2l-tab-panel text="F13">Tab content for F13</d2l-tab-panel>
		<d2l-tab-panel text="S13">Tab content for S13</d2l-tab-panel>
		<d2l-tab-panel text="W13">Tab content for W13</d2l-tab-panel>
		<d2l-tab-panel text="F12">Tab content for F12</d2l-tab-panel>
		<d2l-tab-panel text="S12">Tab content for S12</d2l-tab-panel>
		<d2l-tab-panel text="W12">Tab content for W12</d2l-tab-panel>
		<d2l-tab-panel text="F11">Tab content for F11</d2l-tab-panel>
		<d2l-tab-panel text="S11">Tab content for S11</d2l-tab-panel>
	</d2l-tabs>
`;
