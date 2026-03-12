from django.apps import AppConfig
import sys
import os
from django.apps import AppConfig
from django.core.management import call_command


class MainConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'main'

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'main'

    def ready(self):
        if 'runserver' in sys.argv and os.environ.get('RUN_MAIN') == 'true':
            print("Running media cleanup on startup...")
            call_command('cleanup_media')