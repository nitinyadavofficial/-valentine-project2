const requestCounts = new Map();

export function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100;

  const userRequests = requestCounts.get(ip) || [];
  const recentRequests = userRequests.filter((time) => now - time < windowMs);

  if (recentRequests.length >= maxRequests) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests, please try again later',
      retryAfter: Math.ceil(windowMs / 1000),
    });
  }

  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);

  res.setHeader('X-RateLimit-Limit', maxRequests);
  res.setHeader('X-RateLimit-Remaining', maxRequests - recentRequests.length);
  res.setHeader('X-RateLimit-Reset', new Date(now + windowMs).toISOString());

  next();
}

setInterval(() => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  for (const [ip, times] of requestCounts.entries()) {
    const recent = times.filter((t) => now - t < windowMs);
    if (recent.length === 0) {
      requestCounts.delete(ip);
    } else {
      requestCounts.set(ip, recent);
    }
  }
}, 5 * 60 * 1000);