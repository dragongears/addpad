_.mixin({
	gsub: function (source, pattern, replacement) {
		var result = '', match, replaced;
		while (source.length > 0) {
			if (match = source.match(pattern)) {
				result += source.slice(0, match.index);
				replaced = replacement(match);
				result += replaced == null ? '' : String(replaced);
				source = source.slice(match.index + match[0].length);
			} else {
				result += source;
				source = '';
			}
		}
		return result;
	}
});

enyo.kind({
	name: "enyo.Backbone",
	kind: "Component",
	create: function () {
		this.inherited(arguments);
	},
	statics: {
		translateEvent: function (ctl, evtin, evtout) {
			ctl.collection.on(evtin, enyo.bind(ctl, function () {
				ctl.bubble(evtout, arguments);
			}));
		}
	}
});

enyo.kind({
	name: "PageModel",
	kind: "enyo.Backbone",
	create: function () {
		this.inherited(arguments);
		this.model = Backbone.Model.extend({
			defaults: {
				title: "",
				content: ""
			},
			getTotal: function () {
				var total = 0;

				_.gsub(this.attributes.content, /[-+]?\d+(\.\d+)?/, function (num) {
					total += parseFloat(num);
				});

				return total;
			},
			getTitle: function () {
				var show = this.attributes.title;
				var content = this.attributes.content;

				if (show == "") {
					var len = content.indexOf('\n');
					if (len !== 0 && content.length !== 0) {
						if (len == -1 || len > 60) {
							len = 59;
						}
						show = content.substr(0, len);
					} else {
						show = '<<Untitled>>';
					}
				}

				return show;
			}
		});
	}

});

enyo.kind({
	name: "PadCollection",
	kind: "enyo.Backbone",
	components: [
		{name: "pm", kind: "PageModel"}
	],
	create: function () {
		this.inherited(arguments);
		var pageModel = this.$.pm.model;
		var pc = Backbone.Collection.extend({
			model: pageModel,
			localStorage: new Store("addpad")
		});
		this.collection = new pc();

		enyo.Backbone.translateEvent(this, "change:content", "onContentChange");
		enyo.Backbone.translateEvent(this, "change:title", "onTitleChange");
		enyo.Backbone.translateEvent(this, "add", "onAddPage");
	}
});
