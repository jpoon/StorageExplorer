eval("//# sourceURL=vendor/ember-cli/loader.js");

;eval("define(\"storage-explorer/app\", \n  [\"ember\",\"ember/resolver\",\"ember/load-initializers\",\"storage-explorer/config/environment\",\"exports\"],\n  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    var Resolver = __dependency2__[\"default\"];\n    var loadInitializers = __dependency3__[\"default\"];\n    var config = __dependency4__[\"default\"];\n\n    Ember.MODEL_FACTORY_INJECTIONS = true;\n\n    var App = Ember.Application.extend({\n      modulePrefix: config.modulePrefix,\n      podModulePrefix: config.podModulePrefix,\n      Resolver: Resolver\n    });\n\n    loadInitializers(App, config.modulePrefix);\n\n    __exports__[\"default\"] = App;\n  });//# sourceURL=storage-explorer/app.js");

;eval("define(\"storage-explorer/controllers/application\", \n  [\"ember\",\"exports\"],\n  function(__dependency1__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n\n    \r\n    __exports__[\"default\"] = Ember.Controller.extend({\r\n        init: function() {\r\n          this._super(); \r\n        },\r\n    \r\n        showProgress: false,\r\n    \r\n        loadDisabled: function() {\r\n          var account = this.get(\'accountName\'),\r\n              key = this.get(\'accountKey\');\r\n    \r\n          if (account && key) {\r\n            return false;\r\n          }\r\n    \r\n          return true;\r\n        }.property(\'accountName\', \'accountKey\'),\r\n    \r\n        storageAccountName: function() {\r\n          var name = this.get(\'accountName\');\r\n    \r\n          if (!name) {\r\n            return;\r\n          }\r\n    \r\n          return encodeURIComponent(this.get(\'accountName\'));\r\n        }.property(\'accountName\'),\r\n    \r\n        storageAccountKey: function() {\r\n          var key = this.get(\'accountKey\');\r\n    \r\n          if (!key) {\r\n            return;\r\n          }\r\n    \r\n          return encodeURIComponent(key);\r\n        }.property(\'accountKey\'),\r\n    \r\n        actions: {\r\n            load: function() {\r\n                this.transitionToRoute(\'tables\'); \r\n            }\r\n        }\r\n    });\n  });//# sourceURL=storage-explorer/controllers/application.js");

;eval("define(\"storage-explorer/controllers/table\", \n  [\"ember\",\"exports\"],\n  function(__dependency1__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n\n    \r\n    __exports__[\"default\"] = Ember.ObjectController.extend({\r\n      showProgress: false,\r\n    \r\n      rowCount: function() {\r\n        return this.get(\'rows.length\');\r\n      }.property(\'rows\'),\r\n    \r\n      rowHeader: function() {\r\n        var header = {};\r\n    \r\n        this.get(\'rows\').forEach(function(row) {\r\n          Ember.$.map(row, function(value, key) {\r\n            header[key] = value;\r\n          });\r\n        });\r\n    \r\n        return Object.keys(header);\r\n    \r\n        return Ember.$.map(this.get(\'rows\')[0], function(value, key) {\r\n            return [key];\r\n        });\r\n      }.property(\'rows\'),\r\n    \r\n      rowData: function() {\r\n        var rows = [];\r\n    \r\n        this.get(\'rows\').forEach(function(row) {\r\n            rows.push(Ember.$.map(row, function(value, key) {\r\n                return [value];\r\n            }));\r\n        });\r\n    \r\n        return rows;\r\n      }.property(\'rows\')\r\n    \r\n    });\n  });//# sourceURL=storage-explorer/controllers/table.js");

;eval("define(\"storage-explorer/controllers/tables\", \n  [\"ember\",\"exports\"],\n  function(__dependency1__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n\n    \r\n    __exports__[\"default\"] = Ember.ObjectController.extend({\r\n        tablesCount: function() {\r\n            return this.get(\'tables.length\');\r\n        }.property(\'tables\')\r\n    });\n  });//# sourceURL=storage-explorer/controllers/tables.js");

