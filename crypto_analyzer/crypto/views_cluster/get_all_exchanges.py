""""""

from django.views.decorators.csrf import csrf_protect
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from crypto.models import ExchangesInfo

@api_view(['POST'])
@csrf_protect
def getAllExchanges(request):
  exchanges = []
  exchanges_info = ExchangesInfo.objects.filter(active=True)
  for exchange in exchanges_info:
    exchanges.append(
      {
          'name': exchange.name,
          'exchange_id': exchange.exchange_id,
          'url': exchange.url,
          'website': exchange.website,
      }
    )
  content = {
      'status': 'success',
      'responseCode': status.HTTP_200_OK,
      'exchanges': exchanges,
  }
  return Response(content)
