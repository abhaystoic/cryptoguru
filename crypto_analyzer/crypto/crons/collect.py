import json
import logging
import requests
import traceback

from django_cron import CronJobBase, Schedule
from crypto.models import Cryptos
from crypto.models import IndianCryptos

class CollectCronJob(CronJobBase):
  RUN_EVERY_MINS = 1 # every 2 minutes

  schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
  code = 'crypto.cron.collect'    # a unique code

  def __init__(self):
    self.logger = logging.getLogger('crypto')
    self.collect_map = {
      'zebpay': self.collectZebpay,
      'unicoin': self.collectUnicoin,
      'blockchain_ticker': self.collectBlockchainTicker,
    }

  def do(self):
    """"""

    self.logger.info('running cron...')
    self.collectAllCoinsData()
    self.collectIndianCoinsData()

  def _get_json_response(self, url):
    response = requests.get(url)
    return json.loads(response.text)

  def collectZebpay(self, key, url):
    """"""

    response_json = self._get_json_response(url)
    Exchanges(
      name='Zebpay',
      key=key,
      buy=response_json.get('buy'),
      sell=response_json.get('sell'),
      currency_symbol=response_json.get('currency'),
      volume=response_json.get('volume'),
    ).save()

  def collectUnicoin(self, key, url):

    response_json = self._get_json_response(url)
    Exchanges(
      name='Unicoin',
      key=key,
      buy=response_json.get('buy'),
      sell=response_json.get('sell'),
      currency_symbol='INR',
      average=response_json.get('average'),
    ).save()

  def collectBlockchainTicker(self, key, url):
    response_json = self._get_json_response(url)

    # INR
    response_json_inr = response_json.get('INR')
    Exchanges(
      name='Blockhain Ticker',
      key=key,
      buy=response_json_inr.get('buy'),
      sell=response_json_inr.get('sell'),
      currency_symbol='INR',
      last=response_json_inr.get('last'),
    ).save()

    # USD
    response_json_usd = response_json.get('USD')
    Exchanges(
      name='Blockhain Ticker',
      key=key,
      buy=response_json_usd.get('buy'),
      sell=response_json_usd.get('sell'),
      currency_symbol='USD',
      last=response_json_usd.get('last'),
    ).save()

  def collectAllCoinsData(self):
    url = 'https://api.coinmarketcap.com/v1/ticker/?convert=INR'
    response_json = self._get_json_response(url)
    for coinData in response_json[::-1]:
      try:
        Cryptos(
          name=coinData.get('name'),
          symbol=coinData.get('symbol'),
          coin_id=coinData.get('id'),
          international_price_inr=coinData.get('price_inr'),
          rank=coinData.get('rank'),
          price_usd=coinData.get('price_usd'),
          price_btc=coinData.get('price_btc'),
          volume_usd_24h=coinData.get('24h_volume_usd'),
          market_cap_usd=coinData.get('market_cap_usd'),
          available_supply=coinData.get('available_supply'),
          total_supply=coinData.get('total_supply'),
          max_supply=coinData.get('max_supply'),
          percent_change_1h=coinData.get('percent_change_1h'),
          percent_change_24h=coinData.get('percent_change_24h'),
          percent_change_7d=coinData.get('percent_change_7d'),
          data_last_updated=coinData.get('last_updated'),
          volume_inr_24h=coinData.get('24h_volume_inr'),
          market_cap_inr=coinData.get('market_cap_inr'),
        ).save()
      except Exception as e:
        logging.error(e)
        logging.error(traceback.print_exc)

  def collectIndianCoinsData(self):
    url = 'https://api.coinmarketcap.com/v1/ticker/india-coin/?convert=INR'
    response_json = self._get_json_response(url)
    for coinData in response_json[::-1]:
      try:
        IndianCryptos(
          name=coinData.get('name'),
          symbol=coinData.get('symbol'),
          coin_id=coinData.get('id'),
          international_price_inr=coinData.get('price_inr'),
          rank=coinData.get('rank'),
          price_usd=coinData.get('price_usd'),
          price_btc=coinData.get('price_btc'),
          volume_usd_24h=coinData.get('24h_volume_usd'),
          market_cap_usd=coinData.get('market_cap_usd'),
          available_supply=coinData.get('available_supply'),
          total_supply=coinData.get('total_supply'),
          max_supply=coinData.get('max_supply'),
          percent_change_1h=coinData.get('percent_change_1h'),
          percent_change_24h=coinData.get('percent_change_24h'),
          percent_change_7d=coinData.get('percent_change_7d'),
          data_last_updated=coinData.get('last_updated'),
          volume_inr_24h=coinData.get('24h_volume_inr'),
          market_cap_inr=coinData.get('market_cap_inr'),
        ).save()
      except Exception as e:
        logging.error(e)
        logging.error(traceback.print_exc)
