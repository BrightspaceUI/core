# Color Usage Documentation System

This directory contains tools and components for documenting color usage across D2L Brightspace UI components.

## Overview

The color documentation system provides:
- **Automated color extraction** from component CSS/JS files
- **Categorization** of colors by usage type (background, foreground, border, shadow, gradient, other)
- **Interactive viewer** with multiple navigation modes
- **Semantic summaries** explaining the purpose of each color

## Files

### Scripts

- **`extract-colors-by-component.js`** - Extracts color usage from component directories
- **`generate-colors-summary.js`** - Generates inverse mapping and semantic summaries
- **`extract-spacing-by-component.js`** - Extracts spacing usage from component directories
- **`extract-all-spacing.js`** - Bulk extraction of spacing from all components
- **`generate-spacing-summary.js`** - Generates spacing inverse mapping and summaries

### Data Files

- **`color-usages-by-component.json`** - Component-centric view: `{ "component-name": [{ color, usage, categories }] }`
- **`colors-summary.json`** - Color-centric view: `{ "color-value": { summary, categories, usages } }`
- **`spacing-usages-by-component.json`** - Component-centric spacing view: `{ "component-name": [{ spacing, usages, categories }] }`
- **`spacing-summary.json`** - Spacing-centric view: `{ "spacing-value": { summary, categories, usages } }`

### Components

- **`color-usage-viewer.js`** - Interactive Lit web component for browsing color documentation
- **`spacing-usage-viewer.js`** - Interactive Lit web component for browsing spacing documentation
- **`semantic-usage-viewer.js`** - Shell component with tabs for colors and spacing

## Usage

### Extracting Colors from a Component

To extract color usage from a component directory and update `color-usages-by-component.json`:

```bash
node extract-colors-by-component.js <path-to-component-directory>
```

**Example:**

```bash
# From the color-usage directory
node extract-colors-by-component.js ../button/

# Or from the workspace root
node components/color-usage/extract-colors-by-component.js components/button/
```

**What it does:**
1. Recursively scans all `.css` and `.js` files in the component directory
2. Extracts color values (CSS custom properties, hex, rgb/rgba)
3. Detects usage context (background, text, border, shadow, etc.)
4. Automatically categorizes each color usage
5. Updates `color-usages-by-component.json` with the extracted data

**Features:**
- Creates `color-usages-by-component.json` if it doesn't exist
- Preserves existing component data
- Detects interactive states (hover, focus, disabled, selected)
- Infers semantic meaning from CSS context

### Extracting Spacing from a Component

To extract spacing usage from a component directory and update `spacing-usages-by-component.json`:

```bash
node extract-spacing-by-component.js <path-to-component-directory>
```

**Example:**

```bash
# From the color-usage directory
node extract-spacing-by-component.js ../button/

# Or from the workspace root
node components/color-usage/extract-spacing-by-component.js components/button/
```

**What it does:**
1. Recursively scans all `.css` and `.js` files in the component directory
2. Extracts spacing values (px, rem, em units)
3. Detects usage context (margin, padding, gap, border, border-radius)
4. Automatically categorizes each spacing usage
5. Groups duplicate spacing values within a component
6. Updates `spacing-usages-by-component.json` with the extracted data

**Features:**
- Creates `spacing-usages-by-component.json` if it doesn't exist
- Preserves existing component data
- Detects all margin, padding, gap, border, and border-radius properties
- Groups duplicate values with combined usage arrays

### Generating Color Summary

After extracting colors, generate the inverse mapping and semantic summaries:

```bash
node generate-colors-summary.js
```

**What it does:**
1. Reads `color-usages-by-component.json`
2. Creates inverse mapping (grouped by color instead of component)
3. Generates AI-analyzed semantic summaries for each color
4. Aggregates categories at both color and usage levels
5. Writes output to `colors-summary.json`

**Output format:**
```json
{
  "--d2l-color-primary": {
    "summary": "Primary brand color used for backgrounds, text, icons",
    "categories": ["background", "foreground"],
    "usages": [
      {
        "component": "d2l-button",
        "usage": "background-color for primary button",
        "categories": ["background"]
      }
    ]
  }
}
```

### Generating Spacing Summary

After extracting spacing values, generate the inverse mapping and semantic summaries:

```bash
node generate-spacing-summary.js
```

**What it does:**
1. Reads `spacing-usages-by-component.json`
2. Creates inverse mapping (grouped by spacing value instead of component)
3. Generates semantic summaries for each spacing value
4. Aggregates categories (margin, padding, gap, border, border-radius)
5. Writes output to `spacing-summary.json`

**Output format:**
```json
{
  "1rem": {
    "summary": "1rem (16px) used for gap, margin, padding across 25 properties across 15 components",
    "categories": ["gap", "margin", "padding"],
    "usages": [
      {
        "component": "d2l-button",
        "usages": ["padding", "gap"],
        "categories": ["padding", "gap"]
      }
    ]
  }
}
```

