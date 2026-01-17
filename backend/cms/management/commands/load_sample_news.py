from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime
from cms.models import NewsCategory, PressRelease
from wagtail.images.models import Image
from django.core.files.base import ContentFile
import requests


class Command(BaseCommand):
    help = 'Load sample news data into the database'

    def handle(self, *args, **options):
        self.stdout.write('Loading sample news data...')

        # Create categories
        categories_data = [
            {"name": "Press Releases", "name_te": "పత్రికా ప్రకటనలు", "slug": "press-releases"},
            {"name": "Government Events", "name_te": "ప్రభుత్వ కార్యక్రమాలు", "slug": "government-events"},
            {"name": "Public Announcements", "name_te": "ప్రజా ప్రకటనలు", "slug": "public-announcements"},
            {"name": "Schemes & Initiatives", "name_te": "పథకాలు మరియు కార్యక్రమాలు", "slug": "schemes-initiatives"},
            {"name": "Awards & Recognition", "name_te": "అవార్డులు మరియు గుర్తింపు", "slug": "awards-recognition"},
        ]

        categories = {}
        for cat_data in categories_data:
            category, created = NewsCategory.objects.get_or_create(
                slug=cat_data['slug'],
                defaults={
                    'name': cat_data['name'],
                    'name_te': cat_data['name_te']
                }
            )
            categories[cat_data['slug']] = category
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created category: {category.name}'))

        # Create sample news articles
        news_data = [
            {
                "title": "Hon'ble CM Sri A. Revanth Reddy Participated in Arrive Alive (Road Safety Awareness Programme) at Yousufguda Indoor Stadium",
                "title_te": "గౌరవనీయ సీఎం శ్రీ ఎ. రేవంత్ రెడ్డి యూసుఫ్‌గూడ ఇండోర్ స్టేడియంలో అరైవ్ ఎలైవ్ (రోడ్డు భద్రత అవగాహన కార్యక్రమం)లో పాల్గొన్నారు",
                "slug": "cm-revanth-reddy-arrive-alive-road-safety-yousufguda",
                "excerpt": "Hon'ble Chief Minister Sri A. Revanth Reddy participated in the Arrive Alive Road Safety Awareness Programme at Yousufguda Indoor Stadium, emphasizing the importance of road safety measures.",
                "excerpt_te": "గౌరవనీయ సీఎం శ్రీ ఎ. రేవంత్ రెడ్డి యూసుఫ్‌గూడ ఇండోర్ స్టేడియంలో అరైవ్ ఎలైవ్ రోడ్డు భద్రత అవగాహన కార్యక్రమంలో పాల్గొన్నారు.",
                "body": "<p>Hon'ble Chief Minister Sri A. Revanth Reddy participated in the Arrive Alive Road Safety Awareness Programme held at Yousufguda Indoor Stadium on January 12, 2026. The program aimed to educate citizens about road safety measures and traffic rules.</p><p>The Chief Minister emphasized the government's commitment to reducing road accidents and ensuring safer roads for all citizens. Various stakeholders including traffic police, transport department officials, and civil society organizations participated in the event.</p>",
                "body_te": "<p>గౌరవనీయ సీఎం శ్రీ ఎ. రేవంత్ రెడ్డి జనవరి 12, 2026న యూసుఫ్‌గూడ ఇండోర్ స్టేడియంలో జరిగిన అరైవ్ ఎలైవ్ రోడ్డు భద్రత అవగాహన కార్యక్రమంలో పాల్గొన్నారు. రోడ్డు భద్రత చర్యలు మరియు ట్రాఫిక్ నియమాల గురించి పౌరులకు అవగాహన కల్పించడం ఈ కార్యక్రమం లక్ష్యం.</p>",
                "category": "government-events",
                "is_featured": True,
                "published_date": "2026-01-12T10:30:00Z",
                "tags": ["Road Safety", "CM Events", "Public Awareness"]
            },
            {
                "title": "Hon'ble CM Sri A. Revanth Reddy Participated in Telangana Gazetted Officers Association Diary Release at Dr. B. R. Ambedkar Secretariat",
                "title_te": "గౌరవనీయ సీఎం శ్రీ ఎ. రేవంత్ రెడ్డి డాక్టర్ బి.ఆర్. అంబేద్కర్ సచివాలయంలో తెలంగాణ గెజిటెడ్ ఆఫీసర్స్ అసోసియేషన్ డైరీ విడుదలలో పాల్గొన్నారు",
                "slug": "cm-telangana-gazetted-officers-diary-release",
                "excerpt": "Hon'ble Chief Minister participated in the Telangana Gazetted Officers Association Diary Release ceremony at Dr. B.R. Ambedkar Secretariat on January 12, 2026.",
                "excerpt_te": "జనవరి 12, 2026న డాక్టర్ బి.ఆర్. అంబేద్కర్ సచివాలయంలో తెలంగాణ గెజిటెడ్ ఆఫీసర్స్ అసోసియేషన్ డైరీ విడుదల కార్యక్రమంలో గౌరవనీయ సీఎం పాల్గొన్నారు.",
                "body": "<p>The Hon'ble Chief Minister Sri A. Revanth Reddy graced the occasion of the Telangana Gazetted Officers Association Diary Release for the year 2026 at Dr. B.R. Ambedkar Secretariat.</p><p>The event was attended by senior government officials and association members. The Chief Minister appreciated the dedication and service of gazetted officers in implementing government policies and serving the public.</p>",
                "body_te": "<p>గౌరవనీయ సీఎం శ్రీ ఎ. రేవంత్ రెడ్డి డాక్టర్ బి.ఆర్. అంబేద్కర్ సచివాలయంలో 2026 సంవత్సరానికి తెలంగాణ గెజిటెడ్ ఆఫీసర్స్ అసోసియేషన్ డైరీ విడుదల కార్యక్రమంలో పాల్గొన్నారు.</p>",
                "category": "government-events",
                "is_featured": True,
                "published_date": "2026-01-12T14:00:00Z",
                "tags": ["Government Events", "Officers Association", "CM Events"]
            },
            {
                "title": "Hon'ble CM Sri A. Revanth Reddy participated in the launch of Bala Bharosa and Pranamam schemes at Jyotirao Phule Praja Bhavan",
                "title_te": "గౌరవనీయ సీఎం శ్రీ ఎ. రేవంత్ రెడ్డి జ్యోతిరావు ఫూలే ప్రజా భవన్‌లో బాల భరోసా మరియు ప్రణామం పథకాల ప్రారంభోత్సవంలో పాల్గొన్నారు",
                "slug": "cm-bala-bharosa-pranamam-schemes-launch",
                "excerpt": "Chief Minister launched welfare schemes Bala Bharosa and Pranamam at Jyotirao Phule Praja Bhavan, aimed at supporting children and senior citizens.",
                "excerpt_te": "సీఎం జ్యోతిరావు ఫూలే ప్రజా భవన్‌లో బాలల మరియు వృద్ధులకు మద్దతు ఇచ్చే బాల భరోసా మరియు ప్రణామం సంక్షేమ పథకాలను ప్రారంభించారు.",
                "body": "<p>Hon'ble Chief Minister Sri A. Revanth Reddy launched two significant welfare schemes - Bala Bharosa and Pranamam at Jyotirao Phule Praja Bhavan on January 12, 2026.</p><p>Bala Bharosa provides financial assistance to orphans and children who lost parents, while Pranamam scheme offers pension benefits to senior citizens. The Chief Minister stated that these schemes reflect the government's commitment to social welfare and inclusive development.</p>",
                "body_te": "<p>గౌరవనీయ సీఎం శ్రీ ఎ. రేవంత్ రెడ్డి జనవరి 12, 2026న జ్యోతిరావు ఫూలే ప్రజా భవన్‌లో రెండు ముఖ్యమైన సంక్షేమ పథకాలు - బాల భరోసా మరియు ప్రణామం ప్రారంభించారు.</p>",
                "category": "schemes-initiatives",
                "is_featured": True,
                "published_date": "2026-01-12T11:00:00Z",
                "tags": ["Welfare Schemes", "Bala Bharosa", "Pranamam", "Social Welfare"]
            },
            {
                "title": "BC Commission Notification dated 15.05.2025 & Affidavit Format Released",
                "title_te": "BC కమిషన్ నోటిఫికేషన్ తేదీ 15.05.2025 & అఫిడవిట్ ఫార్మాట్ విడుదల",
                "slug": "bc-commission-notification-affidavit-format",
                "excerpt": "The Backward Classes Commission has released an important notification dated 15.05.2025 along with the updated affidavit format for applicants.",
                "excerpt_te": "వెనుకబడిన తరగతుల కమిషన్ దరఖాస్తుదారుల కోసం నవీకరించిన అఫిడవిట్ ఫార్మాట్‌తో పాటు 15.05.2025 తేదీన ఒక ముఖ్యమైన నోటిఫికేషన్‌ను విడుదల చేసింది.",
                "body": "<p>The Backward Classes Commission has issued a notification dated 15.05.2025 regarding the updated procedures for BC certificate applications.</p><p>The notification includes revised guidelines and a new affidavit format that applicants must use. All pending applications will need to comply with the new format. The commission has set up help desks at all district offices to assist applicants with the transition.</p>",
                "body_te": "<p>వెనుకబడిన తరగతుల కమిషన్ BC సర్టిఫికేట్ దరఖాస్తుల కోసం నవీకరించిన విధానాలకు సంబంధించి 15.05.2025 తేదీన నోటిఫికేషన్ జారీ చేసింది.</p>",
                "category": "public-announcements",
                "is_featured": False,
                "published_date": "2025-05-15T09:00:00Z",
                "tags": ["BC Commission", "Notifications", "Affidavit Format"]
            },
            {
                "title": "Minority Welfare Scholarships 2025-26 Application Process Begins",
                "title_te": "మైనారిటీ సంక్షేమ స్కాలర్‌షిప్స్ 2025-26 దరఖాస్తు ప్రక్రియ ప్రారంభం",
                "slug": "minority-welfare-scholarships-2025-26-application",
                "excerpt": "The Ministry of Minority Welfare has announced the commencement of the scholarship application process for the academic year 2025-26.",
                "excerpt_te": "మైనారిటీ సంక్షేమ మంత్రిత్వ శాఖ 2025-26 విద్యా సంవత్సరం కోసం స్కాలర్‌షిప్ దరఖాస్తు ప్రక్రియను ప్రారంభించినట్లు ప్రకటించింది.",
                "body": "<p>The Telangana State Minority Welfare Department has opened the application window for various scholarship schemes for the academic year 2025-26.</p><p>Eligible students from minority communities can apply for pre-matric, post-matric, and merit-cum-means scholarships. The last date for submission is March 31, 2026. Applications can be submitted online through the official portal. Required documents include income certificate, caste certificate, and academic records.</p>",
                "body_te": "<p>తెలంగాణ రాష్ట్র మైనారిటీ సంక్షేమ శాఖ 2025-26 విద్యా సంవత్సరం కోసం వివిధ స్కాలర్‌షిప్ పథకాల కోసం దరఖాస్తు విండోను తెరిచింది.</p>",
                "category": "schemes-initiatives",
                "is_featured": False,
                "published_date": "2026-01-10T10:00:00Z",
                "tags": ["Scholarships", "Education", "Minority Welfare", "Students"]
            },
        ]

        for news in news_data:
            category = categories.get(news['category'])

            press_release, created = PressRelease.objects.get_or_create(
                slug=news['slug'],
                defaults={
                    'title': news['title'],
                    'title_te': news['title_te'],
                    'excerpt': news['excerpt'],
                    'excerpt_te': news['excerpt_te'],
                    'body': news['body'],
                    'body_te': news['body_te'],
                    'category': category,
                    'is_featured': news['is_featured'],
                    'is_published': True,
                    'published_date': datetime.fromisoformat(news['published_date'].replace('Z', '+00:00')),
                    'author': 'Ministry of Minority Welfare',
                }
            )

            if created:
                # Add tags
                for tag_name in news['tags']:
                    press_release.tags.add(tag_name)

                self.stdout.write(self.style.SUCCESS(f'Created news: {press_release.title[:50]}...'))
            else:
                self.stdout.write(self.style.WARNING(f'News already exists: {press_release.title[:50]}...'))

        self.stdout.write(self.style.SUCCESS('Sample news data loaded successfully!'))
