import requests
import base64
import json

# Stability AI API 엔드포인트
url = "https://api.stability.ai/v2beta/stable-image/control/sketch"

# 헤더에 API 키 추가 (자신의 API 키로 대체해야 함)
headers = {
    "Authorization": "Bearer sk-WgVCeVHXwgF4MmPLFJkEycSUGtpiuDAD3i1JIJyQrzQMNy7s",
    "Accept": "application/json"
}

# 이미지 파일 경로
image_path = "./example_img2.png"

# 요청 데이터 준비 (multipart 폼 데이터)
multipart_data = {
    "image": ("sketch_image.png", open(image_path, "rb"), "image/png"),
    "prompt": (None, "one girl goes desert for adventure behind a parents.")
}

# POST 요청 보내기
response = requests.post(url, headers=headers, files=multipart_data)

# 결과 출력 및 이미지 저장
if response.status_code == 200:
    sketch_result = response.json()
    
    # 생성 과정 및 크레딧 정보 추출
    process_description = sketch_result.get('description', 'No description available.')
    credits_used = sketch_result.get('credits', 'No credits information available.')
    
    # 생성 과정 및 크레딧 정보 출력
    print("Process Description:", process_description)
    print("Credits Used:", credits_used)
    
    # 응답 데이터에서 base64 이미지 추출
    base64_image = sketch_result.get('image')
    
    # base64 이미지 디코딩
    image_data = base64.b64decode(base64_image)
    
    # 이미지 파일로 저장
    with open("generated_image.png", "wb") as image_file:
        image_file.write(image_data)
    
    print("Sketch to image successful. Image saved as 'generated_image.png'.")
else:
    print("Error:", response.status_code, response.text)
