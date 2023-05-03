<div class="row">
	<div class="col-sm-2 col-12 settings-header">Settings</div>
	<div class="col-sm-10 col-12">
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

<!-- IMPORT admin/partials/save_button.tpl -->