;eval("define(\"storage-explorer/initializers/export-application-global\", \n  [\"ember\",\"storage-explorer/config/environment\",\"exports\"],\n  function(__dependency1__, __dependency2__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    var config = __dependency2__[\"default\"];\n\n    function initialize(container, application) {\n      var classifiedName = Ember.String.classify(config.modulePrefix);\n\n      if (config.exportApplicationGlobal) {\n        window[classifiedName] = application;\n      }\n    };\n    __exports__.initialize = initialize;\n    __exports__[\"default\"] = {\n      name: \'export-application-global\',\n\n      initialize: initialize\n    };\n  });//# sourceURL=storage-explorer/initializers/export-application-global.js");

;eval("define(\"storage-explorer/router\", \n  [\"ember\",\"storage-explorer/config/environment\",\"exports\"],\n  function(__dependency1__, __dependency2__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    var config = __dependency2__[\"default\"];\n\n    var Router = Ember.Router.extend({\n      location: config.locationType\n    });\n\n    Router.map(function() {\n        this.resource(\"tables\", { path: \'/tables\' }, function() {\n            this.resource(\"table\", { path: \"/:tableName\" });\n        });\n    });\n\n    __exports__[\"default\"] = Router;\n  });//# sourceURL=storage-explorer/router.js");

;eval("define(\"storage-explorer/routes/table\", \n  [\"ember\",\"storage-explorer/config/environment\",\"exports\"],\n  function(__dependency1__, __dependency2__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n\n    var config = __dependency2__[\"default\"];\n\n    \r\n    __exports__[\"default\"] = Ember.Route.extend({\r\n        beforeModel: function() {\r\n            var name = this.controllerFor(\'application\').get(\'storageAccountName\');\r\n            var key = this.controllerFor(\'application\').get(\'storageAccountKey\');\r\n    \r\n            if (!name || !key) {\r\n                this.transitionTo(\'application\');\r\n            }\r\n    \r\n            this.controllerFor(\'tables\').set(\'showProgress\', true);\r\n        },\r\n    \r\n        model: function(params) {\r\n            var that = this;\r\n            var storageAccountName = this.controllerFor(\"application\").get(\'storageAccountName\');\r\n            var storageAccountKey = this.controllerFor(\"application\").get(\'storageAccountKey\');\r\n    \r\n            var url = config.APP.apiHost + \'/tables/\' + params.tableName + \'?account=\' + storageAccountName + \'&key=\' + storageAccountKey;\r\n            Ember.Logger.info(\'url\', url);\r\n            \r\n            var data = Ember.$.getJSON(url);\r\n    \r\n            Ember.run.later(function() {\r\n                that.controllerFor(\"tables\").set(\'showProgress\', false);\r\n                data.abort();\r\n            }, 5000);\r\n    \r\n            return data;\r\n        },\r\n    \r\n        afterModel: function() {\r\n            this.controllerFor(\"tables\").set(\'showProgress\', false);\r\n        },\r\n    \r\n        actions: {\r\n            error: function(error, transition) {\r\n                console.log(error);\r\n                if (error && error.status === 400) {\r\n                    // error substate and parent routes do not handle this error\r\n                    return this.transitionTo(\'modelNotFound\');\r\n                }\r\n            }\r\n        }\r\n    });\n  });//# sourceURL=storage-explorer/routes/table.js");

