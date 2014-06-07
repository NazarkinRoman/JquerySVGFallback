jQuery Advanced SVG Fallback Plugin
===================================

A jQuery plugin for replace `PNG` images to `SVG`, if browser supports. Have a cache feature.

## Getting Started

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
<script src="js/jquery.SVGfallback.min.js"></script>

<!-- If there are '/img/1.svg' - plugin will replace `src` attribute to SVG file -->
<img class="svg" src="/img/1.png">

<script>
	$(document).ready(function() {
		$('.svg').svgFallback({
			allowExternalImages: false,
			cachePrefix        : 'svgCache_',
			cacheEnabled       : true,
			storage            : sessionStorage
		});
	});
</script>
```

## Parameters

* `allowExternalImages`, default: `false`;
* `cachePrefix`, default: `svgCache_`;
* `cacheEnabled`, default: `true`;
* `storage`, default: `sessionStorage`; Storage class object. 
	By default you can set `localStorage`(saves data for unlimited time) or `sessionStorage`(remove data after browser closes). Also you can write your own storage class with methods: `getItem(index)`, `setItem(index, value)` and `removeItem(index)`

## License
Copyright (c) 2014 <a href="http://nazarkin.su/">Nazarkin Roman</a>
Licensed under the <a href='https://github.com/NazarkinRoman/JquerySVGFallback/blob/master/LICENSE.txt'>MIT license</a>.