import crypto from "crypto"

// More secure password hashing with salt
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")
  return `${salt}:${hash}`
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

// Verify password against the stored salt and hash
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, originalHash] = storedHash.split(":")
    if (!salt || !originalHash) {
      return false
    }
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(originalHash))
  } catch (error) {
    console.error("Error verifying password:", error)
    return false
  }
}
