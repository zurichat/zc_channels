from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import SearchMessageQuerySerializer
from .utils import find_item_in_data

import json

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


class Test(APIView):

    """
    Testing endpoint for channel app
    """

    def get(self, request):
        return Response({"msg": "working"}, status=status.HTTP_200_OK)


class SearchMessagesAPIView(APIView):
	# messages = json.loads(json_data)
		# print("DEFE FEFE "+ messages)
	# except:
	# 	pass
	def post(self, request):
		print("HELOASD")
		print(messages_data)
		serializer = SearchMessageQuerySerializer(data=request.data)
		if serializer.is_valid():
			value = serializer.validated_data['value']
			if value != "-":	
				data = find_item_in_data(messages_data, value, "value")
				response = {
					"status" :True,
					"message": "Query results",
					"data": data
				}
				return Response(response, status=status.HTTP_200_OK)
			else:
				data = messages_data
				response = {
					"status" :True,
					"message": "Query results",
					"data": data
				}
				return Response(response, status=status.HTTP_200_OK)
		return Response(serializer.errors)
	def get(self, request):
		return Response({"status":True, "message":"Endpoint to search messages, passing '-' will return all messages_data."})