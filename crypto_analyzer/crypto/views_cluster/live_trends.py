""""""

import datetime
import json
import pytz
import traceback

from django.views.decorators.csrf import csrf_protect
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from crypto.models import Cryptos
from crypto.models import IndianCryptos


@api_view(['POST'])
@csrf_protect
def getLiveTrends(request):
  indian_coins = ['india-coin']
  requestData = json.loads(request.data.items()[0][0])
  coin_id = requestData.get('coinID')
  minutes = requestData.get('minutes')
  live_trends = []
  if coin_id in indian_coins:
    cryptos = IndianCryptos.objects.filter(
        coin_id=coin_id
    ).order_by('-last_updated')[:minutes]
  else:
    cryptos = Cryptos.objects.filter(
        coin_id=coin_id
    ).order_by('-last_updated')[:minutes]
  for crypto in cryptos:
    live_trends.append(
      {
          'x': formatted_time(crypto.last_updated),
          'y': crypto.international_price_inr,
      }
    )
  content = {
      'status': 'success',
      'responseCode': status.HTTP_200_OK,
      'live_trends': live_trends,
  }
  return Response(content)

def formatted_time(time):
  return datetime.datetime.strptime(str(utc_to_local(time)).split('.')[0], '%Y-%m-%d %H:%M:%S')

def utc_to_local(utc_dt):
  local_tz = pytz.timezone('Asia/Kolkata')
  local_dt = utc_dt.replace(tzinfo=pytz.utc).astimezone(local_tz)
  return local_tz.normalize(local_dt) # .normalize might be unnecessary
