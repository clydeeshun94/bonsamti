const DEVIL_NAMES = {
  first: [
    "Lucifer",
    "Damien",
    "Raven",
    "Shadow",
    "Dante",
    "Vex",
    "Onyx",
    "Blaze",
    "Crimson",
    "Sable",
    "Thorn",
    "Ember",
    "Void",
    "Storm",
    "Ash",
    "Phoenix",
    "Nyx",
    "Zara",
    "Luna",
    "Scarlett",
    "Rogue",
    "Viper",
    "Jinx",
    "Raven",
  ],
  last: [
    "Hellfire",
    "Shadowbane",
    "Darkmore",
    "Nightfall",
    "Bloodworth",
    "Grimm",
    "Blackthorn",
    "Ravencroft",
    "Doomheart",
    "Voidwalker",
    "Stormborn",
    "Ashworth",
    "Ironwill",
    "Deathwhisper",
    "Soulreaper",
    "Nightshade",
    "Darkbane",
    "Hellborn",
  ],
}

export function generateRandomName(): { firstName: string; lastName: string } {
  const firstName = DEVIL_NAMES.first[Math.floor(Math.random() * DEVIL_NAMES.first.length)]
  const lastName = DEVIL_NAMES.last[Math.floor(Math.random() * DEVIL_NAMES.last.length)]
  return { firstName, lastName }
}

export function generateEmail(firstName: string, lastName: string): string {
  const randomNum = Math.floor(Math.random() * 9999)
  const cleanFirst = firstName.toLowerCase().replace(/[^a-z]/g, "")
  const cleanLast = lastName.toLowerCase().replace(/[^a-z]/g, "")
  return `${cleanFirst}.${cleanLast}${randomNum}@bonsamti.onrender.com`
}

export function generateStrongPassword(): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const lowercase = "abcdefghijklmnopqrstuvwxyz"
  const numbers = "0123456789"
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?"

  const allChars = uppercase + lowercase + numbers + symbols
  let password = ""

  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]

  // Fill the rest randomly (12-16 characters total)
  const targetLength = 12 + Math.floor(Math.random() * 5)
  for (let i = password.length; i < targetLength; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("")
}
