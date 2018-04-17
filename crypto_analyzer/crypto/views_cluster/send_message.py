""""""

import json
import traceback

from django.views.decorators.csrf import csrf_protect
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from crypto.models import Message


@api_view(['POST'])
@csrf_protect
def sendMessage(request):
  requestData = json.loads(request.data.items()[0][0])
  first_name = requestData.get('first_name')
  last_name = requestData.get('last_name')
  email = requestData.get('email')
  message = requestData.get('message')

  try:
    message = Message(
      first_name=first_name,
      last_name=last_name,
      email=email,
      message=message
    )
    message.save()
    server_response_msg = 'Thanks for your response. We will respond to your query shortly.'
    server_response_status = 'success'
  except Exception as e:
    print traceback.print_exc()
    server_response_msg = 'Something went wrong! Please try again.'
    server_response_status = 'failure'

  content = {
      'status': server_response_status,
      'responseCode': status.HTTP_200_OK,
      'msg': server_response_msg,
  }
  return Response(content)
