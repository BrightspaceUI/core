# @brightspace-ui/core

[![NPM version](https://img.shields.io/npm/v/@brightspace-ui/core.svg)](https://www.npmjs.org/package/@brightspace-ui/core)
[![NPM downloads](https://img.shields.io/npm/dt/@brightspace-ui/core.svg)](https://www.npmjs.com/package/@brightspace-ui/core)
[![Dependabot badge](https://flat.badgen.net/dependabot/BrightspaceUI/core?icon=dependabot)](https://app.dependabot.com/)
[![Build status](https://travis-ci.com/BrightspaceUI/core.svg?branch=master)](https://travis-ci.com/BrightspaceUI/core)

A collection of accessible, free, open-source web components and tools for building Brightspace applications.

## Installation

```shell
npm install @brightspace-ui/core
```

## README Index

* Components
  * [Alert](components/alert/): alert components for displaying important information
  * [Breadcrumbs](components/breadcrumbs/): component to help users understand where they are within an application
  * [Backdrop](components/backdrop/): component for displaying backdrop behind a target element
  * [Buttons](components/button/): normal, primary, icon and subtle buttons
  * [Calendar](components/calendar/): calendar component
  * [Card](components/card/): card components
  * [Colors](components/colors/): color palette
  * [Dialogs](components/dialog/): generic and confirmation dialogs
  * [Dropdowns](components/dropdown/): dropdown openers and content containers
  * [Expand Collapse](components/expand-collapse): component to create expandable and collapsible content
  * [Focus Trap](components/focus-trap/): generic container that traps focus
  * [Icons](components/icons/): iconography SVGs and web components
  * [Inputs](components/inputs/):
  	* [Checkbox](components/inputs/docs/input-checkbox.md): checkbox components and styles
	* [Date and time](components/inputs/docs/input-date-time.md): date and time picker components including ranges
	* [Radio](components/inputs/docs/input-radio.md): radio input styles
	* [Search](components/inputs/docs/input-search.md): search input component
	* [Select styles](components/inputs/docs/input-select-styles.md): select input styles
	* [Text](components/inputs/docs/input-text.md): text input component and styles
  * [Links](components/link/): link component and styles
  * [List](components/list/): list and list-item components
  * [Loading Spinner](components/loading-spinner/): loading-spinner components
  * [Menu](components/menu/): menu and menu item components
  * [Meter](components/meter/): linear, radial, circle meter web components
  * [More/less](components/more-less/): constrain long bits of content
  * [Off-screen](components/offscreen/): component and styles for positioning content off-screen
  * [Status Indicator](components/status-indicator/): status-indicator components
  * [Switch](components/switch/): switch component with on/off semantics
  * [Tabs](components/tabs/): tab and tab-panel components
  * [Tooltip](components/tooltip/): tooltip components
  * [Typography](components/typography/): typography styles and components
* Helpers
  * [Helpers](helpers/): helpers for composed DOM, unique ids, etc.
* Mixins
  * [ArrowKeysMixin](mixins/arrow-keys-mixin.md): manage focus with arrow keys
  * [AsyncContainerMixin](mixins/async-container/): manage collective async state
  * [LocalizeMixin](mixins/localize-mixin.md): localize text in your components
  * [ProviderMixin](mixins/provider-mixin.md): provide and consume data across elements in a DI-like fashion
  * [RtlMixin](mixins/rtl-mixin.md): enable components to define RTL styles
  * [VisibleOnAncestorMixin](mixins/visible-on-ancestor-mixin.md): display element on-hover of an ancestor
* Templates
  * [PrimarySecondaryTemplate](templates/primary-secondary): Two Panel (primary and secondary) page template with header and optional footer

## Developing

After cloning the repo, run `npm install` to install dependencies.

Run `npm run build` once, or any time icon or Sass files are changed.

### Running the demos

Start an [es-dev-server](https://open-wc.org/developing/es-dev-server.html) that hosts the demo pages:

```shell
npm start
```

### Linting

```shell
# eslint and lit-analyzer
npm run lint

# eslint only
npm run lint:eslint

# lit-analyzer only
npm run lint:lit
```

### Testing

```shell
# lint, unit test and visual-diff test
npm test

# unit tests
npm run test:headless

# debug or run a subset of local unit tests
# then navigate to `http://localhost:9876/debug.html`
npm run test:headless:watch
```

### Visual Diff Testing

This repo uses the [@brightspace-ui/visual-diff utility](https://github.com/BrightspaceUI/visual-diff/) to compare current snapshots against a set of golden snapshots stored in source control.

```shell
# run visual-diff tests
npm run test:diff

# subset of visual-diff tests:
npm run test:diff -- -g some-pattern

# update visual-diff goldens
npm run test:diff:golden
```

Golden snapshots in source control must be updated by Travis CI. To trigger an update, press the "Regenerate Goldens" button in the pull request `visual-difference` test run.

## Future Enhancements

Looking for a new component or an enhancement not listed here? Create a GitHub issue!

## Versioning, Releasing & Deploying

Releases use the [semantic-release](https://semantic-release.gitbook.io/) tooling and the [angular preset](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular) for commit message syntax. All version changes should obey [semantic versioning](https://semver.org/) rules.

Upon release, the version in `package.json` is updated, a tag and GitHub release is created and a new package will be deployed to NPM.

Commits prefixed with `feat` will trigger a minor release, while `fix` or `perf` will trigger a patch release. A commit containing `BREAKING CHANGE` will cause a major release to occur.

Other useful prefixes that will not trigger a release: `build`, `ci`, `docs`, `refactor`, `style` and `test`. More details in the [Angular Contribution Guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#type).

### Backporting Fixes to Previous Releases

If you need to backport a fix to an older release, [semantic-release](https://semantic-release.gitbook.io/) can handle this automatically for you. Create a branch named `A.B.x` based on the most recent tag of that release. So for example, if the release you want to patch is `1.59.4`, create a branch named `1.59.x` pointing at the `v1.59.4` tag:

```shell
git checkout -b 1.59.x v1.59.4
```

Then create a pull request into that branch with your fix, and merge as you normally would to create a release with a `fix: blah blah blah` commit message. Semantic-release will automatically tag and publish the release to NPM.

It's also possible to use this approach to add changes to old minor releases -- simply name the branch `A.x` instead.
