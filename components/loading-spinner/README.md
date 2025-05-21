# Loading Spinners

A loading spinner indicates that something is happening and we don't know how long it will take.

<!-- docs: demo name:d2l-loading-spinner sandboxTitle:'Loading Spinner' -->
```html
<script type="module">
  import '@brightspace-ui/core/components/loading-spinner/loading-spinner.js';
</script>

<d2l-loading-spinner></d2l-loading-spinner>
```

## Best Practices

<!-- docs: start best practices -->
<!-- docs: start dos -->
* Use a loading spinner when the user initiates an action with indeterminate length, and it's expected to take longer than a couple seconds
* Adjust the size proportionally to the area that is being loaded; small for a widget or dropdown, larger for a large list or an entire page
* For a better user experience, use a Skeleton loader instead when possible
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don't use a loading spinner it if the user's action is nearly instant, as it may appear to flash or flicker on the screen before disappearing
* Avoid using multiple spinners on one screen, as this can overwhelm users and create anxiety - see Skeleton loaders instead
<!-- docs: end donts -->
<!-- docs: end best practices -->

### When should I use the Skeleton Loader pattern vs. a Loading Spinner?
The skeleton loader pattern has a feeling of "an existing structure coming into focus", whereas the spinner has a feeling of progression. Because of this, we say that Skeleton Loaders are for loading page chrome, whereas Spinners are for loading data.
* If the page loading for the first time and different parts of the page are coming in asynchronously, use Skeleton Loader pattern.
* If your design is progressively disclosing new components (new form fields for example) because the user has expanded or opened a panel, use Skeleton Loader pattern.
* If the data on a page changes as a result of a user action, ie: sorting or filtering a table, paginating, etc -- use a Loading Spinner.
* If you need to communicate that part of the page is processing data, use a spinner.
* If the whole page is about to refresh (ie: the user has pressed submit on a form), you do NOT need to show a loading spinner ... the browser's native "loading" affordances are enough.

## Loading Spinner [d2l-loading-spinner]

<!-- docs: demo code properties name:d2l-loading-spinner sandboxTitle:'Loading Spinner' -->
```html
<script type="module">
  import '@brightspace-ui/core/components/loading-spinner/loading-spinner.js';
</script>

<d2l-loading-spinner></d2l-loading-spinner>
```
<!-- docs: start hidden content -->

### Properties

| Property | Type | Description |
|--|--|--|
| `color` | String | Color of the animated bar (default is `--d2l-color-celestine`) |
| `size` | Number, default: `50` | Height and width (`px`) of the spinner |

## Future Improvements

- Ability to "freeze" the spinner at a specified frame to make vdiff testing easier

Looking for an enhancement not listed here? Create a GitHub issue!
<!-- docs: end hidden content -->
