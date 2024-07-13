import base64
import os
import requests
from PIL import Image

def resize_image(image_path, output_path, target_size=(896, 512)):
    with Image.open(image_path) as img:
        print(img.size)
        img = img.resize(target_size, Image.ANTIALIAS)
        img.save(output_path)

engine_id = "stable-diffusion-xl-beta-v2-2-2"
api_host = "https://api.stability.ai"
api_key = "sk-WgVCeVHXwgF4MmPLFJkEycSUGtpiuDAD3i1JIJyQrzQMNy7s"

if api_key is None:
    raise Exception("Missing Stability API key.")

# Resize the image to meet the size requirements
input_image_path = "./example_img2.png"
resized_image_path = "./resized_example_img3.png"
resize_image(input_image_path, resized_image_path)

with Image.open(resized_image_path) as img:
        print(img.size)

response = requests.post(
    f"{api_host}/v1/generation/{engine_id}/image-to-image",
    headers={
        "Accept": "application/json",
        "Authorization": f"Bearer {api_key}"
    },
    files={
        "init_image": open(resized_image_path, "rb")
    },
    data={
        "image_strength": 0.8,
        "init_image_mode": "IMAGE_STRENGTH",
        "text_prompts[0][text]": "girl goes to adventure",
        "cfg_scale": 20,
        "samples": 1,
        "steps": 30,
    }
)

if response.status_code != 200:
    raise Exception("Non-200 response: " + str(response.text))

print(response.json())

data = response.json()

# Ensure the 'out' directory exists
os.makedirs("./out", exist_ok=True)

for i, image in enumerate(data.get("artifacts", [])):
    image_data = base64.b64decode(image.get("base64", ""))
    if image_data:
        with open(f"./out/v1_img2img_{i}.png", "wb") as f:
            f.write(image_data)
        print(f"Image saved as ./out/v1_img2img_{i}.png")
    else:
        print(f"No valid image data for artifact {i}")
