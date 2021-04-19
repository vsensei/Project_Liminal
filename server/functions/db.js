const pgp = require('pg-promise')({});

const cn = {
  host: 'localhost', // 'localhost' is the default;
  port: 5432, // 5432 is the default;
  database: 'liminal',
  user: 'postgres',
  password: 'root',
};
const db = pgp(cn);

const getTrackList = async (req, h) => {
  const trackData = await db.any(
    `SELECT t.id, t."path", t."name", t.cover, to_char(t.duration,'MI:SS') as "duration", a.nickname as "author", g.name as "genre" FROM liminal.track t JOIN liminal.author a ON t.author_id=a.id JOIN liminal.genre g ON t.genre_id=g.id order by t.id`
  );
  return h.response(trackData);
  /*const response = await trackData.map((track) => {
    const tr = {
      ...track,
      cover: 'localhost:3001/files/covers/' + track.cover,
    };
    console.log(tr);
    return tr;
  });
  */
};

const getTracksByNameAndAuthor = async (req, h) => {
  const nm = req.params.name;
  const trackData = await db.any(
    `SELECT t.id, t."path", t."name", t.cover, to_char(t.duration,'MI:SS') as "duration", a.nickname as "author", g.name as "genre" FROM liminal.track t JOIN liminal.author a ON t.author_id=a.id JOIN liminal.genre g ON t.genre_id=g.id WHERE lower(t."name") like '%'||lower($1)||'%' OR lower(a.nickname) like '%'||lower($1)||'%' order by t.id`,
    nm
  );
  return h.response(trackData);
};

const getTracksByName = async (req, h) => {
  const nm = req.params.name;
  const trackData = await db.any(
    `SELECT t.id, t."path", t."name", t.cover, to_char(t.duration,'MI:SS') as "duration", a.nickname as "author", g.name as "genre" FROM liminal.track t JOIN liminal.author a ON t.author_id=a.id JOIN liminal.genre g ON t.genre_id=g.id WHERE lower(t."name") like '%'||lower($1)||'%' order by t.id`,
    nm
  );
  return h.response(trackData);
};

const getTracksByAuthor = async (req, h) => {
  const nm = req.params.name;
  const trackData = await db.any(
    `SELECT t.id, t."path", t."name", t.cover, to_char(t.duration,'MI:SS') as "duration", a.nickname as "author", g.name as "genre" FROM liminal.track t JOIN liminal.author a ON t.author_id=a.id JOIN liminal.genre g ON t.genre_id=g.id WHERE lower(a.nickname) like '%'||lower($1)||'%' order by t.id`,
    nm
  );
  return h.response(trackData);
};

const getProfile = async (req, h) => {
  const { email, password } = req.payload;
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }
  const profile = await db.oneOrNone(
    `SELECT id, last_name, first_name, middle_name, to_char(birth_date,'DD.MM.YYYY') as "birth_date", subscribed, email, phone, avatar
FROM liminal.users
where email like $1 AND password like $2`,
    [email, password]
  );
  return h.response(profile);
};

const createProfile = async (req, h) => {
  const { email, firstname, lastname, date, phone, password } = req.payload;
  const profile = await db.one(
    `INSERT INTO liminal.users(email, first_name, last_name, birth_date, phone, password)
VALUES ($1, $2, $3, $4, $5, $6)`,
    [email, firstname, lastname, date, phone, password]
  );
  console.log(profile);
  return h.response({
    profile: { email, firstname, lastname, date, phone, password },
  });
};

const getTrack = async (trackId) => {
  const track = await db
    .one('SELECT * FROM liminal.track WHERE id = $1', trackId)
    .then((trackData) => {
      return trackData;
    });
  return track;
};

module.exports = {
  getTrackList,
  getTracksByNameAndAuthor,
  getTracksByName,
  getTracksByAuthor,
  getProfile,
  createProfile,
  getTrack,
};
