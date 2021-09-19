from apps.multimedia.models import Media
from apps.utils.serializers import ErrorSerializer
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from django.core.signals import request_finished
from rest_framework import serializers, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from channel_plugin.utils.customrequest import Request

from .permissions import IsMember, IsOwner
from .serializers import ChannelMessageReactionsUpdateSerializer, ChannelMessageSerializer, ChannelMessageUpdateSerializer


class ChannelMessageViewset(ViewSet):

    authentication_classes = []

    def get_permissions(self):

        """
        Instantiates and returns the list of permissions that this view requires.
        """

        permissions = super().get_permissions()
        if self.action in ["message", "message_delete", "message_update"]:
            permissions.append(IsMember())
            if self.action in ["message_delete", "message_update"]:
                permissions.append(IsOwner())
        return permissions

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
            data=request.data, context={"channel_id": channel_id, "org_id": org_id}
        )
        serializer.is_valid(raise_exception=True)
        channelmessage = serializer.data.get("channelmessage")
        result = channelmessage.create(org_id)
        status_code = status.HTTP_404_NOT_FOUND
        if result.__contains__("_id"):
            # call signal here
            request_finished.send(
                sender=self.__class__,
                dispatch_uid="CreateMessageSignal",
                org_id=org_id,
                channel_id=channel_id,
                data=result,
            )
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
        result = Request.get(org_id, "channelmessage", data) or []
        status_code = status.HTTP_404_NOT_FOUND
        if isinstance(result, list):
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
        result = Request.get(org_id, "channelmessage", data) or {}
        status_code = status.HTTP_404_NOT_FOUND
        if result.__contains__("_id") or isinstance(result, dict):
            status_code = status.HTTP_200_OK
        return Response(result, status=status_code)

    @swagger_auto_schema(
        request_body=ChannelMessageUpdateSerializer,
        responses={
            200: openapi.Response("Response", ChannelMessageUpdateSerializer),
            404: openapi.Response("Error Response", ErrorSerializer),
        },
        manual_parameters=[
            openapi.Parameter(
                "user_id",
                openapi.IN_QUERY,
                description="User ID (owner of message)",
                required=True,
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                "channel_id",
                openapi.IN_QUERY,
                description="Channel ID (ID of channel message was posted)",
                required=True,
                type=openapi.TYPE_STRING,
            ),
        ],
    )
    @action(
        methods=["PUT"],
        detail=False,
    )
    def message_update(self, request, org_id, msg_id):
        serializer = ChannelMessageUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = serializer.data.get("message")
        payload.update({"edited": str(True)})
        result = Request.put(org_id, "channelmessage", payload, object_id=msg_id) or {}
        status_code = status.HTTP_404_NOT_FOUND

        if result.__contains__("_id") or isinstance(result, dict):
            #put signal here also
            request_finished.send(
                sender=self.__class__,
                dispatch_uid="EditMessageSignal",
                org_id=org_id,
                channel_id=result.get("channel_id"),
                data=result,
            )

            status_code = status.HTTP_200_OK
        return Response(result, status=status_code)

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "user_id",
                openapi.IN_QUERY,
                description="User ID (owner of message)",
                required=True,
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                "channel_id",
                openapi.IN_QUERY,
                description="Channel ID (ID of channel message was posted)",
                required=True,
                type=openapi.TYPE_STRING,
            ),
        ]
    )
    @action(
        methods=["DELETE"],
        detail=False,
    )
    def message_delete(self, request, org_id, msg_id):

        result = Request.delete(org_id, "channelmessage", object_id=msg_id)

        if result.get("status_code") == 200:
            if result.get("data", {}).get("deleted_count") > 0:
                Request.delete(
                    org_id, "thread", data_filter={"channelmessage_id": msg_id}
                )
        
        # add a signal here for delete signal
        channel_id = request.query_params.get("channel_id")
        request_finished.send(
            sender=self.__class__,
            dispatch_uid="DeleteMessageSignal",
            org_id=org_id,
            channel_id=channel_id,
            data = {
                '_id': msg_id,
                'channel_id': channel_id,
                'user_id': request.query_params.get("user_id")
            }
        )

        return Response(status=status.HTTP_204_NO_CONTENT)

    def retrieve_message_reactions(self, request, org_id, msg_id):
        data = {"_id": msg_id}
        data.update(dict(request.query_params))
        result = Request.get(org_id, "channelmessage", data) or {}
        reactions = result.get("emojis", [])
        status_code = status.HTTP_404_NOT_FOUND
        if result.__contains__("_id") or isinstance(result, dict):
            status_code = status.HTTP_200_OK
        return Response(reactions, status=status_code)
    
    def update_message_reactions(self, request, org_id, msg_id):

        # get referenced message
        data = {"_id": msg_id}
        data.update(dict(request.query_params))
        message = Request.get(org_id, "channelmessage", data)
        
        if message:
            message_reactions = message.get("emojis", [])

            serializer = ChannelMessageReactionsUpdateSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            # todo: refactor code to use dict instead of list
            new_message_reaction = serializer.data
            message_reaction = {
                "title": new_message_reaction["title"],
                "count": 1,
                "users": [new_message_reaction["member_id"]]
            }
            message_reaction_index = None
            for reaction in message_reactions:
                if reaction['title'] == new_message_reaction['title']:
                    message_reaction_index = message_reactions.index(reaction)
                    message_reaction = reaction
                    if new_message_reaction["member_id"] in message_reaction["users"]:
                        message_reaction["count"] -= 1
                        message_reaction["users"].remove(new_message_reaction["member_id"])
                    else:
                        message_reaction["count"] += 1
                        message_reaction["users"].append(new_message_reaction["member_id"])
            
            if message_reaction_index:
                message_reactions.pop(message_reaction_index)
                message_reactions.insert(message_reaction_index, message_reaction)
            else:
                message_reactions.append(message_reaction)
            
            payload = {
                "emojis": message_reactions
            }
            result = Request.put(org_id, "channelmessage", payload, object_id=msg_id)
            status_code = status.HTTP_400_BAD_REQUEST
            if result:
                return Response(message_reactions, status=status.HTTP_200_OK)

            return Response({"error": "failed to update reaction"}, status=status_code)
        
        status_code = status.HTTP_404_NOT_FOUND
        return Response({"error": "message not found"}, status=status_code)

channelmessage_views = ChannelMessageViewset.as_view(
    {
        "get": "message_all",
        "post": "message",
    }
)

channelmessage_views_group = ChannelMessageViewset.as_view(
    {"get": "message_retrieve", "put": "message_update", "delete": "message_delete"}
)

channelmessage_reactions = ChannelMessageViewset.as_view(
    {
        "get": "retrieve_message_reactions",
        "put": "update_message_reactions"
    }
)
