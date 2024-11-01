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

## Responsive Behavior

Breadcrumbs that overflow their container will appear to fade at the edge, as in this example:

<!-- docs: demo display:block -->
```html
<script type="module">
  import '@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js';
</script>
<d2l-breadcrumbs>
  <d2l-breadcrumb text="Table of Contents" href="#"></d2l-breadcrumb>
  <d2l-breadcrumb text="Unit 1: Shakespeare" href="#"></d2l-breadcrumb>
  <d2l-breadcrumb text="Lesson 1: Introduction" href="#"></d2l-breadcrumb>
  <d2l-breadcrumb text="Sub-lesson 3: The Breadth of Shakespearean Literature" href="#"></d2l-breadcrumb>
  <d2l-breadcrumb text="The Comedies, Tragedies, Histories, and Other Long Words" href="#"></d2l-breadcrumb>
</d2l-breadcrumbs>
```

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

## Accessibility

Breadcrumbs adhere to [W3C's Breadcrumbs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/), so they are contained in a navigation landmark region with proper aria labelling and add `aria-current` to the final breadcrumb if it represents the [Current Page](#d2l-breadcrumb-current-page).

Note that we do not apply a `visited` style to breadcrumbs, since they reflect tool hiearchy and are part of the UI rather than part of the page content.
