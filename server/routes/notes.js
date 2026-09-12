import { Router } from 'express';
import {
  getNotes,
  createNote,
  updateNote,
  softDeleteNote,
  restoreNote,
  permanentDeleteNote,
  getRecentDeleted,
  addTask,
} from '../controllers/notes.js';

const router = Router();

router.get('/', getNotes);
router.post('/', createNote);
router.post('/add-task', addTask);
router.put('/:id/restore', restoreNote);
router.delete('/:id', softDeleteNote);
router.delete('/:id/permanent', permanentDeleteNote);
router.get('/recent-deleted', getRecentDeleted);

export default router;
