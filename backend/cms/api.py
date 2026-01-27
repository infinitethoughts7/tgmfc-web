from wagtail.api.v2.views import PagesAPIViewSet
from wagtail.api.v2.router import WagtailAPIRouter
from wagtail.images.api.v2.views import ImagesAPIViewSet
from wagtail.documents.api.v2.views import DocumentsAPIViewSet

from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import Notification, GalleryCategory, GalleryImage, NewsCategory, PressRelease


# Wagtail's built-in API router (for pages, images, docs)
api_router = WagtailAPIRouter('wagtailapi')
api_router.register_endpoint('pages', PagesAPIViewSet)
api_router.register_endpoint('images', ImagesAPIViewSet)
api_router.register_endpoint('documents', DocumentsAPIViewSet)


# Custom API for our Snippets
@api_view(['GET'])
def notifications_list(request):
    notifications = Notification.objects.filter(is_active=True)
    data = {
        "notifications": [
            {
                "id": n.id,
                "title": n.title,
                "url": n.url if n.url else None,
            }
            for n in notifications
        ]
    }
    return Response(data)


@api_view(['GET'])
def gallery_categories_list(request):
    categories = GalleryCategory.objects.all()
    data = {
        "categories": [
            {"id": cat.slug, "label": cat.name}
            for cat in categories
        ]
    }
    return Response(data)


@api_view(['GET'])
def gallery_images_list(request):
    images = GalleryImage.objects.select_related('image', 'category').all()
    data = {
        "gallery": [
            {
                "id": img.id,
                "image": request.build_absolute_uri(img.image.file.url) if img.image else None,
                "title": img.title,
                "date": img.date.isoformat(),
                "category": img.category.slug if img.category else None,
            }
            for img in images
        ]
    }
    return Response(data)


# News & Press Releases API

@api_view(['GET'])
def news_categories_list(request):
    categories = NewsCategory.objects.all()
    data = {
        "categories": [
            {
                "id": cat.id,
                "name": cat.name,
                "name_te": cat.name_te,
                "slug": cat.slug,
            }
            for cat in categories
        ]
    }
    return Response(data)


@api_view(['GET'])
def press_releases_list(request):
    # Get query parameters
    category = request.GET.get('category', None)
    is_featured = request.GET.get('featured', None)
    search = request.GET.get('search', None)
    limit = request.GET.get('limit', None)

    # Base queryset - only published articles
    press_releases = PressRelease.objects.filter(is_published=True).select_related('category', 'featured_image')

    # Apply filters
    if category:
        press_releases = press_releases.filter(category__slug=category)

    if is_featured == 'true':
        press_releases = press_releases.filter(is_featured=True)

    if search:
        from django.db.models import Q
        press_releases = press_releases.filter(
            Q(title__icontains=search) | Q(excerpt__icontains=search)
        )

    # Get total count before limiting
    total_count = press_releases.count()

    # Apply limit
    if limit:
        try:
            press_releases = press_releases[:int(limit)]
        except ValueError:
            pass

    data = {
        "news": [
            {
                "id": pr.id,
                "title": pr.title,
                "title_te": pr.title_te,
                "slug": pr.slug,
                "excerpt": pr.excerpt,
                "excerpt_te": pr.excerpt_te,
                "body": pr.body,
                "body_te": pr.body_te,
                "featured_image": request.build_absolute_uri(pr.featured_image.file.url) if pr.featured_image else None,
                "category": pr.category.id if pr.category else None,
                "category_name": pr.category.name if pr.category else None,
                "category_slug": pr.category.slug if pr.category else None,
                "author": pr.author,
                "tags": [tag.name for tag in pr.tags.all()],
                "is_featured": pr.is_featured,
                "is_published": pr.is_published,
                "published_date": pr.published_date.isoformat(),
                "views": pr.views,
            }
            for pr in press_releases
        ],
        "total": total_count,
    }
    return Response(data)


@api_view(['GET'])
def press_release_detail(request, slug):
    try:
        pr = PressRelease.objects.select_related('category', 'featured_image').get(
            slug=slug,
            is_published=True
        )

        # Increment view count
        pr.increment_views()

        # Get related news (same category, excluding current article)
        related_news = []
        if pr.category:
            related_qs = PressRelease.objects.filter(
                is_published=True,
                category=pr.category
            ).exclude(id=pr.id).select_related('category', 'featured_image')[:3]

            related_news = [
                {
                    "id": r.id,
                    "title": r.title,
                    "slug": r.slug,
                    "excerpt": r.excerpt,
                    "featured_image": request.build_absolute_uri(r.featured_image.file.url) if r.featured_image else None,
                    "published_date": r.published_date.isoformat(),
                    "category_name": r.category.name if r.category else None,
                    "category_slug": r.category.slug if r.category else None,
                }
                for r in related_qs
            ]

        data = {
            "id": pr.id,
            "title": pr.title,
            "title_te": pr.title_te,
            "slug": pr.slug,
            "excerpt": pr.excerpt,
            "excerpt_te": pr.excerpt_te,
            "body": pr.body,
            "body_te": pr.body_te,
            "featured_image": request.build_absolute_uri(pr.featured_image.file.url) if pr.featured_image else None,
            "category": {
                "id": pr.category.id,
                "name": pr.category.name,
                "name_te": pr.category.name_te,
                "slug": pr.category.slug,
            } if pr.category else None,
            "author": pr.author,
            "tags": [tag.name for tag in pr.tags.all()],
            "is_featured": pr.is_featured,
            "published_date": pr.published_date.isoformat(),
            "created_at": pr.created_at.isoformat(),
            "updated_at": pr.updated_at.isoformat(),
            "views": pr.views,
            "related_news": related_news,
        }
        return Response(data)
    except PressRelease.DoesNotExist:
        return Response({"error": "Press release not found"}, status=404)