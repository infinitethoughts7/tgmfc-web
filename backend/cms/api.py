from wagtail.api.v2.views import PagesAPIViewSet
from wagtail.api.v2.router import WagtailAPIRouter
from wagtail.images.api.v2.views import ImagesAPIViewSet
from wagtail.documents.api.v2.views import DocumentsAPIViewSet

from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import Notification, GalleryCategory, GalleryImage


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