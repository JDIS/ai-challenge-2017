module.exports = {
  'countAdmin': 'SELECT COUNT(id) FROM public.teams WHERE admin=true;',
  'insertTeam': `INSERT INTO teams(name, members, bot, admin, password)
 VALUES ($1, $2, false, $3, $4) RETURNING id, admin;`,
  'selectTeam': 'SELECT * FROM teams WHERE id=$1',
}
