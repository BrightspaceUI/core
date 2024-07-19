# Breadcrumbs

Breadcrumbs are a way-finding tool that helps users understand where they are within an application, while also offering an easy way to navigate "up" to higher level pages.

<!-- docs: demo display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js';
</script>
<d2l-breadcrumbs>
  <d2l-breadcrumb text="Item 1" href="#"></d2l-breadcrumb>
  <d2l-breadcrumb text="Item 2" href="#"></d2l-breadcrumb>
  <d2l-breadcrumb text="Item 3" href="#"></d2l-breadcrumb>
</d2l-breadcrumbs>
```

## Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Structure breadcrumbs around information architecture rather than the user's browsing history
* Keep breadcrumbs short and sweet; it's okay to simplify language in a breadcrumb
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don't repeat the current page name in the breadcrumb
* Avoid displaying more than one breadcrumb control on a page
* Don't use breadcrumbs as a stepper, see [Wizards](https://github.com/BrightspaceUILabs/wizard) instead
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Responsive Behavior

Breadcrumbs that overflow their container will appear to fade at the edge.

<!-- docs: demo display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js';
</script>
<d2l-breadcrumbs>
  <d2l-breadcrumb text="Table of Contents" href="#"></d2l-breadcrumb>
  <d2l-breadcrumb text="Unit 1: Shakespeare" href="#"></d2l-breadcrumb>
  <d2l-breadcrumb text="Lesson 1: Introduction" href="#"></d2l-breadcrumb>
  <d2l-breadcrumb text="The Comedies, Tragedies, and Histories" href="#"></d2l-breadcrumb>
</d2l-breadcrumbs>
```

This works well for mobile or other touch devices but not as well for mouse or keyboard users, so we have two other options for managing width.

### Limited Width

Set a `max-width` to constrain breadcrumbs to a particular width:

<!-- docs: demo code display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js';
</script>
<d2l-breadcrumbs style="max-width: 250px">
  <d2l-breadcrumb text="Trucate Basic Item 1" href="#"></d2l-breadcrumb>
  <d2l-breadcrumb text="Truncate Basic Item 2" href="#"></d2l-breadcrumb>
</d2l-breadcrumbs>
```

### Compact Mode

Alternately, add the `compact` attribute to only display the last breadcrumb. The `d2l-breadcrumb-current-page` will be hidden:

<!-- docs: demo code display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/breadcrumbs/breadcrumb-current-page.js';
  import '@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js';
</script>
<d2l-breadcrumbs compact>
  <d2l-breadcrumb text="Item 1" href="#"></d2l-breadcrumb>
  <d2l-breadcrumb text="Item 2" href="#"></d2l-breadcrumb>
  <d2l-breadcrumb-current-page text="Current Page"></d2l-breadcrumb-current-page>
</d2l-breadcrumbs>
```

## Breadcrumbs [d2l-breadcrumbs]

<!-- docs: demo code properties name:d2l-breadcrumbs sandboxTitle:'Breadcrumbs' display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js';
</script>
<d2l-breadcrumbs>
  <d2l-breadcrumb text="Item 1" href="#"></d2l-breadcrumb>
  <d2l-breadcrumb text="Item 2" href="#"></d2l-breadcrumb>
  <d2l-breadcrumb text="Item 3" href="#"></d2l-breadcrumb>
</d2l-breadcrumbs>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `compact` | Boolean | Indicates whether the component should render in compact mode |
<!-- docs: end hidden content -->

## Breadcrumb (child) [d2l-breadcrumb]

<!-- docs: demo code properties name:d2l-breadcrumb sandboxTitle:'Breadcrumb' display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js';
</script>
<d2l-breadcrumbs>
  <d2l-breadcrumb text="Item 1" href="#"></d2l-breadcrumb>
</d2l-breadcrumbs>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `text` | String, required | Text of the breadcrumb item |
| `aria-label` | String | AriaLabel of breadcrumb item |
| `href` | String | Href of the breadcrumb item |
| `target` | String | Target of the breadcrumb item |
<!-- docs: end hidden content -->

### Accessibility Properties

To make your usage of `d2l-breadcrumb` (child) accessible, use the following attribute when applicable:

| Attribute | Description |
|---|---|
| `aria-label` | Acts as a primary label. Use if `text` does not provide enough context. |

## Current Page [d2l-breadcrumb-current-page]

Only include the current page in the breadcrumb if your page or view does not have a visible heading. You will notice that some older pages or tools in Brightspace still display the current page as the last breadcrumb despite having a visible page heading, but this is now a legacy pattern.

<!-- docs: demo code properties name:d2l-breadcrumb-current-page sandboxTitle:'Current Page Breadcrumb' display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/breadcrumbs/breadcrumb-current-page.js';
  import '@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js';
</script>
<d2l-breadcrumbs>
  <d2l-breadcrumb text="Item 1" href="#"></d2l-breadcrumb>
  <d2l-breadcrumb text="Item 2" href="#"></d2l-breadcrumb>
  <d2l-breadcrumb-current-page text="Current Page"></d2l-breadcrumb-current-page>
</d2l-breadcrumbs>
```

