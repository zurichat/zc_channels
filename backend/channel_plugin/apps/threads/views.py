from apps.utils.serializers import ErrorSerializer
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from channel_plugin.utils.customrequest import Request

from .permissions import CanReply, IsMember, IsOwner
from .serializers import ThreadSerializer, ThreadUpdateSerializer, ThreadEmojiUpdateSerializer


class ThreadViewset(ViewSet):

    authentication_classes = []

    def get_permissions(self):

        """
        Instantiates and returns the list of permissions that this view requires.
        """
        permissions = super().get_permissions()
        if self.action in [
            "thread_message",
            "thread_message_update",
            "thread_message_delete",
            # "retrieve_thread_reactions",
            # "update_thread_reactions",
        ]:
            permissions.append(IsMember())
            if self.action in ["thread_message_delete", "thread_message_update"]:
                permissions.append(IsOwner())
            if self.action in ["thread_message"]:
                permissions.append(CanReply())
        return permissions

    @swagger_auto_schema(
        request_body=ThreadSerializer,
        responses={
            201: openapi.Response("Response", ThreadUpdateSerializer),
            404: openapi.Response("Error Response", ErrorSerializer),
        },
        manual_parameters=[
            openapi.Parameter(
                "channel_id",
                openapi.IN_QUERY,
                description="Channel ID (ID of channel message to be posted)",
                required=True,
                type=openapi.TYPE_STRING,
            ),
        ],
    )
    @action(
        methods=["POST"],
        detail=False,
    )
    def thread_message(self, request, org_id, channelmessage_id):
        serializer = ThreadSerializer(
            data=request.data,
            context={
                "channelmessage_id": channelmessage_id,
                "org_id": org_id,
                "channel_id": request.query_params.get("channel_id"),
            },
        )
        serializer.is_valid(raise_exception=True)
        thread = serializer.data.get("thread")
        result = thread.create(org_id)
        status_code = status.HTTP_404_NOT_FOUND
        if result.__contains__("_id"):
            status_code = status.HTTP_201_CREATED
            replies = Request.get(
                org_id, "channelmessage", {"_id": channelmessage_id}
            ).get("replies", 0)
            Request.put(
                org_id,
                "channelmessage",
                {"replies": replies + 1},
                object_id=channelmessage_id,
            )
        return Response(result, status=status_code)

    @swagger_auto_schema(
        responses={
            200: openapi.Response("Response", ThreadUpdateSerializer(many=True)),
            404: openapi.Response("Error Response", ErrorSerializer),
        }
    )
    @action(
        methods=["GET"],
        detail=False,
    )
    def thread_message_all(self, request, org_id, channelmessage_id):
        data = {"channelmessage_id": channelmessage_id}
        data.update(dict(request.query_params))
        result = Request.get(org_id, "thread", data) or []
        status_code = status.HTTP_404_NOT_FOUND
        if isinstance(result, list):
            status_code = status.HTTP_200_OK
        return Response(result, status=status_code)

    @swagger_auto_schema(
        request_body=ThreadUpdateSerializer,
        responses={
            200: openapi.Response("Response", ThreadUpdateSerializer),
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
    def thread_message_update(self, request, org_id, thread_id):
        serializer = ThreadUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = serializer.data.get("thread")
        payload.update({"edited": True})
        result = Request.put(org_id, "thread", payload, object_id=thread_id) or {}
        status_code = status.HTTP_404_NOT_FOUND
        if result.__contains__("_id") or isinstance(result, dict):
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
    def thread_message_delete(self, request, org_id, thread_id):
        thread = Request.get(org_id, "thread", {"_id": thread_id})
        message = Request.get(
            org_id, "channelmessage", {"_id": thread.get("channelmessage_id")}
        )
        replies = message.get("replies", 1)
        Request.delete(org_id, "thread", object_id=thread_id)
        Request.put(
            org_id,
            "channelmessage",
            {"replies": replies - 1},
            object_id=message.get("_id"),
        )
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(
        methods=["GET"],
        detail=False,
    )

    def retrieve_thread_reactions(self, request, org_id, thread_id):
        data = {"_id": thread_id}
        data.update(dict(request.query_params))
        result = Request.get(org_id, "thread", data) or {}
        reactions = result.get("emojis", [])
        status_code = status.HTTP_404_NOT_FOUND
        if result.__contains__("_id") or isinstance(result, dict):
            status_code = status.HTTP_200_OK
        return Response(reactions, status=status_code)

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
        ],
        request_body = ThreadEmojiUpdateSerializer,
         responses={
            200: openapi.Response("Response", ThreadEmojiUpdateSerializer),
            404: openapi.Response("Not Found"),
        },
        operation_id="update-thread-reactions",
    )

    @action(
        methods=["PUT"],
        detail=False,
    )
    def update_thread_reactions(self, request, org_id, thread_id):

        # get referenced message
        data = {"_id": thread_id}
        data.update(dict(request.query_params))
        message = Request.get(org_id, "thread", data)

        if message:
            message_reactions = message.get("emojis", [])

            serializer = ThreadEmojiUpdateSerializer(data=request.data)
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
            result = Request.put(org_id, "thread", payload, object_id=thread_id)
            status_code = status.HTTP_400_BAD_REQUEST
            if result:
                return Response(message_reactions, status=status.HTTP_200_OK)

            return Response({"error": "failed to update reaction"}, status=status_code)

        status_code = status.HTTP_404_NOT_FOUND
        return Response({"error": "message not found"}, status=status_code)



thread_views = ThreadViewset.as_view(
    {
        "get": "thread_message_all",
        "post": "thread_message",
    }
)
thread_views_group = ThreadViewset.as_view(
    {"put": "thread_message_update", "delete": "thread_message_delete"}
)
thread_reactions = ThreadViewset.as_view(
    {"get": "retrieve_thread_reactions", "put": "update_thread_reactions"}
)
