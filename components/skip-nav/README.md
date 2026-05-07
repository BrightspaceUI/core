# Skip Nav

Components which provide a link for skipping past navigation panels.

## Skip Nav Main [d2l-skip-nav-main]

Meant to be used once at the page level, `<d2l-skip-nav-main>` provides preset "skip to main content" text. It also automatically skips to the `<main>` element of the page, or the first `<h1>` element.

## Skip Nav Custom [d2l-skip-nav-custom]

A skip navigation link where custom text can be provided. Focus will need to be moved manually when clicked.

<!-- docs: demo code properties name:d2l-skip-nav-custom sandboxTitle:'Skip Nav Custom' -->
```html
<script type="module">
  import '@brightspace-ui/core/components/skip-nav/skip-nav-custom.js';
</script>
<d2l-skip-nav-custom text="Skip to custom place"></d2l-skip-nav-custom>
<button id="custom-target">Skip to here</button>
<script>
  document.querySelector('d2l-skip-nav-custom').addEventListener('click', () => {
    document.querySelector('#custom-target').focus();
  });
</script>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `text` | String, required | Text for the link |
<!-- docs: end hidden content -->

