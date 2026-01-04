import os
from datetime import datetime
from django.core.management.base import BaseCommand
from django.core.files.images import ImageFile
from wagtail.images.models import Image
from cms.models import GalleryImage, GalleryCategory


class Command(BaseCommand):
    help = 'Populate gallery with images'

    def handle(self, *args, **options):
        gallery_data = [
            {
                "filename": "m1.jpeg",
                "title": "Distribution of Certificates to the Trained Minority Candidates",
                "date": "2025-06-15",
                "category": "training"
            },
            {
                "filename": "m2.jpeg",
                "title": "Distribution of Sewing Machines at Achampet",
                "date": "2025-06-14",
                "category": "distribution"
            },
            {
                "filename": "m3.jpeg",
                "title": "Distribution of Sewing Machines at Chevella Constituency",
                "date": "2025-06-12",
                "category": "distribution"
            },
            {
                "filename": "m4.jpeg",
                "title": "Distribution of Sewing Machines at Devarkadra Constituency",
                "date": "2025-06-10",
                "category": "distribution"
            },
            {
                "filename": "m5.jpeg",
                "title": "Distribution of Sewing Machines at Jedcherla",
                "date": "2025-06-08",
                "category": "distribution"
            },
            {
                "filename": "m6.jpeg",
                "title": "Distribution of Sewing Machines at Ibrahimpatnam",
                "date": "2025-06-05",
                "category": "distribution"
            },
            {
                "filename": "m7.jpeg",
                "title": "Distribution of Sewing Machines at Narayanpet",
                "date": "2025-06-03",
                "category": "distribution"
            },
            {
                "filename": "m8.jpeg",
                "title": "Distribution of Sewing Machines at Makthal",
                "date": "2025-06-01",
                "category": "distribution"
            },
            {
                "filename": "m9.jpeg",
                "title": "Minority Welfare Program at Kalwakurthy",
                "date": "2025-06-12",
                "category": "welfare"
            },
            {
                "filename": "m10.jpeg",
                "title": "Minority Welfare Program at Kodangal",
                "date": "2025-06-02",
                "category": "welfare"
            },
            {
                "filename": "m11.jpeg",
                "title": "Minority Welfare Program at Kollapur",
                "date": "2025-06-30",
                "category": "welfare"
            },
            {
                "filename": "m12.jpeg",
                "title": "Driver Empowerment Program",
                "date": "2025-05-28",
                "category": "empowerment"
            },
            {
                "filename": "m13.jpeg",
                "title": "Skill Development Workshop for Minorities",
                "date": "2025-05-25",
                "category": "training"
            },
            {
                "filename": "m14.jpeg",
                "title": "Financial Aid Distribution Ceremony",
                "date": "2025-05-20",
                "category": "distribution"
            },
            {
                "filename": "m15.jpeg",
                "title": "Shaadi Mubarak Scheme Beneficiaries Meet",
                "date": "2025-05-18",
                "category": "welfare"
            },
            {
                "filename": "m16.jpeg",
                "title": "Educational Scholarship Distribution",
                "date": "2025-05-15",
                "category": "distribution"
            },
            {
                "filename": "m17.jpeg",
                "title": "Women Empowerment Program at Hyderabad",
                "date": "2025-05-12",
                "category": "empowerment"
            },
            {
                "filename": "m18.jpeg",
                "title": "Minority Youth Skill Training Inauguration",
                "date": "2025-05-10",
                "category": "training"
            },
            {
                "filename": "m19.jpeg",
                "title": "Community Development Meet at Warangal",
                "date": "2025-05-08",
                "category": "welfare"
            },
            {
                "filename": "m20.jpeg",
                "title": "Entrepreneurship Support Program Launch",
                "date": "2025-05-05",
                "category": "empowerment"
            },
        ]

        images_dir = "media/gallery"
        created_count = 0

        for item in gallery_data:
            filepath = os.path.join(images_dir, item["filename"])
            
            if not os.path.exists(filepath):
                self.stdout.write(self.style.WARNING(f"File not found: {filepath}"))
                continue

            # Create Wagtail Image
            with open(filepath, "rb") as f:
                wagtail_image = Image(title=item["title"])
                wagtail_image.file.save(item["filename"], ImageFile(f))
                wagtail_image.save()

            # Get category
            category = GalleryCategory.objects.filter(slug=item["category"]).first()

            # Create GalleryImage
            GalleryImage.objects.create(
                image=wagtail_image,
                title=item["title"],
                date=datetime.strptime(item["date"], "%Y-%m-%d").date(),
                category=category
            )
            created_count += 1
            self.stdout.write(f"Created: {item['title']}")

        self.stdout.write(self.style.SUCCESS(f"\nCreated {created_count} gallery images!"))
