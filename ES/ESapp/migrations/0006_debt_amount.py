# Generated by Django 4.2.4 on 2023-09-05 22:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ESapp', '0005_debt'),
    ]

    operations = [
        migrations.AddField(
            model_name='debt',
            name='amount',
            field=models.DecimalField(decimal_places=2, default=None, max_digits=10, null=True),
        ),
    ]