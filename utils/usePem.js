const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const dirname = require("../dirname");

const pemPath = path.join(dirname(), "pem.config.json");
const PEM_FALLBACK_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

class PemManager {
  constructor() {
    this.config = { pems: [] };
    this.load();
  }

  load = () => {
    try {
      const raw = fs.readFileSync(pemPath, "utf8");
      const parsed = raw ? JSON.parse(raw) : {};
      this.config = {
        pems: Array.isArray(parsed.pems) ? parsed.pems : [],
      };
    } catch {
      this.config = { pems: [] };
      this.save();
    }
    this.removeExpired();
  };

  save = () => {
    fs.writeFileSync(pemPath, JSON.stringify(this.config), "utf8");
  };

  removeExpired = () => {
    const now = Date.now();
    const active = this.config.pems.filter((pem) => {
      const explicitExpiry = Number(pem.expiresAt);
      if (Number.isFinite(explicitExpiry) && explicitExpiry > 0) {
        return explicitExpiry > now;
      }

      const createdAt = Number(pem.createdAt) || Date.parse(pem.dateCreated);
      return (
        !Number.isFinite(createdAt) || createdAt + PEM_FALLBACK_MAX_AGE > now
      );
    });
    if (active.length !== this.config.pems.length) {
      this.config.pems = active;
      this.save();
    }
  };

  create = ({
    useragent,
    addr,
    session = null,
    oneTime = true,
    durationMs,
  }) => {
    const createdAt = Date.now();
    const effectiveOneTime = !Number(durationMs) || Boolean(oneTime);
    const expiresAt = effectiveOneTime
      ? null
      : createdAt + Math.max(Number(durationMs) || 0, 1000);
    const pem = {
      id: crypto.randomUUID(),
      useragent: useragent || "",
      ip: addr || "",
      addr: addr || "",
      dateCreated: new Date(createdAt).toISOString(),
      createdAt,
      expiresAt,
      oneTime: effectiveOneTime,
      session: session
        ? {
            useragent: session.useragent || session.agent || "",
            addr: session.addr || session.ip || "",
          }
        : null,
    };
    this.config.pems.push(pem);
    this.save();
    return pem;
  };

  findValid = (id, user) => {
    if (!id) return null;
    this.removeExpired();
    const pem = this.config.pems.find((entry) => entry.id === id);
    if (!pem) return null;
    if (
      pem.session &&
      (pem.session.useragent !== user?.agent || pem.session.addr !== user?.addr)
    ) {
      return null;
    }
    return pem;
  };

  consume = (pem) => {
    if (!pem?.oneTime) return;
    this.config.pems = this.config.pems.filter((entry) => entry.id !== pem.id);
    this.save();
  };

  getConfig = () => ({
    pems: this.config.pems.map(
      ({
        id,
        useragent,
        ip,
        addr,
        dateCreated,
        expiresAt,
        oneTime,
        session,
      }) => ({
        id,
        useragent,
        ip,
        addr,
        dateCreated,
        expiresAt,
        oneTime,
        session,
      }),
    ),
  });
}

const pemManager = new PemManager();

class UsePem {
  constructor() {
    this.pem = pemManager;
  }
}

module.exports = { UsePem, PemManager };
