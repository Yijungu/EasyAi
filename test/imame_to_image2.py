import base64
import os
import requests
from PIL import Image

def resize_image(image_path, output_path, target_size=(896, 512)):
    with Image.open(image_path) as img:
        print(img.size)
        img = img.resize(target_size, Image.ANTIALIAS)
        img.save(output_path)

input_image_path = "./example_img.png"
resized_image_path = "./resized_example_img3.png"
resize_image(input_image_path, resized_image_path)

response = requests.post(
    f"https://api.stability.ai/v2beta/stable-image/generate/sd3",
    headers={
        "authorization": f"Bearer sk-WgVCeVHXwgF4MmPLFJkEycSUGtpiuDAD3i1JIJyQrzQMNy7s",
        "accept": "image/*"
    },
    files={"image": open(resized_image_path, "rb")},
    data={
        "prompt": "A whimsical fairy tale depiction of Lisa in the desert, surrounded by tall, fantastically shaped cacti. Lisa is dancing joyfully among the cacti, mid-action pose, with sand swirling around her feet. The background has a vibrant sunset with a mix of oranges and purples. Soft, dreamy lighting with sparkling effects, detailed desert flora, magical vibe. Created Using: digital painting, fantasy style, soft brushwork, glowing highlights, dynamic motion, vibrant palette, detailed textures, hd quality, natural look",
        "output_format": "jpeg",
        "mode": "image-to-image",
        "strength": 0.77,
        "model": "sd3-large"
    },
)

if response.status_code == 200:
    with open("./generated_image.jpeg", 'wb') as file:
        file.write(response.content)
else:
    raise Exception(str(response.json()))
