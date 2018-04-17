# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-02-10 12:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crypto', '0018_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='image_url',
            field=models.URLField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(default='a', max_length=254, unique=True),
            preserve_default=False,
        ),
    ]