;eval("define(\"storage-explorer/routes/tables\", \n  [\"ember\",\"storage-explorer/config/environment\",\"exports\"],\n  function(__dependency1__, __dependency2__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n\n    var config = __dependency2__[\"default\"];\n\n    \r\n    __exports__[\"default\"] = Ember.Route.extend({\r\n        beforeModel: function() {\r\n            var name = this.controllerFor(\'application\').get(\'storageAccountName\');\r\n            var key = this.controllerFor(\'application\').get(\'storageAccountKey\');\r\n    \r\n            if (!name || !key) {\r\n                this.transitionTo(\'application\');\r\n            }\r\n    \r\n            this.controllerFor(\"application\").set(\'showProgress\', true);\r\n        },\r\n    \r\n        model: function() {\r\n            var that = this;\r\n            var storageAccountName = this.controllerFor(\"application\").get(\'storageAccountName\');\r\n            var storageAccountKey = this.controllerFor(\"application\").get(\'storageAccountKey\');\r\n    \r\n            var url = config.APP.apiHost + \'/tables?account=\' + storageAccountName + \'&key=\' + storageAccountKey;\r\n            Ember.Logger.info(\'url\', url);\r\n            \r\n            var data = Ember.$.getJSON(url);\r\n    \r\n            Ember.run.later(function() {\r\n                that.controllerFor(\"application\").set(\'showProgress\', false);\r\n                data.abort();\r\n            }, 5000);\r\n    \r\n            return data;\r\n        },\r\n    \r\n        afterModel: function() {\r\n            this.controllerFor(\"application\").set(\'showProgress\', false);\r\n        },\r\n    \r\n        actions: {\r\n            error: function(error, transition) {\r\n                console.log(error);\r\n                if (error && error.status === 400) {\r\n                    // error substate and parent routes do not handle this error\r\n                    return this.transitionTo(\'modelNotFound\');\r\n                }\r\n            }\r\n        }\r\n    });\n  });//# sourceURL=storage-explorer/routes/tables.js");

