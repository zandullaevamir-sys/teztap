import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: "Server auth konfiguratsiyasi yetarli emas" });
  }

  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Avtorizatsiya talab qilinadi" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token yaroqsiz yoki muddati tugagan" });
  }
}
