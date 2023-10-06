# Generated by Django 3.2.15 on 2023-10-06 14:21

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('specify', '__first__'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Spattachmentdataset',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256)),
                ('remarks', models.TextField(null=True)),
                ('importedfilename', models.TextField(null=True)),
                ('uploaderstatus', models.JSONField(null=True)),
                ('uploadplan', models.TextField(null=True)),
                ('data', models.JSONField(default=list)),
                ('timestampcreated', models.DateTimeField(default=django.utils.timezone.now)),
                ('timestampmodified', models.DateTimeField(auto_now=True)),
                ('collection', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='specify.collection')),
                ('createdbyagent', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to='specify.agent')),
                ('modifiedbyagent', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to='specify.agent')),
                ('specifyuser', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'attachmentdataset',
            },
        ),
    ]
