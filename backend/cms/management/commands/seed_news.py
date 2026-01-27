"""
Management command to seed news data from mock JSON file.
Usage: python manage.py seed_news
"""
import json
import os
from datetime import datetime
from django.core.management.base import BaseCommand
from django.utils import timezone
from cms.models import NewsCategory, PressRelease


class Command(BaseCommand):
    help = 'Seeds news categories and press releases from mock JSON data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing news data before seeding',
        )
        parser.add_argument(
            '--json-path',
            type=str,
            default=None,
            help='Path to the JSON file (default: frontend mock data)',
        )

    def handle(self, *args, **options):
        # Default path to frontend mock data
        json_path = options['json_path']
        if not json_path:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
            json_path = os.path.join(base_dir, 'frontend', 'app', 'mock', 'news-press-releases.json')

        if not os.path.exists(json_path):
            self.stderr.write(self.style.ERROR(f'JSON file not found: {json_path}'))
            return

        # Load JSON data
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Clear existing data if requested
        if options['clear']:
            self.stdout.write('Clearing existing news data...')
            PressRelease.objects.all().delete()
            NewsCategory.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Cleared existing data'))

        # Seed categories
        self.stdout.write('Seeding news categories...')
        category_map = {}
        for cat_data in data.get('categories', []):
            category, created = NewsCategory.objects.update_or_create(
                slug=cat_data['slug'],
                defaults={
                    'name': cat_data['name'],
                    'name_te': cat_data.get('name_te', ''),
                }
            )
            category_map[cat_data['id']] = category
            status = 'Created' if created else 'Updated'
            self.stdout.write(f'  {status}: {category.name}')

        self.stdout.write(self.style.SUCCESS(f'Seeded {len(category_map)} categories'))

        # Seed press releases
        self.stdout.write('Seeding press releases...')
        created_count = 0
        updated_count = 0

        for news_data in data.get('news', []):
            # Parse the published date
            published_date_str = news_data.get('published_date', '')
            if published_date_str:
                published_date = datetime.fromisoformat(published_date_str.replace('Z', '+00:00'))
            else:
                published_date = timezone.now()

            # Get the category
            category_id = news_data.get('category')
            category = category_map.get(category_id) if category_id else None

            # Create or update press release
            press_release, created = PressRelease.objects.update_or_create(
                slug=news_data['slug'],
                defaults={
                    'title': news_data['title'],
                    'title_te': news_data.get('title_te', ''),
                    'excerpt': news_data.get('excerpt', ''),
                    'excerpt_te': news_data.get('excerpt_te', ''),
                    'body': news_data.get('body', ''),
                    'body_te': news_data.get('body_te', ''),
                    'category': category,
                    'author': news_data.get('author', 'Ministry of Minority Welfare'),
                    'is_published': news_data.get('is_published', True),
                    'is_featured': news_data.get('is_featured', False),
                    'published_date': published_date,
                }
            )

            # Handle tags
            tags = news_data.get('tags', [])
            if tags:
                press_release.tags.clear()
                for tag_name in tags:
                    press_release.tags.add(tag_name)

            if created:
                created_count += 1
                self.stdout.write(f'  Created: {press_release.title[:50]}...')
            else:
                updated_count += 1
                self.stdout.write(f'  Updated: {press_release.title[:50]}...')

        self.stdout.write(self.style.SUCCESS(
            f'Seeded press releases: {created_count} created, {updated_count} updated'
        ))

        # Summary
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('=' * 50))
        self.stdout.write(self.style.SUCCESS('News seeding completed successfully!'))
        self.stdout.write(f'  Categories: {NewsCategory.objects.count()}')
        self.stdout.write(f'  Press Releases: {PressRelease.objects.count()}')
        self.stdout.write(self.style.SUCCESS('=' * 50))
        self.stdout.write('')
        self.stdout.write('Note: Images need to be uploaded manually via Wagtail admin.')
        self.stdout.write('You can then assign them to the press releases.')
