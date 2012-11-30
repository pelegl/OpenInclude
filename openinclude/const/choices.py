class Choices:
    @classmethod
    def get_value(cls, key):
        for item in cls.CHOICES:
            if item[0] == key:
                return item[1]
        return ""


class ProjectTypeChoices(Choices):
    library = 0
    snippet = 1

    CHOICES = (
        (library, "library"),
        (snippet, "snippet"),
    )

class ProjectLanguageChoices(Choices):
    c = 0
    cplusplus = 1
    csharp  = 2
    python = 3
    ruby = 4
    java = 5

    CHOICES = (
        (c, "c"),
        (cplusplus, "c++"),
        (csharp, "c#"),
        (python, "python"),
        (ruby, "ruby"),
        (java, "java"),
    )

class ProjectLicenseChoices(Choices):
    MIT = 0
    GPL = 1
    Apache = 2
    BSD = 3
    LPGL = 4
    MPL = 5
    CDDL = 6
    EPL = 7

    CHOICES = (
        (MIT, "MIT"),
        (GPL, "GPL"),
        (Apache, "Apache"),
        (BSD, "BSD"),
        (LPGL, "LPGL"),
        (MPL, "MPL"),
        (CDDL, "CDDL"),
        (EPL, "EPL"),
    )
    

class ProjectSizeChoices(Choices):
    verysmall = 0
    small = 1
    notsmall = 2

    small_lib = 3
    medium_lib = 4
    large_lib = 5

    CHOICES = (
        (verysmall, "1-10 lines"),
        (small, "10-100 lines"),
        (notsmall, "100-1000 lines"),
        (small_lib, "small library"),
        (medium_lib, "medium library"),
        (large_lib,"large library"),
    )
