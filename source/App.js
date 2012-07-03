enyo.kind({
	name: "App",
	kind: "Panels",
	classes: "panels enyo-unselectable",
	realtimeFit: true,
	arrangerKind: "CollapsingArranger",
	components: [
		{name: "pad", kind: "PadCollection"},
		{layoutKind: "FittableRowsLayout", components: [
			{kind: "onyx.Toolbar", components: [
				{content: "Test Pad"}
			]},
			{kind: "List", fit: true, touch: true, onSetupItem: "setupListItem", components: [
				{name: "item", style: "padding: 10px;", classes: "item enyo-border-box", ontap: "listItemTap", components: [
					{name: "listItemTitle", classes: "title"},
					{name: "listItemTotal", classes: "total"}
				]}
			]},
			{kind: "onyx.Toolbar", components: [
				{name: "addPage", kind: "onyx.Button", content: "Add page"}
			]}

		]},
		{name: "pageView", fit: true, kind: "FittableRows", classes: "enyo-fit main", components: [
			{name: "backToolbar", kind: "onyx.Toolbar", showing: false, components: [
				{kind: "onyx.Button", content: "Back", ontap: "showList"}
			]},
			{fit: true, style: "position: relative;", components: [
				{name: "page", kind: "onyx.TextArea", classes: "enyo-fill", placeholder: "Enter text here"}
			]},
			{kind: "onyx.Toolbar", components: [
				{name: "total", kind: "onyx.Button", content: "0"}
			]}
		]}
	],
	rendered: function() {
		this.inherited(arguments);
//		this.search();
		this.$.list.setCount(this.$.pad.collection.size());
		if (this.page == 0) {
			this.$.list.reset();
		} else {
			this.$.list.refresh();
		}
	},
	reflow: function() {
		this.inherited(arguments);
		var backShowing = this.$.backToolbar.showing;
		this.$.backToolbar.setShowing(enyo.Panels.isScreenNarrow());
		if (this.$.backToolbar.showing != backShowing) {
			this.$.pageView.resized();
		}
	},
	setupListItem: function(inSender, inEvent) {
		var i = inEvent.index;
		var item = this.$.pad.collection.at(i);
		this.$.item.addRemoveClass("onyx-selected", inSender.isSelected(inEvent.index));
		this.$.listItemTitle.setContent(item.get("title") || "Untitled");
		this.$.listItemTotal.setContent(item.getTotal());
	},
	listItemTap: function(inSender, inEvent) {
		if (enyo.Panels.isScreenNarrow()) {
			this.setIndex(1);
		}
//		this.$.imageSpinner.show();
		var item = this.$.pad.collection.at(inEvent.index);
		this.$.page.setValue(item.get("content"));
//		this.$.flickrImage.hide();
//		this.$.flickrImage.setSrc(item.original);

	},
	showList: function() {
		this.setIndex(0);
	}
});

new App({fit: true}).write();

