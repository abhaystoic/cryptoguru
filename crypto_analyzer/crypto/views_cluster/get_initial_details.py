""""""

import json
import traceback

from django.views.decorators.csrf import csrf_protect
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from crypto.models import Cryptos


@api_view(['POST'])
@csrf_protect
def getInitialDetails(request):
  requestData = json.loads(request.data.items()[0][0])
  coin_id = requestData.get('coin_id')
  crypto = Cryptos.objects.filter(
      coin_id=coin_id
  ).order_by('-last_updated')[0]
  coin_details = {
      "id": crypto.coin_id,
      "name": crypto.name,
      # "price_usd": crypto.price_usd,
      # "24h_volume_usd": crypto.volume_usd_24h,
      # "market_cap_usd": crypto.market_cap_usd,
      # "last_updated": crypto.data_last_updated,
      "market_cap_inr": crypto.market_cap_inr,
      "24h_volume_inr": crypto.volume_inr_24h,
      "price_inr": crypto.international_price_inr,
      "percent_change_7d": crypto.percent_change_7d,
      "percent_change_24h": crypto.percent_change_24h,
      "percent_change_1h": crypto.percent_change_1h,
      "max_supply": crypto.max_supply,
      "total_supply": crypto.total_supply,
      "available_supply": crypto.available_supply,
      "price_btc": crypto.price_btc,
      "rank": crypto.rank,
      "symbol": crypto.symbol,
  }
  content = {
      'status': 'success',
      'responseCode': status.HTTP_200_OK,
      'coin_details': coin_details,
  }
  return Response(content)
