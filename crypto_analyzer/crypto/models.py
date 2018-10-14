# -*- coding: utf-8 -*-
"""
TODO: Remove 'blank=True, null=True' wherever it doesn't make sense.
"""

from __future__ import unicode_literals

from __future__ import absolute_import
from django.db import models

MAX_CHAR_LEN = 1024
MAX_CHAR_LEN_URL = 2000
MAX_CHAR_LEN_BIG = 10000

# Create your models here.
class Cryptos(models.Model):
  name = models.CharField(max_length=MAX_CHAR_LEN)
  coin_id = models.CharField(blank=True, null=True, max_length=MAX_CHAR_LEN)
  symbol = models.CharField(blank=True, null=True, max_length=MAX_CHAR_LEN)
  international_price_inr = models.FloatField(blank=True, null=True)
  rank = models.IntegerField(blank=True, null=True)
  price_usd = models.FloatField(blank=True, null=True)
  price_btc = models.FloatField(blank=True, null=True)
  volume_usd_24h = models.FloatField(blank=True, null=True)
  market_cap_usd = models.FloatField(blank=True, null=True)
  available_supply = models.FloatField(blank=True, null=True)
  total_supply = models.FloatField(blank=True, null=True)
  max_supply = models.FloatField(blank=True, null=True)
  percent_change_1h = models.FloatField(blank=True, null=True)
  percent_change_24h = models.FloatField(blank=True, null=True)
  percent_change_7d = models.FloatField(blank=True, null=True)
  data_last_updated = models.CharField(blank=True, null=True, max_length=MAX_CHAR_LEN)
  volume_inr_24h = models.FloatField(blank=True, null=True)
  market_cap_inr = models.FloatField(blank=True, null=True)
  last_updated = models.DateTimeField(auto_now_add=True, blank=True, null=True)

  def __str__(self):
    return self.name

class IndianCryptos(models.Model):
  name = models.CharField(max_length=MAX_CHAR_LEN)
  coin_id = models.CharField(blank=True, null=True, max_length=MAX_CHAR_LEN)
  symbol = models.CharField(blank=True, null=True, max_length=MAX_CHAR_LEN)
  international_price_inr = models.FloatField(blank=True, null=True)
  rank = models.IntegerField(blank=True, null=True)
  price_usd = models.FloatField(blank=True, null=True)
  price_btc = models.FloatField(blank=True, null=True)
  volume_usd_24h = models.FloatField(blank=True, null=True)
  market_cap_usd = models.FloatField(blank=True, null=True)
  available_supply = models.FloatField(blank=True, null=True)
  total_supply = models.FloatField(blank=True, null=True)
  max_supply = models.FloatField(blank=True, null=True)
  percent_change_1h = models.FloatField(blank=True, null=True)
  percent_change_24h = models.FloatField(blank=True, null=True)
  percent_change_7d = models.FloatField(blank=True, null=True)
  data_last_updated = models.CharField(blank=True, null=True, max_length=MAX_CHAR_LEN)
  volume_inr_24h = models.FloatField(blank=True, null=True)
  market_cap_inr = models.FloatField(blank=True, null=True)
  last_updated = models.DateTimeField(auto_now_add=True, blank=True, null=True)

  def __str__(self):
    return self.name

class Exchanges(models.Model):
  name = models.CharField(blank=True, null=True, max_length=MAX_CHAR_LEN)
  exchange_id = models.CharField(blank=True, null=True, max_length=MAX_CHAR_LEN)
  buy = models.FloatField(blank=True, null=True)
  sell = models.FloatField(blank=True, null=True)
  last = models.FloatField(blank=True, null=True)
  average = models.FloatField(blank=True, null=True)
  currency_symbol = models.CharField(blank=True, null=True, max_length=MAX_CHAR_LEN)
  volume = models.FloatField(blank=True, null=True)
  international_price_dollar = models.FloatField(blank=True, null=True)
  international_price_inr = models.FloatField(blank=True, null=True)
  last_updated = models.DateTimeField(blank=True, null=True, auto_now_add=True)

  def __str__(self):
    return self.name


class ExchangesInfo(models.Model):
  name = models.CharField(blank=True, null=True, max_length=MAX_CHAR_LEN)
  exchange_id = models.CharField(blank=True, null=True, max_length=MAX_CHAR_LEN)
  url = models.URLField(blank=True, null=True, max_length=MAX_CHAR_LEN_URL)
  website = models.URLField(blank=True, null=True, max_length=MAX_CHAR_LEN_URL)
  active = models.NullBooleanField(default=False)
  bitcoin_org_recognized = models.NullBooleanField(default=False)
  last_updated = models.DateTimeField(blank=True, null=True, auto_now_add=True)

  def __str__(self):
    return self.name

class Message(models.Model):
  first_name = models.TextField(max_length=MAX_CHAR_LEN_URL)
  last_name = models.TextField(blank=True, null= True)
  email = models.EmailField(max_length=MAX_CHAR_LEN, blank=True, null= True)
  message = models.TextField()
  last_updated = models.DateTimeField(blank=True, null=True, auto_now_add=True)

  def __str__(self):
    return ' '.join([self.first_name, self.last_name])


class FAQ(models.Model):
  title = models.TextField(blank=True, null= True)
  content = models.TextField(blank=True, null= True)
  last_updated = models.DateTimeField(blank=True, null=True, auto_now_add=True)

  def __str__(self):
    return self.title

class User(models.Model):
  email = models.EmailField(unique=True)
  full_name = models.CharField(blank=True, null= True, max_length=MAX_CHAR_LEN)
  provider = models.CharField(blank=True, null= True, max_length=MAX_CHAR_LEN)
  token = models.CharField(blank=True, null= True, max_length=MAX_CHAR_LEN_BIG)
  image_url = models.URLField(blank=True, null= True, max_length=MAX_CHAR_LEN_URL)
  uid = models.CharField(blank=True, null= True, max_length=MAX_CHAR_LEN)
  preferred_currency_code = models.CharField(max_length=MAX_CHAR_LEN, default='INR')
  enable_notification = models.BooleanField(default=True)
  last_updated = models.DateTimeField(blank=True, null=True, auto_now_add=True)

  def __str__(self):
    return self.email
