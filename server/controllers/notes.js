import Note from '../models/Note.js';
import { createNoteSchema, updateNoteSchema } from '../validation/noteSchema.js';

export const getNotes = async (req, res, next) => {
  try {
    const { search, tags, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (search && search.trim()) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { body: { $regex: escaped, $options: 'i' } },
      ];
    }

    if (tags) {
      const tagArray = tags.split(',').map((t) => t.trim()).filter(Boolean);
      if (tagArray.length > 0) {
        filter.tags = { $in: tagArray };
      }
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [data, total] = await Promise.all([
      Note.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Note.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const parsed = createNoteSchema.parse(req.body);
    const note = await Note.create(parsed);
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const parsed = updateNoteSchema.parse(req.body);
    if (Object.keys(parsed).length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }
    const note = await Note.findByIdAndUpdate(req.params.id, parsed, {
      new: true,
      runValidators: true,
    });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
};
