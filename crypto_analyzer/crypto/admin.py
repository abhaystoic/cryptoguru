# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

# Register your models here.
# Models
from models import ExchangesInfo
from models import Cryptos
from models import Exchanges
from models import FAQ
from models import IndianCryptos
from models import Message
from models import User

admin.site.register(ExchangesInfo)
admin.site.register(Cryptos)
admin.site.register(Exchanges)
admin.site.register(FAQ)
admin.site.register(IndianCryptos)
admin.site.register(Message)
admin.site.register(User)
