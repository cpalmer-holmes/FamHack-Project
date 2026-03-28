export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  link: string;
  points: number;
  stats: {
    str?: number;
    dex?: number;
    int?: number;
    cha?: number;
  };
  category: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  societyLogo?: string;
  unlockedDate?: string;
}

export interface UserStats {
  str: number;
  dex: number;
  int: number;
  cha: number;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: 'Head' | 'Body' | 'Weapon' | 'Accessory';
}

export interface User {
  name: string;
  guild: string;
  points: number;
  stats: UserStats;
  badges: string[]; // Event IDs
  achievements: string[]; // Achievement IDs
  inventory: string[]; // Item IDs
}
