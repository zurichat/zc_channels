import json

import requests

"""
To run `python manage.py runscript plugin`
"""

url = "https://api.zuri.chat/plugins/register"


data = {
    "name": "Channels Plugin",
    "developer_name": "Team Coelho",
    "developer_email": "team-coelho@zuri.chat",
    "description": "Channel Plugin",
    "template_url": "https://channels.zuri.chat",
    "install_url": "https://channels.zuri.chat/api/v1/install",
    "sidebar_url": "https://channels.zuri.chat/api/v1/sidebar",
    "icon_url": "https://www.svgrepo.com/show/43575/message-in-a-speech-bubble.svg",
    "approved": True,
    "images": None,
    "version": "v1",
    "category": "channels",
}


def run():
    response = requests.post(url, data=json.dumps(data))
    if response.status_code >= 200 and response.status_code < 300:
        response = response.json()
        plugin_id = response.get("data", {}).get("plugin_id")
        with open("plugin_id.txt", "w+") as f:
            f.truncate(0)
            f.write(plugin_id)
            f.close()
            print("Plugin registration successful")        
        
        sync_url = f"https://api.zuri.chat/plugins/{plugin_id}"
        sync_data = {"sync_request_url": "https://channels.zuri.chat/sync/"}
        
        response = requests.patch(sync_url, sync_data)

        if response.status_code >= 200 and response.status_code < 300:
            print("Setup Plugin Synchronization successful")
        return
    print("Plugin registration not successful")
