import rateLimit from 'express-rate-limit';

export const aiRateLimit = rateLimit({
  windowMs: 60_000,
  max: 10,
  message: { error: 'AI generation rate limit hit. Try again in a minute.' },
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60_000,
  max: 20,
  message: { error: 'Too many auth attempts. Wait 15 minutes.' },
});
