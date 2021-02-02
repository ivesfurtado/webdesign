from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
import markdown2
from . import util
import os
import random
from django import forms


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class NewEntryForm(forms.Form):
    entry = forms.CharField(label="New Entry")
    htmlcontent = forms.CharField(widget=forms.Textarea, label="Markdown Content")
class EditEntryForm(forms.Form):
    entry = forms.CharField(label="Edit Entry").disabled
    htmlcontent = forms.CharField(widget=forms.Textarea, label="Markdown Content")

def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def search_result(request):
    search = request.GET.get('q').lower()
    entries = util.list_entries()
    loweredEntries = [c.lower() for c in entries]
    if search in loweredEntries:
        return HttpResponseRedirect(f"wiki/{search}")
    else:
        matching = [s for s in loweredEntries if f"{search}" in s]
        return render(request, "encyclopedia/search.html", {
            "entries": matching,
            "keyword": search
        })

def randompage(request):
    urlLista = util.list_entries()
    url = random.choice(urlLista)
    return HttpResponseRedirect(f"wiki/{url}")
    #return HttpResponseRedirect(reverse("encyclopedia:title_index" url))

def title_index(request, title):
    if util.get_entry(title):
        html = markdown2.markdown_path(f"{BASE_DIR}/entries/{title}.md")
        return render(request, "encyclopedia/entries.html", {
            "html" : html,
            "entry": title
        })
    else:
        html = "<h1> Entry not found </h1>"
        return render(request, "encyclopedia/entries.html", {
            "html" : html
        })

def new(request):
    if request.method == "POST":
        form = NewEntryForm(request.POST)
        if form.is_valid():
            entry = form.cleaned_data["entry"]
            htmlcontent = form.cleaned_data["htmlcontent"]
            if os.path.isfile(f"{BASE_DIR}/entries/{entry}.md") == False:
                with open(f"{BASE_DIR}/entries/{entry}.md", "x") as f:
                    f.write(f"#{entry}\n{htmlcontent}")
                    f.close()
                    return HttpResponseRedirect(reverse("encyclopedia:index"))
            else:
                html = "<h1> Entry already exists </h1>"
                return render(request, "encyclopedia/entries.html", {
                    "html" : html
                })
        else:
            return render(request, "encyclopedia/new.html", {
                "form": form
            })
    return render(request, "encyclopedia/new.html", {
        "form": NewEntryForm()
    })

def edit(request, entry):
    if request.method == "POST":
        form = EditEntryForm(request.POST)
        if form.is_valid():
            entry = entry
            htmlcontent = form.cleaned_data["htmlcontent"]
            with open(f"{BASE_DIR}/entries/{entry}.md", "w") as f:
                f.write(f"#{entry}\n{htmlcontent}")
                f.close()
                return HttpResponseRedirect(reverse("encyclopedia:index"))
        else:
            return render(request, "encyclopedia/edit.html", {
                "form": form
            })
    return render(request, "encyclopedia/edit.html", {
        "form": EditEntryForm(initial={'entry': f'{entry}'}),
        "entry": entry
    })