## Workflow

### Complete Extraction Workflow

To document colors and spacing for all components:

```bash
# 1. Extract colors from each component directory
for dir in components/*/; do
  node components/color-usage/extract-colors-by-component.js "$dir"
done

# 2. Generate the color summary and inverse mapping
cd components/color-usage
node generate-colors-summary.js

# 3. Extract spacing from all components (bulk extraction)
node extract-all-spacing.js

# 4. Generate the spacing summary
node generate-spacing-summary.js
```

### Updating a Single Component

```bash
# Extract colors from the updated component
node extract-colors-by-component.js ../button/

# Regenerate the color summary
node generate-colors-summary.js

# Extract spacing from the updated component
node extract-spacing-by-component.js ../button/

# Regenerate the spacing summary
node generate-spacing-summary.js
```

## Color Categories

The system automatically categorizes colors into six types:

- **background** - Background colors for elements
- **foreground** - Text, icon, fill, and stroke colors
- **border** - Border and outline colors
- **shadow** - Box shadow colors
- **gradient** - Gradient definitions
- **other** - Uncategorized color usage

Categories are detected using pattern matching on the usage context.

## Spacing Categories

The system automatically categorizes spacing values into five types:

- **margin** - All margin properties (including directional variants)
- **padding** - All padding properties (including directional variants)
- **gap** - Gap, row-gap, and column-gap properties
- **border** - Border width properties
- **border-radius** - Border radius properties (including corner-specific variants)

Categories are detected based on the CSS property name where the spacing value appears.

## Interactive Viewer

The `color-usage-viewer.js` component provides three viewing modes:

### Summary View
- Color-category matrix showing which colors fall into which categories
- Expandable rows revealing component details
- Clickable column headers for filtering by category
- Collapsible panel with category definitions

### By Component View
- Dropdown to select a component
- Shows all colors used by that component
- Category badges and filtering
- Usage descriptions for each color

### By Color View
- Dropdown to select a color
- Shows all components using that color
- Semantic summary of the color's purpose
- Usage descriptions for each component

### Integration

To use the viewer in a demo page:

```html
<script type="module" src="./color-usage-viewer.js"></script>

<color-usage-viewer></color-usage-viewer>
```

### Configuration

The viewer accepts the following attributes for customizing data file paths:

#### `color-data-file`
Path to the JSON file containing color usage data organized by component.

**Default:** `./color-usages-by-component.json`

**Example:**
```html
<color-usage-viewer color-data-file="./custom-color-data.json"></color-usage-viewer>
```

#### `color-summary-file`
Path to the JSON file containing color summary data organized by color.

**Default:** `./colors-summary.json`

**Example:**
```html
<color-usage-viewer color-summary-file="./custom-summary.json"></color-usage-viewer>
```

#### Combined Example
```html
<color-usage-viewer 
  color-data-file="../../data/color-usages.json"
  color-summary-file="../../data/colors-summary.json">
</color-usage-viewer>
```

This allows you to use the viewer with different datasets or place the data files in alternative locations.

## Technical Details

### Color Detection Patterns

The extraction script detects:
- CSS custom properties: `--d2l-color-*`
- Hex colors: `#RGB`, `#RRGGBB`
- RGB/RGBA: `rgb()`, `rgba()`

### Context Analysis

The script analyzes surrounding CSS to infer:
- **CSS properties**: `background-color`, `color`, `border`, `box-shadow`, `fill`, `stroke`, `outline`
- **Pseudo-classes**: `:hover`, `:focus`, `:active`
- **States**: `disabled`, `selected`, `primary`, `invalid`

### Category Detection

Categories are assigned based on regex patterns:

```javascript
{
  background: /background(?:-color)?/i,
  foreground: /(?:text|icon|foreground|fill|stroke)\s+color/i,
  border: /border|outline/i,
  shadow: /(?:box-)?shadow/i,
  gradient: /gradient/i
}
```

## Maintenance

### Adding New Components

When adding a new component:
1. Run extraction script on the component directory
2. Regenerate the summary
3. Verify categories are correctly assigned
4. Check the viewer to ensure proper display

### Updating Existing Components

When modifying component styles:
1. Re-run extraction on the modified component
2. Regenerate the summary
3. Review changes in the viewer

### Troubleshooting

**Issue: No colors extracted**
- Verify the component directory contains `.css` or `.js` files
- Check that color values are in supported formats
- Ensure colors are used in context of CSS properties (not just comments)

**Issue: Incorrect categories**
- Review usage descriptions in `color-usages-by-component.json`
- Adjust category patterns in the extraction script if needed
- Re-run extraction after pattern updates

**Issue: Missing semantic summaries**
- Ensure `generate-colors-summary.js` was run after extraction
- Check `colors-summary.json` for the summary field
