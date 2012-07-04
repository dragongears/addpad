enyo.kind({
	name: "App",
	kind: "Panels",
	classes: "panels enyo-unselectable",
	realtimeFit: true,
	arrangerKind: "CollapsingArranger",
	currentPageModel: null,
	currentPageIndex: null,
	components: [
		{name: "pad", kind: "PadCollection", onContentChange: "doContentChange"},
		{layoutKind: "FittableRowsLayout", components: [
			{kind: "onyx.Toolbar", components: [
				{content: "Test Pad"}
			]},
			{name: "pageList", kind: "List", fit: true, touch: true, onSetupItem: "setupListItem", components: [
				{name: "item", style: "padding: 10px;", classes: "item enyo-border-box", ontap: "listItemTap", components: [
					{name: "listItemTitle", classes: "title"},
					{name: "listItemTotal", classes: "total"}
				]}
			]},
			{kind: "onyx.Toolbar", components: [
				{name: "addPage", kind: "onyx.Button", content: "New page"}
			]}

		]},
		{name: "pageView", fit: true, kind: "FittableRows", classes: "enyo-fit main", components: [
			{name: "backToolbar", kind: "onyx.Toolbar", showing: false, components: [
				{kind: "onyx.Button", content: "Back", ontap: "showList"}
			]},
			{fit: true, style: "position: relative;", components: [
				{name: "page", kind: "onyx.TextArea", classes: "enyo-fill", placeholder: "Enter text here", onkeyup: "doPageChange"}
			]},
			{kind: "onyx.Toolbar", components: [
				{name: "total", kind: "onyx.Button", content: "0"}
			]}
		]}
	],
	rendered: function() {
		this.inherited(arguments);
		this.$.pageList.setCount(this.$.pad.collection.size());
		if (this.page == 0) {
			this.$.pageList.reset();
		} else {
			this.$.pageList.refresh();
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
		this.currentPageModel = this.$.pad.collection.at(inEvent.index);
		this.currentPageIndex = inEvent.index;
		this.$.page.setValue(this.currentPageModel.get("content"));
		this.$.total.setContent(this.currentPageModel.getTotal());
	},
	showList: function() {
		this.setIndex(0);
	},
	doPageChange: function() {
		enyo.job("updatePageModelContent", enyo.bind(this, function() {
			this.currentPageModel.set({content: this.$.page.getValue()});
		}), 500);
	},
	doContentChange: function() {
		this.$.total.setContent(this.currentPageModel.getTotal());
		this.$.pageList.renderRow(this.currentPageIndex);
	}
});

new App({fit: true}).write();

