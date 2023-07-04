from tortoise import fields
from tortoise.models import Model


class IdMixin:
    id = fields.UUIDField(pk=True)


class TimestampMixin:
    created_at = fields.DatetimeField(null=False, auto_now_add=True)
    last_modified_at = fields.DatetimeField(null=True, auto_now=True)


class User(IdMixin, TimestampMixin, Model):
    # Tortoise doesn't support unique indexes on Text, so using CharField here
    email = fields.CharField(unique=True, null=False, max_length=100)
    hashed_password = fields.CharField(null=False, max_length=128)
    is_deleted = fields.BooleanField(default=False, null=False)

    # Tortoise ORM recommends the Meta class as a good habit
    # https://tortoise.github.io/models.html#inheritance
    class Meta:
        table = "users"

    def __str__(self):
        return f"User with id: {self.id}"
