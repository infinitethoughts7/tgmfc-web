from django.db import models
from wagtail.snippets.models import register_snippet  # type: ignore
from wagtail.admin.panels import FieldPanel  # type: ignore


@register_snippet
class Notification(models.Model):
    title = models.CharField(max_length=255)
    url = models.CharField(max_length=500, blank=True, help_text="Optional link")
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    panels = [
        FieldPanel('title'),
        FieldPanel('url'),
        FieldPanel('is_active'),
        FieldPanel('order'),
    ]

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title


@register_snippet
class GalleryCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    panels = [
        FieldPanel('name'),
        FieldPanel('slug'),
    ]

    class Meta:
        verbose_name_plural = "Gallery Categories"

    def __str__(self):
        return self.name


@register_snippet
class GalleryImage(models.Model):
    image = models.ForeignKey(
        'wagtailimages.Image',
        on_delete=models.CASCADE,
        related_name='+'
    )
    title = models.CharField(max_length=255)
    date = models.DateField()
    category = models.ForeignKey(
        GalleryCategory,
        on_delete=models.SET_NULL,
        null=True,
        related_name='images'
    )

    panels = [
        FieldPanel('image'),
        FieldPanel('title'),
        FieldPanel('date'),
        FieldPanel('category'),
    ]

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return self.title