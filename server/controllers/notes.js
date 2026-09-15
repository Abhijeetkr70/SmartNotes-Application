import Note from '../models/Note.js';
import { createNoteSchema, updateNoteSchema } from '../validation/noteSchema.js';

export const getNotes = async (req, res, next) => {
  try {
    const { search, tags, cursor, limit = 20 } = req.query;
    const filter = { userId: req.userId, status: 'active' };

    if (search && search.trim()) {
      const searchText = search.trim();
      filter.$text = { $search: searchText };
    }

    if (tags) {
      const tagArray = tags.split(',').map((t) => t.trim()).filter(Boolean);
      if (tagArray.length > 0) {
        filter.tags = { $in: tagArray };
      }
    }

    if (cursor) {
      try {
        const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
        const { createdAt, _id } = JSON.parse(decoded);
        filter.$or = [
          { createdAt: { $lt: new Date(createdAt) } },
          { createdAt: new Date(createdAt), _id: { $lt: new mongoose.Types.ObjectId(_id) } },
        ];
      } catch {
        return res.status(400).json({ success: false, message: 'Invalid cursor' });
      }
    }

    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));

    const notes = await Note.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limitNum + 1)
      .select('title body color tags createdAt updatedAt')
      .lean();

    let nextCursor = null;
    if (notes.length > limitNum) {
      const nextNote = notes.pop();
      nextCursor = Buffer.from(JSON.stringify({
        createdAt: nextNote.createdAt.toISOString(),
        _id: nextNote._id.toString(),
      })).toString('base64');
    }

    res.json({
      success: true,
      data: notes,
      pagination: {
        nextCursor,
        hasMore: !!nextCursor,
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const parsed = createNoteSchema.parse(req.body);
    const note = await Note.create({ ...parsed, userId: req.userId });
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
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      parsed,
      { new: true, runValidators: true }
    );
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

export const softDeleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { status: 'deleted' },
      { new: true }
    );
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

export const restoreNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { status: 'active' },
      { new: true }
    );
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

export const permanentDeleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.json({ success: true, message: 'Note permanently deleted' });
  } catch (error) {
    next(error);
  }
};

export const getRecentDeleted = async (req, res, next) => {
  try {
    const notes = await Note.find({ userId: req.userId, status: 'deleted' })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, data: notes });
  } catch (error) {
    next(error);
  }
};

export const addTask = async (req, res, next) => {
  try {
    const parsed = createNoteSchema.parse(req.body);
    const note = await Note.create({ ...parsed, userId: req.userId });
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};
