""""""

from __future__ import absolute_import
from django.conf.urls import url
from crypto.views_cluster import capture_user
from crypto.views_cluster import get_all_coins
from crypto.views_cluster import get_all_exchanges
from crypto.views_cluster import get_faqs
from crypto.views_cluster import get_crypto_names
from crypto.views_cluster import get_initial_details
from crypto.views_cluster import live_trends
from crypto.views_cluster import save_user_settings
from crypto.views_cluster import send_message
from crypto.views_cluster import home

urlpatterns = [
    url(r'^api/live_trends/', live_trends.getLiveTrends, name='live_trends'),
    url(r'^api/send_message/', send_message.sendMessage, name='send_message'),
    url(r'^api/get_all_coins/', get_all_coins.getAllCoins, name='get_all_coins'),
    url(r'^api/get_initial_details/', get_initial_details.getInitialDetails, name='get_initial_details'),
    url(r'^api/get_faqs/', get_faqs.getFaqs, name='get_faqs'),
    url(r'^api/get_crypto_names/', get_crypto_names.getCryptoNames, name='get_crypto_names'),
    url(r'^api/get_all_exchanges/', get_all_exchanges.getAllExchanges, name='get_all_exchanges'),
    url(r'^api/capture_user/', capture_user.captureUser, name='capture_user'),
    url(r'^api/save_user_settings/', save_user_settings.saveUserSettings, name='save_user_settings'),
    url(r'', home.home),
]
