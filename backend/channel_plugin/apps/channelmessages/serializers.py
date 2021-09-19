from rest_framework import serializers

from .models import MESSAGE_TYPES, ChannelMessage


class ChannelMessageSerializer(serializers.Serializer):

    user_id = serializers.CharField(max_length=30, required=True)
    content = serializers.CharField(required=False)
    files = serializers.ListField(
        child=serializers.URLField(), allow_empty=True, required=False
    )
    timestamp = serializers.DateTimeField(read_only=True)

    def validate(self, attrs):
        if attrs.get("content", None) is None and attrs.get("files", None) is None:
            raise serializers.ValidationError(
                {"error": "Both content & files cannot be none"}
            )
        return super().validate(attrs)

    def to_representation(self, instance):
        instance = dict(instance)
        files = instance.get("files", None)
        channel_id = self.context.get("channel_id")
        if files:
            message = ChannelMessage(**instance, channel_id=channel_id, has_files="yes")
        else:
            message = ChannelMessage(**instance, channel_id=channel_id)
        data = {"channelmessage": message}
        return data

class ChannelMessageReactionSerializer(serializers.Serializer):

    title = serializers.CharField(read_only=True)
    count = serializers.IntegerField(read_only=True)
    users = serializers.ListField(read_only=True)

class ChannelMessageReactionsUpdateSerializer(serializers.Serializer):
    title = serializers.CharField(required=True)
    member_id = serializers.CharField()

class ChannelMessageUpdateSerializer(serializers.Serializer):

    _id = serializers.ReadOnlyField()
    user_id = serializers.CharField(read_only=True)
    channel_id = serializers.CharField(read_only=True)
    can_reply = serializers.BooleanField(read_only=True)
    type = serializers.ChoiceField(choices=MESSAGE_TYPES, read_only=True)
    edited = serializers.BooleanField(read_only=True)
    files = serializers.ListField(read_only=True)
    timestamp = serializers.DateTimeField(read_only=True)
    has_files = serializers.ChoiceField(choices=["yes", "no"], read_only=True)

    pinned = serializers.BooleanField(required=False)
    content = serializers.CharField(required=False)
    emojis = serializers.ListField(
        serializers.CharField(), allow_empty=True, required=False
    )

    def to_representation(self, instance):
        instance = dict(instance)

        data = {"message": instance}
        return data

    def validate_pinned(self, pinned):

        if pinned:
            return "True"
        return "False"
