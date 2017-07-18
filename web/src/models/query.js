module.exports = {
  'countAdmin': 'SELECT COUNT(id) FROM public.teams WHERE admin=true;',
  'insertTeam': `INSERT INTO teams(name, members, bot, admin, password)
 VALUES ($1, $2, false, $3, $4) RETURNING id, admin;`,
  'selectTeam': 'SELECT * FROM teams WHERE name=$1',
  'insertSimpleGame': `INSERT INTO games(next_team_count, round, ranked, team0)
 VALUES (1, (SELECT round FROM configs WHERE id=0), $1, $2);`,
}
