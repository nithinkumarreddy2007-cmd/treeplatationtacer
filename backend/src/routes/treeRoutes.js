import express from 'express';
import {
  getTrees,
  getTreeById,
  createTree,
  updateTree,
  deleteTree,
} from '../controllers/treeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTrees);
router.get('/:id', getTreeById);

// Protected routes
router.post('/', protect, createTree);
router.put('/:id', protect, updateTree);
router.delete('/:id', protect, authorize('admin', 'coordinator', 'planter'), deleteTree);

export default router;
