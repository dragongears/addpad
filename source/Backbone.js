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
	name: "EnyoBackbone",
	kind: "Component",
	create: function() {
		this.inherited(arguments);
	},
	translateEvent: function(evtin, evtout) {
		this.collection.on(evtin, enyo.bind(this, function() {
			var args = arguments;
			this.bubble(evtout, args);
		}));
	}
});

enyo.kind({
	name: "PageModel",
	kind: "EnyoBackbone",
	create: function() {
		this.inherited(arguments);
		this.model = Backbone.Model.extend({
			defaults: {
				title: "",
				content: ""
			},
			getTotal: function() {
				var total = 0;

				_.gsub(this.attributes.content, /[-+]?\d+(\.\d+)?/, function(num) {
					total += parseFloat(num);
				});

				return total;
			}
		});
	}

});

enyo.kind({
	name: "PadCollection",
	kind: "EnyoBackbone",
	components: [
		{name: "pm", kind: "PageModel"}
	],
	create: function() {
		this.inherited(arguments);
		var pageModel = this.$.pm.model;
		var pc = Backbone.Collection.extend({
				  model: pageModel
				});
		this.collection = new pc([
			{
				title: "Test item 1",
				content: "This is a test 1 2 3"
			},
			{
				title: "Test item 2",
				content: "This is a test 4 5 6"
			},
			{
				title: "Test item 3",
				content: "This is a test 7 8 9"
			}
		]);
		this.translateEvent("change:content", "onContentChange");
		this.translateEvent("change:title", "onTitleChange");
		this.translateEvent("add", "onAddPage");
	}
});
