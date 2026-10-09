import Tree from '../models/Tree.js';
import { getDBStatus, localStore } from '../config/db.js';

// @desc    Get all trees with filter, search, sort
// @route   GET /api/trees
export const getTrees = async (req, res, next) => {
  try {
    const { search, status, city, species, sort = '-plantedDate' } = req.query;
    const { connectedToMongo } = getDBStatus();

    if (connectedToMongo) {
      const filter = {};

      if (status && status !== 'All') {
        filter.status = status;
      }

      if (city && city !== 'All') {
        filter['location.city'] = new RegExp(city, 'i');
      }

      if (species && species !== 'All') {
        filter.treeSpecies = new RegExp(species, 'i');
      }

      if (search) {
        const regex = new RegExp(search, 'i');
        filter.$or = [
          { commonName: regex },
          { treeSpecies: regex },
          { 'location.name': regex },
          { 'location.city': regex },
          { 'person.name': regex },
          { healthNotes: regex },
        ];
      }

      const trees = await Tree.find(filter).sort(sort);
      return res.json({
        success: true,
        count: trees.length,
        data: trees,
      });
    } else {
      // Local persistent store filter & search
      let list = [...localStore.data.trees];

      if (status && status !== 'All') {
        list = list.filter((t) => t.status === status);
      }

      if (city && city !== 'All') {
        list = list.filter(
          (t) => t.location?.city && t.location.city.toLowerCase() === city.toLowerCase()
        );
      }

      if (species && species !== 'All') {
        list = list.filter(
          (t) => t.treeSpecies && t.treeSpecies.toLowerCase().includes(species.toLowerCase())
        );
      }

      if (search) {
        const q = search.toLowerCase();
        list = list.filter(
          (t) =>
            (t.commonName && t.commonName.toLowerCase().includes(q)) ||
            (t.treeSpecies && t.treeSpecies.toLowerCase().includes(q)) ||
            (t.location?.name && t.location.name.toLowerCase().includes(q)) ||
            (t.location?.city && t.location.city.toLowerCase().includes(q)) ||
            (t.person?.name && t.person.name.toLowerCase().includes(q)) ||
            (t.healthNotes && t.healthNotes.toLowerCase().includes(q))
        );
      }

      // Sort
      if (sort === '-plantedDate') {
        list.sort((a, b) => new Date(b.plantedDate) - new Date(a.plantedDate));
      } else if (sort === 'plantedDate') {
        list.sort((a, b) => new Date(a.plantedDate) - new Date(b.plantedDate));
      } else if (sort === 'commonName') {
        list.sort((a, b) => (a.commonName || '').localeCompare(b.commonName || ''));
      } else if (sort === '-heightCm') {
        list.sort((a, b) => (b.heightCm || 0) - (a.heightCm || 0));
      }

      return res.json({
        success: true,
        count: list.length,
        data: list,
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Get single tree by ID
// @route   GET /api/trees/:id
export const getTreeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { connectedToMongo } = getDBStatus();

    let tree;
    if (connectedToMongo) {
      tree = await Tree.findById(id);
    } else {
      tree = localStore.data.trees.find((t) => t._id === id);
    }

    if (!tree) {
      return res.status(404).json({ success: false, message: 'Tree record not found' });
    }

    res.json({ success: true, data: tree });
  } catch (err) {
    next(err);
  }
};

// @desc    Add new tree record
// @route   POST /api/trees
export const createTree = async (req, res, next) => {
  try {
    const {
      treeSpecies,
      commonName,
      location,
      plantedDate,
      person,
      status,
      heightCm,
      healthNotes,
      imageUrl,
      tags,
    } = req.body;

    if (!treeSpecies || !commonName || !location?.name || !location?.city || !person?.name) {
      return res.status(400).json({
        success: false,
        message: 'Please fill required fields: Tree Species, Common Name, Location Name, City, and Person Name',
      });
    }

    const { connectedToMongo } = getDBStatus();

    const treeData = {
      treeSpecies: treeSpecies.trim(),
      commonName: commonName.trim(),
      location: {
        name: location.name.trim(),
        city: location.city.trim(),
        state: location.state ? location.state.trim() : '',
        latitude: location.latitude ? Number(location.latitude) : null,
        longitude: location.longitude ? Number(location.longitude) : null,
      },
      plantedDate: plantedDate ? new Date(plantedDate) : new Date(),
      person: {
        name: person.name.trim(),
        email: person.email ? person.email.trim() : '',
        phone: person.phone ? person.phone.trim() : '',
        organization: person.organization ? person.organization.trim() : '',
      },
      status: status || 'Planted',
      heightCm: heightCm ? Number(heightCm) : 30,
      healthNotes: healthNotes ? healthNotes.trim() : '',
      imageUrl: imageUrl ? imageUrl.trim() : '',
      lastInspectedDate: new Date(),
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' && tags ? tags.split(',').map((t) => t.trim()) : [],
      createdBy: req.user ? req.user._id : null,
    };

    if (connectedToMongo) {
      const created = await Tree.create(treeData);
      return res.status(201).json({ success: true, data: created });
    } else {
      const newTree = {
        _id: `tree_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        ...treeData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStore.data.trees.unshift(newTree);
      localStore.save();
      return res.status(201).json({ success: true, data: newTree });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Update tree record
// @route   PUT /api/trees/:id
export const updateTree = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { connectedToMongo } = getDBStatus();

    if (connectedToMongo) {
      const existing = await Tree.findById(id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Tree record not found' });
      }

      const updated = await Tree.findByIdAndUpdate(id, { ...req.body, updatedAt: new Date() }, {
        new: true,
        runValidators: true,
      });

      return res.json({ success: true, data: updated });
    } else {
      const index = localStore.data.trees.findIndex((t) => t._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Tree record not found' });
      }

      const current = localStore.data.trees[index];
      const merged = {
        ...current,
        ...req.body,
        location: {
          ...current.location,
          ...(req.body.location || {}),
        },
        person: {
          ...current.person,
          ...(req.body.person || {}),
        },
        updatedAt: new Date().toISOString(),
      };

      localStore.data.trees[index] = merged;
      localStore.save();

      return res.json({ success: true, data: merged });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Delete tree record
// @route   DELETE /api/trees/:id
export const deleteTree = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { connectedToMongo } = getDBStatus();

    if (connectedToMongo) {
      const deleted = await Tree.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Tree record not found' });
      }
      return res.json({ success: true, message: 'Tree record removed successfully', id });
    } else {
      const index = localStore.data.trees.findIndex((t) => t._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Tree record not found' });
      }

      localStore.data.trees.splice(index, 1);
      localStore.save();
      return res.json({ success: true, message: 'Tree record removed successfully', id });
    }
  } catch (err) {
    next(err);
  }
};
