# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Project'
        db.create_table('project_project', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('member', self.gf('django.db.models.fields.related.ForeignKey')(related_name='ProjectMember', to=orm['member.Member'])),
            ('type', self.gf('django.db.models.fields.IntegerField')(default=0)),
            ('language', self.gf('django.db.models.fields.IntegerField')()),
            ('license', self.gf('django.db.models.fields.IntegerField')()),
            ('intro', self.gf('django.db.models.fields.TextField')()),
            ('fulldesc', self.gf('django.db.models.fields.TextField')()),
            ('size', self.gf('django.db.models.fields.IntegerField')()),
            ('link', self.gf('django.db.models.fields.URLField')(max_length=200)),
        ))
        db.send_create_signal('project', ['Project'])


    def backwards(self, orm):
        # Deleting model 'Project'
        db.delete_table('project_project')


    models = {
        'auth.group': {
            'Meta': {'object_name': 'Group'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        'auth.permission': {
            'Meta': {'ordering': "('content_type__app_label', 'content_type__model', 'codename')", 'unique_together': "(('content_type', 'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['contenttypes.ContentType']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        'member.member': {
            'Meta': {'object_name': 'Member'},
            'github_username': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'MemberUser'", 'to': "orm['auth.User']"})
        },
        'project.project': {
            'Meta': {'object_name': 'Project'},
            'fulldesc': ('django.db.models.fields.TextField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'intro': ('django.db.models.fields.TextField', [], {}),
            'language': ('django.db.models.fields.IntegerField', [], {}),
            'license': ('django.db.models.fields.IntegerField', [], {}),
            'link': ('django.db.models.fields.URLField', [], {'max_length': '200'}),
            'member': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'ProjectMember'", 'to': "orm['member.Member']"}),
            'size': ('django.db.models.fields.IntegerField', [], {}),
            'type': ('django.db.models.fields.IntegerField', [], {'default': '0'})
        }
    }

    complete_apps = ['project']