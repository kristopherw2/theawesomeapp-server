const AuthService = require('../auth/auth-service')

function requireAuth(req, res, next) {
  console.log('require auth')
  console.log(req.get('authorization'))
  const authToken = req.get('Authorization') || ''

  let basicToken
  if(!authToken.toLowerCase().startsWith('basic ')) {
    return res.status(401).json({error: 'Missing basic token'})
  } else {
    basicToken = authToken.slice('basic '.length, authToken.length)
  }

  const[tokenUserName, tokenPassword] = Buffer
    .from(basicToken, 'base64')
    .toString()
    .split(':')

    //if no username or password
  if(!tokenUserName || !tokenPassword) {
    return res.status(401).json({error: `Unauthorized request`})
  }

  //making query for user MAY HAVE TO CHANGE THIS TO LIVE DB!
  AuthService.getUserWithUserName(
    req.app.get('db'),
    tokenUserName
  )
    .then(user => {
      if(!user) {
        return res.status(401).json({ error: `Unauthorized Request` })
      }
      req.user = user
      next()
    })
    .catch(next)
}

module.exports = {
  requireAuth
}