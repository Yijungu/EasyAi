import requests

response = requests.post(
    f"https://api.stability.ai/v2beta/stable-image/control/sketch",
    headers={
        "authorization": "Bearer sk-WgVCeVHXwgF4MmPLFJkEycSUGtpiuDAD3i1JIJyQrzQMNy7s",
        "accept": "image/*"
    },
    files={
        "image": open("./lighthouse.png", "rb")
    },
    data={
        "prompt": "one girl run to desert for adventure with her family.",
        "control_strength": 0.7,
        "output_format": "png",
        "seed" : 2000,
    },
)

if response.status_code == 200:
    with open("./castle2.png", 'wb') as file:
        file.write(response.content)
else:
    raise Exception(str(response.json()))