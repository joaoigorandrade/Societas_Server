const {db} = require('../../config/firebaseConfig');

const createUser = async (req, res) => {
  try {
    const { name, avatar, enterprise } = req.body;
    const userRef = await db.collection('users').add({
      name,
      avatar,
      enterprise,
      createdAt: new Date().toISOString(),
    });
    res.status(201).send({ id: userRef.id });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = [];
    usersSnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      res.status(404).send('User not found');
    } else {
      res.status(200).send({ id: userDoc.id, ...userDoc.data() });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, avatar, enterprise } = req.body;
    await db.collection('users').doc(userId).update({
      name,
      avatar,
      enterprise,
    });
    res.status(200).send('User updated successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await db.collection('users').doc(userId).delete();
    res.status(200).send('User deleted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getUserSettings = async (req, res) => {
  try {
    const { userId } = req.params;
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      res.status(404).send('User not found');
    } else {
      res.status(200).send(userDoc.data().settings);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateUserSettings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { settings } = req.body;
    await db.collection('users').doc(userId).update({
      settings,
    });
    res.status(200).send('User settings updated successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserSettings,
  updateUserSettings,
};