'use strict';

/* jshint esversion: 6 */

/**
 * Define Initial Variables
 */
var head = document.head || document.getElementsByTagName('head')[0],
    star = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 21"><path d="M11.4428797,0.682367821 L13.1475073,5.91258374 C13.3362303,6.49202457 13.8779163,6.88340127 14.4879506,6.88340127 L20.0068228,6.88340127 C20.9667598,6.88340127 21.3666485,8.10734296 20.5893138,8.66950222 L16.1242299,11.9021721 C15.6304898,12.2600022 15.4244247,12.8943375 15.6131477,13.4727617 L17.3177753,18.7029777 C17.6146315,19.6128014 16.5700242,20.3691242 15.7937097,19.8069649 L11.3286258,16.574295 C10.8348856,16.2164649 10.1656841,16.2164649 9.67194396,16.574295 L5.20686008,19.8069649 C4.43054552,20.3691242 3.38491815,19.6128014 3.68177431,18.7029777 L5.38742207,13.4727617 C5.57614506,12.8943375 5.36905984,12.2600022 4.87531969,11.9021721 L0.410235806,8.66950222 C-0.366078756,8.10734296 0.0327898298,6.88340127 0.992726759,6.88340127 L6.51159901,6.88340127 C7.12265344,6.88340127 7.6633193,6.49202457 7.85204228,5.91258374 L9.55769005,0.682367821 C9.85454621,-0.22745594 11.1460235,-0.22745594 11.4428797,0.682367821"></path></svg>',
    count = document.currentScript.getAttribute('count'),
    script = document.scripts[document.scripts.length - 1],
    engine = document.currentScript.getAttribute('engine'),
    parent = script.parentElement,
    columns = document.currentScript.getAttribute('columns') ? document.currentScript.getAttribute('columns') : 2,
    characters = document.currentScript.getAttribute('characters');

/**
 * Insert a Loading Animation
 */
var loader = document.createElement('div'),
    style = document.createElement('style'),
    css = '@keyframes review-engine-loader{from{transform:scale(0) translate(-50%,-50%);opacity:1}to{transform:scale(1) translate(-50%,-50%);opacity:0}}@keyframes review-engine-loader-container{from{transform:rotate(0)}to{transform:rotate(360deg)}}.review-engine-loader-container,.review-engine-loader-container *{box-sizing:border-box}.review-engine-loader-container{margin:0 auto;width:72px;height:72px;position:relative}.review-engine-loader-container:before{content:"";display:block;position:absolute;width:64px;height:64px;border-radius:50%;border:4px solid rgba(0,149,238,.25);border-top-color:#0095ee;animation:1s review-engine-loader-container forwards linear infinite}.review-engine-loader-container svg{position:absolute;width:48px;stroke:#fff;top:50%;left:50%;filter:drop-shadow( 1px 1px 1px rgba(0, 0, 0, .1) );fill:#ffbb58;transform-origin:top left;animation:1s review-engine-loader forwards linear infinite}';

style.type = 'text/css';
if (style.styleSheet) {
	style.styleSheet.cssText = css; // IE <= 8
} else {
	style.appendChild(document.createTextNode(css));
}

loader.classList.add('review-engine-loader-container');
loader.innerHTML = star;

head.appendChild(style);
parent.insertBefore(loader, script.nextSibling);

/**
 * Apply Stylesheet to Document
 */
var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://plugins.svn.wordpress.org/redbrick-digital-core/trunk/assets/css/shortcode-review-engine-display.css';

head.appendChild(link);

/**
 * Make API GET Request to Review Engine
 */
fetch('https://' + engine + '/reviews-api-v2/?user=test&key=cdff.1070bdaacf&threshold=4&query_v2=true&reviews_per_page=' + count).then(function (response) {
	return response.json();
}).then(function (json) {
	var company = json.company[0],
	    reviews = json.reviews,
	    data = json.data[0];

	var container = document.createElement('div');
	container.classList.add('rbd-core-ui', 'rbd-review-engine-display', 'rbd-3d-effects');

	// Make sure we fetched some Header Information
	if (data.aggregate != null && data.total_reviews != 0) {

		loader.outerHTML = ''; // Remove Loader
		parent.insertBefore(container, script.nextSibling); // Insert Review Grid Container

		// Construct Header/Aggregate
		var header = document.createElement('h2');
		var percent = data.aggregate * 20;
		header.classList.add('rbd-header');
		header.innerHTML = '<span class="rbd-aggregate">' + data.aggregate + '</span>\n\t\t<span class="rbd-aggregate-container">\n\t\t\t<span class="rbd-earned" style="width: ' + percent + '%;">\n\t\t\t\t<i class="rbd-score renderSVG rendered" data-icon="star" data-repeat="5">' + star.repeat(5) + '</i>\n\t\t\t</span>\n\t\t\t<span>\n\t\t\t\t<i class="rbd-score renderSVG rendered" data-icon="star" data-repeat="5">' + star.repeat(5) + '</i>\n\t\t\t</span>\n\t\t</span>\n\t\t<span class="rbd-normal rbd-review-count">(' + data.total_reviews + ')</span>';

		var section = document.createElement('section');
		section.classList.add('rbd-review-grid');
		section.setAttribute('data-grid', 'grid');
		section.setAttribute('data-columns', columns);

		// Build Review Elements
		reviews.forEach(function (review) {
			var el = document.createElement('div');
			el.classList.add('rbd-review');
			el.setAttribute('data-meta', 'Written by ' + review.review_meta.reviewer.display_name + ' on ' + review.review_meta.review_date.date);
			el.setAttribute('data-permalink', review.url);
			var content = review.content.length > characters ? review.content.substr(0, characters) + '…' : review.content;
			var button = review.content.length > characters ? '<a target="_blank" href="' + review.url + '">Read More</a>' : '';
			el.innerHTML = '<h3 class="rbd-heading">' + review.title + '</h3>\n\t\t\t\t\t\t\t<i class="rbd-score renderSVG rendered" data-icon="star" data-repeat="' + review.rating + '" data-score="' + review.rating + '">' + star.repeat(review.rating) + '</i>\n\t\t\t\t\t\t\t<p class="rbd-content">\n\t\t\t\t\t\t\t\t<!--<img class="rbd-gravatar" src="' + review.review_meta.reviewer.gravatar + '">-->\n\t\t\t\t\t\t\t\t<span class="rbd-content-limit">' + content + '</span>\n\t\t\t\t\t\t\t\t' + button + '\n\t\t\t\t\t\t\t</p>';

			section.appendChild(el);
		});

		var more = document.createElement('a');
		more.classList.add('rbd-button');
		more.setAttribute('target', '_blank');
		more.setAttribute('href', data.review_engine_url);
		more.innerText = 'Read More Reviews';

		container.appendChild(header);
		container.appendChild(section);
		container.appendChild(more);
	} else {
		var reURL;

		if (data.review_funnels.selected_review_funnel != null && data.review_funnels.selected_review_funnel.length > 0) {
			reURL = data.review_funnels.review_funnel_url;
		} else {
			reURL = data.review_engine_url;
		}

		var _header = document.createElement('h2');
		_header.classList.add('rbd-header');
		_header.innerHTML = 'Be the first to write a review: <a class="rbd-button rbd-small" target="_blank" rel="noopener nofollow" href="' + reURL + '">Write a Review</a>';

		container.appendChild(_header);
	}

	// Remove Script Tag
	script.outerHTML = '';
});