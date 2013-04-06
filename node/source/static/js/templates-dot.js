function encodeHTMLSource() {var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },matchHTML = /&(?!#?w+;)|<|>|"|'|\//g;return function() {return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;};};
String.prototype.encodeHTML=encodeHTMLSource();
var dt=dt|| {};
var partials = [];
partials['css'] = '<link href="/static/css/app.min.css" rel="stylesheet" type="text/css" media="screen" />';
partials['footer'] = '<footer><!-- add text later --></footer><script type="text/javascript">var _gaq = _gaq || [];_gaq.push([\'_setAccount\', \'UA-23203675-4\']);_gaq.push([\'_trackPageview\']);(function() {var ga = document.createElement(\'script\'); ga.type = \'text/javascript\'; ga.async = true;ga.src = (\'https:\' == document.location.protocol ? \'https://ssl\' : \'http://www\') + \'.google-analytics.com/ga.js\';var s = document.getElementsByTagName(\'script\')[0]; s.parentNode.insertBefore(ga, s);})();</script>';
partials['how-to'] = '<div class=\'container profile\'><div class=\'row\'><div class=\'span12\'><h2>Features</h2><p>Open source modules presented and visualized for use in your project. Whether you\'re building a mashup or a Minimum Viable Product -- stand on the shoulders of giants. Reuse code from the public domain.  Browse and explore modules from github using Open Include\'s <a href=\'/discover\'>discovery</a> tool.</p><ul class=\'unstyled\' style=\'margin-left:10px\'><li><strong>Sample searches:</strong></li><li><a href=\'/discover?q=natural language processing\'>natural language processing</a></li><li><a href=\'/discover?q=machine learning\'>machine learning</a></li><li><a href=\'/discover?q=neural net\'>neural net</a></li><li><a href=\'/discover?q=tag cloud\'>tag cloud</a></li></ul><p>The visualizer shows relevance to the search term, relative time that the module was last updated, and popularity (denoted by size of the bubble).  Click on a bubble to add to the comparison list.  Click into the module to view trends of commits, watchers, and questions & answers on Stack Overflow, over time.</p><p>Open Include is, first, a resource for developers. When on the lookout for a great idea, developers can connect with startups working with Open Include. Collaborate to bring business vision to reality.</p><h2>Upcoming</h2><p>Open Include is expanding its suite of tools to better utilize the vast number of quality open source libraries. Next in the pipeline is to provide Virtual Machines to be spun up on demand, containing pre-installed open source modules. Minimize time spent configuring locally, and cleansing your personal machine of remnants of libraries that never quite worked out.</p></div></div></div>';
partials['index'] = '<div class=\'container\'><div class=\'row\'><div class=\'span12\'><div class="features text-center"><ul><li><a href="/{{= it.discover_url }}"><div class="box"><img src="{{=it.STATIC_URL}}images/icon-discover.png" alt=""><h2>Discover</h2><p>quality open source projects</p></div></a></li><li><a href="/{{= it.how_to_url }}"><div class="box"><img src="{{=it.STATIC_URL}}images/icon-demo.png" alt=""><h2>Demo</h2><p>on our virtual machines</p></div></a></li><li><a href="/{{= it.how_to_url }}"><div class="box"><img src="{{=it.STATIC_URL}}images/icon-integrate.png" alt=""><h2>Integrate</h2><p>into your current work</p></div></a></li></div></div></div></div>';
partials['menu'] = '{{~ it._menu: menu }}<li {{? menu.isActive }} class=\'active\' {{?}}><a href=\'{{= menu.url}}\'>{{= menu.text }}</a></li>{{~}}';
partials['scripts'] = '<script type="text/javascript" src="/static/js/jquery-1.9.1.min.js"></script><script type="text/javascript" src="/static/js/jquery.nicescroll.js"></script><script type="text/javascript" src="/static/js/bootstrap.min.js"></script><script type="text/javascript" src="/static/js/bootstrap-datepicker.js"></script><script type="text/javascript" src="/static/js/cookie.js"></script><script type="text/javascript" src="/static/js/d3.min.js"></script><script type="text/javascript" src="/static/js/humanize.js"></script><script type="text/javascript" src="/static/js/underscore.js"></script><script type="text/javascript" src="/static/js/backbone.min.js"></script><script type="text/javascript" src="/static/js/backbone.paginator.js"></script><script type="text/javascript" src="/static/js/backbone.syphon.js"></script><script type="text/javascript" src="/static/js/dot.js"></script><script type="text/javascript" src="/static/js/templates-dot.js"></script><script type="text/javascript" src="/static/js/moment.js"></script><script type="text/javascript" src="/static/js/app.js"></script>';
partials['suggest-idea'] = '<div class="share-common"><a href="#" role="button" class="share-ideas">Suggest Ideas</a><!-- Modal --><div id="shareYourThoughts" class="" tabindex="-1"><div class="modal-body"><button type="button" class="close">&times;</button><form >{{? !it.user}}<div class=\'control-group\'><div class=\'controls\'><input type="text" name="email" id=\'email\' placeholder="E-mail" /></div></div>{{?}}<div class=\'control-group\'><div class=\'controls\' for=\'ideas\'><textarea id=\'ideas\' name="ideas" rows="5" resize=\'none\' placeholder="Ideas..."></textarea></div></div></form></div><div class="modal-footer"><button class="submit btn btn-primary">Suggest</button></div></div></div>';
partials['admin/admin'] = '<div class=\'container admin\'><div class=\'row\'><div class=\'span12\'><h2>Admin Panel</h2><hr><div class=\'fluid-column-2 clearfix\'><div class=\'column-left\'><h3>Actions</h3><ul class=\'nav\'><li><a href=\'/{{= it.users_with_stripe}}\' class=\'backbone\'>View Users with Stripe</a></li></ul></div><div class=\'column-right\'><div class=\'informationBox\'>{{= it.informationBox || "" }}</div></div></div></div></div></div>';
partials['admin/users_with_stripe'] = '<div class=\'row-fluid\'><div class=\'span12\'><h3>Users with stripe added</h3><table class="table table-striped table-bordered userList"><thead><tr><th>User</th><th>Actions</th></tr></thead><tbody>{{~it.users :user}}<tr><td><a href=\'/profile/view/{{= user.github_username }}\' target="_blank" ><img src="http://www.gravatar.com/avatar/{{= user.github_avatar_url }}?s=40" class=\'avatar\'  />{{! user.github_username }}</a></td><td><a href=\'/admin/issue_bill/{{= user.github_username }}\' class=\'btn btn-success btn-mini backbone\'>Issue Bill</a></td></tr>{{~}}</tbody></table></div></div>';
partials['bills/table'] = '<table class=\'table table-bordered table-striped\'><thead><tr><th>Bill id</th><th>Issue date</th><th>Description</th><th>Amount</th><th>Actions</th></tr></thead><tbody>{{~it.bills :bill}}<tr><td><a href="{{= it.view_bills }}/{{= bill._id }}" class=\'backbone\'>{{= bill._id.toString().substr(0,10) }}...</a></td><td>{{= moment( bill._id.getTimestamp() ).format("LL") }}</td><td>{{! bill.description }}</td><td>{{= bill.amount }}$</td><td>&nbsp;</td></tr>{{~}}</tbody></table>';
partials['dashboard/create_project'] = '<form method=\'post\' action=\'\' class=\'inline-popover\'><input type=\'text\' class=\'input-block-level\' name=\'project[name]\' required placeholder="Project name" /><textarea class="input-block-level typeahead" name=\'project[description]\' required placeholder="Description"></textarea>{{? it.project }}<input type="hidden" name="project[parent]" value="{{= it.project._id }}" />{{?}}<button type=\'submit\' class="btn btn-success">Confirm</button><a href="#" class="close-inline">Close</a></form>';
partials['dashboard/create_task'] = '<form method=\'post\' action=\'\' class=\'inline-popover\'><input type=\'text\' class=\'input-block-level\' name=\'task[name]\' required placeholder="Task name" /><textarea class="input-block-level" name=\'task[description]\' required placeholder="Description"></textarea><input type="text" class="input-block-level" name="task[label]" placeholder="Task label" /><input type="text" class="input-block-level" name="task[due]" placeholder="Due date" /><input type="text" class="input-block-level" name="task[duration]" placeholder="Maximum duration" /><input type="text" class="input-block-level" name="task[price]" placeholder="Price" /><div><a class="btn pull-left close-inline">Close</a><button type=\'submit\' class="btn btn-primary pull-left" style=\'margin-left: 20px\'>Confirm</button></div></form>';
partials['dashboard/create_task_comment'] = '<form method=\'post\' action=\'\' class=\'inline-popover\'><textarea class="input-block-level" name=\'comment\' required placeholder="Your comment"></textarea><div><a class="btn pull-left close-inline">Close</a><button type=\'submit\' class="btn btn-primary pull-left" style=\'margin-left: 20px\'>Confirm</button></div></form>';
partials['dashboard/dashboard'] = '<div class=\'container dashboard\'><div class=\'row\'><div class=\'span12\'><div class=\'row\'><div class=\'span3 dashboard-left\'><h3>Projects</h3><hr/><ul class="project-list nav nav-tabs nav-stacked">{{~it.projects :project}}<li rel="{{=project._id}}">{{ for (i = 0; i < project.level; i++) { }}&nbsp{{ } }}{{? project.client.id == it.user._id }}[my]{{?}}{{=project.name}}{{? it.canEdit(it.user, project) }}<span class="pull-right"><a href="{{= it.dashboard_url }}/project/edit/{{=it.projectId}}"class="btn btn-warning btn-small" style="margin-top: -3px" rel="{{=project._id}}">Edit</a></span>{{?}}</li>{{~}}</ul><p id="create-project-inline"></p><p><a href="{{= it.dashboard_url }}/project/create" id="create-project-button" class="btn btn-small btn-success">Create</a></p></div><div class=\'span9 dashboard-right\'><div class="row-fluid"><div id="main-area" class=\'main-area\'>{{? it.project}}<h3 id="project-name">{{=it.project.name}}{{? it.isOwner }}{{? it.project.level < 4 }}<a href="{{=it.dashboard_url }}/project/create/{{=it.projectId }}" id="create-subproject-button" class="btn btn-success btn-small pull-right">Add subproject</a>&nbsp;{{?}}<a href="{{=it.dashboard_url }}/project/delete/{{=it.projectId }}"id="delete-project-button" class="btn btn-danger btn-small pull-right">Delete</a>{{?}}</h3><hr><h4 id="project-description" class=\'muted\'>{{=it.project.description}}</h4><div class=\'tag-list\'><h5>Involved</h5><ul class=\'inline unstyled\'>{{~ it.project.resources :resource}}<li><a href="/profile/view/{{=resource.name}}" class=\'label label-info\'>{{=resource.name}}</a></li>{{~}}</ul></div><div class=\'tag-list\'><h5>Owner</h5><ul class=\'inline unstyled\'>{{~ it.project.resources :resource}}<li><a href="/profile/view/{{=it.project.client.name}}" class=\'label\'>{{=it.project.client.name}}</a></li>{{~}}</ul></div>{{? it.tasks.length > 0 }}<h3>Tasks:</h3><ul id="task-list" class="task-list nav nav-tabs nav-stacked">{{~ it.tasks :task}}<li rel="{{=task._id}}">{{? task.person }}{{?}}<input type="checkbox" {{? task.completed }}checked{{?}} name=\'isCompleted\' /><span class="task-label">{{= task.label }}</span><span class="task-name">{{= task.name}}</span><span class="task-comments">Comments</span><span class="task-due pull-right">{{= moment(task.due).calendar() }}</span></li>{{~}}</ul>{{?}}{{? it.canWrite || it.isOwner }}<p id="create-task-inline"></p><p><a href="{{=it.dashboard_url }}/task/create/{{=it.projectId }}" id="create-task-button"class="btn btn-success btn-small">Create</a></p>{{?}}{{?}}</div></div></div></div></div></div></div><div id="typeahead"></div>';
partials['dashboard/edit_project'] = '{{? it.isOwner || it.canWrite }}<h3>Edit project “{{! it.project.name }}”</h3><form method=\'post\' action=\'\'><label for=\'name\'>Project name</label><input type=\'text\' id=\'name\' class=\'input-block-level\' name=\'project[name]\' value="{{! it.project.name }}" required /><label for=\'description\'>Description</label><textarea id="description" class="input-block-level" name=\'project[description]\' required>{{=it.project.description}}</textarea>{{? it.isOwner || it.canGrant }}<label for=\'resources\'>Resources</label><textarea id="resources" class="input-block-level" name=\'project[resources]\'>{{~ it.project.resources :resource}}@{{! resource.name }} {{~}}</textarea><label for=\'read\'>Grant read permissions to</label><textarea id="read" class="input-block-level" name=\'project[read]\'>{{~ it.project.read :resource}}@{{! resource.name }} {{~}}</textarea><label for=\'write\'>Grant write permissions to</label><textarea id="write" class="input-block-level" name=\'project[write]\'>{{~ it.project.write :resource}}@{{! resource.name }} {{~}}</textarea><label for=\'grant\'>Grant grant permissions to</label><textarea id="grant" class="input-block-level" name=\'project[grant]\'>{{~ it.project.grant :resource}}@{{! resource.name }} {{~}}</textarea>{{?}}<div><a class="btn pull-left close-inline">Close</a><button type=\'submit\' class="btn btn-primary pull-left" style=\'margin-left: 20px\'>Confirm</button></div></form>{{??}}<h3>Sorry, you do not have permission to edit this project.</h3>{{?}}';
partials['dashboard/search'] = '<form method=\'post\' action=\'\' class=\'inline-popover\'><input type="text" name="search" class="input-block-level" placeholder="Search for..."/><input type="text" name="from" class="input-block-level" placeholder="Deadline after"/><input type="text" name="to" class="input-block-level" placeholder="Deadline before"/><div><input type="submit" class="btn btn-success" value="Search"/></div></form>{{? it.tasks }}<h4>Found tasks:</h4>{{~ it.tasks :task }}<div class="task-view"><a href="/dashboard/project/{{= task.project }}/task/{{= task._id }}">{{= task.name }}</a></div>{{~}}{{?}}';
partials['dashboard/task'] = '<h3>{{= it.task.name }}</h3><h4>{{= it.task.description }} <small>{{= it.task.label}}</small></h4>{{? it.task.person }}<h5><a href="/profile/view/{{= it.task.person.link }}">{{= it.task.person.name }}</a> is working on this!</h5>{{?}}<span class="task-worked">Worked: <span id="timer">{{= it.task.logged }}</span></span><span class="task-runway">Maximum: {{= it.task.duration }}</span><span class="task-due pull-right">Deadline: {{= moment(it.task.due).calendar() }}</span><ul class="task-comments">{{~ it.task.comments :comment}}<li>{{= comment.text }} by <a href="/profile/view/{{= comment.author_link}}">{{= comment.author }}</a> on {{= moment(comment.date).calendar() }}</li>{{~}}</ul><a href="#" id="task-add-comment-button" class="btn btn-small btn-success">Add comment</a> {{? !it.task.person && it.task.duration > it.task.logged }}<a href="" id="task-check-in" class="btn btn-small">Check in</a>{{?}}<div id="task-add-comment-{{= it.task._id}}" style="margin-top: 10px"></div>';
partials['dashboard/typeahead'] = '<ul class="typeahead-container">{{~ it.suggestions :suggestion }}<li class="suggestion" rel="{{= suggestion.value }}">{{= suggestion.label }}</li>{{~}}</ul>';
partials['discover/chart'] = '<div class=\'row-fluid searchChart\' data-chart=\'{{= it.searchData || ""}}\' data-maxScore=\'{{= it.maxScore || ""}}\'><div class=\'span12\' id=\'searchChart\'></div></div>';
partials['discover/compare'] = '<div class=\'span12 moduleComparison\'><table class=\'table table-striped table-hover\'><thead><tr>{{~ it.headers :header}}{{? !header.key }}<th>{{=header.name}}</th>{{??}}<th><a href=\'#\' data-sort=\'{{= header.key }}\' {{? header.active}}class=\'active\'{{?}}><span class=\'name\'>{{! header.name }}</span>{{? header.directionBottom}}<i class=\'icon-chevron-down\'></i>{{??}}<i class=\'icon-chevron-up\'></i>{{?}}</a></th>{{?}}{{~}}<th>&nbsp;</th></tr></thead><tbody>{{~ it.projects :project}}<tr data-id="{{= project._id }}"><td><a href=\'/modules/{{= encodeURIComponent(project._source.language)}}/{{=project._source.owner}}|{{=project._source.module_name}}\'>{{! project._source.module_name }}</a></td><td><span class=\'color\' style=\'background: #{{=project.color}}\'></span>{{= project._source.language }}</td><td>{{= project.lastCommitHuman }}</td><td>{{= project._source.watchers }}</td><td>{{= project.asked }}</td><td>{{? project.asked > 0}}{{= Math.round(project.answered/project.asked*100) }}%{{??}}-{{?}}<td><button type="button" class=\'fade btn btn-mini btn-danger\'><i class=\'icon icon-remove\'></i></button></td></tr>{{~}}</tbody>{{? !it.projects}}<tfoot><tr><td colspan=7><h3>click on the project\'s bubble to add it to the comparison list</h3></td></tr></tfoot>{{?}}</table></div>';
partials['discover/filter'] = '<h3>Filter</h3>{{~ it.filters :filter}}<div class=\'filterBox\'><h4>{{=filter.name}}<a href=\'#\' class=\'pull-right\' data-reset=\'{{=filter.key}}\'>select all</a><a href=\'#\' class=\'pull-right\' data-clear=\'{{=filter.key}}\'>select none</a></h4><ul class=\'unstyled\'>{{~ filter.languages :language}}<li><label class=\'checkbox\'><span style="background:#{{= language.color}}" class="color"></span><input type=\'checkbox\' name=\'{{=filter.key}}\' value="{{! language.name }}" /> {{! language.name }}</label></li>{{~}}</ul></div>{{~}}';
partials['discover/search'] = '<div class="search"><form class="search-form" action="{{=it.discover_search_action}}" method="GET"><div class="input-append input-block-level"><input type="text" name="q" placeholder="Discover an open source project" value="{{! it.discover_search_query }}" class=\'input-block-level\'><button type="submit" class=\'btn btn-primary\'>search</button></div></form></div>';
partials['member/agreement'] = '<div class=\'row-fluid agreementContainer\'><div class=\'span12\'><form class=\'agreement\' method=\'post\' action=\'{{= it.agreement_signup_action }}\' ><legend>Terms of Service</legend><div class=\'agreementWrapper\'><div class=\'agreementText\'>{{! it.agreement_text }}</div></div><button type=\'submit\' class=\'btn btn-success pull-left\'>Upgrade Account</button><label class=\'checkbox\'><input type=\'checkbox\' name=\'signed\' value=\'signed\' /> I agree with the TOA<!-- change the wording later --></label></form></div></div>';
partials['member/alter_runway'] = '<form method=\'post\' action=\'\' class=\'inline-popover\'><input type="text" name="data" class="input-block-level" placeholder="New runway"/><div><a class="btn pull-left close-inline">Close</a><button type=\'submit\' class="btn btn-primary pull-left" style=\'margin-left: 20px\'>Confirm</button></div></form>';
partials['member/bill'] = '<div class="bill"><h4>Bill #{{= it.bill._id}} details</h4><hr><p><b>Description:</b> {{! it.bill.description}}</p><p><b>Issued:</b> {{= moment( it.bill._id.getTimestamp() ).format("LLL") }}</p><p><b>Amount:</b> {{! it.bill.amount }}$</p>{{? it.bill.user == it.user._id }}<div class=\'controls\'><button class=\'btn btn-success btn-mini authorizePayment\'>Authorize Payment</button><button class=\'btn btn-danger btn-mini declinePayment\'>Decline Payment</button></div>{{?}}</div>';
partials['member/credit_card'] = '<div class=\'dropdown-menu\'><form role="menu" method=\'post\' action=\'{{=it.update_credit_card}}\'><div class=\'row-fluid\'><div class=\'span12\'><div class=\'controls-row\'><input type=\'text\' class=\'span6\' name=\'card[givenName]\' placeholder="Given name" required /><input type=\'text\' class=\'span6\' name=\'card[lastName]\' placeholder="Last name" required /></div><div class=\'controls-row\'><input type=\'text\' id=\'ccNumber\' class=\'span12\' name=\'card[number]\' required placeholder="Card Number" pattern="[0-9]{4}[ \-]?[0-9]{4}[ \-]?[0-9]{4}[ \-]?[0-9]{4}" /></div><div class=\'controls-row\'><input type=\'text\' id=\'ccExpiration\' class=\'span6\' name=\'card[expiration]\' required placeholder="MM/YYYY" pattern="[0-9]{2}/[0-9]{4}" /><input type=\'text\' id=\'ccCVV\' class=\'span6\'  name=\'card[cvv]\' required pattern="[0-9]{3}" placeholder="CVV" /></div><div class=\'controls-row\'><button type=\'submit\' class="btn btn-primary pull-right">Update credit card</button></div></div></div></form></div>';
partials['member/new_connection'] = '<form method=\'post\' action=\'\' class=\'inline-popover\'><input type="text" name="reader" class="input-block-level" placeholder="Reader"/><input type="text" name="writer" class="input-block-level" placeholder="Writer"/><input type="hidden" name="reader_id" /><input type="hidden" name="writer_id" /><input type="text" name="charged" class="input-block-level" placeholder="Writer rate"/><input type="text" name="fee" class="input-block-level" placeholder="% fee"/><input type="text" name="data" class="input-block-level" placeholder="Runway"/><div><a class="btn pull-left close-inline">Close</a><button type=\'submit\' class="btn btn-primary pull-left" style=\'margin-left: 20px\'>Confirm</button></div></form>';
partials['member/runways'] = '<ul id="runways" class="nav nav-tabs">{{? it.user.groups.indexOf("admin") >= 0 }}<li><a href="#connections" data-toggle="tab">Connections</a></li>{{?}}{{? it.user.groups.indexOf("reader") >= 0 }}<li class="dropdown"><a href="/profile" class="dropdown-toggle" data-toggle="dropdown" data-target="#">Reader <b class="caret"></b></a><ul class="dropdown-menu" role="menu"><li><a href="#reader-runway" data-toggle="tab">Runway</a></li><li><a href="#reader-finance" data-toggle="tab">Finance</a></li></ul></li>{{?}}{{? it.user.groups.indexOf("writer") >= 0 }}<li class="dropdown"><a href="/profile" class="dropdown-toggle" data-toggle="dropdown" data-target="#">Writer <b class="caret"></b></a><ul class="dropdown-menu" role="menu"><li><a href="#writer-runway" data-toggle="tab">Runway</a></li><li><a href="#writer-finance" data-toggle="tab">Finance</a></li></ul></li>{{?}}</ul><div class="tab-content">{{? it.user.groups.indexOf("admin") >= 0 }}<div class="tab-pane" id="connections"><table class="table table-bordered table-condensed table-hover"><tr><th>Reader</th><th>Hourly charged</th><th>Writer</th><th>Hourly paid</th></tr>{{~ it.connections :connection }}<tr><td><a href="/profile/view/{{= connection.reader.name }}">{{= connection.reader.name }}</a></td><td>{{= connection.charged + connection.charged * connection.fee / 100 }}</td><td><a href="/profile/view/{{= connection.writer.name }}">{{= connection.writer.name }}</a></td><td>{{= connection.charged }}</td></tr>{{~}}</table><div><div style="margin-bottom: 20px"><a href="#" id="new-connection" class="btn btn-small btn-success">New connection</a></div><div id="new-connection-inline"></div></div></div>{{?}}{{? it.user.groups.indexOf("reader") >= 0 }}<div class="tab-pane" id="reader-runway"><table class="table table-bordered table-condensed table-hover"><tr><th>Writer</th><th>Hourly rate</th><th>Runway</th><th>Actions</th></tr>{{~ it.runways_reader :runway }}{{worked = 0;for (r in runway.runways){worked += parseInt(runway.runways[r].worked);}}}<tr><td><a href="/profile/view/{{= runway.writer.name }}">{{= runway.writer.name }}</a></td><td>{{= runway.charged + runway.charged * runway.fee / 100 }}</td><td>{{= runway.data }}</td><td><button id="alter-runway" rel="{{= runway._id }}" data-limit="{{= worked }}" class="btn btn-small btn-success">Alter</button><div id="alter-runway-inline" style="margin-top: 15px; display: none"></div></td></tr>{{~}}</table></div><div class="tab-pane" id="reader-finance">TODO</div>{{?}}{{? it.user.groups.indexOf("writer") >= 0 }}<div class="tab-pane" id="writer-runway"><table class="table table-bordered table-condensed table-hover"><tr><th>Reader</th><th>Hourly rate</th><th>Runway</th><th>Actions</th></tr>{{~ it.runways_writer :runway }}{{worked = 0;for (r in runway.runways){worked += parseInt(runway.runways[r].worked);}}}<tr><td><a href="/profile/view/{{= runway.reader.name }}">{{= runway.reader.name }}</a></td><td>{{= runway.charged }}</td><td>{{= worked }} / {{= runway.data }}</td><td>{{? worked >= runway.data }}Allowed time limit exceeded.{{??}}<button id="track-time" rel="{{= runway._id }}" data-limit="{{= runway.data - worked }}" class="btn btn-small btn-success">Track</button>{{?}}<div id="track-time-inline" style="margin-top: 15px; display: none"></div></td></tr>{{~}}</table></div><div class="tab-pane{{? it.active_tab == \'writer-finance\'}} active{{?}}" id="writer-finance"><div class="runway-date"><label>From<input type="text" name="start_date_writer" class="datepicker" value="{{= it.from == \'none\' ? \'\': it.from }}" /></label><label>To<input type="text" name="end_date_writer" class="datepicker" value="{{= it.to == \'none\' ? \'\': it.to }}" /></label><button id="writer-filter" class="btn btn-info">View</button></div><table class="table table-bordered table-condensed table-hover"><tr><th>Client</th><th>Paid</th><th>Pending</th></tr>{{~ it.runways_writer :finance }}{{paid = 0;pending = 0;for (r in finance.runways){data = finance.runways[r];m = moment(data.date);f = moment(it.from);t = moment(it.to);if (it.from != "none" && it.to != "none" && !((m.isAfter(f, \'day\') || m.isSame(f, \'day\')) && (m.isBefore(t, \'day\')) || m.isSame(t, \'day\'))) continue;if (data.paid) paid += data.charged; else pending += data.charged;}}}<tr><td><a href="/profile/view/{{= finance.writer.name }}">{{= finance.writer.name }}</a></td><td>{{= paid }}</td><td>{{= pending }}</td></tr>{{~}}</table></div>{{?}}</div><script>$(function() {$(".datepicker").datepicker();});</script>';
partials['member/track_time'] = '<form method=\'post\' action=\'\' class=\'inline-popover\'><input type="text" name="worked" class="input-block-level" placeholder="Amount worked"/><input type="text" name="memo" class="input-block-level" placeholder="Memo"/><div><a class="btn pull-left close-inline">Close</a><button type=\'submit\' class="btn btn-primary pull-left" style=\'margin-left: 20px\'>Confirm</button></div></form>';
partials['module/index'] = '<div class=\'container module\'><div class=\'row\'><div class=\'span12\'><h2>Language list</h2><ul class=\'unstyled\' data-languages=\'{{=it.prepopulation}}\'>{{~ it.languages :language}}<li><a href=\'{{=it.modules_url}}/{{=language.name}}\'>{{! language.name }}</a></li>{{~}}</ul>{{? it.pages}}<div class="pagination pagination-centered"><ul>{{? it.prev}}<li><a href="?page={{=it.prev}}">Prev</a></li>{{??}}<li class=\'disabled\'><a>Prev</a></li>{{?}}{{~ it.pages :page}}<li {{? page.isActive}}class=\'active\'{{?}}><a href="?page={{=page.link}}">{{=page.text}}</a></li>{{~}}{{? it.next}}<li><a href="?page={{=it.next}}">Next</a></li>{{??}}<li class=\'disabled\'><a>Next</a></li>{{?}}</ul></div>{{?}}</div></div></div>';
partials['module/modules'] = '<div class=\'container module\'><div class=\'row\'><div class=\'span12\'><h2>{{=it.language}}: Module list</h2><ul class=\'unstyled\' data-modules=\'{{=it.prepopulation}}\'>{{~ it.modules :module}}<li><a href=\'{{=it.modules_url}}/{{=module.language}}/{{=module.owner}}|{{=module.module_name}}\'>{{! module.module_name}}</a></li>{{~}}</ul>{{? it.pages}}<div class="pagination pagination-centered"><ul>{{? it.prev}}<li><a href="?page={{=it.prev}}">Prev</a></li>{{??}}<li class=\'disabled\'><a>Prev</a></li>{{?}}{{~ it.pages :page}}<li {{? page.isActive}}class=\'active\'{{?}}><a href="?page={{=page.link}}">{{=page.text}}</a></li>{{~}}{{? it.next}}<li><a href="?page={{=it.next}}">Next</a></li>{{??}}<li class=\'disabled\'><a>Next</a></li>{{?}}</ul></div>{{?}}</div></div></div>';
partials['module/view'] = '<div class=\'container module\'><div class=\'row\'><div class=\'span12\' data-repo=\'{{= it.prepopulate || "" }}\'><!--{{? !it.module.starred}}<button class=\'btn pull-right toolbar\' data-action=\'star\'><i class=\'icon-star\'></i> Star</button>{{??}}<button class=\'btn pull-right toolbar\' data-action=\'star\'><i class=\'icon-star-empty\'></i> Unstar</button>{{?}}--><h2>{{=it.module.owner}}/{{=it.module.module_name}}<small><a href="{{=it.module.url}}" class=\'muted\' target="_blank"> {{! it.module.url}}</a></small></h2><hr /><div class=\'row\'><div class=\'span6\'><!-- stacked bar chart #52 weeks history --><div class=\'commitHistory\'></div></div><div class=\'span6\'><!-- bar chart #52 weeks history --><div class=\'starsHistory\'></div></div></div><div><!-- multi series - new questions, new answers #52 week history --><div class=\'stackQAHistory\'></div></div></div></div></div>';
partials['payment/index'] = '<div class=\'container discover\'><h5>Hello World!</h5></div>';
partials['registration/login'] = '<div class=\'container login\'><div class=\'row\'><div class=\'offset2 span8 text-center\'><form name="signin" method="post" action="">{{? !it.user}}<a href="{{= it.github_auth_url}}" class="github-auth">Authenticate with GitHub</a>{{??}}<div class=\'welcome-back\'><img src=\'http://www.gravatar.com/avatar/{{= it.user.github_avatar_url }}?s=80\' /><p class=\'name\'>Hi, {{! it.user.github_display_name }}!<span class=\'controls clearfix\'><a href="{{= it.github_auth_url}}" class="btn btn-success">Sign in</a><a href="#" class="thats-not-me">That\'s not me</a></span></p></div>{{?}}</form></div></div></div>';
partials['registration/trello'] = '<div class=\'container login\'><div class=\'row\'><div class=\'offset2 span8 text-center\'><form name="signin" method="post" action=""><a href="{{=it.trello_auth_url}}" class="trello-auth">Authenticate Trello</a></form></div></div></div>';
 dt['css']=doT.template(partials['css']);

 dt['footer']=doT.template(partials['footer']);

 dt['how-to']=doT.template(partials['how-to']);

 dt['index']=doT.template(partials['index']);

 dt['menu']=doT.template(partials['menu']);

 dt['scripts']=doT.template(partials['scripts']);

 dt['suggest-idea']=doT.template(partials['suggest-idea']);

 dt['admin/admin']=doT.template(partials['admin/admin']);

 dt['admin/users_with_stripe']=doT.template(partials['admin/users_with_stripe']);

 dt['bills/table']=doT.template(partials['bills/table']);

 dt['dashboard/create_project']=doT.template(partials['dashboard/create_project']);

 dt['dashboard/create_task']=doT.template(partials['dashboard/create_task']);

 dt['dashboard/create_task_comment']=doT.template(partials['dashboard/create_task_comment']);

 dt['dashboard/dashboard']=doT.template(partials['dashboard/dashboard']);

 dt['dashboard/edit_project']=doT.template(partials['dashboard/edit_project']);

 dt['dashboard/search']=doT.template(partials['dashboard/search']);

 dt['dashboard/task']=doT.template(partials['dashboard/task']);

 dt['dashboard/typeahead']=doT.template(partials['dashboard/typeahead']);

 dt['discover/chart']=doT.template(partials['discover/chart']);

 dt['discover/compare']=doT.template(partials['discover/compare']);

 dt['discover/filter']=doT.template(partials['discover/filter']);

 dt['discover/search']=doT.template(partials['discover/search']);

 dt['member/agreement']=doT.template(partials['member/agreement']);

 dt['member/alter_runway']=doT.template(partials['member/alter_runway']);

 dt['member/bill']=doT.template(partials['member/bill']);

 dt['member/credit_card']=doT.template(partials['member/credit_card']);

 dt['member/new_connection']=doT.template(partials['member/new_connection']);

 dt['member/runways']=doT.template(partials['member/runways']);

 dt['member/track_time']=doT.template(partials['member/track_time']);

 dt['module/index']=doT.template(partials['module/index']);

 dt['module/modules']=doT.template(partials['module/modules']);

 dt['module/view']=doT.template(partials['module/view']);

 dt['payment/index']=doT.template(partials['payment/index']);

 dt['registration/login']=doT.template(partials['registration/login']);

 dt['registration/trello']=doT.template(partials['registration/trello']);

 dt['header']=doT.template('<header class="navbar navbar-fixed-top"><div class="navbar-inner"><div class="container"><!-- .btn-navbar is used as the toggle for collapsed navbar content --><a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse"><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></a><!-- Be sure to leave the brand out there if you want it shown --><a class="brand" href="/"></a><!-- Everything you want hidden at 940px or less, place within here --><div class="nav-collapse collapse"><ul class="nav pull-right navigationMenu" data-menu=\'{{= JSON.stringify(it._menu) }}\'>{{#def.partials[\'menu\']}}</ul><form class="navbar-search pull-right form-search" method=\'get\' action="/discover"><div class=\'input-append\'><input type="text" class="search-query" name=\'q\' placeholder="Discover..."><button class="btn" type="submit"><i class=\'icon-search\'></i></button></div></form></div></div></div></header>', undefined, { partials: partials });

 dt['admin/bill']=doT.template('<div class=\'row-fluid billing\'><div class=\'span12\'><div class=\'customer\'><img src=\'http://www.gravatar.com/avatar/{{= it.user.github_avatar_url }}?s=40\' /><p class=\'name\'>{{! it.user.github_display_name }}</p></div><form method=\'POST\' action=\'{{= it.bills_action }}\' class=\'form-horizontal\'><legend>Issue a bill<span class="help-inline error"></span></legend><input type=\'hidden\' class=\'span6\' name=\'bill[user]\' value=\'{{= it.user._id }}\' ><div class=\'control-group\'><label class=\'control-label\' for=\'billAmount\'>Amount</label><div class=\'controls\'><input type=\'number\' id="billAmount" class=\'span6\' name=\'bill[amount]\' placeholder="1$" /></div></div><div class=\'control-group\'><label class=\'control-label\' for=\'billDescription\'>Description</label><div class=\'controls\'><input type=\'text\' id="billDescription" class=\'span6\' name=\'bill[description]\' placeholder="Enter a custom description for the customer" /></div></div><div class=\'control-group\'><div class=\'controls\'><button type=\'submit\' class="btn btn-primary pull-left">Issue bill</button></div></div></form><hr /><div class=\'bills\'>{{#def.partials["bills/table"]}}</div></div></div>', undefined, { partials: partials });

 dt['discover/index']=doT.template('<div class=\'container discover\'><div class=\'row\'><div class=\'span8\'>{{#def.partials[\'discover/chart\']}}</div><div class=\'span4\'><div class=\'filter\'>{{#def.partials[\'discover/filter\']}}</div></div></div><div class=\'row\' id=\'moduleComparison\'>{{#def.partials[\'discover/compare\']}}</div></div>', undefined, { partials: partials });

 dt['member/bills']=doT.template('<div class="bills"><h2> Bills </h2>{{#def.partials["bills/table"]}}</div>', undefined, { partials: partials });

 dt['member/profile']=doT.template('<div class=\'container profile\'><div class=\'row\'><div class=\'span12\'><div class=\'row\'><div class=\'span4\'><div class=\'personalInformation\'><img src="http://www.gravatar.com/avatar/{{= it.user.github_avatar_url }}?s=210" class=\'avatar\'  /><h3>{{! it.user.github_display_name }}</h3><h4><a href=\'https://github.com/{{! it.user.github_username }}\' target="_blank" class=\'muted\'>{{! it.user.github_username }}</a></h4><hr />{{? it.private }}<h4>Account type</h4><div class=\'accountType\'><div class=\'type\'><div><div class=\'status\'>{{? it.user.merchant && it.user.groups.indexOf("reader") >= 0 }}{{? it.user.has_stripe }}<a href=\'{{= it.bills }}\' class=\'btn btn-success btn-mini backbone\'>View Bills</a>{{??}}<div class=\'dropup setupPayment\'><button class="btn btn-info btn-mini">Setup payment method</button>{{#def.partials[\'member/credit_card\']}}</div>{{?}}{{??}}<a href=\'{{= it.merchant_agreement }}\' class=\'btn btn-success btn-mini backbone\'>Sign Up</a>{{?}}</div><p>Client</p></div></div><div class=\'type\'><div><div class=\'status\'>{{? it.user.employee && it.user.groups.indexOf("writer") >= 0 }}<i class=\'icon-ok\'></i>{{??}}<a href=\'{{= it.developer_agreement }}\' class=\'btn btn-success btn-mini backbone\'>Sign Up</a>{{?}}</div><p>Developer</p></div></div><div class=\'type\'><div><div class=\'status\'>{{? it.user.trello_id }}<i class=\'icon-ok\'></i>{{??}}<a href=\'{{= it.trello_auth_url }}\' class=\'btn btn-success btn-mini\'>Authorize</a>{{?}}</div><p>Trello</p></div></div></div><hr />{{?}}<div class=\'contactData\'><div class=\'contact\'><i class=\'icon-envelope\'></i> <a class=\'muted\' href="mailto:{{= it.user.github_email }}">{{! it.user.github_email }}</a></div></div></div></div><div class=\'span8\'><div>{{#def.partials[\'member/runways\']}}</div><div class=\'informationBox\'>{{= it.informationBox || "" }}</div></div></div></div></div></div>', undefined, { partials: partials });

window.dt = dt;