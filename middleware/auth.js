import jwt from "jsonwebtoken"

export default function verifyToken(req, res, next) {

  let token

  if (req.headers['authorization']) {
    let ss = req.headers['authorization'].split(' ')
    if (ss.length==2 && ss[0]=='Bearer') {
      token = ss[1]
    }
  } else {
    token = req.body.token || req.query.token;
  }

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};
