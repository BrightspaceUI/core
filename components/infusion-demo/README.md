# Demo Page

```
<!DOCTYPE html>
<html lang="en">

<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta charset="UTF-8">
	<link rel="stylesheet" href="../../demo/styles.css" type="text/css">
	<script type="module">
		import '../../demo/demo-page.js';
		import '../infusion-demo.js';
	</script>
</head>

<body unresolved>

	<d2l-demo-page page-title="d2l-infusion-demo">
		<d2l-demo-snippet>
			<template>
				<d2l-infusion-demo boldKey="id" data='{"id":"42","name":"John Doe","age":50}'></d2l-infusion-demo>
			</template>
		</d2l-demo-snippet>

	</d2l-demo-page>
</body>

</html>

```

# index.html

```
<li><a href="components/infusion-demo/demo/infusion-demo.html">d2l-infusion-demo</a></li>
```
