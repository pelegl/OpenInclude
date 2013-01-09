from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, redirect
from django.template import RequestContext
from django.core.urlresolvers import reverse
from django.contrib.auth.decorators import login_required

import settings

from forms import EmailForm


def email(request, template="prelaunch/email.html"):
    """ collect visitor's email
    """
    if request.method == 'POST':
        form = EmailForm
        form = form(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            if email == "admin":
                return render_to_response(template, {}, context_instance=RequestContext(request))
            form = form.save(commit=False)
            form.save()
    elif request.method == "GET":
        email = request.GET.get("email", None)
        password = request.GET.get("password", None)
        if email == "clear":
            request.session["in_stealth_mode"] = True
        elif password == "admin":
            request.session["in_stealth_mode"] = False

    return redirect("/")