;eval("define(\"storage-explorer/templates/application\", \n  [\"ember\",\"exports\"],\n  function(__dependency1__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    __exports__[\"default\"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {\n    this.compilerInfo = [4,\'>= 1.0.0\'];\n    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};\n      var buffer = \'\', stack1, helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;\n\n    function program1(depth0,data) {\n      \n      \n      data.buffer.push(\"\\r\\n    <div class=\\\"progress progress-striped active\\\">\\r\\n        <div class=\\\"progress-bar\\\" style=\\\"width: 100%\\\"></div>\\r\\n    </div>\\r\\n    \");\n      }\n\n      data.buffer.push(\"<header>\\r\\n    <div class=\\\"navbar navbar-default\\\">\\r\\n        <div class=\\\"navbar-header\\\">\\r\\n            <button type=\\\"button\\\" class=\\\"navbar-toggle\\\" data-toggle=\\\"collapse\\\" data-target=\\\".navbar-responsive-collapse\\\">\\r\\n                <span class=\\\"icon-bar\\\"></span>\\r\\n                <span class=\\\"icon-bar\\\"></span>\\r\\n                <span class=\\\"icon-bar\\\"></span>\\r\\n            </button>\\r\\n            <a class=\\\"navbar-brand\\\">Azure Table Storage Explorer</a>\\r\\n        </div>\\r\\n        <div class=\\\"navbar-collapse collapse navbar-responsive-collapse\\\">\\r\\n            <ul class=\\\"nav navbar-nav navbar-right\\\">\\r\\n                <li><a href=\\\"https://github.com/jpoon/StorageExplorer\\\">GitHub</a></li>\\r\\n                <li><a href=\\\"javascript:void(0)\\\" data-toggle=\\\"modal\\\" data-target=\\\"#complete-dialog\\\">Security</a></li>\\r\\n            </ul>\\r\\n        </div>\\r\\n    </div>\\r\\n</header>\\r\\n\\r\\n<!-- Modal -->\\r\\n<div id=\\\"complete-dialog\\\" class=\\\"modal fade\\\" tabindex=\\\"-1\\\">\\r\\n  <div class=\\\"modal-dialog\\\">\\r\\n    <div class=\\\"modal-content\\\">\\r\\n        <div class=\\\"modal-header\\\">\\r\\n            <button type=\\\"button\\\" class=\\\"close\\\" data-dismiss=\\\"modal\\\" aria-hidden=\\\"true\\\">×</button>\\r\\n            <h4 class=\\\"modal-title\\\">Security Disclaimer</h4>\\r\\n        </div>\\r\\n        <div class=\\\"modal-body\\\">\\r\\n        <p>\\r\\n            Storage account credentials are never stored on the server and are transmitted securely (via HTTPS).\\r\\n        </p>\\r\\n        </div>\\r\\n        <div class=\\\"modal-footer\\\">\\r\\n            <button class=\\\"btn btn-primary\\\" data-dismiss=\\\"modal\\\">Dismiss</button>\\r\\n        </div>\\r\\n    </div>\\r\\n  </div>\\r\\n</div>\\r\\n\\r\\n<br>\\r\\n\\r\\n<div class=\\\"panel panel-default\\\">\\r\\n    <div class=\\\"panel-heading\\\">\\r\\n        <span>Storage Account Information</span>\\r\\n    </div>\\r\\n    <div class=\\\"panel-body row\\\">\\r\\n        <form \");\n      data.buffer.push(escapeExpression(helpers.action.call(depth0, \"load\", {hash:{\n        \'on\': (\"submit\")\n      },hashTypes:{\'on\': \"STRING\"},hashContexts:{\'on\': depth0},contexts:[depth0],types:[\"STRING\"],data:data})));\n      data.buffer.push(\">\\r\\n            <div class=\\\"form-group col-md-2\\\">\\r\\n                \");\n      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{\n        \'value\': (\"accountName\"),\n        \'type\': (\"text\"),\n        \'class\': (\"form-control floating-label\"),\n        \'placeholder\': (\"storage account name\")\n      },hashTypes:{\'value\': \"ID\",\'type\': \"STRING\",\'class\': \"STRING\",\'placeholder\': \"STRING\"},hashContexts:{\'value\': depth0,\'type\': depth0,\'class\': depth0,\'placeholder\': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, \"input\", options))));\n      data.buffer.push(\"\\r\\n            </div>\\r\\n            <div class=\\\"form-group col-md-10\\\">\\r\\n                \");\n      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{\n        \'value\': (\"accountKey\"),\n        \'type\': (\"text\"),\n        \'class\': (\"form-control floating-label\"),\n        \'placeholder\': (\"storage account key\")\n      },hashTypes:{\'value\': \"ID\",\'type\': \"STRING\",\'class\': \"STRING\",\'placeholder\': \"STRING\"},hashContexts:{\'value\': depth0,\'type\': depth0,\'class\': depth0,\'placeholder\': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, \"input\", options))));\n      data.buffer.push(\"\\r\\n            </div>\\r\\n            <div class=\\\"col-md-2 col-md-offset-10 text-right\\\">\\r\\n                <button type=\\\"submit\\\" \");\n      data.buffer.push(escapeExpression(helpers[\'bind-attr\'].call(depth0, {hash:{\n        \'disabled\': (\"loadDisabled\")\n      },hashTypes:{\'disabled\': \"ID\"},hashContexts:{\'disabled\': depth0},contexts:[],types:[],data:data})));\n      data.buffer.push(\" class=\\\"btn btn-primary btn-raised\\\">Load</button>\\r\\n            </div>\\r\\n        </form>\\r\\n    </div>\\r\\n\\r\\n    \");\n      stack1 = helpers[\'if\'].call(depth0, \"showProgress\", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:[\"ID\"],data:data});\n      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }\n      data.buffer.push(\"\\r\\n</div>\\r\\n\\r\\n\");\n      stack1 = helpers._triageMustache.call(depth0, \"outlet\", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:[\"ID\"],data:data});\n      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }\n      data.buffer.push(\"\\r\\n\\r\\n\");\n      return buffer;\n      \n    });\n  });//# sourceURL=storage-explorer/templates/application.js");

