<div data-widget-area="header">
	{{{each widgets.header}}}
	{{widgets.header.html}}
	{{{end}}}
</div>

<div class="dev-tracker flex-fill">
	<div class="topic-list-header d-flex justify-content-end py-2 mb-2 gap-1">
		<!-- IMPORT partials/category/filter-dropdown-right.tpl -->
		<!-- IMPORT partials/groups/filter-dropdown-right.tpl -->
	</div>
	<div class="row">
		<div data-widget-area="left" class="col-lg-3 col-sm-12 {{{ if !widgets.left.length }}}hidden{{{ end }}}">
			{{{each widgets.left}}}
			{{widgets.left.html}}
			{{{end}}}
		</div>
		{{{ if (widgets.left.length && widgets.right.length) }}}
		<div class="col-lg-6 col-sm-12">
		{{{ end }}}
		{{{ if (!widgets.left.length && !widgets.right.length) }}}
		<div class="col-lg-12 col-sm-12">
		{{{ end }}}
		{{{ if ((widgets.left.length && !widgets.right.length) || (!widgets.left.length && widgets.right.length)) }}}
		<div class="col-lg-9 col-sm-12">
		{{{ end }}}
			<div class="d-flex flex-column flex-md-row">
				<div class="flex-shrink-0 pe-2 border-end-md text-sm mb-3 flex-basis-md-200">
					<div class="nav sticky-md-top d-flex flex-row flex-md-column flex-wrap gap-1" style="top: 1rem; z-index: 1;">
						<a href="dev-tracker?posts=1" class="btn btn-sm fw-semibold {{{ if showPosts }}}active btn-primary{{{ else }}}btn-outline-secondary{{{ end }}}">
							[[global:posts]]
						</a>
						<a href="dev-tracker?topics=1" class="btn btn-sm fw-semibold {{{ if showTopics }}}active btn-primary{{{ else }}}btn-outline-secondary{{{ end }}}">
							[[global:topics]]
						</a>
					</div>
				</div>
				<div class="flex-grow-1 ps-md-2 ps-lg-5" style="min-width:0;">
					{{{ if showPosts }}}
					{{{ if !posts.length  }}}
					<div class="alert alert-warning text-center">[[dev-tracker:no-posts-found]]</div>
					{{{ end }}}

					<!-- IMPORT partials/posts_list.tpl -->
					{{{ end }}}

					{{{ if showTopics }}}
					{{{ if !topics.length  }}}
					<div class="alert alert-warning text-center">[[dev-tracker:no-topics-found]]</div>
					{{{ end }}}
					<!-- IMPORT partials/topics_list.tpl -->
					{{{ end }}}


					{{{ if config.usePagination }}}
					<!-- IMPORT partials/paginator.tpl -->
					{{{ end }}}
				</div>
			</div>
		</div>

		<div data-widget-area="right" class="col-lg-3 col-sm-12 {{{ if !widgets.right.length }}}hidden{{{ end }}}">
			{{{each widgets.right}}}
			{{widgets.right.html}}
			{{{end}}}
		</div>
	</div>
</div>

<div data-widget-area="footer">
	{{{each widgets.footer}}}
	{{widgets.footer.html}}
	{{{end}}}
</div>
