
'use strict';

const querystring = require('querystring');

const _ = require.main.require('lodash');

const db = require.main.require('./src/database');
const routeHelpers = require.main.require('./src/routes/helpers');
const controllerHelpers = require.main.require('./src/controllers/helpers');
const topics = require.main.require('./src/topics');
const groups = require.main.require('./src/groups');
const posts = require.main.require('./src/posts');
const privileges = require.main.require('./src/privileges');
const pagination = require.main.require('./src/pagination');
const meta = require.main.require('./src/meta');

const devTracker = module.exports;

devTracker.init = async function (params) {
	routeHelpers.setupPageRoute(params.router, '/dev-tracker', renderDevTracker);
	routeHelpers.setupAdminPageRoute(params.router, '/admin/plugins/dev-tracker', renderAdmin);
};

async function renderAdmin(req, res) {
	const groupsData = await groups.getNonPrivilegeGroups('groups:createtime', 0, -1);
	groupsData.sort((a, b) => b.system - a.system);
	res.render('admin/plugins/dev-tracker', { groups: groupsData });
}

async function getDevTrackerGroups() {
	const settings = await meta.settings.get('dev-tracker');
	let groups = settings.devTrackerGroups || '[]';
	try {
		groups = JSON.parse(groups);
		return groups;
	} catch (err) {
		console.error(err.stack);
		return [];
	}
}

async function getDevTrackerUidsFromGroups(groupNames) {
	const arrayOfUids = await groups.getMembersOfGroups(groupNames);
	return _.uniq(_.flatten(arrayOfUids));
}

async function renderDevTracker(req, res) {
	const page = Math.max(1, parseInt(req.query.page, 10) || 1);
	const cids = getCidsArray(req.query.cid);
	const groupNames = await getDevTrackerGroups();
	const currentGroup = req.query.group || '';
	let showPosts = parseInt(req.query.posts, 10) === 1;
	const showTopics = parseInt(req.query.topics, 10) === 1;
	if (!showPosts && !showTopics) {
		showPosts = true;
	}

	const [uids, groupData, categoryData] = await Promise.all([
		getDevTrackerUidsFromGroups(currentGroup ? [currentGroup] : groupNames),
		groups.getGroupsData(groupNames),
		controllerHelpers.getSelectedCategory(cids),
	]);

	groupData.forEach((group) => {
		group.selected = group.name === req.query.group;
		group.url = `dev-tracker?${querystring.stringify({ ...req.query, group: group.name })}`;
	});
	let data = [];
	if (showPosts) {
		data = await getPosts(req, uids, cids);
	} else if (showTopics) {
		data = await getTopics(req, uids, cids);
	}

	delete req.query._;
	res.render('dev-tracker', {
		showPosts,
		showTopics,
		posts: data.posts,
		topics: data.topics,
		groups: groupData,
		allCategoriesUrl: `dev-tracker${controllerHelpers.buildQueryString(req.query, 'cid', '')}`,
		allGroupsUrl: `dev-tracker${controllerHelpers.buildQueryString(req.query, 'group', '')}`,
		selectedGroup: groupData.find(g => g.name === req.query.group),
		selectedCategory: categoryData.selectedCategory,
		selectedCids: categoryData.selectedCids,
		pagination: pagination.create(page, data.pageCount, req.query),
	});
}

async function getPosts(req, uids, cids) {
	const sets = _.flatten(uids.map((uid) => {
		if (cids) {
			return cids.map(cid => `cid:${cid}:uid:${uid}:pids`);
		}
		return `uid:${uid}:posts`;
	}));
	const allPids = await db.getSortedSetRevRange(sets, 0, 499);
	const pids = await privileges.posts.filter('topics:read', allPids, req.uid);

	const pageCount = Math.max(1, Math.ceil(pids.length / meta.config.postsPerPage));
	const page = Math.max(1, parseInt(req.query.page, 10) || 1);

	const start = Math.max(0, (page - 1) * meta.config.postsPerPage);
	const stop = start + meta.config.postsPerPage - 1;
	const pagePids = page > pageCount ? [] : pids.slice(start, stop + 1);
	const postData = await posts.getPostSummaryByPids(pagePids, req.uid, { stripTags: false });
	return {
		posts: postData,
		pageCount,
	};
}

async function getTopics(req, uids, cids) {
	const sets = _.flatten(uids.map((uid) => {
		if (cids) {
			return cids.map(cid => `cid:${cid}:uid:${uid}:tids`);
		}
		return `uid:${uid}:topics`;
	}));
	const allTids = await db.getSortedSetRevRange(sets, 0, 499);
	const tids = await privileges.topics.filterTids('topics:read', allTids, req.uid);

	const pageCount = Math.max(1, Math.ceil(tids.length / meta.config.topicsPerPage));
	const page = Math.max(1, parseInt(req.query.page, 10) || 1);

	const start = Math.max(0, (page - 1) * meta.config.topicsPerPage);
	const stop = start + meta.config.topicsPerPage - 1;
	const pageTids = page > pageCount ? [] : tids.slice(start, stop + 1);
	const topicData = await topics.getTopicsByTids(pageTids, req.uid);
	topics.calculateTopicIndices(topicData, start);
	return {
		topics: topicData,
		pageCount,
	};
}

function getCidsArray(cid) {
	if (cid && !Array.isArray(cid)) {
		cid = [cid];
	}
	return cid && cid.map(cid => parseInt(cid, 10));
}

devTracker.addAdminNavigation = function (header) {
	header.plugins.push({
		route: '/plugins/dev-tracker',
		icon: 'fa-list',
		name: 'Dev Tracker',
	});
	return header;
};

devTracker.defineWidgetAreas = async function (areas) {
	areas = areas.concat([
		{
			name: 'Dev Tracker Page (Header)',
			template: 'dev-tracker.tpl',
			location: 'header',
		},
		{
			name: 'Dev Tracker Page (Left)',
			template: 'dev-tracker.tpl',
			location: 'left',
		},
		{
			name: 'Dev Tracker Page (Right)',
			template: 'dev-tracker.tpl',
			location: 'right',
		},
		{
			name: 'Dev Tracker Page (Footer)',
			template: 'dev-tracker.tpl',
			location: 'footer',
		},
	]);
	return areas;
};
