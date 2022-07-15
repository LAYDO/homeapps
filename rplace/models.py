# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models

class RplaceTile(models.Model):
    id = models.AutoField(primary_key=True, db_index=True)
    timestamp = models.DateTimeField(db_index=True, blank=True, null=True)
    user_id = models.CharField(max_length=88, blank=True, null=True)
    pixel_color = models.CharField(max_length=7, blank=True, null=True)
    coordinate = models.CharField(max_length=21, blank=True, null=True)

    class Meta:
        indexes = [
            models.Index(fields=['timestamp']),
        ]
        managed = False
        db_table = 'rplace_tile'
