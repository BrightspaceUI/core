# Backdrops

Use a backdrop to de-emphasize the content of an element or page.

## Backdrop [d2l-backdrop]

Use a backdrop to de-emphasize background elements and draw the user's attention to a dialog or other modal content.

<!-- docs: demo code properties name:d2l-backdrop sandboxTitle:'Backdrop' size:small -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/button.js';
  import '@brightspace-ui/core/components/backdrop/backdrop.js';

  const backdrop = document.querySelector('d2l-backdrop');
  document.querySelector('#target > d2l-button').addEventListener('click', () => {
    backdrop.shown = !backdrop.shown;
  });
</script>
<style>
  #target { position: relative; z-index: 1000; margin: 40px; }
</style>
<div>
  <div id="target"><d2l-button primary>Toggle backdrop</d2l-button></div>
  <d2l-backdrop for-target="target"></d2l-backdrop>
</div>
<span>Background content</span>
```

<!-- docs: start hidden content -->
### Properties:

| Property | Type | Description |
|--|--|--|
| `for-target` | String, required | id of the target element to display backdrop behind |
| `no-animate-hide` | Boolean | Disables the fade-out transition while the backdrop is being hidden |
| `shown` | Boolean | Used to control whether the backdrop is shown |
| `slow-transition` | Boolean | Increases the fade transition time to 1200ms (default is 200ms) |
<!-- docs: end hidden content -->

### Focus Management

Elements with `aria-hidden` applied (as well as their descendants) are completely hidden from assistive technologies. It's therefore very important that the element with active focus be within the backdrop target.

**When showing a backdrop**: first move focus inside the target, then set the `shown` attribute on the backdrop.

**When hiding a backdrop**: first remove the `shown` attribute on the backdrop, then if appropriate move focus outside the target.

### Accessibility

The dialog backdrop hides background elements from screen reader users by setting `aria-hidden="true"` on all elements other than the target element specified in `for-target`.

Before showing the backdrop, focus should be moved inside the target element — see [Focus Management](#focus-management) for more details.

## Loading Backdrop

The loading backdrop can be used to de-emphasize an element's contents while they're being refreshed. It also displays a loading spinner to indicate that new contents will be populated without any further user input.

<!-- docs: demo code properties name:d2l-backdrop-loading sandboxTitle:'Loading Backdrop' size:medium -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/button.js';
  import '@brightspace-ui/core/components/backdrop/loading-backdrop.js';
  import '@brightspace-ui/core/components/loading-spinner/loading-spinner.js';

  const loadingBackdrop = document.querySelector('d2l-backdrop-loading');
  document.querySelector('#target > d2l-button').addEventListener('click', () => {
    loadingBackdrop.shown = !loadingBackdrop.shown;

	setTimeout(() => {
  		document.querySelectorAll('.grade').forEach((grade) => {
			grade.innerHTML = `${Math.round(Math.random() * 100).toString()}%`;
		})
		loadingBackdrop.shown = !loadingBackdrop.shown;
	}, 5000)
  });

</script>
<style>
	table {
		width: 100%
		background-color: #b4e0bf;
	}
	th, td {
		padding: 30px;
		border-bottom: 1px solid #ddd;
		text-align: left;
	}
	#grade-container {
		position: relative;
	}
</style>
<div id="target"><d2l-button primary>Refresh Content</d2l-button></div>
<div id="grade-container">
	<table>
		<thead>
			<th>Course</th>
			<th>Grade</th>
			<th>Hours Spent in Content</th>
		</thead>
		<tr>
			<td>Math</td>
			<td class="grade">85%</td>
			<td>100</td>
		</tr>
		<tr>
			<td>Art</td>
			<td class="grade">98%</td>
			<td>10</td>
		</tr>
	</table>
	<d2l-backdrop-loading></d2l-backdrop-loading>
</div>
```
<!-- docs: start hidden content -->
### Properties:

| Property | Type | Description |
|--|--|--|
| `shown` | Boolean | Used to control whether the loading backdrop is shown |
<!-- docs: end hidden content -->
