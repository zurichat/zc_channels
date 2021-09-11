from apps.utils.serializers import ErrorSerializer
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from channel_plugin.utils.customrequest import Request

from .serializers import ChannelMessageSerializer, ChannelMessageUpdateSerializer


class ChannelMessageViewset(ViewSet):
    @swagger_auto_schema(
        request_body=ChannelMessageSerializer,
        responses={
            201: openapi.Response("Response", ChannelMessageUpdateSerializer),
            404: openapi.Response("Error Response", ErrorSerializer),
        },
    )
    @action(
        methods=["POST"],
        detail=False,
    )
    def message(self, request, org_id, channel_id):
        serializer = ChannelMessageSerializer(
            data=request.data, context={"channel_id": channel_id}
        )
        serializer.is_valid(raise_exception=True)
        channelmessage = serializer.data.get("channelmessage")
        result = channelmessage.create(org_id)
        status_code = status.HTTP_404_NOT_FOUND
        if result.__contains__("_id"):
            status_code = status.HTTP_201_CREATED
        return Response(result, status=status_code)

    @swagger_auto_schema(
        responses={
            200: openapi.Response(
                "Response", ChannelMessageUpdateSerializer(many=True)
            ),
            404: openapi.Response("Error Response", ErrorSerializer),
        }
    )
    @action(
        methods=["GET"],
        detail=False,
    )
    def message_all(self, request, org_id, channel_id):
        data = {"channel_id": channel_id}
        data.update(dict(request.query_params))
        result = Request.get(org_id, "channelmessage", data)
        status_code = status.HTTP_404_NOT_FOUND
        if type(result) == list:
            status_code = status.HTTP_200_OK
        return Response(result, status=status_code)

    @swagger_auto_schema(
        responses={
            200: openapi.Response("Response", ChannelMessageUpdateSerializer),
            404: openapi.Response("Error Response", ErrorSerializer),
        },
        operation_id="message read one channelmessage",
    )
    @action(
        methods=["GET"],
        detail=False,
    )
    def message_retrieve(self, request, org_id, msg_id):
        data = {"_id": msg_id}
        data.update(dict(request.query_params))
        result = Request.get(org_id, "channelmessage", data)
        status_code = status.HTTP_404_NOT_FOUND
        if result.__contains__("_id"):
            status_code = status.HTTP_200_OK
        return Response(result, status=status_code)

    @swagger_auto_schema(
        request_body=ChannelMessageUpdateSerializer,
        responses={
            200: openapi.Response("Response", ChannelMessageUpdateSerializer),
            404: openapi.Response("Error Response", ErrorSerializer),
        },
    )
    @action(
        methods=["PUT"],
        detail=False,
    )
    def message_update(self, request, org_id, msg_id):
        serializer = ChannelMessageUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = serializer.data.get("message")
        payload.update({"edited": True})
        result = Request.put(org_id, "channelmessage", payload, object_id=msg_id)
        status_code = status.HTTP_404_NOT_FOUND
        if result.__contains__("_id"):
            status_code = status.HTTP_200_OK
        return Response(result, status=status_code)

    @action(
        methods=["DELETE"],
        detail=False,
    )
    def message_delete(self, request, org_id, channel_id):
        return Response({"msg": "To be implemened"}, status=status.HTTP_204_NO_CONTENT)


channelmessage_views = ChannelMessageViewset.as_view(
    {
        "get": "message_all",
        "post": "message",
    }
)

channelmessage_views_group = ChannelMessageViewset.as_view(
    {"get": "message_retrieve", "put": "message_update", "delete": "message_delete"}
)
