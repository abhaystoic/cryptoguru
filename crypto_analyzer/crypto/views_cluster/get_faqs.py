""""""

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from crypto.models import FAQ


@api_view(['POST'])
@csrf_protect
def getFaqs(request):
  faqs = []
  for faq in FAQ.objects.values():
    faqs.append(faq)
  content = {
      'status': 'success',
      'responseCode': status.HTTP_200_OK,
      'faqs': faqs,
  }
  return Response(content)
