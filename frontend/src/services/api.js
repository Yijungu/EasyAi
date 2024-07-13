export const login = async email => {
  try {
    const response = await fetch('http://192.168.0.32:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email}),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const generateQRCodes = async (schoolId, userId) => {
  try {
    const response = await fetch('http://192.168.0.32:3000/api/qr/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({schoolId, userId}),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return await response.json();
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw error;
  }
};

export const handleChildLogin = async (qrCode, nickname) => {
  try {
    const response = await fetch('http://localhost:3000/api/qr/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({qrCode, nickname}),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return await response.json();
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw error;
  }
};
