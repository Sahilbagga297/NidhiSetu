const ipRequestCounts = new Map();

export const rateLimiter = (limit = 5, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();

    if (!ipRequestCounts.has(ip)) {
      ipRequestCounts.set(ip, []);
    }

    const requests = ipRequestCounts.get(ip).filter(timestamp => now - timestamp < windowMs);
    
    if (requests.length >= limit) {
      return res.status(429).json({
        message: "Too many login/registration attempts from this IP. Please try again after 15 minutes."
      });
    }

    requests.push(now);
    ipRequestCounts.set(ip, requests);
    next();
  };
};
