# @brightspace-ui/core

[![NPM version](https://img.shields.io/npm/v/@brightspace-ui/core.svg)](https://www.npmjs.org/package/@brightspace-ui/core)
[![NPM downloads](https://img.shields.io/npm/dt/@brightspace-ui/core.svg)](https://www.npmjs.com/package/@brightspace-ui/core)

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
  * [Filter](components/filter/): single or multi-dimensional filter component
  * [Focus Trap](components/focus-trap/): generic container that traps focus
  * [Forms](components/form/): aggregate data for submission and validation
  * [Hierarchical View](components/hierarchical-view/): nested container component that shows the active container
  * [HTML Block](components/html-block/): component for rendering user-authored HTML
  * [Icons](components/icons/): iconography SVGs and web components
  * [Inputs](components/inputs/):
    * [Checkbox](components/inputs/docs/input-checkbox.md): checkbox components and styles
    * [Date and time](components/inputs/docs/input-date-time.md): date and time picker components including ranges
    * [Number](components/inputs/docs/input-numeric.md): numeric input components
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
  * [Selection](components/selection/): components for selection and bulk actions
  * [Scroll Wrapper](components/scroll-wrapper/): arrows to scroll content horizontally
  * [Skeleton](components/skeleton/): apply low-fidelity skeletons to your application as it loads
  * [Status Indicator](components/status-indicator/): status-indicator components
  * [Switch](components/switch/): switch component with on/off semantics
  * [Table](components/table/): table styles, column sorting and overflow handling
  * [Tabs](components/tabs/): tab and tab-panel components
  * [Tooltip](components/tooltip/): tooltip components
  * [Typography](components/typography/): typography styles and components
  * [Validation](components/validation/): plugin custom validation logic to native and custom form elements
* Directives
  * [Animate](directives/animate/): animate showing, hiding and removal of elements
* Helpers
  * [Helpers](helpers/): helpers for composed DOM, unique ids, etc.
* Mixins
  * [ArrowKeysMixin](mixins/arrow-keys-mixin.md): manage focus with arrow keys
  * [AsyncContainerMixin](mixins/async-container/): manage collective async state
  * [FocusVisiblePolyfillMixin](mixins/focus-visible-polyfill-mixin.md): components can use the `:focus-visible` pseudo-class polyfill
  * [FormElementMixin](components/form/docs/form-element-mixin.md): allow components to participate in forms and validation
  * [LabelledMixin](mixins/labelled-mixin.md): label custom elements by referencing elements across DOM scopes
  * [LocalizeMixin](mixins/localize-mixin.md): localize text in your components
  * [ProviderMixin](mixins/provider-mixin.md): provide and consume data across elements in a DI-like fashion
  * [RtlMixin](mixins/rtl-mixin.md): enable components to define RTL styles
  * [SkeletonMixin](components/skeleton/): make components skeleton-aware
  * [VisibleOnAncestorMixin](mixins/visible-on-ancestor-mixin.md): display element on-hover of an ancestor
* Templates
  * [PrimarySecondaryTemplate](templates/primary-secondary): Two Panel (primary and secondary) page template with header and optional footer

## Developing

After cloning the repo, run `npm install` to install dependencies.

Run `npm run build` once, or any time icon or Sass files are changed.

### Running the demos

Start a [@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) that hosts the demo pages:

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
# lint, unit tests and axe tests
npm test

# unit tests
npm run test:headless

# debug or run a subset of local unit tests
npm run test:headless:watch
```

### Visual Diff Testing

This repo uses the [@brightspace-ui/visual-diff utility](https://github.com/BrightspaceUI/visual-diff/) to compare current snapshots against a set of golden snapshots stored in source control.

The golden snapshots in source control must be updated by Github Actions.  If your PR's code changes result in visual differences, a PR with the new goldens will be automatically opened for you against your branch.

If you'd like to run the tests locally to help troubleshoot or develop new tests, you can use these commands:

```shell
# Install dependencies locally
npm install esm mocha puppeteer @brightspace-ui/visual-diff --no-save

# run visual-diff tests
npx mocha './**/*.visual-diff.js' -t 10000 --require esm

# subset of visual-diff tests:
npx mocha './**/*.visual-diff.js' -t 10000 --require esm -g some-pattern

# update visual-diff goldens
npx mocha './**/*.visual-diff.js' -t 10000 --require esm --golden
```

## Versioning & Releasing

> TL;DR: Commits prefixed with `fix:` and `feat:` will trigger patch and minor releases when merged to `main`. Read on for more details...

The [sematic-release GitHub Action](https://github.com/BrightspaceUI/actions/tree/master/semantic-release) is called from the `release.yml` GitHub Action workflow to handle version changes and releasing.

### Version Changes

All version changes should obey [semantic versioning](https://semver.org/) rules:
1. **MAJOR** version when you make incompatible API changes,
2. **MINOR** version when you add functionality in a backwards compatible manner, and
3. **PATCH** version when you make backwards compatible bug fixes.

The next version number will be determined from the commit messages since the previous release. Our semantic-release configuration uses the [Angular convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular) when analyzing commits:
* Commits which are prefixed with `fix:` or `perf:` will trigger a `patch` release. Example: `fix: validate input before using`
* Commits which are prefixed with `feat:` will trigger a `minor` release. Example: `feat: add toggle() method`
* To trigger a MAJOR release, include `BREAKING CHANGE:` with a space or two newlines in the footer of the commit message
* Other suggested prefixes which will **NOT** trigger a release: `build:`, `ci:`, `docs:`, `style:`, `refactor:` and `test:`. Example: `docs: adding README for new component`

To revert a change, add the `revert:` prefix to the original commit message. This will cause the reverted change to be omitted from the release notes. Example: `revert: fix: validate input before using`.

### Releases

When a release is triggered, it will:
* Update the version in `package.json`
* Tag the commit
* Create a GitHub release (including release notes)
* Deploy a new package to NPM

### Releasing from Maintenance Branches

Occasionally you'll want to backport a feature or bug fix to an older release. `semantic-release` refers to these as [maintenance branches](https://semantic-release.gitbook.io/semantic-release/usage/workflow-configuration#maintenance-branches).

Maintenance branch names should be of the form: `+([0-9])?(.{+([0-9]),x}).x`.

Regular expressions are complicated, but this essentially means branch names should look like:
* `1.15.x` for patch releases on top of the `1.15` release (after version `1.16` exists)
* `2.x` for feature releases on top of the `2` release (after version `3` exists)

## Future Enhancements

Looking for a new component or an enhancement not listed here? Create a GitHub issue!
