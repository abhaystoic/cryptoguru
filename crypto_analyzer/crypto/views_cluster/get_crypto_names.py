""""""

from django.db import connection
from django.views.decorators.csrf import csrf_protect
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view


@api_view(['POST'])
@csrf_protect
def getCryptoNames(request):
  crypto_coins = []
  cursor = connection.cursor()
  sql_cryptos = 'SELECT cryp.coin_id, cryp.name FROM (SELECT coin_id, name FROM crypto.crypto_cryptos group by coin_id  order by rank) cryp'
  sql_indian_cryptos = 'SELECT indcryp.coin_id, indcryp.name FROM (SELECT coin_id, name FROM crypto.crypto_indiancryptos group by coin_id  order by rank) indcryp'
  sql_union = '{} UNION ALL {}'.format(sql_cryptos, sql_indian_cryptos)
  cursor.execute(sql_union)
  cryptos = cursor.fetchall()
  for crypto in cryptos:
    crypto_coins.append(
      {
          'coin_id': crypto[0],
          'name': crypto[1],
      }
    )
  content = {
      'status': 'success',
      'responseCode': status.HTTP_200_OK,
      'crypto_coins': crypto_coins,
  }
  return Response(content)
