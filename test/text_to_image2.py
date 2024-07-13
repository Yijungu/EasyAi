import requests

response = requests.post(
    f"https://api.stability.ai/v2beta/stable-image/generate/core",
    headers={
        "authorization": f"Bearer sk-WgVCeVHXwgF4MmPLFJkEycSUGtpiuDAD3i1JIJyQrzQMNy7s",
        "accept": "image/*"
    },
    files={"none": ''},
    data={
        "prompt": "3-heads-tall character, cute and chibi-style, wearing a colorful outfit, big expressive eyes, small hands and feet, standing in a whimsical forest. The background is filled with oversized mushrooms and fairy lights. Soft, glowing lighting. Created Using: digital painting, vibrant colors, whimsical art style, detailed shading, fantasy elements, soft brush strokes, cartoon influence, dynamic lighting",
        "output_format": "png",
        "style_preset" : "anime",
        "seed" : 200000,
    },
)

if response.status_code == 200:
    with open("./desert_line.png", 'wb') as file:
        file.write(response.content)
else:
    raise Exception(str(response.json()))