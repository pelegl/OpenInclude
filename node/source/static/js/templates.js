this["hbt"] = this["hbt"] || {};

Handlebars.registerPartial("module/modules", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data,depth1) {
  
  var buffer = "", stack1;
  buffer += "\n          ";
  stack1 = helpers['with'].call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.programWithDepth(program2, data, depth1),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  return buffer;
  }
function program2(depth0,data,depth2) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n          <li><a href='"
    + escapeExpression(((stack1 = depth2.modules_url),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/"
    + escapeExpression(((stack1 = depth2.language),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/";
  if (stack2 = helpers.owner) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.owner; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "|";
  if (stack2 = helpers.module_name) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.module_name; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "'>";
  if (stack2 = helpers.module_name) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.module_name; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "</a></li>\n          ";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <div class=\"pagination pagination-centered\">\n          <ul>\n            ";
  stack1 = helpers['if'].call(depth0, depth0.prev, {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            \n            ";
  stack1 = helpers.each.call(depth0, depth0.pages, {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            \n            ";
  stack1 = helpers['if'].call(depth0, depth0.next, {hash:{},inverse:self.program(15, program15, data),fn:self.program(13, program13, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "      \n                \n          </ul>\n        </div>\n      ";
  return buffer;
  }
function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <li><a href=\"?page=";
  if (stack1 = helpers.prev) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.prev; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">Prev</a></li>\n            ";
  return buffer;
  }

function program7(depth0,data) {
  
  
  return "\n            <li class='disabled'><a>Prev</a></li>\n            ";
  }

function program9(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n              ";
  stack1 = helpers['with'].call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            ";
  return buffer;
  }
function program10(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n              <li ";
  stack1 = helpers['if'].call(depth0, depth0.isActive, {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n                <a href=\"?page=";
  if (stack1 = helpers.link) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.link; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.text) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.text; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a>\n              </li>\n              ";
  return buffer;
  }
function program11(depth0,data) {
  
  
  return "class='active'";
  }

function program13(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <li><a href=\"?page=";
  if (stack1 = helpers.next) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.next; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">Next</a></li>\n            ";
  return buffer;
  }

function program15(depth0,data) {
  
  
  return "\n            <li class='disabled'><a>Next</a></li>\n            ";
  }

  buffer += "<div class='container module'>\n  <div class='row'>\n    <div class='span12'>\n      <h2>";
  if (stack1 = helpers.language) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.language; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ": Module list</h2>\n      <ul class='unstyled' data-modules='";
  if (stack1 = helpers.prepopulation) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.prepopulation; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>\n        ";
  stack1 = helpers.each.call(depth0, depth0.modules, {hash:{},inverse:self.noop,fn:self.programWithDepth(program1, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </ul>\n      ";
  stack1 = helpers['if'].call(depth0, depth0.pages, {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n  </div>  \n</div>";
  return buffer;
  }));