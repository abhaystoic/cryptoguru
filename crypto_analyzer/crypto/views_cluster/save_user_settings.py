""""""

import json
import traceback

from django.db import IntegrityError
from django.views.decorators.csrf import csrf_protect
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from crypto.models import User


@api_view(['POST'])
@csrf_protect
def saveUserSettings(request):
  preferred_currency_code = None
  enable_notification = None
  user_settings = json.loads(request.data.items()[0][0])
  if user_settings:
    email = user_settings.get('email')
    enable_notification = user_settings.get('enable_notification')
    preferred_currency = user_settings.get('preferred_currency')

    try:
      user = User.objects.get(email=email)
      user.preferred_currency_code = preferred_currency
      user.enable_notification = enable_notification
      user.save()
      server_response_msg = 'Settings saved.'
      server_response_status = 'success'
    except Exception as e:
      print traceback.print_exc()
      server_response_msg = 'Something went wrong! Please try again.'
      server_response_status = 'failure'
  else:
    server_response_msg = 'Login failed! User information not received.'
    server_response_status = 'failure'
  content = {
      'status': server_response_status,
      'responseCode': status.HTTP_200_OK,
      'msg': server_response_msg
  }
  return Response(content)
