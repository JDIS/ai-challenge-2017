module.exports = {
  'countAdmin': 'SELECT COUNT(id) FROM public.teams WHERE admin=true;',
  'insertTeam': `INSERT INTO teams(name, members, bot, admin, password)
 VALUES ($1, $2, false, $3, $4) RETURNING id, admin;`,
  'selectTeam': 'SELECT * FROM teams WHERE name=$1',
  'insertGame': `INSERT INTO games(
    round, ranked, next_team_count, team0, team1, team2, team3
  )
 VALUES ((SELECT round FROM configs WHERE id=0), $1, $2, $3, $4, $5, $6);`,
  'selectBots': 'SELECT * FROM teams WHERE bot=true;',
  'selectJoinableGames':
`SELECT * FROM games
WHERE status='created'
 AND next_team_count < 4
 AND (team0 IS null OR team0<>$1)
 AND (team1 IS null OR team1<>$1)
 AND (team2 IS null OR team2<>$1)
 AND (team3 IS null OR team3<>$1);`,
  'getNextTeamIDForGame': `
UPDATE games
SET next_team_count = next_team_count + 1
WHERE id=$1
RETURNING next_team_count`,
  // I know, this should be nicer
  'joinGameAsTeam0': 'UPDATE games SET team0=$1 WHERE id=$2',
  'joinGameAsTeam1': 'UPDATE games SET team1=$1 WHERE id=$2',
  'joinGameAsTeam2': 'UPDATE games SET team2=$1 WHERE id=$2',
  'joinGameAsTeam3': 'UPDATE games SET team3=$1 WHERE id=$2',
}
