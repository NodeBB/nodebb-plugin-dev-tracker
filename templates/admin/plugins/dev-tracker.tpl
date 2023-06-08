
<div class="acp-page-container">
	<!-- IMPORT admin/partials/settings/header.tpl -->

	<div class="row m-0">
		<div id="spy-container" class="col-12 px-0 mb-4" tabindex="0">
			<form role="form" class="dev-tracker-settings">
				<label class="form-label" for="devTrackerGroups">Select groups you wish to display on the Dev Tracker Page</label>
				<select class="form-control" id="devTrackerGroups" name="devTrackerGroups" multiple size="20">
					{{{ each groups }}}
					<option value="{./displayName}">{./displayName}</option>
					{{{ end }}}
				</select>
			</form>
		</div>
	</div>
</div>
