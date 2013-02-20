this["app"] = this["app"] || {};
this["app"]["tpl"] = this["app"]["tpl"] || {};

this["app"]["tpl"]["css.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<link href=\"";
  if (stack1 = helpers.STATIC_URL) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.STATIC_URL; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "css/app.min.css\" rel=\"stylesheet\" type=\"text/css\" media=\"screen\" />  ";
  return buffer;
  });

this["app"]["tpl"]["footer.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "";


  buffer += "<footer>\n  <div class=\"wrapper\">\n    <p>2013 Open Include.</p>\n  </div>\n</footer>\n\n"
    + "\n<script type=\"text/javascript\">\n\n  var _gaq = _gaq || [];\n  _gaq.push(['_setAccount', 'UA-23203675-4']);\n  _gaq.push(['_trackPageview']);\n\n  (function() {\n    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;\n    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';\n    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);\n  })();\n\n</script>";
  return buffer;
  });

this["app"]["tpl"]["header.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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
  });

this["app"]["tpl"]["index.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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
  
  
  return "\n    <div class=\"search\">\n      <form  class=\"search-form\" action=\"{% url project-search '' %}\" method=\"GET\">\n        <input type=\"text\" name=\"query\" placeholder=\"discover an open source project\">\n        <button type=\"submit\">search</button>\n      </form>\n      <a href=\"#\" class=\"advanced\">advanced search</a>\n    </div>\n\n    <div class=\"search-terms\">\n      <h3>sample search terms:</h3>\n      <ul>\n        <li><a href=\"#\">neural net python</a></li>\n        <li><a href=\"#\">prime number generator java</a></li>\n        <li><a href=\"#\">scraping toolkit</a></li>\n        <li><a href=\"#\">sleek web design</a></li>\n      </ul>\n    </div>\n";
  }

  buffer += "<section class=\"contents\">\n  <div class=\"wrapper\" ";
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
  buffer += "\n\n  </div>\n</section>\n";
  return buffer;
  });

this["app"]["tpl"]["scripts.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<script type=\"text/javascript\" src=\"/static/js/jquery-1.9.1.min.js\"></script>\n<script type=\"text/javascript\" src=\"/static/js/bootstrap.min.js\"></script>\n<script type=\"text/javascript\" src=\"/static/js/d3.min.js\"></script>\n<script type=\"text/javascript\" src=\"/static/js/humanize.js\"></script>\n<script type=\"text/javascript\" src=\"/static/js/backbone.min.js\"></script>\n<script type=\"text/javascript\" src=\"/static/js/app.js\"></script>";
  });

