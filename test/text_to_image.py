import requests

response = requests.post(
    f"https://api.stability.ai/v2beta/stable-image/generate/ultra",
    headers={
        "authorization": f"Bearer sk-WgVCeVHXwgF4MmPLFJkEycSUGtpiuDAD3i1JIJyQrzQMNy7s",
        "accept": "image/*"
    },
    files={"none": ''},
    data={
        "prompt": "With the desert as the backdrop, the woman begins her journey, leaving her family behind. Please draw it in the style of stick figures. Please draw it as if it were drawn by a 7-year-old.",
        "output_format": "png",
    },
)

if response.status_code == 200:
    with open("./lighthouse.png", 'wb') as file:
        file.write(response.content)
else:
    raise Exception(str(response.json()))

