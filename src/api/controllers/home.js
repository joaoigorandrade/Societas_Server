const { db } = require('../../config/firebaseConfig');

const getHomeScreen = async (req, res) => {
  try {
    const userId = "6qDU3re3ejbpIdman0WL";

    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).send({ message: 'User not found' });
    }

    const agentsSnapshot = await db.collection('users').doc(userId).collection('agents').get();
    const cBoard = agentsSnapshot.docs.map(doc => {
      const agentData = doc.data();
      return {
        name: agentData.name || 'Unnamed Agent',
        department: agentData.description || 'No Department',
        id: doc.id
      };
    });

    const userData = userDoc.data();
    const homeScreenModel = {
      userName: userData.name || 'No Name',
      userPhoto: userData.avatar_url || '',
      enterprise: userData.enterprise || 'Societas',
      cBoard: cBoard
    };

    res.status(200).json(homeScreenModel);
  } catch (error) {
    res.status(500).send({ message: 'Error getting home screen data', error: error.message });
  }
};

module.exports = {
  getHomeScreen,
};