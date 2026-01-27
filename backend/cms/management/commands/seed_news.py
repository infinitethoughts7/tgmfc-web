"""
Management command to seed news data from mock JSON file.
Usage: python manage.py seed_news
"""
import json
import os
from datetime import datetime
from django.core.management.base import BaseCommand
from django.core.files.images import ImageFile
from django.utils import timezone
from cms.models import NewsCategory, PressRelease
from wagtail.images.models import Image


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
        parser.add_argument(
            '--skip-images',
            action='store_true',
            help='Skip importing images',
        )

    def get_frontend_public_path(self):
        """Get the path to frontend/public folder"""
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
        return os.path.join(base_dir, 'frontend', 'public')

    def import_image(self, image_path, title):
        """Import an image file into Wagtail's image library"""
        public_path = self.get_frontend_public_path()

        # Normalize the image path (remove leading slash if present)
        clean_path = image_path.lstrip('/')
        full_path = os.path.join(public_path, clean_path)

        if not os.path.exists(full_path):
            self.stderr.write(f'    Image not found: {full_path}')
            return None

        # Check if image already exists in Wagtail by title
        filename = os.path.basename(full_path)
        existing_image = Image.objects.filter(title=title).first()
        if existing_image:
            self.stdout.write(f'    Image exists: {filename}')
            return existing_image

        # Create new Wagtail image
        with open(full_path, 'rb') as f:
            image_file = ImageFile(f, name=filename)
            wagtail_image = Image(title=title, file=image_file)
            wagtail_image.save()
            self.stdout.write(self.style.SUCCESS(f'    Imported image: {filename}'))
            return wagtail_image

    def handle(self, *args, **options):
        # Default path to frontend mock data
        json_path = options['json_path']
        if not json_path:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(
                os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
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
        images_imported = 0

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

            # Handle featured image
            featured_image = None
            if not options['skip_images']:
                image_path = news_data.get('featured_image')
                if image_path:
                    # Create a title for the image based on the article
                    image_title = f"News: {news_data['title'][:50]}"
                    featured_image = self.import_image(image_path, image_title)
                    if featured_image:
                        images_imported += 1

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
                    'featured_image': featured_image,
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
        self.stdout.write(f'  Images Imported: {images_imported}')
        self.stdout.write(self.style.SUCCESS('=' * 50))
