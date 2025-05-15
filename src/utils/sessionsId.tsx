type SessionData = {
  sessionId: string;
  createdAt: number;
};

export function getOrCreateSessionId(): string {
  const key = "sessionData";
  const stored = typeof window !== "undefined" ? localStorage.getItem(key) : null;
  const now = Date.now();

  if (stored) {
    try {
      const { sessionId, createdAt }: SessionData = JSON.parse(stored);
      const expired = now - createdAt > 24 * 60 * 60 * 1000; // 24 jam

      if (!expired) return sessionId;

      // expired → hapus dan lanjut buat baru
      localStorage.removeItem(key);
    } catch (e) {
      localStorage.removeItem(key); // corrupted data
    }
  }

  // generate session baru
  const sessionId = crypto.randomUUID();
  const sessionData: SessionData = {
    sessionId,
    createdAt: now,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(sessionData));
  }

  return sessionId;
}
