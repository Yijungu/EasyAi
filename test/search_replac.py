import requests
import base64

# Stability AI API 엔드포인트
url = "https://api.stability.ai/v2beta/stable-image/edit/search-and-replace"

# 헤더에 API 키 추가 (자신의 API 키로 대체해야 함)
headers = {
    "Authorization": "Bearer sk-WgVCeVHXwgF4MmPLFJkEycSUGtpiuDAD3i1JIJyQrzQMNy7s",
    "Accept": "application/json"
}

# 이미지 파일 경로
image_path = "./background_removed_image.png"

# 요청 데이터 준비 (multipart/form-data)
files = {
    "image": ("background_removed_image.png", open(image_path, "rb"), "image/png")
}

# 프롬프트 예시
prompt = " A whimsical fairy tale depiction of Lisa setting off on an adventure in the desert, leaving her family behind. Lisa is walking determinedly among tall, fantastically shaped cacti, with a small backpack, mid-step pose, with sand swirling around her feet. The background has a vibrant sunset with a mix of oranges and purples. Soft, dreamy lighting with sparkling effects, detailed desert flora, magical vibe. Created Using: digital painting, fantasy style, soft brushwork, glowing highlights, dynamic motion, vibrant palette, detailed textures, hd quality, natural look"
search_prompt = "background"

data = {
    "prompt": prompt,
    "search_prompt": search_prompt,
    "negative_prompt": "",
    "grow_mask": 3,
    "seed": 0,
    "output_format": "png"
}

# POST 요청 보내기
response = requests.post(url, headers=headers, files=files, data=data)

# 결과 출력 및 이미지 저장
if response.status_code == 200:
    result = response.json()
    
    # 응답 데이터에서 base64 이미지 추출
    base64_image = result.get('image')
    
    if base64_image:
        # base64 이미지 디코딩
        image_data = base64.b64decode(base64_image)
        
        # 이미지 파일로 저장
        with open("replaced_image.png", "wb") as image_file:
            image_file.write(image_data)
        
        print("Search and replace successful. Image saved as 'replaced_image.png'.")
    else:
        print("No image found in response.")
else:
    print("Error:", response.status_code, response.text)
