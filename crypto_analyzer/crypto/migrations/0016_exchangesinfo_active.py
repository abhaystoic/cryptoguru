# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-01-31 14:52
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crypto', '0015_auto_20180130_2209'),
    ]

    operations = [
        migrations.AddField(
            model_name='exchangesinfo',
            name='active',
            field=models.NullBooleanField(default=False),
        ),
    ]