;eval("define(\"storage-explorer/templates/table\", \n  [\"ember\",\"exports\"],\n  function(__dependency1__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    __exports__[\"default\"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {\n    this.compilerInfo = [4,\'>= 1.0.0\'];\n    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};\n      var buffer = \'\', stack1, self=this;\n\n    function program1(depth0,data) {\n      \n      var buffer = \'\', stack1;\n      data.buffer.push(\"\\r\\n                      <th>\");\n      stack1 = helpers._triageMustache.call(depth0, \"item\", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:[\"ID\"],data:data});\n      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }\n      data.buffer.push(\"</th>\\r\\n                    \");\n      return buffer;\n      }\n\n    function program3(depth0,data) {\n      \n      var buffer = \'\', stack1;\n      data.buffer.push(\"\\r\\n                    <tr>\\r\\n                    <td>\");\n      stack1 = helpers._triageMustache.call(depth0, \"_view.contentIndex\", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:[\"ID\"],data:data});\n      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }\n      data.buffer.push(\"</td>\\r\\n                    \");\n      stack1 = helpers.each.call(depth0, \"column\", \"in\", \"row\", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0,depth0,depth0],types:[\"ID\",\"ID\",\"ID\"],data:data});\n      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }\n      data.buffer.push(\"\\r\\n                    </tr>\\r\\n                \");\n      return buffer;\n      }\n    function program4(depth0,data) {\n      \n      var buffer = \'\', stack1;\n      data.buffer.push(\"\\r\\n                      <td>\");\n      stack1 = helpers._triageMustache.call(depth0, \"column\", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:[\"ID\"],data:data});\n      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }\n      data.buffer.push(\"</td>\\r\\n                    \");\n      return buffer;\n      }\n\n      data.buffer.push(\"<div class=\\\"panel panel-default\\\">\\r\\n    <div class=\\\"panel-heading\\\">\\r\\n        \");\n      stack1 = helpers._triageMustache.call(depth0, \"name\", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:[\"ID\"],data:data});\n      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }\n      data.buffer.push(\" <i>(\");\n      stack1 = helpers._triageMustache.call(depth0, \"rowCount\", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:[\"ID\"],data:data});\n      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }\n      data.buffer.push(\")</i>\\r\\n    </div>\\r\\n\\r\\n    <div class=\\\"panel-body row\\\">\\r\\n        <table class=\\\"table table-striped table-hover\\\">\\r\\n            <thead>\\r\\n                <tr>\\r\\n                    <th>#</th>\\r\\n                    \");\n      stack1 = helpers.each.call(depth0, \"item\", \"in\", \"rowHeader\", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:[\"ID\",\"ID\",\"ID\"],data:data});\n      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }\n      data.buffer.push(\"\\r\\n                <tr>\\r\\n            </thead>\\r\\n\\r\\n            <tbody>\\r\\n                \");\n      stack1 = helpers.each.call(depth0, \"row\", \"in\", \"rowData\", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0,depth0],types:[\"ID\",\"ID\",\"ID\"],data:data});\n      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }\n      data.buffer.push(\"\\r\\n            </tbody>\\r\\n        </table>\\r\\n    </div>\\r\\n</div>\");\n      return buffer;\n      \n    });\n  });//# sourceURL=storage-explorer/templates/table.js");

