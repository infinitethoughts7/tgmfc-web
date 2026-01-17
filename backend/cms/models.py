from django.db import models
from django.utils.text import slugify
from wagtail.snippets.models import register_snippet  # type: ignore
from wagtail.admin.panels import FieldPanel, MultiFieldPanel  # type: ignore
from wagtail.fields import RichTextField  # type: ignore
from taggit.models import TaggedItemBase  # type: ignore
from modelcluster.fields import ParentalKey  # type: ignore
from modelcluster.contrib.taggit import ClusterTaggableManager  # type: ignore
from modelcluster.models import ClusterableModel  # type: ignore


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


# News & Press Releases Models

@register_snippet
class NewsCategory(models.Model):
    name = models.CharField(max_length=100)
    name_te = models.CharField(max_length=100, blank=True, help_text="Telugu translation")
    slug = models.SlugField(unique=True)

    panels = [
        FieldPanel('name'),
        FieldPanel('name_te'),
        FieldPanel('slug'),
    ]

    class Meta:
        verbose_name_plural = "News Categories"
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class PressReleaseTag(TaggedItemBase):
    content_object = ParentalKey(
        'PressRelease',
        related_name='tagged_items',
        on_delete=models.CASCADE
    )


@register_snippet
class PressRelease(ClusterableModel):
    # English fields
    title = models.CharField(max_length=500)
    slug = models.SlugField(unique=True, max_length=500)
    excerpt = models.TextField(max_length=500, help_text="Short summary")
    body = RichTextField(help_text="Full article content")

    # Telugu fields
    title_te = models.CharField(max_length=500, blank=True, help_text="Telugu title")
    excerpt_te = models.TextField(max_length=500, blank=True, help_text="Telugu summary")
    body_te = RichTextField(blank=True, help_text="Telugu article content")

    # Media
    featured_image = models.ForeignKey(
        'wagtailimages.Image',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='+'
    )

    # Metadata
    category = models.ForeignKey(
        NewsCategory,
        on_delete=models.SET_NULL,
        null=True,
        related_name='press_releases'
    )
    author = models.CharField(max_length=255, default="Ministry of Minority Welfare")
    tags = ClusterTaggableManager(through=PressReleaseTag, blank=True)

    # Status
    is_published = models.BooleanField(default=False, help_text="Publish this article")
    is_featured = models.BooleanField(default=False, help_text="Show on homepage")

    # Dates
    published_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Analytics
    views = models.PositiveIntegerField(default=0, editable=False)

    panels = [
        MultiFieldPanel([
            FieldPanel('title'),
            FieldPanel('slug'),
            FieldPanel('excerpt'),
            FieldPanel('body'),
        ], heading="English Content"),

        MultiFieldPanel([
            FieldPanel('title_te'),
            FieldPanel('excerpt_te'),
            FieldPanel('body_te'),
        ], heading="Telugu Content"),

        MultiFieldPanel([
            FieldPanel('featured_image'),
            FieldPanel('category'),
            FieldPanel('author'),
            FieldPanel('tags'),
        ], heading="Metadata"),

        MultiFieldPanel([
            FieldPanel('is_published'),
            FieldPanel('is_featured'),
            FieldPanel('published_date'),
        ], heading="Publishing"),
    ]

    class Meta:
        ordering = ['-published_date']
        verbose_name = "Press Release / News Article"
        verbose_name_plural = "Press Releases / News Articles"

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def increment_views(self):
        self.views += 1
        self.save(update_fields=['views'])