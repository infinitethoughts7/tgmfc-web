from django.conf import settings
from django.urls import include, path
from django.contrib import admin

from wagtail.admin import urls as wagtailadmin_urls
from wagtail import urls as wagtail_urls
from wagtail.documents import urls as wagtaildocs_urls

from search import views as search_views 

from cms.api import (
    api_router,
    notifications_list,
    gallery_categories_list,
    gallery_images_list,
    news_categories_list,
    press_releases_list,
    press_release_detail,
)

urlpatterns = [
    path("django-admin/", admin.site.urls),
    path("admin/", include(wagtailadmin_urls)),
    path("documents/", include(wagtaildocs_urls)),
    path("search/", search_views.search, name="search"),

    # Wagtail API (pages, images, documents)
    path("api/v2/", api_router.urls),

    # Our custom Snippet APIs
    path("api/v2/notifications/", notifications_list, name="notifications-list"),
    path("api/v2/gallery/categories/", gallery_categories_list, name="gallery-categories"),
    path("api/v2/gallery/images/", gallery_images_list, name="gallery-images"),

    # News & Press Releases APIs
    path("api/v2/news/categories/", news_categories_list, name="news-categories"),
    path("api/v2/news/", press_releases_list, name="press-releases-list"),
    path("api/v2/news/<slug:slug>/", press_release_detail, name="press-release-detail"),

    # Wagtail catch-all (keep at bottom)
    path("", include(wagtail_urls)),
]


if settings.DEBUG:
    from django.conf.urls.static import static
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns

    # Serve static and media files from development server
    urlpatterns += staticfiles_urlpatterns()
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns = urlpatterns + [
    # For anything not caught by a more specific rule above, hand over to
    # Wagtail's page serving mechanism. This should be the last pattern in
    # the list:
    path("", include(wagtail_urls)),
    # Alternatively, if you want Wagtail pages to be served from a subpath
    # of your site, rather than the site root:
    #    path("pages/", include(wagtail_urls)),
]
