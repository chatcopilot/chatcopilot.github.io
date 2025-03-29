const express = require('express');
const router = express.Router();
const ChatLog = require('../models/ChatLog');

// 记录日志
router.post('/', async (req, res) => {
    try {
        const log = await ChatLog.create(req.body);
        res.status(201).json({ success: true, data: log });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// 获取所有日志
router.get('/', async (req, res) => {
    try {
        const logs = await ChatLog.find().sort({ timestamp: -1 });
        res.status(200).json({ success: true, data: logs });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router; 