;eval("define(\"storage-explorer/templates/tables\", \n  [\"ember\",\"exports\"],\n  function(__dependency1__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    __exports__[\"default\"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {\n    this.compilerInfo = [4,\'>= 1.0.0\'];\n    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};\n      var buffer = \'\', stack1, self=this, helperMissing=helpers.helperMissing;\n\n    function program1(depth0,data) {\n      \n      var buffer = \'\', stack1, helper, options;\n      data.buffer.push(\"\\r\\n            \");\n      stack1 = (helper = helpers[\'link-to\'] || (depth0 && depth0[\'link-to\']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:[\"STRING\",\"ID\"],data:data},helper ? helper.call(depth0, \"table\", \"tableName\", options) : helperMissing.call(depth0, \"link-to\", \"table\", \"tableName\", options));\n      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }\n      data.buffer.push(\"\\r\\n        \");\n      return buffer;\n      }\n    function program2(depth0,data) {\n      \n      var buffer = \'\', stack1;\n      data.buffer.push(\"\\r\\n                <p>\");\n      stack1 = helpers._triageMustache.call(depth0, \"tableName\", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:[\"ID\"],data:data});\n      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }\n      data.buffer.push(\"</p>\\r\\n            \");\n      return buffer;\n      }\n\n    function program4(depth0,data) {\n      \n      \n      data.buffer.push(\"\\r\\n    <div class=\\\"progress progress-striped active\\\">\\r\\n        <div class=\\\"progress-bar\\\" style=\\\"width: 100%\\\"></div>\\r\\n    </div>\\r\\n    \");\n      }\n\n      data.buffer.push(\"<div class=\\\"panel panel-default\\\">\\r\\n    <div class=\\\"panel-heading\\\">\\r\\n        Tables <i>(\");\n      stack1 = helpers._triageMustache.call(depth0, \"tablesCount\", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:[\"ID\"],data:data});\n      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }\n      data.buffer.push(\")</i>\\r\\n    </div>\\r\\n\\r\\n    <div class=\\\"panel-body\\\">\\r\\n        \");\n      stack1 = helpers.each.call(depth0, \"tableName\", \"in\", \"tables\", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:[\"ID\",\"ID\",\"ID\"],data:data});\n      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }\n      data.buffer.push(\"\\r\\n    </div>\\r\\n\\r\\n    \");\n      stack1 = helpers[\'if\'].call(depth0, \"showProgress\", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:[\"ID\"],data:data});\n      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }\n      data.buffer.push(\"\\r\\n</div>\\r\\n\\r\\n\");\n      stack1 = helpers._triageMustache.call(depth0, \"outlet\", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:[\"ID\"],data:data});\n      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }\n      data.buffer.push(\"\\r\\n\");\n      return buffer;\n      \n    });\n  });//# sourceURL=storage-explorer/templates/tables.js");

;eval("define(\"storage-explorer/tests/app.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - .\');\n    test(\'app.js should pass jshint\', function() { \n      ok(true, \'app.js should pass jshint.\'); \n    });\n  });//# sourceURL=storage-explorer/tests/app.jshint.js");

;eval("define(\"storage-explorer/tests/controllers/application.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - controllers\');\n    test(\'controllers/application.js should pass jshint\', function() { \n      ok(true, \'controllers/application.js should pass jshint.\'); \n    });\n  });//# sourceURL=storage-explorer/tests/controllers/application.jshint.js");

;eval("define(\"storage-explorer/tests/controllers/table.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - controllers\');\n    test(\'controllers/table.js should pass jshint\', function() { \n      ok(false, \'controllers/table.js should pass jshint.\\ncontrollers/table.js: line 21, col 5, Unreachable \\\'return\\\' after \\\'return\\\'.\\ncontrollers/table.js: line 30, col 52, \\\'key\\\' is defined but never used.\\n\\n2 errors\'); \n    });\n  });//# sourceURL=storage-explorer/tests/controllers/table.jshint.js");

;eval("define(\"storage-explorer/tests/controllers/tables.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - controllers\');\n    test(\'controllers/tables.js should pass jshint\', function() { \n      ok(true, \'controllers/tables.js should pass jshint.\'); \n    });\n  });//# sourceURL=storage-explorer/tests/controllers/tables.jshint.js");

;eval("define(\"storage-explorer/tests/helpers/resolver\", \n  [\"ember/resolver\",\"storage-explorer/config/environment\",\"exports\"],\n  function(__dependency1__, __dependency2__, __exports__) {\n    \"use strict\";\n    var Resolver = __dependency1__[\"default\"];\n    var config = __dependency2__[\"default\"];\n\n    var resolver = Resolver.create();\n\n    resolver.namespace = {\n      modulePrefix: config.modulePrefix,\n      podModulePrefix: config.podModulePrefix\n    };\n\n    __exports__[\"default\"] = resolver;\n  });//# sourceURL=storage-explorer/tests/helpers/resolver.js");

