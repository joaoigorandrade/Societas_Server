const { db } = require('../../config/firebaseConfig');

const createUser = async (req, res) => {
  try {
    const { uid, name, email, avatar_url } = req.body;
    if (!uid) {
      return res.status(400).send({ message: 'User ID (uid) is required in the request body.' });
    }
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();
    if (doc.exists) {
      return res.status(409).send({ message: 'User already exists.' });
    }
    const newUser = {
      name,
      email,
      created_at: new Date().toISOString(),
    };
    if (avatar_url) newUser.avatar_url = avatar_url;

    await userRef.set(newUser);
    res.status(201).send({ id: uid, ...newUser });
  } catch (error) {
    res.status(500).send({ message: 'Error creating user', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('users').doc(id).delete();
    res.status(200).send({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting user', error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send({ message: 'Error getting all users', error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userDoc = await db.collection('users').doc(id).get();
    if (!userDoc.exists) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).json({ id: userDoc.id, ...userDoc.data() });
  } catch (error) {
    res.status(500).send({ message: 'Error getting user', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await db.collection('users').doc(id).update(data);
    const updatedDoc = await db.collection('users').doc(id).get();
    res.status(200).send({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    res.status(500).send({ message: 'Error updating user', error: error.message });
  }
};

module.exports = {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
};
