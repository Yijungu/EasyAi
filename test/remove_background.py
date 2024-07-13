import requests
import base64

# Stability AI API 엔드포인트
url = "https://api.stability.ai/v2beta/stable-image/edit/remove-background"

# 헤더에 API 키 추가 (자신의 API 키로 대체해야 함)
headers = {
    "Authorization": "Bearer sk-WgVCeVHXwgF4MmPLFJkEycSUGtpiuDAD3i1JIJyQrzQMNy7s",
    "Accept": "application/json"
}

# 이미지 파일 경로
image_path = "./example_img.png"

# 요청 데이터 준비 (multipart/form-data)
files = {
    "image": ("example_img.png", open(image_path, "rb"), "image/png")
}

# POST 요청 보내기
response = requests.post(url, headers=headers, files=files)

# 결과 출력 및 이미지 저장
if response.status_code == 200:
    result = response.json()
    
    # 응답 데이터에서 base64 이미지 추출
    base64_image = result.get('image')
    
    if base64_image:
        # base64 이미지 디코딩
        image_data = base64.b64decode(base64_image)
        
        # 이미지 파일로 저장
        with open("background_removed_image.png", "wb") as image_file:
            image_file.write(image_data)
        
        print("Background removal successful. Image saved as 'background_removed_image.png'.")
    else:
        print("No image found in response.")
else:
    print("Error:", response.status_code, response.text)
