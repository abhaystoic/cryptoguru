""""""

from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie

@ensure_csrf_cookie
def home(request):
  """"""
  context_dict = {}
  return render(request, 'crypto/index.html', context_dict)
