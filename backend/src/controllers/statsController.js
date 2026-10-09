import Tree from '../models/Tree.js';
import User from '../models/User.js';
import { getDBStatus, localStore } from '../config/db.js';

// @desc    Get aggregate statistics and analytics for dashboard
// @route   GET /api/stats
export const getStats = async (req, res, next) => {
  try {
    const { connectedToMongo } = getDBStatus();
    let trees = [];
    let totalUsers = 0;

    if (connectedToMongo) {
      trees = await Tree.find();
      totalUsers = await User.countDocuments();
    } else {
      trees = localStore.data.trees;
      totalUsers = localStore.data.users.length;
    }

    const totalTrees = trees.length;

    // Status counts
    const statusCounts = {
      Planted: 0,
      Healthy: 0,
      Growing: 0,
      'Needs Attention': 0,
      Deceased: 0,
    };

    const speciesMap = {};
    const cityMap = {};
    const planterMap = {};
    let totalHeightCm = 0;

    trees.forEach((tree) => {
      // Status
      if (statusCounts[tree.status] !== undefined) {
        statusCounts[tree.status]++;
      } else {
        statusCounts[tree.status] = 1;
      }

      // Species
      const species = tree.commonName || tree.treeSpecies || 'Unknown';
      speciesMap[species] = (speciesMap[species] || 0) + 1;

      // City
      const city = tree.location?.city || 'Unspecified';
      cityMap[city] = (cityMap[city] || 0) + 1;

      // Planter
      const planterName = tree.person?.name || 'Anonymous Planter';
      planterMap[planterName] = (planterMap[planterName] || 0) + 1;

      // Height
      totalHeightCm += Number(tree.heightCm || 0);
    });

    const activeLivingTrees = (statusCounts.Healthy || 0) + (statusCounts.Growing || 0) + (statusCounts.Planted || 0);
    const survivalRate = totalTrees > 0 ? Math.round((activeLivingTrees / totalTrees) * 100) : 0;
    const avgHeightCm = totalTrees > 0 ? Math.round(totalHeightCm / totalTrees) : 0;
    
    // Estimated Carbon Offset (~21.8 kg CO2 absorbed per tree annually on average)
    const estimatedCo2KgYear = Math.round(activeLivingTrees * 21.8);

    // Top Species
    const topSpecies = Object.entries(speciesMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top Cities
    const topCities = Object.entries(cityMap)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top Planters
    const topPlanters = Object.entries(planterMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Unique species count
    const uniqueSpeciesCount = Object.keys(speciesMap).length;

    res.json({
      success: true,
      stats: {
        totalTrees,
        totalUsers,
        survivalRate,
        avgHeightCm,
        estimatedCo2KgYear,
        uniqueSpeciesCount,
        statusCounts,
        topSpecies,
        topCities,
        topPlanters,
      },
      dbStatus: getDBStatus(),
    });
  } catch (err) {
    next(err);
  }
};
