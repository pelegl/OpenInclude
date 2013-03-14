function encodeHTMLSource() {var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },matchHTML = /&(?!#?w+;)|<|>|"|'|\//g;return function() {return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;};};
String.prototype.encodeHTML=encodeHTMLSource();
var dt=dt|| {};
var partials = [];
partials['css'] = '<link href="/static/css/app.min.css" rel="stylesheet" type="text/css" media="screen" />';
partials['footer'] = '<footer><div class="wrapper"><p>2013 Open Include.</p></div></footer><script type="text/javascript">var _gaq = _gaq || [];_gaq.push([\'_setAccount\', \'UA-23203675-4\']);_gaq.push([\'_trackPageview\']);(function() {var ga = document.createElement(\'script\'); ga.type = \'text/javascript\'; ga.async = true;ga.src = (\'https:\' == document.location.protocol ? \'https://ssl\' : \'http://www\') + \'.google-analytics.com/ga.js\';var s = document.getElementsByTagName(\'script\')[0]; s.parentNode.insertBefore(ga, s);})();</script>';
partials['header'] = '<header class="navbar navbar-static-top"><div class="navbar-inner"><div class="container"><!-- .btn-navbar is used as the toggle for collapsed navbar content --><a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse"><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></a><!-- Be sure to leave the brand out there if you want it shown --><a class="brand" href="/"></a><!-- Everything you want hidden at 940px or less, place within here --><div class="nav-collapse collapse"><ul class="nav pull-right">{{? it.user}}<li><a href="{{=it.logout_url}}" class="button">sign out</a></li><li><a href="{{=it.profile_url}}" class="button">profile</a></li><li><a href="{{=it.dashboard_url}}" class="button">dashboard</a></li>{{??}}<li><a href="{{=it.signin_url}}" class="button">sign in</a></li>{{?}}<li><a href="{{=it.discover_url}}" class="button">discover</a></li><li><a href="{{=it.how_to_url}}" class="button">how to</a></li><li><a href="{{=it.modules_url}}" class="button">modules</a></li></ul></div></div></div></header>';
partials['how-to'] = '<div class=\'container profile\'><div class=\'row\'><div class=\'span12\'><h2>{{= it.title }}</h2><h3>Features</h3><ul class=\'unstyled\'><li>Discover</li><li>Demo</li><li>Integrate</li><li>Contribute</li></ul><h3>Upcoming Features</h3><ul class=\'unstyled\'><li>Cool feature #1</li><li>Cool feature #2</li><li>Cool feature #3</li></ul></div></div></div>';
partials['index'] = '<div class="wrapper" {{? it.in_stealth_mode}}style="width:740px"{{?}}><div class="features"><ul><li> <a href="{{? !it.in_stealth_mode}}/discover{{?}}"><div class="box"><img src="{{=it.STATIC_URL}}images/icon-discover.png" alt=""><h2>Discover</h2><p>quality open source projects</p></div></a> </li><li> <a href="{{? !it.in_stealth_mode}}{% url demo %}{{?}}"><div class="box"><img src="{{=it.STATIC_URL}}images/icon-demo.png" alt=""><h2>Demo</h2><p>on our virtual machines</p></div></a> </li><li> <a href="{{? !it.in_stealth_mode}}{% url integrate %}{{?}}"><div class="box"><img src="{{=it.STATIC_URL}}images/icon-integrate.png" alt=""><h2>Integrate</h2><p>into your current work</p></div></a> </li>{{? !it.in_stealth_mode}}<li> <a href="{% url contribute %}"><div class="box"><img src="{{=it.STATIC_URL}}images/icon-contribute.png" alt=""><h2>Contribute</h2><p>code or cash to the open source ecosystem</p></div></a> </li>{{?}}</ul></div>{{? it.in_stealth_mode }}<div class="email"><form  class="email-form" action="/prelaunch/email/" method="POST"><input type="text" name="email" placeholder="email address - we will get in touch for the launch.">{{=it.csrf_token}}<button type="submit">submit</button></form></div>{{?}}{{? !it.in_stealth_mode}}<div class="search"><form  class="search-form" action="/discover" method="GET"><input type="text" name="query" placeholder="discover an open source project"><button type="submit">search</button></form><a href="#" class="advanced">advanced search</a></div><div class="search-terms"><h3>sample search terms:</h3><ul class=\'unstyled\'><li><a href="#">neural net python</a></li><li><a href="#">prime number generator java</a></li><li><a href="#">scraping toolkit</a></li><li><a href="#">sleek web design</a></li></ul></div>{{?}}</div>';
partials['scripts'] = '<script type="text/javascript" src="/static/js/jquery-1.9.1.min.js"></script><script type="text/javascript" src="/static/js/jquery.nicescroll.js"></script><script type="text/javascript" src="/static/js/bootstrap.min.js"></script><script type="text/javascript" src="/static/js/d3.min.js"></script><script type="text/javascript" src="/static/js/humanize.js"></script><script type="text/javascript" src="/static/js/underscore.js"></script><script type="text/javascript" src="/static/js/backbone.min.js"></script><script type="text/javascript" src="/static/js/backbone.paginator.js"></script><script type="text/javascript" src="/static/js/backbone.syphon.js"></script><script type="text/javascript" src="/static/js/handlebars.runtime.js"></script><script type="text/javascript" src="/static/js/dot.js"></script><script type="text/javascript" src="/static/js/templates.js"></script><script type="text/javascript" src="/static/js/templates-dot.js"></script><script type="text/javascript" src="/static/js/app.js"></script>';
partials['dashboard/create_project'] = '<form method=\'post\' action=\'\'><label for=\'pName\'>Project name</label><input type=\'text\' id=\'pName\' class=\'input-block-level\' name=\'project[name]\' required /><label for=\'tDescription\'>Description</label><textarea id="tDescription" class="input-block-level" name=\'project[description]\' required></textarea><div><a class="btn pull-left close-inline">Close</a><button type=\'submit\' class="btn btn-primary pull-left" style=\'margin-left: 20px\'>Confirm</button></div></form>';
partials['dashboard/create_task'] = '<form method=\'post\' action=\'\'><label for=\'tName\'>Task name</label><input type=\'text\' id=\'tName\' class=\'input-block-level\' name=\'task[name]\' required /><label for=\'tDescription\'>Description</label><textarea id="tDescription" class="input-block-level" name=\'task[description]\' required></textarea><div><a class="btn pull-left close-inline">Close</a><button type=\'submit\' class="btn btn-primary pull-left" style=\'margin-left: 20px\'>Confirm</button></div></form>';
partials['dashboard/dashboard'] = '<div class=\'container dashboard\'><div class=\'row\'><div class=\'span12\'><div class=\'row\'><div class=\'span3 dashboard-left\'><h3>Projects</h3><ul class="project-list nav nav-tabs nav-stacked">{{~it.projects :project}}<li rel="{{=project._id}}">{{? project.client.id == it.user._id }}[my] {{?}}{{=project.name}}{{? it.canEdit(it.user, project) }}<span class="pull-right"><a href="{{= it.dashboard_url }}/project/edit/{{=it.projectId}}" class="btn btn-warning btn-small" style="margin-top: -3px" rel="{{=project._id}}">Edit</a></span>{{?}}</li>{{~}}</ul><p id="create-project-inline"></p><p><a href="{{= it.dashboard_url }}/project/create" id="create-project-button" class="btn btn-success btn-small">Create</a></p></div><div class=\'span9 dashboard-right\'><div class="row"><div class=\'span7 main-area\'>{{? it.project}}<h3 id="project-name">{{=it.project.name}}</h3><h4 id="project-description">{{=it.project.description}}</h4><h5>Involved</h5>{{~ it.project.resources :resource}}<p><a href="/profile/view/{{=resource.name}}">{{=resource.name}}</a></p>{{~}}<h5>Owner</h5><p><a href="/profile/view/{{=it.project.client.name}}">{{=it.project.client.name}}</a></p>{{? it.isOwner }}<p><a href="{{=it.dashboard_url }}/project/delete/{{=it.projectId }}"id="delete-project-button" class="btn btn-danger btn-small">Delete</a></p>{{?}}<ul id="task-list" class="task-list nav nav-tabs nav-stacked">{{~ it.tasks :task}}<li rel="{{=task._id}}">{{=task.name}}</li>{{~}}</ul>{{? it.canWrite || it.isOwner }}<p id="create-task-inline"></p><p><a href="{{=it.dashboard_url }}/task/create/{{=it.projectId }}" id="create-task-button" class="btn btn-success btn-small">Create</a></p>{{?}}{{?}}</div><div class=\'span2 supplementary-area\'><h3>filters, etc</h3></div></div></div></div></div></div></div>';
partials['dashboard/edit_project'] = '{{? it.isOwner || it.canWrite }}<h3>Edit project “{{=it.project.name}}”</h3><form method=\'post\' action=\'\'><label for=\'name\'>Project name</label><input type=\'text\' id=\'name\' class=\'input-block-level\' name=\'project[name]\' value="{{=it.project.name}}" required /><label for=\'description\'>Description</label><textarea id="description" class="input-block-level" name=\'project[description]\' required>{{=it.project.description}}</textarea>{{? it.isOwner || it.canGrant }}<label for=\'resources\'>Resources</label><textarea id="resources" class="input-block-level" name=\'project[resources]\'>{{~ it.project.resources :resource}}@{{=resource.name}} {{~}}</textarea><label for=\'read\'>Grant read permissions to</label><textarea id="read" class="input-block-level" name=\'project[read]\'>{{~ it.project.read :resource}}@{{=resource.name}} {{~}}</textarea><label for=\'write\'>Grant write permissions to</label><textarea id="write" class="input-block-level" name=\'project[write]\'>{{~ it.project.write :resource}}@{{=resource.name}} {{~}}</textarea><label for=\'grant\'>Grant grant permissions to</label><textarea id="grant" class="input-block-level" name=\'project[grant]\'>{{~ it.project.grant :resource}}@{{=resource.name}} {{~}}</textarea>{{?}}<div><a class="btn pull-left close-inline">Close</a><button type=\'submit\' class="btn btn-primary pull-left" style=\'margin-left: 20px\'>Confirm</button></div></form>{{??}}<h3>Sorry, you do not have permission to edit this project.</h3>{{?}}';
partials['discover/chart'] = '<div class=\'row-fluid searchChart\' data-chart=\'{{=it.searchData}}\' data-maxScore=\'{{=it.maxScore}}\'><div class=\'span12\' id=\'searchChart\'></div></div>';
partials['discover/compare'] = '<div class=\'span12 moduleComparison\'><table class=\'table table-striped table-hover\'><thead><tr>{{~ it.headers :header}}{{? !header.key }}<th>{{=header.name}}</th>{{??}}<th><a href=\'#\' data-sort=\'{{=header.key}}\' {{? header.active}}class=\'active\'{{?}}>{{=header.name}}{{? header.directionBottom}}<i class=\'icon-chevron-down\'></i>{{??}}<i class=\'icon-chevron-up\'></i>{{?}}</a></th>{{?}}{{~}}</tr></thead><tbody>{{~ it.projects :project}}<tr><td>{{=project._source.module_name}}</td><td>{{=project._source.language}}</td><td>#</td><td>{{=project.lastCommitHuman}}</td><td>{{=project._source.watchers}}</td><td>#</td><td>#</td></tr>{{~}}</tbody>{{? !it.projects}}<tfoot><tr><td colspan=7><h3>click on the project\'s bubble to add it to the comparison list</h3></td></tr></tfoot>{{?}}</table></div>';
partials['discover/filter'] = '<h3>Filter</h3>{{~ it.filters :filter}}<div class=\'filterBox\'><h4>{{=filter.name}} <a href=\'#\' class=\'pull-right\' data-reset=\'{{=filter.key}}\'>reset filter</a></h4><ul class=\'unstyled\'>{{~ filter.languages :language}}<li><label class=\'checkbox\'><input type=\'checkbox\' name=\'{{=filter.key}}\' value="{{=language}}" /> {{language}}</label></li>{{~}}</ul></div>{{~}}';
partials['discover/search'] = '<div class="search"><form  class="search-form" action="{{=it.discover_search_action}}" method="GET"><input type="text" name="q" placeholder="discover an open source project" value="{{=it.discover_search_query}}"><button type="submit">search</button></form></div>';
partials['member/agreement'] = '<div class=\'row-fluid agreementContainer\'><div class=\'span12\'><form class=\'agreement\' method=\'post\' action=\'{{=it.agreement_signup_action}}\' ><legend>Terms of Service</legend><div class=\'agreementWrapper\'><div class=\'agreementText\'>{{=it.agreement_text}}</div></div><button type=\'submit\' class=\'btn btn-success pull-left\'>Upgrade Account</button><label class=\'checkbox\'><input type=\'checkbox\' name=\'signed\' value=\'signed\' /> I agree with the TOA<!-- change the wording later --></label></form></div></div>';
partials['member/credit_card'] = '<div class=\'dropdown-menu\'><form role="menu" method=\'post\' action=\'{{=it.update_credit_card}}\'><div class=\'row-fluid\'><div class=\'span12\'><div class=\'controls-row\'><input type=\'text\' class=\'span6\' name=\'card[givenName]\' placeholder="Given name" required /><input type=\'text\' class=\'span6\' name=\'card[lastName]\' placeholder="Last name" required /></div><div class=\'controls-row\'><input type=\'text\' id=\'ccNumber\' class=\'span12\' name=\'card[number]\' required placeholder="Card Number" pattern="[0-9]{4}[ \-]?[0-9]{4}[ \-]?[0-9]{4}[ \-]?[0-9]{4}" /></div><div class=\'controls-row\'><input type=\'text\' id=\'ccExpiration\' class=\'span6\' name=\'card[expiration]\' required placeholder="MM/YYYY" pattern="[0-9]{2}/[0-9]{4}" /><input type=\'text\' id=\'ccCVV\' class=\'span6\'  name=\'card[cvv]\' required pattern="[0-9]{3}" placeholder="CVV" /></div><div class=\'controls-row\'><button type=\'submit\' class="btn btn-primary pull-right">Update credit card</button></div></div></div></form></div>';
partials['member/profile'] = '<div class=\'container profile\'><div class=\'row\'><div class=\'span12\'><div class=\'row\'><div class=\'span4\'><div class=\'personalInformation\'><img src="http://www.gravatar.com/avatar/{{= it.user.github_avatar_url }}?s=210" class=\'avatar\'  /><h3>{{= it.user.github_display_name }}</h3><h4><a href=\'https://github.com/{{= it.user.github_username }}\' target="_blank" class=\'muted\'>{{= it.user.github_username }}</a></h4><hr />{{? it.private }}<h4>Account type</h4><div class=\'accountType\'><div class=\'type\'><div><div class=\'status\'>{{? it.user.merchant }}{{? it.user.has_stripe }}<i class=\'icon-ok\'></i>{{??}}<button class=\'btn btn-info btn-mini setupPayment\'>setup payment method</button>{{?}}{{??}}<a href=\'{{= it.merchant_agreement }}\' class=\'btn btn-success btn-mini backbone\'>Sign Up</a>{{?}}</div><p>Client</p></div></div><div class=\'type\'><div><div class=\'status\'>{{? it.user.employee }}<i class=\'icon-ok\'></i>{{??}}<a href=\'{{= it.developer_agreement }}\' class=\'btn btn-success btn-mini backbone\'>Sign Up</a>{{?}}</div><p>Developer</p></div></div><div class=\'type\'><div><div class=\'status\'>{{? it.user.trello_id }}<i class=\'icon-ok\'></i>{{??}}<a href=\'{{= it.trello_auth_url }}\' class=\'btn btn-success btn-mini\'>Authorize</a>{{?}}</div><p>Trello</p></div></div></div><hr />{{?}}<div class=\'contactData\'><div class=\'contact\'><i class=\'icon-envelope\'></i> <a class=\'muted\' href="mailto:{{= it.user.github_email }}">{{= it.user.github_email }}</a></div></div></div></div><div class=\'span8 informationBox\'>{{= it.informationBox }}</div></div></div></div></div>';
partials['module/index'] = '<div class=\'container module\'><div class=\'row\'><div class=\'span12\'><h2>Language list</h2><ul class=\'unstyled\' data-languages=\'{{=it.prepopulation}}\'>{{~ it.languages :language}}<li><a href=\'{{=it.modules_url}}/{{=language.name}}\'>{{=language.name}}</a></li>{{~}}</ul>{{? it.pages}}<div class="pagination pagination-centered"><ul>{{? it.prev}}<li><a href="?page={{=it.prev}}">Prev</a></li>{{??}}<li class=\'disabled\'><a>Prev</a></li>{{?}}{{~ it.pages :page}}<li {{? page.isActive}}class=\'active\'{{?}}><a href="?page={{=page.link}}">{{=page.text}}</a></li>{{~}}{{? it.next}}<li><a href="?page={{=it.next}}">Next</a></li>{{??}}<li class=\'disabled\'><a>Next</a></li>{{?}}</ul></div>{{?}}</div></div></div>';
partials['module/modules'] = '<div class=\'container module\'><div class=\'row\'><div class=\'span12\'><h2>{{=it.language}}: Module list</h2><ul class=\'unstyled\' data-modules=\'{{=it.prepopulation}}\'>{{~ it.modules :module}}<li><a href=\'{{=it.modules_url}}/{{=module.language}}/{{=module.owner}}|{{=module.module_name}}\'>{{=module.module_name}}</a></li>{{~}}</ul>{{? it.pages}}<div class="pagination pagination-centered"><ul>{{? it.prev}}<li><a href="?page={{=it.prev}}">Prev</a></li>{{??}}<li class=\'disabled\'><a>Prev</a></li>{{?}}{{~ it.pages :page}}<li {{? page.isActive}}class=\'active\'{{?}}><a href="?page={{=page.link}}">{{=page.text}}</a></li>{{~}}{{? it.next}}<li><a href="?page={{=it.next}}">Next</a></li>{{??}}<li class=\'disabled\'><a>Next</a></li>{{?}}</ul></div>{{?}}</div></div></div>';
partials['module/view'] = '<div class=\'container module\'><div class=\'row\'><div class=\'span12\' data-repo=\'{{=it.prepopulate}}\'><h2>{{=it.module.module_name}}</h2><div class=\'row\'><div class=\'span6\'><!-- stacked bar chart #52 weeks history --><div class=\'commitHistory\'></div></div><div class=\'span6\'><!-- bar chart #52 weeks history --><div class=\'starsHistory\'></div></div></div><div><!-- multi series - new questions, new answers #52 week history --><div class=\'stackQAHistory\'></div></div></div></div></div>';
partials['payment/index'] = '<div class=\'container discover\'><h5>Hello World!</h5></div>';
partials['registration/login'] = '<div class=\'container login\'><div class=\'row\'><div class=\'offset2 span8 text-center\'><form name="signin" method="post" action=""><a href="{{= it.github_auth_url}}" class="github-auth">Authenticate with GitHub</a></form></div></div></div>';
partials['registration/trello'] = '<div class=\'container login\'><div class=\'row\'><div class=\'offset2 span8 text-center\'><form name="signin" method="post" action=""><a href="{{=it.trello_auth_url}}" class="trello-auth">Authenticate Trello</a></form></div></div></div>';
 dt['css']=doT.template(partials['css']);

 dt['footer']=doT.template(partials['footer']);

 dt['header']=doT.template(partials['header']);

 dt['how-to']=doT.template(partials['how-to']);

 dt['index']=doT.template(partials['index']);

 dt['scripts']=doT.template(partials['scripts']);

 dt['dashboard/create_project']=doT.template(partials['dashboard/create_project']);

 dt['dashboard/create_task']=doT.template(partials['dashboard/create_task']);

 dt['dashboard/dashboard']=doT.template(partials['dashboard/dashboard']);

 dt['dashboard/edit_project']=doT.template(partials['dashboard/edit_project']);

 dt['discover/chart']=doT.template(partials['discover/chart']);

 dt['discover/compare']=doT.template(partials['discover/compare']);

 dt['discover/filter']=doT.template(partials['discover/filter']);

 dt['discover/search']=doT.template(partials['discover/search']);

 dt['member/agreement']=doT.template(partials['member/agreement']);

 dt['member/credit_card']=doT.template(partials['member/credit_card']);

 dt['member/profile']=doT.template(partials['member/profile']);

 dt['module/index']=doT.template(partials['module/index']);

 dt['module/modules']=doT.template(partials['module/modules']);

 dt['module/view']=doT.template(partials['module/view']);

 dt['payment/index']=doT.template(partials['payment/index']);

 dt['registration/login']=doT.template(partials['registration/login']);

 dt['registration/trello']=doT.template(partials['registration/trello']);

 dt['discover/index']=doT.template('<div class=\'container discover\'><div class=\'row\'><div class=\'span8\'>{{#def.partials[\'discover/search\']}}{{#def.partials[\'discover/chart\']}}</div><div class=\'span4\'><div class=\'filter\'>{{#def.partials[\'discover/filter\']}}</div></div></div><div class=\'row\' id=\'moduleComparison\'>{{#def.partials[\'discover/compare\']}}</div></div>', undefined, { partials: partials });

window.dt = dt;