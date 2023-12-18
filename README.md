>  Are you a D2L employee? Use our  🎉 [Daylight Design System site](https://daylight.d2l.dev/)!

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
  * [Tag List](components/tag-list/): tag-list and tag-list-item components
  * [Tooltip](components/tooltip/): tooltip components
  * [Typography](components/typography/): typography styles and components
  * [Validation](components/validation/): plugin custom validation logic to native and custom form elements
* Controllers
  * [Subscriber](controllers/subscriber/): for managing a registry of subscribers in a many-to-many relationship
* Directives
  * [Animate](directives/animate/): animate showing, hiding and removal of elements
* Helpers
  * [Helpers](helpers/): helpers for composed DOM, unique ids, etc.
* Mixins
  * [ArrowKeysMixin](mixins/arrow-keys/): manage focus with arrow keys
  * [AsyncContainerMixin](mixins/async-container/): manage collective async state
  * [FocusMixin](mixins/focus/): delegate focus to a nested element when `focus()` is called
  * [FormElementMixin](components/form/docs/form-element-mixin.md): allow components to participate in forms and validation
  * [InteractiveMixin](mixins/interactive/): enables toggling interactive elements inside of nested grids
  * [LabelledMixin](mixins/labelled/): label custom elements by referencing elements across DOM scopes
  * [LocalizeMixin](mixins/localize/): localize text in your components
  * [ProviderMixin](mixins/provider/): provide and consume data across elements in a DI-like fashion
  * [RtlMixin](mixins/rtl/): enable components to define RTL styles
  * [SkeletonMixin](components/skeleton/): make components skeleton-aware
  * [VisibleOnAncestorMixin](mixins/visible-on-ancestor/): display element on-hover of an ancestor
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

D2L employees can also view the latest main-branch demos at https://live.d2l.dev/BrightspaceUI/core/.

### Linting

```shell
# eslint and stylelint
npm run lint

# eslint only
npm run lint:eslint

# stylelint only
npm run lint:style
```

### Testing

To run the full suite of tests:

```shell
npm test
```

Alternatively, tests can be selectively run:

```shell
# unit tests
npm run test:unit

# aXe accessibility tests
npm run test:axe

# translations tests
npm run test:translations
```

Note: The axe tests require `prefers-reduced-motion` emulation to be turned on in the dev console if debugging in a local browser.

This repo uses [@brightspace-ui/testing](https://github.com/BrightspaceUI/testing)'s vdiff command to perform visual regression testing:

```shell
# vdiff
npm run test:vdiff

# re-generate goldens
npm run test:vdiff -- --golden
```

### Versioning and Releasing

This repo is configured to use `semantic-release`. Commits prefixed with `fix:` and `feat:` will trigger patch and minor releases when merged to `main`.

To learn how to create major releases and release from maintenance branches, refer to the [semantic-release GitHub Action](https://github.com/BrightspaceUI/actions/tree/main/semantic-release) documentation.

## Future Enhancements

Looking for a new component or an enhancement not listed here? Create a GitHub issue!
