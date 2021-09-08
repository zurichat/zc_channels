from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet, ModelViewSet

from channel_plugin.utils.customrequest import Request
from . import models
from .serializers import (  # SearchMessageQuerySerializer,
    ChannelSerializer,
    ChannelUpdateSerializer,
)

# Create your views here.

# Creating mockup data for the messages_data
messages_data = [
	{	"user_name":"Buka",
		"channel_name": "Backend",
		"value": "Submit all assignments on time"
	},
	{	"user_name":"Vuie",
		"channel_name": "Announcements",
		"value": "Sign up on time"
	},
	{	"user_name":"Marxo",
		"channel_name": "Announcements",
		"value": "Welcome to HNGX8"
	}

	]

# messages_data = []


class ChannelViewset(ViewSet):
    @swagger_auto_schema(
        request_body=ChannelSerializer,
        responses={201: openapi.Response("Response", ChannelUpdateSerializer)},
    )
    @action(methods=["POST"], detail=False, url_path="(?P<org_id>[^/.]+)")
    def channels(self, request, org_id):

        """
        This creates a channel for a
        particular organization identified by ID
        """

        serializer = ChannelSerializer(data=request.data, context={"org_id": org_id})
        serializer.is_valid(raise_exception=True)
        channel = serializer.data.get("channel")
        result = channel.create(org_id)
        return Response(result, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(
        responses={
            200: openapi.Response("Response", ChannelUpdateSerializer(many=True))
        }
    )
    @action(methods=["GET"], detail=False, url_path="(?P<org_id>[^/.]+)/all")
    def channel_all(self, request, org_id):

        """
        This gets all channels for a
        particular organization identified by ID
        """
        data = {}
        data.update(dict(request.query_params))
        result = Request.get(org_id, "channel", data)
        return Response({"message":True,"data" :result}, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        responses={200: openapi.Response("Response", ChannelUpdateSerializer)}
    )
    @action(
        methods=["GET"],
        detail=False,
        url_path="(?P<org_id>[^/.]+)/(?P<channel_id>[^/.]+)/retrieve",
    )
    def channel_retrieve(self, request, org_id, channel_id):
        data = {"_id": channel_id}
        result = Request.get(org_id, "channel", data)
        return Response(result, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        request_body=ChannelUpdateSerializer,
        responses={200: openapi.Response("Response", ChannelUpdateSerializer)},
    )
    @action(
        methods=["PUT"],
        detail=False,
        url_path="(?P<org_id>[^/.]+)/(?P<channel_id>[^/.]+)/update",
    )
    def channel_update(self, request, org_id, channel_id):
        serializer = ChannelUpdateSerializer(
            data=request.data, context={"org_id": org_id}
        )
        serializer.is_valid(raise_exception=True)
        channel = serializer.data.get("channel")
        result = channel.update(org_id, channel_id)
        return Response(result, status=status.HTTP_200_OK)

    @action(
        methods=["DELETE"],
        detail=False,
        url_path="(?P<org_id>[^/.]+)/(?P<channel_id>[^/.]+)/delete",
    )
    def channel_delete(self, request, org_id, channel_id):
        return Response({"msg": "To be implemened"}, status=status.HTTP_204_NO_CONTENT)


class ChannelsModelViewset(ModelViewSet):
    pass