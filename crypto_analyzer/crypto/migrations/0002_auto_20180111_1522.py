# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-01-11 09:52
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crypto', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='cryptos',
            name='coin_id',
            field=models.CharField(blank=True, max_length=1024, null=True),
        ),
        migrations.AddField(
            model_name='cryptos',
            name='international_price_inr',
            field=models.FloatField(blank=True, null=True),
        ),
    ]