;eval("define(\"storage-explorer/tests/helpers/start-app\", \n  [\"ember\",\"storage-explorer/app\",\"storage-explorer/router\",\"storage-explorer/config/environment\",\"exports\"],\n  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    var Application = __dependency2__[\"default\"];\n    var Router = __dependency3__[\"default\"];\n    var config = __dependency4__[\"default\"];\n\n    __exports__[\"default\"] = function startApp(attrs) {\n      var App;\n\n      var attributes = Ember.merge({}, config.APP);\n      attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;\n\n      Ember.run(function() {\n        App = Application.create(attributes);\n        App.setupForTesting();\n        App.injectTestHelpers();\n      });\n\n      return App;\n    }\n  });//# sourceURL=storage-explorer/tests/helpers/start-app.js");

;eval("define(\"storage-explorer/tests/router.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - .\');\n    test(\'router.js should pass jshint\', function() { \n      ok(true, \'router.js should pass jshint.\'); \n    });\n  });//# sourceURL=storage-explorer/tests/router.jshint.js");

;eval("define(\"storage-explorer/tests/routes/table.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - routes\');\n    test(\'routes/table.js should pass jshint\', function() { \n      ok(false, \'routes/table.js should pass jshint.\\nroutes/table.js: line 39, col 32, \\\'transition\\\' is defined but never used.\\n\\n1 error\'); \n    });\n  });//# sourceURL=storage-explorer/tests/routes/table.jshint.js");

;eval("define(\"storage-explorer/tests/routes/tables.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - routes\');\n    test(\'routes/tables.js should pass jshint\', function() { \n      ok(false, \'routes/tables.js should pass jshint.\\nroutes/tables.js: line 39, col 32, \\\'transition\\\' is defined but never used.\\n\\n1 error\'); \n    });\n  });//# sourceURL=storage-explorer/tests/routes/tables.jshint.js");

;eval("define(\"storage-explorer/tests/storage-explorer/tests/helpers/resolver.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - storage-explorer/tests/helpers\');\n    test(\'storage-explorer/tests/helpers/resolver.js should pass jshint\', function() { \n      ok(true, \'storage-explorer/tests/helpers/resolver.js should pass jshint.\'); \n    });\n  });//# sourceURL=storage-explorer/tests/storage-explorer/tests/helpers/resolver.jshint.js");

;eval("define(\"storage-explorer/tests/storage-explorer/tests/helpers/start-app.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - storage-explorer/tests/helpers\');\n    test(\'storage-explorer/tests/helpers/start-app.js should pass jshint\', function() { \n      ok(true, \'storage-explorer/tests/helpers/start-app.js should pass jshint.\'); \n    });\n  });//# sourceURL=storage-explorer/tests/storage-explorer/tests/helpers/start-app.jshint.js");

;eval("define(\"storage-explorer/tests/storage-explorer/tests/test-helper.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - storage-explorer/tests\');\n    test(\'storage-explorer/tests/test-helper.js should pass jshint\', function() { \n      ok(true, \'storage-explorer/tests/test-helper.js should pass jshint.\'); \n    });\n  });//# sourceURL=storage-explorer/tests/storage-explorer/tests/test-helper.jshint.js");

;eval("define(\"storage-explorer/tests/test-helper\", \n  [\"storage-explorer/tests/helpers/resolver\",\"ember-qunit\"],\n  function(__dependency1__, __dependency2__) {\n    \"use strict\";\n    var resolver = __dependency1__[\"default\"];\n    var setResolver = __dependency2__.setResolver;\n\n    setResolver(resolver);\n\n    document.write(\'<div id=\"ember-testing-container\"><div id=\"ember-testing\"></div></div>\');\n\n    QUnit.config.urlConfig.push({ id: \'nocontainer\', label: \'Hide container\'});\n    var containerVisibility = QUnit.urlParams.nocontainer ? \'hidden\' : \'visible\';\n    document.getElementById(\'ember-testing-container\').style.visibility = containerVisibility;\n  });//# sourceURL=storage-explorer/tests/test-helper.js");

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
  require("storage-explorer/app")["default"].create({"apiHost":"http://localhost:3000","LOG_RESOLVER":true,"LOG_ACTIVE_GENERATION":true,"LOG_TRANSITIONS":true,"LOG_TRANSITIONS_INTERNAL":true,"LOG_VIEW_LOOKUPS":true});
}



/* jshint ignore:end */
