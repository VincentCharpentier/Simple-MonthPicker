# Simple-MonthPicker
A simple monthpicker plugin for jQuery

TL;DR : [Live Demo](http://codepen.io/VincentCharpentier/full/WQrozB)

## Basic usage

1 - Initialization :

```js
$("selector").Monthpicker();
```

2 - Get the value :

```js
$("selector").val();
```

  The value will be in the "`mm/yyyy`" format

## Options

You can pass these option as arguments like so :

```js
$("#boundMonthPicker").Monthpicker({
	minValue: "04/2015",
	maxValue: "07/2016"
});
```

Or update any option like so :

```js
$("#boundMonthPicker").Monthpicker("option", {
	minValue: "02/2016",
	maxValue: "07/2019"
});
```

**1. Bounds :**
<table>
	<tr><th>Attribute</th><th>Type</th><th>Description</th><th>Default</th></tr>
	<tr><td colspan='4'><i>Minimum<i></td></tr>
	<tr><td><code>minValue</code></td><td>STRING</td><td>represent the minimum allowed value (format: "<code>mm/yyyy</code>")</td><td><code>null</code></td></tr>
	<tr><td><code>minYear</code></td><td>INT</td><td>Equivalent to minValue with January as default month</td><td><code>null</code></td></tr>
	<tr><td colspan='4'><i>Maximum<i></td></tr>
	<tr><td><code>maxValue</code></td><td>STRING</td><td>represent the maximum allowed value (format: "<code>mm/yyyy</code>")</td><td><code>null</code></td></tr>
	<tr><td><code>maxYear</code></td><td>INT</td><td>Equivalent to maxValue with December as default month</td><td><code>null</code></td></tr>
</table>

**2. Labels :**

  - `monthLabels` : STRING ARRAY - Labels for months in the selection tool
  
    **Default** : 
	```js
	["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jui", "Aug", "Sep", "Oct", "Nov", "Dec"]
	```
    
    
## Events

|Name|Description|
|---|---|
|`onSelect`|Fired when a value is selected|
|`onClose`|Fired when the selection box is closed|
