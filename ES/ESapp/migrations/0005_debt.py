# Generated by Django 4.2.4 on 2023-09-02 20:58

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ESapp', '0004_alter_user_age_alter_user_emg_fund_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Debt',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('account', models.CharField(max_length=200)),
                ('interest', models.DecimalField(decimal_places=2, default=None, max_digits=10, null=True)),
                ('min_pay', models.DecimalField(decimal_places=2, default=None, max_digits=10, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
