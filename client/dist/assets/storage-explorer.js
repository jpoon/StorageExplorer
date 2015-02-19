define('storage-explorer/adapters/application', ['exports', 'ember', 'ember-data', 'storage-explorer/config/environment'], function (exports, Ember, DS, config) {

	'use strict';

	exports['default'] = DS['default'].RESTAdapter.extend({
		host: config['default'].APP.apiHost,

		ajax: function (url, type, hash) {
			if (Ember['default'].isEmpty(hash)) {
				hash = {};
			}

			if (Ember['default'].isEmpty(hash.data)) {
				hash.data = {};
			}

			hash.data.account = localStorage.storageAccountName;
			hash.data.key = localStorage.storageAccountKey;

			return this._super(url, type, hash);
		}

		/*
	 headers: function() {
	 	return {
	 		"storage_account_name": localStorage.storageAccountName,
	         "storage_account_key": localStorage.storageAccountKey
	 	};
	 }.property().volatile()
	 */
	});

});
define('storage-explorer/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'storage-explorer/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('storage-explorer/controllers/application', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Controller.extend({
        init: function () {
            this._super();
        },

        showProgress: false,

        loadDisabled: (function () {
            var account = this.get("accountName"),
                key = this.get("accountKey");

            if (account && key) {
                return false;
            }

            return true;
        }).property("accountName", "accountKey"),

        storageAccountName: (function () {
            var name = this.get("accountName");

            if (!name) {
                return;
            }

            name = "sueandjason";

            localStorage.storageAccountName = name;
            return encodeURIComponent(name);
        }).property("accountName"),

        storageAccountKey: (function () {
            var key = this.get("accountKey");

            if (!key) {
                return;
            }

            key = "VdSeV70ua7RcuTMW7vPDhAU+Kyzo/hBOb6oOt8zQ5oU4wFrrwOGVEa8bYxfcEcm2G6HeKDh48OSpOUqDQ7tHOA==";

            localStorage.storageAccountKey = key;
            return encodeURIComponent(key);
        }).property("accountKey"),

        actions: {
            load: function () {
                this.transitionToRoute("tables");
            }
        }
    });

});
define('storage-explorer/controllers/error', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var ErrorController = Ember['default'].Controller.extend({
        code: (function () {
            return this.get("content.status") > 200 ? this.get("content.status") : 500;
        }).property("content.status"),

        response: (function () {
            return this.get("content.responseText") || this.get("content.statusText");
        }).property("content.responseText", "content.statusText") });

    exports['default'] = ErrorController;

});
define('storage-explorer/controllers/row', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ArrayController.extend({
    //  itemController: 'tableRow',

    showProgress: false });


  /*
  rowCount: function(){
    return this.get('table.length');
  }.property('table')

  rowHeader: function(){
    var header = {};
     this.get('rows').forEach(function(row) {
      Ember.$.map(row, function(value, key) {
        header[key] = key;
      });
    });
     return Object.keys(header);
  }.property('rows')
   /*
  rowData: function(){
    var rows = [];
     var rowHeader = this.get('rowHeader');
     this.get('rows').forEach(function(row) {
        console.log(row);
        rows.push(Ember.$.map(rowHeader, function(header) {
            var value = row[header];
            if (value === undefined) {
              value = '';
            }
            return value;
        }));
    });
     return rows;
  }.property('rows', 'rowHeader')
  */

});
define('storage-explorer/initializers/app-version', ['exports', 'storage-explorer/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;

  exports['default'] = {
    name: "App Version",
    initialize: function (container, application) {
      var appName = classify(application.toString());
      Ember['default'].libraries.register(appName, config['default'].APP.version);
    }
  };

});
define('storage-explorer/initializers/export-application-global', ['exports', 'ember', 'storage-explorer/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  };

  exports['default'] = {
    name: "export-application-global",

    initialize: initialize
  };

});
define('storage-explorer/models/row', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    var row = DS['default'].Model.extend({
        partitionKey: DS['default'].attr("string"),
        rowKey: DS['default'].attr("string"),
        table: DS['default'].belongsTo("table")
    });

    exports['default'] = row;

});
define('storage-explorer/models/table', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    var table = DS['default'].Model.extend({
        tableName: DS['default'].attr("string"),
        rows: DS['default'].hasMany("row")
    });

    exports['default'] = table;

});
define('storage-explorer/router', ['exports', 'ember', 'storage-explorer/config/environment'], function (exports, Ember, config) {

    'use strict';

    var Router = Ember['default'].Router.extend({
        location: config['default'].locationType
    });

    Router.map(function () {
        this.resource("tables", { path: "/tables" }, function () {
            this.resource("table", { path: "/:tableName" });
        });
    });

    exports['default'] = Router;

});
define('storage-explorer/routes/table', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Route.extend({
        beforeModel: function () {
            var name = this.controllerFor("application").get("storageAccountName");
            var key = this.controllerFor("application").get("storageAccountKey");

            if (!name || !key) {
                this.transitionTo("application");
            }

            this.controllerFor("tables").set("showProgress", true);
        },

        model: function (params) {
            return this.store.fetch("table", params.tableName);
        },

        afterModel: function () {
            this.controllerFor("tables").set("showProgress", false);
        } });

});
define('storage-explorer/routes/tables', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Route.extend({
        beforeModel: function () {
            var name = this.controllerFor("application").get("storageAccountName");
            var key = this.controllerFor("application").get("storageAccountKey");

            if (!name || !key) {
                this.transitionTo("application");
            }

            this.controllerFor("application").set("showProgress", true);
        },

        model: function () {
            return this.store.find("table");
        },

        afterModel: function () {
            this.controllerFor("application").set("showProgress", false);
        },

        actions: {
            error: function () {
                this.controllerFor("application").set("showProgress", false);
                return true;
            }
        }
    });

});
define('storage-explorer/serializers/row', ['exports', 'ember-data'], function (exports, DS) {

	'use strict';

	exports['default'] = DS['default'].RESTSerializer.extend(DS['default'].EmbeddedRecordsMixin, {
		normalize: function (type, hash) {
			hash.id = hash.partitionKey + "/" + hash.rowKey;
			return this._super(type, hash);
		}
	});

});
define('storage-explorer/serializers/table', ['exports', 'ember-data'], function (exports, DS) {

	'use strict';

	exports['default'] = DS['default'].RESTSerializer.extend(DS['default'].EmbeddedRecordsMixin, {
		primaryKey: "tableName",

		attrs: {
			rows: { embedded: "always" } }
	});

});
define('storage-explorer/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","progress progress-striped active");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","progress-bar");
          dom.setAttribute(el2,"style","width: 100%");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("header");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","navbar navbar-default");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","navbar-header");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"type","button");
        dom.setAttribute(el4,"class","navbar-toggle");
        dom.setAttribute(el4,"data-toggle","collapse");
        dom.setAttribute(el4,"data-target",".navbar-responsive-collapse");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","icon-bar");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","icon-bar");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","icon-bar");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"class","navbar-brand");
        var el5 = dom.createTextNode("Azure Table Storage Explorer");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","navbar-collapse collapse navbar-responsive-collapse");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4,"class","nav navbar-nav navbar-right");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createElement("a");
        dom.setAttribute(el6,"href","https://github.com/jpoon/StorageExplorer");
        var el7 = dom.createTextNode("GitHub");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        var el6 = dom.createElement("a");
        dom.setAttribute(el6,"href","javascript:void(0)");
        dom.setAttribute(el6,"data-toggle","modal");
        dom.setAttribute(el6,"data-target","#complete-dialog");
        var el7 = dom.createTextNode("Security");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment(" Modal ");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","complete-dialog");
        dom.setAttribute(el1,"class","modal fade");
        dom.setAttribute(el1,"tabindex","-1");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","modal-dialog");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","modal-content");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","modal-header");
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"type","button");
        dom.setAttribute(el5,"class","close");
        dom.setAttribute(el5,"data-dismiss","modal");
        dom.setAttribute(el5,"aria-hidden","true");
        var el6 = dom.createTextNode("×");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h4");
        dom.setAttribute(el5,"class","modal-title");
        var el6 = dom.createTextNode("Security Disclaimer");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","modal-body");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("\n            Storage account credentials are never stored on the server and are transmitted securely (via HTTPS).\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","modal-footer");
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"class","btn btn-primary");
        dom.setAttribute(el5,"data-dismiss","modal");
        var el6 = dom.createTextNode("Dismiss");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        var el4 = dom.createTextNode("Storage Account Information");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body row");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("form");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group col-md-2");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group col-md-10");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-md-2 col-md-offset-10 text-right");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"type","submit");
        dom.setAttribute(el5,"class","btn btn-primary btn-raised");
        var el6 = dom.createTextNode("Load");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, element = hooks.element, get = hooks.get, inline = hooks.inline, block = hooks.block, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [6]);
        var element1 = dom.childAt(element0, [3, 1]);
        var element2 = dom.childAt(element1, [5, 1]);
        var morph0 = dom.createMorphAt(dom.childAt(element1, [1]),0,1);
        var morph1 = dom.createMorphAt(dom.childAt(element1, [3]),0,1);
        var morph2 = dom.createMorphAt(element0,4,-1);
        var morph3 = dom.createMorphAt(fragment,7,8,contextualElement);
        element(env, element1, context, "action", ["load"], {"on": "submit"});
        inline(env, morph0, context, "input", [], {"value": get(env, context, "accountName"), "type": "text", "class": "form-control floating-label", "placeholder": "storage account name"});
        inline(env, morph1, context, "input", [], {"value": get(env, context, "accountKey"), "type": "text", "class": "form-control floating-label", "placeholder": "storage account key"});
        element(env, element2, context, "bind-attr", [], {"disabled": get(env, context, "loadDisabled")});
        block(env, morph2, context, "if", [get(env, context, "showProgress")], {}, child0, null);
        content(env, morph3, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('storage-explorer/templates/error', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","alert alert-dismissable alert-warning");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"type","button");
        dom.setAttribute(el2,"class","close");
        dom.setAttribute(el2,"data-dismiss","alert");
        var el3 = dom.createTextNode("×");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("strong");
        var el3 = dom.createTextNode("Oh snap!");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode(" ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode(" (");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode(")\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var morph0 = dom.createMorphAt(element0,4,5);
        var morph1 = dom.createMorphAt(element0,5,6);
        content(env, morph0, context, "response");
        content(env, morph1, context, "code");
        return fragment;
      }
    };
  }()));

});
define('storage-explorer/templates/table', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("th");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),-1,-1);
          content(env, morph0, context, "item");
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("td");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),-1,-1);
            content(env, morph0, context, "column");
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n                    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("                    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),-1,-1);
          var morph1 = dom.createMorphAt(element0,2,3);
          content(env, morph0, context, "_view.contentIndex");
          block(env, morph1, context, "each", [get(env, context, "row")], {"keyword": "column"}, child0, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createElement("div");
        dom.setAttribute(el0,"class","panel panel-default");
        var el1 = dom.createTextNode("\n    ");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-heading");
        var el2 = dom.createTextNode("\n        ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode(" ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("i");
        var el3 = dom.createTextNode("(");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(")");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n    ");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel-body row");
        var el2 = dom.createTextNode("\n        ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("table");
        dom.setAttribute(el2,"class","table table-striped table-hover");
        var el3 = dom.createTextNode("\n            ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("thead");
        var el4 = dom.createTextNode("\n                ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("tr");
        var el5 = dom.createTextNode("\n                    ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("th");
        var el6 = dom.createTextNode("#");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("                ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n            ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tbody");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("            ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element1 = dom.childAt(fragment, [1]);
        var element2 = dom.childAt(fragment, [3, 1]);
        var morph0 = dom.createMorphAt(element1,0,1);
        var morph1 = dom.createMorphAt(dom.childAt(element1, [2]),0,1);
        var morph2 = dom.createMorphAt(dom.childAt(element2, [1, 1]),2,3);
        var morph3 = dom.createMorphAt(dom.childAt(element2, [3]),0,1);
        content(env, morph0, context, "name");
        content(env, morph1, context, "rowCount");
        block(env, morph2, context, "each", [get(env, context, "rowHeader")], {"keyword": "item"}, child0, null);
        block(env, morph3, context, "each", [get(env, context, "rowData")], {"keyword": "row"}, child1, null);
        return fragment;
      }
    };
  }()));

});
define('storage-explorer/templates/tables', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("               ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("p");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),-1,-1);
            content(env, morph0, context, "table.id");
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          block(env, morph0, context, "link-to", ["table", get(env, context, "table.id")], {}, child0, null);
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","progress progress-striped active");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","progress-bar");
          dom.setAttribute(el2,"style","width: 100%");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n        Tables ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("i");
        var el4 = dom.createTextNode("(");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(")");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [1, 1]),0,1);
        var morph1 = dom.createMorphAt(dom.childAt(element0, [3]),0,1);
        var morph2 = dom.createMorphAt(element0,4,-1);
        var morph3 = dom.createMorphAt(fragment,1,2,contextualElement);
        content(env, morph0, context, "controller.length");
        block(env, morph1, context, "each", [get(env, context, "controller")], {"keyword": "table"}, child0, null);
        block(env, morph2, context, "if", [get(env, context, "showProgress")], {}, child1, null);
        content(env, morph3, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('storage-explorer/tests/adapters/application.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/application.js should pass jshint', function() { 
    ok(true, 'adapters/application.js should pass jshint.'); 
  });

});
define('storage-explorer/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('storage-explorer/tests/controllers/application.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/application.js should pass jshint', function() { 
    ok(true, 'controllers/application.js should pass jshint.'); 
  });

});
define('storage-explorer/tests/controllers/error.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/error.js should pass jshint', function() { 
    ok(true, 'controllers/error.js should pass jshint.'); 
  });

});
define('storage-explorer/tests/controllers/row.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/row.js should pass jshint', function() { 
    ok(true, 'controllers/row.js should pass jshint.'); 
  });

});
define('storage-explorer/tests/helpers/resolver', ['exports', 'ember/resolver', 'storage-explorer/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('storage-explorer/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('storage-explorer/tests/helpers/start-app', ['exports', 'ember', 'storage-explorer/app', 'storage-explorer/router', 'storage-explorer/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var App;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      App = Application['default'].create(attributes);
      App.setupForTesting();
      App.injectTestHelpers();
    });

    return App;
  }

});
define('storage-explorer/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('storage-explorer/tests/models/row.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/row.js should pass jshint', function() { 
    ok(true, 'models/row.js should pass jshint.'); 
  });

});
define('storage-explorer/tests/models/table.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/table.js should pass jshint', function() { 
    ok(true, 'models/table.js should pass jshint.'); 
  });

});
define('storage-explorer/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('storage-explorer/tests/routes/table.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/table.js should pass jshint', function() { 
    ok(true, 'routes/table.js should pass jshint.'); 
  });

});
define('storage-explorer/tests/routes/tables.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/tables.js should pass jshint', function() { 
    ok(true, 'routes/tables.js should pass jshint.'); 
  });

});
define('storage-explorer/tests/serializers/row.jshint', function () {

  'use strict';

  module('JSHint - serializers');
  test('serializers/row.js should pass jshint', function() { 
    ok(true, 'serializers/row.js should pass jshint.'); 
  });

});
define('storage-explorer/tests/serializers/table.jshint', function () {

  'use strict';

  module('JSHint - serializers');
  test('serializers/table.js should pass jshint', function() { 
    ok(true, 'serializers/table.js should pass jshint.'); 
  });

});
define('storage-explorer/tests/test-helper', ['storage-explorer/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

	document.write("<div id=\"ember-testing-container\"><div id=\"ember-testing\"></div></div>");

	QUnit.config.urlConfig.push({ id: "nocontainer", label: "Hide container" });
	var containerVisibility = QUnit.urlParams.nocontainer ? "hidden" : "visible";
	document.getElementById("ember-testing-container").style.visibility = containerVisibility;

});
define('storage-explorer/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
/* jshint ignore:start */

define('storage-explorer/config/environment', ['ember'], function(Ember) {
  var prefix = 'storage-explorer';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("storage-explorer/tests/test-helper");
} else {
  require("storage-explorer/app")["default"].create({"apiHost":"http://localhost:3000","LOG_RESOLVER":true,"LOG_ACTIVE_GENERATION":true,"LOG_TRANSITIONS":true,"LOG_TRANSITIONS_INTERNAL":true,"LOG_VIEW_LOOKUPS":true,"name":"storage-explorer","version":"0.0.0.ace9f56b"});
}

/* jshint ignore:end */
//# sourceMappingURL=storage-explorer.map