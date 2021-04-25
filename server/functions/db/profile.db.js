const Boom = require('boom');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createFileWithRandomId } = require('../file');

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, 'JWT_SECRET', { expiresIn: '2 days' });
};

const setToken = (redisClient, key, value) => {
  return Promise.resolve(redisClient.set(key, value));
};

const createSessions = (redisClient, user) => {
  const { email, id } = user;
  const token = signToken(email);
  return setToken(redisClient, token, id)
    .then(() => {
      return { success: 'true', userId: id, token };
    })
    .catch((err) => {
      return err;
    });
};

const getProfile = async (req, h) => {
  const { email, password } = req.payload;
  const db = req.getDb();
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }
  const signindata = await db.any(
    'SELECT id, email, hash FROM liminal.login WHERE email like $1',
    email
  );
  if (bcrypt.compareSync(password, signindata[0].hash)) {
    try {
      const profile = await db.one(
        `SELECT id, last_name, first_name, middle_name, to_char(birth_date,'DD.MM.YYYY') as "birth_date", subscribed, email, phone, avatar
FROM liminal.user
where email like $1`,
        email
      );
      return profile;
    } catch (err) {
      throw Boom.badRequest('unable to get user');
    }
  } else {
    throw Boom.badRequest('wrong email or password');
  }
};

const signinAuth = async (req, h) => {
  const { authorization } = req.headers;
  const redisClient = req.getRedis();
  if (authorization) {
    const reply = await redisClient.get(authorization);
    if (reply) {
      return h.response({
        success: 'true',
        userId: reply,
        token: authorization,
      });
    } else {
      throw Boom.badRequest('Unauthorized');
    }
  } else {
    const profile = await getProfile(req, h);
    if (profile.id && profile.email) {
      const session = await createSessions(redisClient, profile);
      return h.response(session);
    } else {
      throw Boom.badRequest('signinauth error');
    }
  }
};

const createProfile = async (req, h) => {
  try {
    const {
      email,
      firstname,
      lastname,
      date,
      phone,
      file,
      password,
    } = req.payload;
    if (
      !email ||
      !firstname ||
      !lastname ||
      !date ||
      !phone ||
      !file ||
      !password
    ) {
      throw Boom.badRequest('incorrect form submission');
    }
    const db = req.getDb();
    const base64Data = file.imagePreviewUrl.split(',')[1];
    const imagename = createFileWithRandomId(
      'images/avatars/',
      file.image,
      'base64',
      base64Data
    );
    const hash = bcrypt.hashSync(password);
    await db.none(
      `INSERT INTO liminal.login(email, hash)
VALUES ($1, $2)`,
      [email, hash]
    );
    await db.none(
      `INSERT INTO liminal.user(email, first_name, last_name, birth_date, phone, avatar)
VALUES ($1, $2, $3, $4, $5, $6)`,
      [email, firstname, lastname, date, phone, imagename]
    );
    return h.response().code(200);
  } catch (err) {
    switch (err.routine) {
      case '_bt_check_unique':
        throw Boom.notAcceptable('NOT UNIQUE');
      default:
        throw Boom.badRequest('unable to register');
    }
  }
};

const handleGetProfile = async (req, h) => {
  const { id } = req.params;
  const { authorization } = req.headers;
  const db = req.getDb();
  if (!authorization) {
    throw Boom.badRequest('Unauthorized');
  }

  try {
    const user = await db.one(
      `SELECT id, last_name, first_name, middle_name, to_char(birth_date,'DD.MM.YYYY') as "birth_date", subscribed, email, phone, avatar FROM liminal.user WHERE id = $1`,
      id
    );
    const redisClient = req.getRedis();
    const auth = await redisClient.get(authorization);
    if (auth) {
      return h.response(user);
    } else throw Boom.badRequest('Unauthorized');
  } catch (err) {
    throw Boom.badRequest('Unauthorized');
  }
};

module.exports = {
  getProfile,
  createProfile,
  signinAuth,
  handleGetProfile,
};