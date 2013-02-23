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
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n      ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.user),stack1 == null || stack1 === false ? stack1 : stack1.is_authenticated), {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    ";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return "      \n      <div class=\"sign-in\"><a href=\"{% url member-logout %}\" class=\"button\">sign out</a></div>\n      <div class=\"sign-in\" style=\"padding-right:20px\"><a href=\"{% url member-profile %}\" class=\"button\">Profile</a></div>\n      ";
  }

function program4(depth0,data) {
  
  
  return "\n      <div class=\"sign-in\"><a href=\"{% url member-signin %}\" class=\"button\">sign in</a></div>\n      ";
  }

  buffer += "<header>\n  <div class=\"wrapper\">\n    <h1><a href=\"/\" title=\"Open Include\">Open Include</a></h1>\n    ";
  stack1 = helpers.unless.call(depth0, depth0.in_stealth_mode, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n  </div>\n</header>";
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
  
  
  return "\n    <div class=\"search\">\n      <form  class=\"search-form\" action=\"{% url project-search '' %}\" method=\"GET\">\n        <input type=\"text\" name=\"query\" placeholder=\"discover an open source project\">\n        <button type=\"submit\">search</button>\n      </form>\n      <a href=\"#\" class=\"advanced\">advanced search</a>\n    </div>\n\n    <div class=\"search-terms\">\n      <h3>sample search terms:</h3>\n      <ul class='unstyled'>\n        <li><a href=\"#\">neural net python</a></li>\n        <li><a href=\"#\">prime number generator java</a></li>\n        <li><a href=\"#\">scraping toolkit</a></li>\n        <li><a href=\"#\">sleek web design</a></li>\n      </ul>\n    </div>\n";
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
  buffer += "\n</div>";
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
    + "'>\n	<div class='span12' id='searchChart'>\n				\n	</div>\n</div>\n\n\n";
  return buffer;
  }));

Handlebars.registerPartial("discover/compare", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n				";
  stack1 = helpers['with'].call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return "\n				\n				\n				\n				";
  }

function program4(depth0,data) {
  
  
  return "\n		<tfoot>\n			<tr>\n				<td colspan=7><h3>Click on the project to add it to the comparison list</h3></td>\n			</tr>\n		</tfoot>\n		";
  }

  buffer += "<div class='span12'>\n	<table class='table table-striped table-hover table-bordered'>\n		<thead>\n			<tr>\n				<th>Project Name</th><th>Languages</th><th>Active Contributors</th><th>Last Commit</th><th>Start on GitHub</th><th>Questions on Stack Overflow</th><th>Percentage</th>\n			</tr>\n		</thead>\n		<tbody>\n			";
  stack1 = helpers.each.call(depth0, depth0.projects, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</tbody>\n		";
  stack1 = helpers.unless.call(depth0, depth0.project, {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
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
  buffer += "\n			";
  stack1 = helpers['with'].call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n			<li>\n				<label class='checkbox'>\n					<input type='checkbox' name='languageFilter' value=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" /> ";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " 				\n				</label>\n			</li>\n			";
  return buffer;
  }

  buffer += "<div class='filter'>\n	<h3>Filter</h3>\n	<h4>Languages</h4>\n	<ul class='unstyled'>\n		";
  stack1 = helpers.each.call(depth0, depth0.languages, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	</ul>\n</div>\n";
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
  buffer += "\n		</div>\n		<div class='span4'>\n			";
  stack1 = self.invokePartial(partials['discover/filter'], 'discover/filter', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</div>\n	</div>\n	<div class='row moduleComparison'>\n		";
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


  buffer += "<h1>";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h1>\n\n<div>\n<h2>User Data Gotten from Github</h2>\n<ul>\n    <li><img src=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.member),stack1 == null || stack1 === false ? stack1 : stack1.avatar)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"></img></li>\n    <li>"
    + escapeExpression(((stack1 = ((stack1 = depth0.member),stack1 == null || stack1 === false ? stack1 : stack1.github_username)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</li>\n    <li>"
    + escapeExpression(((stack1 = ((stack1 = depth0.member),stack1 == null || stack1 === false ? stack1 : stack1.github_profile)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</li>\n</ul>\n\n</div>\n";
  return buffer;
  }));

Handlebars.registerPartial("registration/login", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, self=this;

function program1(depth0,data) {
  
  
  return "\n	  <div class=\"message error\">\n	    <h2>Please try again</h2>\n	    <p>The username or password you entered is incorrect.</p>\n	  </div>\n  ";
  }

  buffer += "<div>\n  \n  ";
  stack1 = helpers['if'].call(depth0, depth0.error, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  \n  <h2>Login to your account</h2>\n  <form name=\"signin\" method=\"post\" action=\"\">\n    <input type=\"hidden\" name=\"next\" value=\"\" />  \n    <div class=\"form-row\">\n      <label for=\"email\">Username</label>\n      <input type=\"text\" name=\"username\" value=\"\"/>\n    </div>\n    <div class=\"form-row\">\n      <label for=\"password\">Password</label>\n      <input type=\"password\" name=\"password\" value=\"\"/>\n    </div>\n    \n    <div class=\"form-row clearfix\">\n        <input type=\"submit\" name=\"submit\" value=\"Login\"/>\n    </div>\n    \n    <a href=\"/auth/github\" class=\"github-auth\">Github Auth</a>\n  </form>\n</div>\n";
  return buffer;
  }));