this["app"]["tpl"]["discover/chart.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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
    + "'>\n	<div class='span12' id='searchChart'></div>\n</div>\n\n"
    + "\n\n\n<script type='text/javascript'>\n$(function(){\n	var oneDay = 1000*60*60*24;\n	var chartClass = (function(){\n		function chartClass(data, maxScore, container){\n			this.scope 		= $(container);\n			this.data  		= data;\n			this.maxScore 	= parseFloat(maxScore);			\n			this.maxRadius  = 50;\n			this.init();\n		}\n		\n		chartClass.prototype.x = function(d){\n			var d = d._source,\n				lastCommit = new Date(d.pushed_at).getTime(),\n				currentDate = new Date().getTime();						\n			var difference_ms = currentDate - lastCommit;\n			/* dates difference*/ 			\n			var dD = Math.round(difference_ms/oneDay);   			\n			/*	0 - super active - up to 7 days\n			 *  1 - up to 30 days\n			 *  2 - up to 180 days\n			 *  3 - more than 180\n			 */			\n			function lastCommitBucket(d){\n				if ( d > 180 ){\n					return 3.5;\n				} else if ( d <= 7 ){\n					return 0.5;\n				} else if ( d <= 30){\n					return 1.5;\n				} else {\n					return 2.5;\n				}\n			}		\n				\n			return lastCommitBucket(dD);\n		}\n		\n		chartClass.prototype.y = function(d){\n			//max value is 1 === 100%					\n			return d._score/this.maxScore;\n		}\n		\n		chartClass.prototype.radius = function(d){\n			//watchers gives us the star rating\n			var d = d._source,\n				watchers = d.watchers;	\n			//random for now		\n			return 10+watchers*5;\n		}\n		\n		chartClass.prototype.color = function(d){\n			return d._source.language;\n		}\n		\n		chartClass.prototype.key = function(d){\n			return d._source._id;\n		}\n		\n		chartClass.prototype.init = function(){\n			var self = this;\n			var margin = {top: 19.5, right: 19.5, bottom: 60, left: 50};		    	\n		    var padding = 30;\n		    	\n		    function xFormatter(d,i){\n		    	if ( d === 0.5 ){\n		    		return \"< 1 week ago\";\n		    	} else if ( d === 1.5 ){\n		    		return \"< 1 month ago\";\n		    	} else if ( d === 2.5 ){\n		    		return \"< 6 months ago\";\n		    	} else if ( d === 3.5 ){\n		    		return \"> 6 months ago\";\n		    	} else {\n		    		return \"\";\n		    	}\n		    }\n		    	\n		    this.width  = this.scope.width() - margin.right - margin.left;\n		   	this.height = this.width*9/16;		    \n		    this.xScale = d3.scale.linear().domain([0, 4]).range([0, this.width]);\n		    this.yScale = d3.scale.linear().domain([0, 1.1]).range([this.height, 0]);\n		    		    		    \n		    this.radiusScale = d3.scale.sqrt()\n		    						.domain([10, d3.max(this.data, function(d){ return self.radius(d); })   ])\n		    						.range([5,this.maxRadius]);		    \n		    \n		    this.colorScale = d3.scale.category20c();\n		    \n		    this.xAxis = d3.svg.axis()\n		    						 .orient(\"bottom\")\n		    						 .scale(this.xScale)\n		    						 .tickValues([0.5,1.5,2.5,3.5])\n		    						 .tickFormat(xFormatter);\n    		this.yAxis = d3.svg.axis()\n    								 .scale(this.yScale)\n    								 .orient(\"left\")\n    								 .tickValues([1])\n    								 .tickFormat(function(d,i){\n    								 	return d === 1 ? \"100%\" : \"\";\n    								 });\n    		\n    		this.svg = d3.select(this.scope[0]).append(\"svg\")\n		    			.attr(\"width\", this.width + margin.left + margin.right)\n						.attr(\"height\", this.height + margin.top + margin.bottom)\n						.append(\"g\")\n						.attr(\"transform\", \"translate(\" + margin.left + \",\" + margin.top + \")\");\n						\n			// Add the x-axis.\n			this.svg.append(\"g\")\n			    .attr(\"class\", \"x axis\")\n			    .attr(\"transform\", \"translate(0,\" + this.height + \")\")\n			    .call(this.xAxis);\n			\n			// Add the y-axis.\n			this.svg.append(\"g\")\n			    .attr(\"class\", \"y axis\")\n			    .call(this.yAxis);\n			\n			// Add an x-axis label.\n			this.svg.append(\"text\")\n			    .attr(\"class\", \"x label\")\n			    .attr(\"text-anchor\", \"middle\")\n			    .attr(\"x\", this.width/2)\n			    .attr(\"y\", this.height + margin.bottom - 10)\n			    .text(\"Last commit\");\n			\n			// Add a y-axis label.\n			this.svg.append(\"text\")\n			    .attr(\"class\", \"y label\")\n			    .attr(\"text-anchor\", \"middle\")\n			    .attr(\"y\", 6)\n			    .attr(\"x\", -this.height/2)\n			    .attr(\"dy\", \"-1em\")\n			    .attr(\"transform\", \"rotate(-90)\")\n			    .text(\"Relevance\");\n			\n			// Add the year label; the value is set on transition.						\n			var dot = this.svg.append(\"g\")\n		      	.attr(\"class\", \"dots\")\n		    	.selectAll(\".dot\")\n		      		.data(this.data)\n		    	.enter().append(\"circle\")\n		      		.attr(\"class\", \"dot\")\n		      		.style(\"fill\", function(d) { return self.colorScale(self.color(d)); })\n		      		.call(position)\n		      		.sort(order)\n		      		.on(\"mouseover\", this.popup('show', this.scope))\n		      		.on(\"mouseout\", this.popup('hide'))\n		      		.on(\"click\", this.addToComparison);\n			\n			dot.append(\"title\")\n			      .text(function(d) { return d._source.module_name; });\n			      \n			\n			function position(dot) {\n		    	 dot\n		    		.attr(\"cx\", function(d) { return self.xScale(self.x(d)); })\n		        	.attr(\"cy\", function(d) { return self.yScale(self.y(d)); })\n		        	.attr(\"r\", function(d) { return self.radiusScale(self.radius(d)); });\n		  	}\n		  	\n		  	function order(a, b) {\n			  return self.radius(b) - self.radius(a);\n			}\n\n		}\n		\n		var popup = $(\"<div />\").addClass(\"popover\").hide().appendTo(\"#searchChart\")\n								.append(\"<h4 class='moduleName' />\")\n								.append(\"<h5 class='moduleLanguage' ><span class='color'></span><span class='name'></span></h5>\")\n								.append(\"<p class='moduleDescription' />\")\n								.append(\"<div class='moduleStars' ></div>\");\n		\n		chartClass.prototype.addToComparison  = function(d,i){\n			//TODO: add module comparison\n		}\n		\n		chartClass.prototype.popup = function(action, scope){\n			return function(d,i){\n				if ( action === 'hide' ){\n					popup.hide();\n				} else {\n					var marginLeft = 50,\n						$this = $(this),\n						width = height = parseInt($this.attr(\"r\"))*2,\n						x = parseInt($this.attr(\"cx\")),\n						y = parseInt($this.attr(\"cy\")),\n						color = $this.css(\"fill\");\n						\n					\n					var data = d._source,\n						stars = data.watchers,						\n						lastContribution = humanize.relativeTime(new Date(data.pushed_at).getTime()/1000);\n					\n					var activity = $(\"<p class='activity' />\").html(\"<i class='icon-star'></i>Last checking <strong>\"+lastContribution+\"</strong>\"),\n						activityStars = $(\"<p class='stars' />\").html(\"<i class='icon-star'></i><strong>\"+stars+\" stars</strong> on GitHub\");	\n											\n					$(\".moduleName\", popup).text(data.module_name);\n					$(\".moduleLanguage\", popup)\n						.find(\".name\").text(data.language).end()\n						.find(\".color\").css({background: color});\n					$(\".moduleDescription\", popup).text(data.description);										\n					$(\".moduleStars\", popup).html(\"\").append(activity, activityStars);\n																\n					popup.show()\n						 .css({\n							bottom: (scope.outerHeight()-y-(popup.outerHeight()/2)-15)+'px',\n							left: x+marginLeft+(width/2)+15+'px'\n						 });\n				}\n			}\n		}\n\n		\n		\n		return chartClass;\n	})();\n	\n	var data = $(\"[data-chart]\").data(\"chart\"),\n		maxScore = $(\"[data-maxscore]\").data(\"maxscore\");\n	var chart = new chartClass(data, maxScore, \"#searchChart\");\n	\n});\n</script>";
  return buffer;
  });

this["app"]["tpl"]["discover/compare.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "compare";
  });

this["app"]["tpl"]["discover/filter.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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
  });

this["app"]["tpl"]["discover/index.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; partials = partials || Handlebars.partials; data = data || {};
  var buffer = "", stack1, self=this;


  buffer += "<section class=\"contents discover\">\n	<div class='container'>\n		<div class='row'>\n			<div class='span8'>				\n				";
  stack1 = self.invokePartial(partials['discover/search'], 'discover/search', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			    ";
  stack1 = self.invokePartial(partials['discover/chart'], 'discover/chart', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			</div>\n			<div class='span4'>\n				";
  stack1 = self.invokePartial(partials['discover/filter'], 'discover/filter', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			</div>\n		</div>\n		<div class='row'>\n			";
  stack1 = self.invokePartial(partials['discover/compare'], 'discover/compare', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</div>\n	</div>\n</section>";
  return buffer;
  });

this["app"]["tpl"]["discover/search.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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
  });