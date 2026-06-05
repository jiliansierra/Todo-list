const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Your PostgreSQL pool connection

// 1. GET ALL TODOS
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM todos ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error while fetching tasks" });
    }
});

// 2. ADD A TODO
router.post('/', async (req, res) => {
    try {
        const { title } = req.body;
        const result = await db.query(
            'INSERT INTO todos (title, is_completed) VALUES ($1, false) RETURNING *',
            [title]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error while adding task" });
    }
});

// 3. TOGGLE COMPLETION STATUS
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { is_completed } = req.body;
        const result = await db.query(
            'UPDATE todos SET is_completed = $1 WHERE id = $2 RETURNING *',
            [is_completed, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error while updating task" });
    }
});

// 4. DELETE A TODO
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM todos WHERE id = $1', [id]);
        res.json({ message: "Task successfully deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error while deleting task" });
    }
});

module.exports = router;