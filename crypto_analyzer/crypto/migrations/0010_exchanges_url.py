# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-01-30 14:42
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crypto', '0009_auto_20180130_2012'),
    ]

    operations = [
        migrations.AddField(
            model_name='exchanges',
            name='url',
            field=models.URLField(blank=True, max_length=2000, null=True),
        ),
    ]
