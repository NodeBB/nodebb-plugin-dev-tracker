'use strict';

define('forum/dev-tracker', [
	'forum/infinitescroll',
	'categoryFilter',
], function (infinitescroll, categoryFilter) {
	const devTracker = {};
	let page = 1;
	let pageCount = 1;

	devTracker.init = function () {
		categoryFilter.init($('[component="category/dropdown"]'));
		page = ajaxify.data.pagination.currentPage;
		pageCount = ajaxify.data.pagination.pageCount;
		if (!config.usePagination) {
			infinitescroll.init(loadMore);
		}
	};

	function loadMore(direction) {
		if (direction < 0) {
			return;
		}
		const params = utils.params();
		page += 1;
		if (page > pageCount) {
			return;
		}
		params.page = page;

		infinitescroll.loadMoreXhr(params, function (data, done) {
			onPostsLoaded(data, done);
		});
	}

	async function onPostsLoaded(data, callback) {
		if (!data || (data.posts && !data.posts.length) || (data.topics && !data.topics.length)) {
			return callback();
		}
		let html;
		if (ajaxify.data.showPosts) {
			html = await app.parseAndTranslate('dev-tracker', 'posts', { posts: data.posts });
			$('[component="posts"]').append(html);
		} else if (ajaxify.data.showTopics) {
			html = await app.parseAndTranslate('dev-tracker', 'topics', { topics: data.topics });
			$('[component="category"]').append(html);
		}
		if (html) {
			html.find('img:not(.not-responsive)').addClass('img-fluid');
			html.find('.timeago').timeago();
			utils.makeNumbersHumanReadable(html.find('.human-readable-number'));
		}
		callback();
	}

	return devTracker;
});
