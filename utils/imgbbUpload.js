const axios = require('axios');
require('dotenv').config();

const uploadToImgBB = async (file) => {
  try {
    if (!file || !file.buffer) throw new Error('No file provided');

    const base64 = file.buffer.toString('base64');

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      { image: base64 }
    );

    return response.data.data.url;
  } catch (err) {
    console.error('ImgBB upload error:', err.message);
    throw new Error('Failed to upload image');
  }
};

module.exports = uploadToImgBB;
