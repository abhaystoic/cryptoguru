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
def captureUser(request):
  preferred_currency_code = None
  enable_notification = None
  user_details = json.loads(request.data.items()[0][0])
  if user_details:
    email = user_details.get('email')
    image_url = user_details.get('imageUrl')
    name = user_details.get('name')
    provider = user_details.get('provider')
    token = user_details.get('token')
    uid = user_details.get('uid')

    try:
      user = User.objects.get(email=email)
      if user:
        preferred_currency_code = user.preferred_currency_code
        enable_notification = user.enable_notification
        server_response_msg = 'Welcome {}!'.format(user.full_name)
        server_response_status = 'success'
      else:
        user = User(
          email=email,
          image_url=image_url,
          full_name=name,
          provider=provider,
          token=token,
          uid=uid,
        )
        user.save()
        server_response_msg = 'Welcome {}!'.format(name)
        server_response_status = 'success'
    except IntegrityError as e:
      server_response_msg = 'Welcome back {}!'.format(name)
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
      'msg': server_response_msg,
      'preferred_currency_code': preferred_currency_code,
      'enable_notification': enable_notification,
  }
  return Response(content)
