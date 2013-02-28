from django.shortcuts import redirect

import settings

# Protection decorator for pages other than index in stealth phase
def in_stealth_mode(callable):
    def method(*args,**kws):
        if settings.STEALTH_MODE:
            if "in_stealth_mode" in args[0].session and not args[0].session["in_stealth_mode"]:
                return callable(*args,**kws)
            else:
                return redirect("/")
        else:
            return callable(*args,**kws)
    return method