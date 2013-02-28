this["hbt"] = this["hbt"] || {};

Handlebars.registerPartial("css", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<link href=\"";
  if (stack1 = helpers.STATIC_URL) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.STATIC_URL; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "css/app.min.css\" rel=\"stylesheet\" type=\"text/css\" media=\"screen\" />  ";
  return buffer;
  }));

Handlebars.registerPartial("footer", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "";


  buffer += "<footer>\n  <div class=\"wrapper\">\n    <p>2013 Open Include.</p>\n  </div>\n</footer>\n\n"
    + "\n<script type=\"text/javascript\">\n\n  var _gaq = _gaq || [];\n  _gaq.push(['_setAccount', 'UA-23203675-4']);\n  _gaq.push(['_trackPageview']);\n\n  (function() {\n    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;\n    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';\n    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);\n  })();\n\n</script>";
  return buffer;
  }));

Handlebars.registerPartial("header", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      ";
  stack1 = helpers['if'].call(depth0, depth0.user, {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      <div class=\"sign-in\"><a href=\"";
  if (stack1 = helpers.discover_url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.discover_url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"button\">discover</a></div>\n      <div class=\"sign-in\"><a href=\"";
  if (stack1 = helpers.how_to_url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.how_to_url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"button\">how to</a></div>\n      <div class=\"sign-in\"><a href=\"";
  if (stack1 = helpers.modules_url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.modules_url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"button\">modules</a></div>\n    ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "      \n      <div class=\"sign-in\"><a href=\"";
  if (stack1 = helpers.logout_url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.logout_url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"button\">sign out</a></div>\n      <div class=\"sign-in\"><a href=\"";
  if (stack1 = helpers.profile_url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.profile_url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"button\">profile</a></div>\n      ";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <div class=\"sign-in\"><a href=\"";
  if (stack1 = helpers.signin_url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.signin_url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"button\">sign in</a></div>\n      ";
  return buffer;
  }

  buffer += "<header>\n  <div class=\"wrapper\">\n    <h1><a href=\"/\" title=\"Open Include\">Open Include</a></h1>\n    \n    ";
  stack1 = helpers.unless.call(depth0, depth0.in_stealth_mode, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n  </div>\n</header>\n";
  return buffer;
  }));

Handlebars.registerPartial("how-to", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class='container profile'>\n	<div class='row'>\n		<div class='span12'>\n			<h2>";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h2>\n			<h3>Features</h3>\n			<ul class='unstyled'>\n        <li>Discover</li>\n        <li>Demo</li>\n        <li>Integrate</li>\n        <li>Contribute</li>\n			</ul>\n			<h3>Upcoming Features</h3>\n			<ul class='unstyled'>\n        <li>Cool feature #1</li>\n        <li>Cool feature #2</li>\n        <li>Cool feature #3</li>\n			</ul>\n		</div>\n	</div>\n</div>\n\n";
  return buffer;
  }));

Handlebars.registerPartial("index", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "style=\"width:740px\"";
  }

function program3(depth0,data) {
  
  
  return "/discover";
  }

function program5(depth0,data) {
  
  
  return "{% url demo %}";
  }

function program7(depth0,data) {
  
  
  return "{% url integrate %}";
  }

function program9(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <li> <a href=\"{% url contribute %}\">\n          <div class=\"box\"><img src=\"";
  if (stack1 = helpers.STATIC_URL) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.STATIC_URL; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "images/icon-contribute.png\" alt=\"\">\n            <h2>Contribute</h2>\n            <p>code or cash to the open source ecosystem</p>\n          </div>\n          </a> </li>\n";
  return buffer;
  }

function program11(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <div class=\"email\">\n      <form  class=\"email-form\" action=\"/prelaunch/email/\" method=\"POST\">\n        <input type=\"text\" name=\"email\" placeholder=\"email address - we will get in touch for the launch.\">\n        ";
  if (stack1 = helpers.csrf_token) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.csrf_token; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n        <button type=\"submit\">submit</button>\n      </form>\n    </div>\n";
  return buffer;
  }

function program13(depth0,data) {
  
  
  return "\n    <div class=\"search\">\n      <form  class=\"search-form\" action=\"/discover\" method=\"GET\">\n        <input type=\"text\" name=\"query\" placeholder=\"discover an open source project\">\n        <button type=\"submit\">search</button>\n      </form>\n      <a href=\"#\" class=\"advanced\">advanced search</a>\n    </div>\n\n    <div class=\"search-terms\">\n      <h3>sample search terms:</h3>\n      <ul class='unstyled'>\n        <li><a href=\"#\">neural net python</a></li>\n        <li><a href=\"#\">prime number generator java</a></li>\n        <li><a href=\"#\">scraping toolkit</a></li>\n        <li><a href=\"#\">sleek web design</a></li>\n      </ul>\n    </div>\n";
  }

  buffer += "<div class=\"wrapper\" ";
  stack1 = helpers['if'].call(depth0, depth0.in_stealth_mode, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n    <div class=\"features\">\n      <ul>\n        <li> <a href=\"";
  stack1 = helpers.unless.call(depth0, depth0.in_stealth_mode, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n          <div class=\"box\"><img src=\"";
  if (stack1 = helpers.STATIC_URL) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.STATIC_URL; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "images/icon-discover.png\" alt=\"\">\n            <h2>Discover</h2>\n            <p>quality open source projects</p>\n          </div>\n          </a> </li>\n        <li> <a href=\"";
  stack1 = helpers.unless.call(depth0, depth0.in_stealth_mode, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n          <div class=\"box\"><img src=\"";
  if (stack1 = helpers.STATIC_URL) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.STATIC_URL; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "images/icon-demo.png\" alt=\"\">\n            <h2>Demo</h2>\n            <p>on our virtual machines</p>\n          </div>\n          </a> </li>\n        <li> <a href=\"";
  stack1 = helpers.unless.call(depth0, depth0.in_stealth_mode, {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n          <div class=\"box\"><img src=\"";
  if (stack1 = helpers.STATIC_URL) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.STATIC_URL; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "images/icon-integrate.png\" alt=\"\">\n            <h2>Integrate</h2>\n            <p>into your current work</p>\n          </div>\n          </a> </li>\n";
  stack1 = helpers.unless.call(depth0, depth0.in_stealth_mode, {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </ul>\n    </div>\n\n";
  stack1 = helpers['if'].call(depth0, depth0.in_stealth_mode, {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n";
  stack1 = helpers.unless.call(depth0, depth0.in_stealth_mode, {hash:{},inverse:self.noop,fn:self.program(13, program13, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n";
  return buffer;
  }));

Handlebars.registerPartial("scripts", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<script type=\"text/javascript\" src=\"/static/js/jquery-1.9.1.min.js\"></script>\n<script type=\"text/javascript\" src=\"/static/js/bootstrap.min.js\"></script>\n<script type=\"text/javascript\" src=\"/static/js/d3.min.js\"></script>\n<script type=\"text/javascript\" src=\"/static/js/humanize.js\"></script>\n<script type=\"text/javascript\" src=\"/static/js/underscore.js\"></script>\n<script type=\"text/javascript\" src=\"/static/js/backbone.min.js\"></script>\n<script type=\"text/javascript\" src=\"/static/js/handlebars.runtime.js\"></script>\n<script type=\"text/javascript\" src=\"/static/js/templates.js\"></script>\n<script type=\"text/javascript\" src=\"/static/js/app.js\"></script>";
  }));

Handlebars.registerPartial("discover/chart", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class='row-fluid searchChart' data-chart='";
  if (stack1 = helpers.searchData) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.searchData; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-maxScore='";
  if (stack1 = helpers.maxScore) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.maxScore; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>\n	<div class='span12' id='searchChart'></div>\n</div>";
  return buffer;
  }));

Handlebars.registerPartial("discover/compare", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n					";
  stack1 = helpers['with'].call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n				";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n						";
  stack1 = helpers.unless.call(depth0, depth0.key, {hash:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n					";
  return buffer;
  }
function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n						<th>";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</th>\n						";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n						<th><a href='#' data-sort='";
  if (stack1 = helpers.key) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.key; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' ";
  stack1 = helpers['if'].call(depth0, depth0.active, {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n							";
  stack1 = helpers['if'].call(depth0, depth0.directionBottom, {hash:{},inverse:self.program(10, program10, data),fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n						</a></th>\n						";
  return buffer;
  }
function program6(depth0,data) {
  
  
  return "class='active'";
  }

function program8(depth0,data) {
  
  
  return " \n							<i class='icon-chevron-down'></i>\n							";
  }

function program10(depth0,data) {
  
  
  return "\n							<i class='icon-chevron-up'></i>\n							";
  }

function program12(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n				";
  stack1 = helpers['with'].call(depth0, depth0._source, {hash:{},inverse:self.noop,fn:self.programWithDepth(program13, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			";
  return buffer;
  }
function program13(depth0,data,depth1) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n					<tr>\n						<td>";
  if (stack1 = helpers.module_name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.module_name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td><td>";
  if (stack1 = helpers.language) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.language; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td><td>#</td><td>"
    + escapeExpression(((stack1 = depth1.lastCommitHuman),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</td><td>";
  if (stack2 = helpers.watchers) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.watchers; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</td><td>#</td><td>#</td>						\n					</tr>\n				";
  return buffer;
  }

function program15(depth0,data) {
  
  
  return "\n		<tfoot>\n			<tr>\n				<td colspan=7><h3>click on the project's bubble to add it to the comparison list</h3></td>\n			</tr>\n		</tfoot>\n		";
  }

  buffer += "<div class='span12 moduleComparison'>\n	<table class='table table-striped table-hover'>\n		<thead>\n			<tr>\n				";
  stack1 = helpers.each.call(depth0, depth0.headers, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			</tr>\n		</thead>\n		<tbody>\n			";
  stack1 = helpers.each.call(depth0, depth0.projects, {hash:{},inverse:self.noop,fn:self.program(12, program12, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</tbody>\n		";
  stack1 = helpers.unless.call(depth0, depth0.projects, {hash:{},inverse:self.noop,fn:self.program(15, program15, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	</table>\n</div>";
  return buffer;
  }));

Handlebars.registerPartial("discover/filter", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n	";
  stack1 = helpers['with'].call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "	\n	<div class='filterBox'>\n		<h4>";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " <a href='#' class='pull-right' data-reset='";
  if (stack1 = helpers.key) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.key; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>reset filter</a></h4>\n		<ul class='unstyled'>			\n			";
  stack1 = helpers.each.call(depth0, depth0.languages, {hash:{},inverse:self.noop,fn:self.programWithDepth(program3, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</ul>\n	</div>\n	";
  return buffer;
  }
function program3(depth0,data,depth1) {
  
  var buffer = "", stack1;
  buffer += "\n				<li>\n					<label class='checkbox'>\n						<input type='checkbox' name='"
    + escapeExpression(((stack1 = depth1.key),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "' value=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\" /> "
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + " 				\n					</label>\n				</li>\n			";
  return buffer;
  }

  buffer += "<h3>Filter</h3>\n";
  stack1 = helpers.each.call(depth0, depth0.filters, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
  }));

Handlebars.registerPartial("discover/index", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials; data = data || {};
  var buffer = "", stack1, self=this;


  buffer += "<div class='container discover'>\n	<div class='row'>\n		<div class='span8'>				\n			";
  stack1 = self.invokePartial(partials['discover/search'], 'discover/search', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		    ";
  stack1 = self.invokePartial(partials['discover/chart'], 'discover/chart', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</div>\n		<div class='span4'>\n			<div class='filter'>\n			";
  stack1 = self.invokePartial(partials['discover/filter'], 'discover/filter', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			</div>\n		</div>\n	</div>\n	<div class='row' id='moduleComparison'>\n		";
  stack1 = self.invokePartial(partials['discover/compare'], 'discover/compare', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	</div>\n</div>";
  return buffer;
  }));

Handlebars.registerPartial("discover/search", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"search\">\n  <form  class=\"search-form\" action=\"";
  if (stack1 = helpers.discover_search_action) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.discover_search_action; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" method=\"GET\">\n    <input type=\"text\" name=\"q\" placeholder=\"discover an open source project\" value=\"";
  if (stack1 = helpers.discover_search_query) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.discover_search_query; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    <button type=\"submit\">search</button>\n  </form>  \n</div>";
  return buffer;
  }));

Handlebars.registerPartial("member/profile", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class='container profile'>\n	<div class='row'>\n		<div class='span12'>\n			<h2>";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h2>\n			<h3>GitHub profile data</h3>\n			<ul class='unstyled'>\n			    <li><img src=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.github_avatar_url)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"></img></li>\n			    <li>"
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.github_display_name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</li>\n			    <li>"
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.github_username)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</li>\n			    <li>"
    + escapeExpression(((stack1 = ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.github_id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</li>\n			</ul>\n		</div>\n	</div>\n</div>\n";
  return buffer;
  }));

Handlebars.registerPartial("module/index", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<div class='container module'>\n  <div class='row'>\n    Language list\n  </div>  \n</div>";
  }));

Handlebars.registerPartial("registration/login", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class='container login'>  \n  <div class='row'>\n  	  <div class='offset2 span8 text-center''>		  \n		  <form name=\"signin\" method=\"post\" action=\"\">              \n		    <a href=\"";
  if (stack1 = helpers.github_auth_url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.github_auth_url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"github-auth\">Authenticate with GitHub</a>\n		  </form>  	\n	  </div>\n  </div>\n</div>\n";
  return buffer;
  }));