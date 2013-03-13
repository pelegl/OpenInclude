function encodeHTMLSource() {var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },matchHTML = /&(?!#?w+;)|<|>|"|'|\//g;return function() {return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;};};
String.prototype.encodeHTML=encodeHTMLSource();
var dt=dt|| {};
 dt['header']=doT.template('<header><div class="wrapper"><h1><a href="/" title="Open Include">Open Include</a></h1>{{? !it.in_stealth_mode }}{{? it.user}}<div class="sign-in"><a href="{{logout_url}}" class="button">sign out</a></div><div class="sign-in"><a href="{{profile_url}}" class="button">profile</a></div><div class="sign-in"><a href="{{dashboard_url}}" class="button">dashboard</a></div>{{??}}<div class="sign-in"><a href="{{signin_url}}" class="button">sign in</a></div>{{?}}<div class="sign-in"><a href="{{discover_url}}" class="button">discover</a></div><div class="sign-in"><a href="{{how_to_url}}" class="button">how to</a></div><div class="sign-in"><a href="{{modules_url}}" class="button">modules</a></div>{{?}}</div></header>');

 dt['dashboard/create_project']=doT.template('<form method=\'post\' action=\'\'><label for=\'pName\'>Project name</label><input type=\'text\' id=\'pName\' class=\'input-block-level\' name=\'project[name]\' required /><label for=\'tDescription\'>Description</label><textarea id="tDescription" class="input-block-level" name=\'project[description]\' required></textarea><div><a class="btn pull-left close-inline">Close</a><button type=\'submit\' class="btn btn-primary pull-left" style=\'margin-left: 20px\'>Confirm</button></div></form>');

 dt['dashboard/create_task']=doT.template('<form method=\'post\' action=\'\'><label for=\'tName\'>Task name</label><input type=\'text\' id=\'tName\' class=\'input-block-level\' name=\'task[name]\' required /><label for=\'tDescription\'>Description</label><textarea id="tDescription" class="input-block-level" name=\'task[description]\' required></textarea><div><a class="btn pull-left close-inline">Close</a><button type=\'submit\' class="btn btn-primary pull-left" style=\'margin-left: 20px\'>Confirm</button></div></form>');

 dt['dashboard/dashboard']=doT.template('<div class=\'container dashboard\'><div class=\'row\'><div class=\'span12\'><div class=\'row\'><div class=\'span3 dashboard-left\'><h3>Projects</h3><ul class="project-list nav nav-tabs nav-stacked">{{~it.projects :project}}<li rel="{{=project._id}}">{{? project.client.id == it.user._id }}[my] {{?}}{{=project.name}}{{? it.canEdit(it.user, project) }}<span class="pull-right"><a href="{{= it.dashboard_url }}/project/edit/{{=it.projectId}}" class="btn btn-warning btn-small" style="margin-top: -3px" rel="{{=project._id}}">Edit</a></span>{{?}}</li>{{~}}</ul><p id="create-project-inline"></p><p><a href="{{= it.dashboard_url }}/project/create" id="create-project-button" class="btn btn-success btn-small">Create</a></p></div><div class=\'span9 dashboard-right\'><div class="row"><div class=\'span7 main-area\'>{{? it.project}}<h3 id="project-name">{{=it.project.name}}</h3><h4 id="project-description">{{=it.project.description}}</h4><h5>Involved</h5>{{~ it.project.resources :resource}}<p><a href="/profile/view/{{=resource.name}}">{{=resource.name}}</a></p>{{~}}<h5>Owner</h5><p><a href="/profile/view/{{=it.project.client.name}}">{{=it.project.client.name}}</a></p>{{? it.isOwner }}<p><a href="{{=it.dashboard_url }}/project/delete/{{=it.projectId }}"id="delete-project-button" class="btn btn-danger btn-small">Delete</a></p>{{?}}<ul id="task-list" class="task-list nav nav-tabs nav-stacked">{{~ it.tasks :task}}<li rel="{{=task._id}}">{{=task.name}}</li>{{~}}</ul>{{? it.canWrite || it.isOwner }}<p id="create-task-inline"></p><p><a href="{{=it.dashboard_url }}/task/create/{{=it.projectId }}" id="create-task-button" class="btn btn-success btn-small">Create</a></p>{{?}}{{?}}</div><div class=\'span2 supplementary-area\'><h3>filters, etc</h3></div></div></div></div></div></div></div>');

 dt['dashboard/edit_project']=doT.template('{{? it.isOwner || it.canWrite }}<h3>Edit project “{{=it.project.name}}”</h3><form method=\'post\' action=\'\'><label for=\'name\'>Project name</label><input type=\'text\' id=\'name\' class=\'input-block-level\' name=\'project[name]\' value="{{=it.project.name}}" required /><label for=\'description\'>Description</label><textarea id="description" class="input-block-level" name=\'project[description]\' required>{{=it.project.description}}</textarea>{{? it.isOwner || it.canGrant }}<label for=\'resources\'>Resources</label><textarea id="resources" class="input-block-level" name=\'project[resources]\'>{{~ it.project.resources :resource}}@{{=resource.name}} {{~}}</textarea><label for=\'read\'>Grant read permissions to</label><textarea id="read" class="input-block-level" name=\'project[read]\'>{{~ it.project.read :resource}}@{{=resource.name}} {{~}}</textarea><label for=\'write\'>Grant write permissions to</label><textarea id="write" class="input-block-level" name=\'project[write]\'>{{~ it.project.write :resource}}@{{=resource.name}} {{~}}</textarea><label for=\'grant\'>Grant grant permissions to</label><textarea id="grant" class="input-block-level" name=\'project[grant]\'>{{~ it.project.grant :resource}}@{{=resource.name}} {{~}}</textarea>{{?}}<div><a class="btn pull-left close-inline">Close</a><button type=\'submit\' class="btn btn-primary pull-left" style=\'margin-left: 20px\'>Confirm</button></div></form>{{??}}<h3>Sorry, you do not have permission to edit this project.</h3>{{?}}');

window.dt = dt;