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
def getAllCoins(request):
  requestData = json.loads(request.data.items()[0][0])
  num_records = int(requestData.get('num_records'))
  coin_data = []
  bitcoin_data = {}
  # cryptos = Cryptos.objects.order_by('-last_updated')[:100][:num_records]
  # cryptos = Cryptos.objects.filter(rank__gte=1, rank__lte=100).order_by('-last_updated')[:num_records]
  cryptos = Cryptos.objects.raw('SELECT * FROM crypto.crypto_cryptos where rank between 1 and 100 limit 100')[::-1][:num_records]
  for crypto in cryptos:
    if crypto.coin_id == 'bitcoin':
      bitcoin_data = {
          "id": crypto.coin_id,
          "name": crypto.name,
          "symbol": crypto.symbol,
          # "rank": crypto.rank,
          # "price_usd": crypto.price_usd,
          # "price_btc": crypto.price_btc,
          # "24h_volume_usd": crypto.volume_usd_24h,
          # "market_cap_usd": crypto.market_cap_usd,
          # "available_supply": crypto.available_supply,
          # "total_supply": crypto.total_supply,
          # "max_supply": crypto.max_supply,
          "percent_change_1h": crypto.percent_change_1h,
          # "percent_change_24h": crypto.percent_change_24h,
          # "percent_change_7d": crypto.percent_change_7d,
          # "last_updated": crypto.data_last_updated,
          "price_inr": crypto.international_price_inr,
          # "24h_volume_inr": crypto.volume_inr_24h,
          # "market_cap_inr": crypto.market_cap_inr,
      }
    else:
      coin_data.append(
        {
          "id": crypto.coin_id,
          "name": crypto.name,
          "symbol": crypto.symbol,
          # "rank": crypto.rank,
          # "price_usd": crypto.price_usd,
          # "price_btc": crypto.price_btc,
          # "24h_volume_usd": crypto.volume_usd_24h,
          # "market_cap_usd": crypto.market_cap_usd,
          # "available_supply": crypto.available_supply,
          # "total_supply": crypto.total_supply,
          # "max_supply": crypto.max_supply,
          "percent_change_1h": crypto.percent_change_1h,
          # "percent_change_24h": crypto.percent_change_24h,
          # "percent_change_7d": crypto.percent_change_7d,
          # "last_updated": crypto.data_last_updated,
          "price_inr": crypto.international_price_inr,
          # "24h_volume_inr": crypto.volume_inr_24h,
          # "market_cap_inr": crypto.market_cap_inr,
        }
      )
  content = {
      'status': 'success',
      'responseCode': status.HTTP_200_OK,
      'coin_data': coin_data,
      'bitcoin_data': bitcoin_data,
  }
  return Response(content)
