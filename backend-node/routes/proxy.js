const express = require('express');
const router = express.Router();
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const { protect, authorize } = require('../middleware/authMiddleware');

const upload = multer({ dest: 'uploads/' }); 

router.post('/predict', protect, async (req, res) => {
  try {
    const response = await axios.post(`${process.env.FLASK_API_URL}/predict`, req.body);
    res.json(response.data);
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message;
    res.status(error.response?.status || 500).json({ message: 'Error communicating with ML service', error: errorMsg });
  }
});

router.post('/predict/bulk', protect, authorize('dispatcher', 'admin'), upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path), req.file.originalname);

    const response = await axios.post(`${process.env.FLASK_API_URL}/predict-bulk`, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    
    fs.unlinkSync(req.file.path);
    res.json(response.data);
  } catch (error) {
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    const errorMsg = error.response?.data?.error || error.message;
    res.status(error.response?.status || 500).json({ message: 'Error processing bulk prediction', error: errorMsg });
  }
});

module.exports = router;
