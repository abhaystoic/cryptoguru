# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-01-25 18:48
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crypto', '0007_auto_20180126_0013'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cryptos',
            name='data_last_updated',
            field=models.CharField(blank=True, max_length=1024, null=True),
        ),
    ]
