// --- Imports (ย้ายมาไว้ด้านบนสุด) ---
import truffle from './assets/truffle.png';
import strawberry from './assets/strawberry.png';
import blue from './assets/blue.png';
import orange from './assets/orange.png';
import spade from './assets/spade.png';
import heart from './assets/heart.png';
import club from './assets/club.png';
import diamond from './assets/diamond.png';
import wild from './assets/wild.png';
import scatter from './assets/scatter.png';

// --- Game Configuration ---
export const GRID_SIZE = 6;
export const CELL_SIZE = 75;
export const MIN_CLUSTER_SIZE = 5; // Remove the duplicate declaration

export const SYMBOLS = {
  // High-value Symbols
  S1: { image: truffle, label: 'Truffle' },  // แทน 🌰
  S2: { image: strawberry, label: 'Strawberry' },  // แทน 🍓
  S3: { image: blue, label: 'Blue' },  // แทน 💧
  S4: { image: orange, label: 'Orange' },  // แทน 🍊
  // Low-value Symbols
  L1: { image: spade, label: 'Spade' },  // แทน ♠️
  L2: { image: heart, label: 'Heart' },  // แทน ♥️
  L3: { image: club, label: 'Club' },  // แทน ♣️
  L4: { image: diamond, label: 'Diamond' },  // แทน ♦️
  // Special Symbols
  WILD: { image: wild, label: 'Wild' },  // แทน 🃏
  SCATTER: { image: scatter, label: 'Scatter' }  // แทน 🎁
};

export const SYMBOL_LIST = [SYMBOLS.S1, SYMBOLS.S2, SYMBOLS.S3, SYMBOLS.S4, SYMBOLS.L1, SYMBOLS.L2, SYMBOLS.L3, SYMBOLS.L4];
export const SPECIAL_SYMBOL_CHANCE = 0.08;
export const WILD_CHANCE = 0.80;
export const SCATTER_SYMBOL = SYMBOLS.SCATTER;
export const WILD_SYMBOL = SYMBOLS.WILD;
export const MULTIPLIER_CHANCE = 0.15;

// Remove duplicate MIN_CLUSTER_SIZE declaration
// export const MIN_CLUSTER_SIZE = 5; // <-- Remove this line

export const PAYTABLE = {
  // S1 (Truffle) & S2 (Strawberry)
  'Truffle_5': 10, 'Strawberry_5': 10,
  'Truffle_6': 12, 'Strawberry_6': 12,
  'Truffle_7': 15, 'Strawberry_7': 15,
  'Truffle_8': 20, 'Strawberry_8': 20,
  'Truffle_9': 25, 'Strawberry_9': 25,
  'Truffle_10': 30, 'Strawberry_10': 30,
  'Truffle_11': 35, 'Strawberry_11': 35,
  'Truffle_12': 40, 'Strawberry_12': 40,
  'Truffle_13': 45, 'Strawberry_13': 45,
  'Truffle_14': 50, 'Strawberry_14': 50,
  'Truffle_15': 60, 'Strawberry_15': 60,
  'Truffle_16': 70, 'Strawberry_16': 70,
  'Truffle_17': 80, 'Strawberry_17': 80,
  'Truffle_18': 100, 'Strawberry_18': 100,
  'Truffle_20': 150, 'Strawberry_20': 150,
  'Truffle_21': 200, 'Strawberry_21': 200,
  'Truffle_22': 250, 'Strawberry_22': 250,
  'Truffle_23': 300, 'Strawberry_23': 300,
  'Truffle_24': 350, 'Strawberry_24': 350,
  'Truffle_25': 400, 'Strawberry_25': 400,
  'Truffle_26': 450, 'Strawberry_26': 450,
  'Truffle_27': 500, 'Strawberry_27': 500,
  'Truffle_28': 600, 'Strawberry_28': 600,
  'Truffle_29': 800, 'Strawberry_29': 800,
  'Truffle_30': 1000, 'Strawberry_30': 1000,
  'Truffle_31': 1200, 'Strawberry_31': 1200,
  'Truffle_32': 1500, 'Strawberry_32': 1500,
  'Truffle_33': 1800, 'Strawberry_33': 1800,
  'Truffle_34': 2000, 'Strawberry_34': 2000,
  'Truffle_35': 2500, 'Strawberry_35': 2500,
  'Truffle_36': 2500, 'Strawberry_36': 2500,

  // S3 (Blue)
  'Blue_5': 8, 'Blue_6': 10, 'Blue_7': 12, 'Blue_8': 14, 'Blue_9': 16, 'Blue_10': 18,
  'Blue_11': 20, 'Blue_12': 25, 'Blue_13': 30, 'Blue_14': 35, 'Blue_15': 40, 'Blue_16': 45,
  'Blue_17': 50, 'Blue_18': 60, 'Blue_19': 80, 'Blue_20': 100, 'Blue_21': 120, 'Blue_22': 140,
  'Blue_23': 160, 'Blue_24': 180, 'Blue_25': 200, 'Blue_26': 220, 'Blue_27': 250, 'Blue_28': 280,
  'Blue_29': 320, 'Blue_30': 360, 'Blue_31': 400, 'Blue_32': 450, 'Blue_33': 500, 'Blue_34': 550,
  'Blue_35': 600, 'Blue_36': 800,

  // S4 (Orange)
  'Orange_5': 8, 'Orange_6': 10, 'Orange_7': 12, 'Orange_8': 14, 'Orange_9': 16, 'Orange_10': 18,
  'Orange_11': 20, 'Orange_12': 25, 'Orange_13': 30, 'Orange_14': 35, 'Orange_15': 40, 'Orange_16': 45,
  'Orange_17': 50, 'Orange_18': 60, 'Orange_19': 80, 'Orange_20': 100, 'Orange_21': 120, 'Orange_22': 140,
  'Orange_23': 160, 'Orange_24': 180, 'Orange_25': 200, 'Orange_26': 220, 'Orange_27': 240, 'Orange_28': 260,
  'Orange_29': 280, 'Orange_30': 300, 'Orange_31': 350, 'Orange_32': 400, 'Orange_33': 450, 'Orange_34': 500,
  'Orange_35': 550, 'Orange_36': 600,

  // L1 (Spade) & L2 (Heart)
  'Spade_5': 3, 'Heart_5': 3,
  'Spade_6': 4, 'Heart_6': 4,
  'Spade_7': 5, 'Heart_7': 5,
  'Spade_8': 6, 'Heart_8': 6,
  'Spade_9': 8, 'Heart_9': 8,
  'Spade_10': 10, 'Heart_10': 10,
  'Spade_11': 12, 'Heart_11': 12,
  'Spade_12': 14, 'Heart_12': 14,
  'Spade_13': 16, 'Heart_13': 16,
  'Spade_14': 18, 'Heart_14': 18,
  'Spade_15': 20, 'Heart_15': 20,
  'Spade_16': 25, 'Heart_16': 25,
  'Spade_17': 40, 'Heart_17': 40, 
  'Spade_18': 45, 'Heart_18': 45,
  'Spade_19': 50, 'Heart_19': 50,
  'Spade_20': 55, 'Heart_20': 55,
  'Spade_21': 60, 'Heart_21': 60,
  'Spade_22': 65, 'Heart_22': 65,
  'Spade_23': 70, 'Heart_23': 70,
  'Spade_24': 80, 'Heart_24': 80,
  'Spade_25': 95, 'Heart_25': 95,
  'Spade_26': 190, 'Heart_26': 190, 
  'Spade_27': 200, 'Heart_27': 200,
  'Spade_28': 220, 'Heart_28': 220,
  'Spade_29': 240, 'Heart_29': 240,
  'Spade_30': 260, 'Heart_30': 260,
  'Spade_31': 300, 'Heart_31': 300,
  'Spade_32': 300, 'Heart_32': 300,
  'Spade_33': 320, 'Heart_33': 320,
  'Spade_34': 340, 'Heart_34': 340,
  'Spade_35': 360, 'Heart_35': 360,
  'Spade_36': 360, 'Heart_36': 360,

  // L3 (Club) & L4 (Diamond)
  'Club_5': 2, 'Diamond_5': 2,
  'Club_6': 3, 'Diamond_6': 3,
  'Club_7': 4, 'Diamond_7': 4,
  'Club_8': 5, 'Diamond_8': 5,
  'Club_9': 6, 'Diamond_9': 6,
  'Club_10': 8, 'Diamond_10': 8,
  'Club_11': 10, 'Diamond_11': 10,
  'Club_12': 12, 'Diamond_12': 12,
  'Club_13': 14, 'Diamond_13': 14,
  'Club_14': 16, 'Diamond_14': 16,
  'Club_15': 18, 'Diamond_15': 18,
  'Club_16': 20, 'Diamond_16': 20,
  'Club_17': 30, 'Diamond_17': 30, 
  'Club_18': 35, 'Diamond_18': 35,
  'Club_19': 40, 'Diamond_19': 40,
  'Club_20': 45, 'Diamond_20': 45,
  'Club_21': 50, 'Diamond_21': 50,
  'Club_22': 55, 'Diamond_22': 55,
  'Club_23': 60, 'Diamond_23': 60,
  'Club_24': 65, 'Diamond_24': 65,
  'Club_25': 80, 'Diamond_25': 80,
  'Club_26': 160, 'Diamond_26': 160, 
  'Club_27': 170, 'Diamond_27': 170,
  'Club_28': 180, 'Diamond_28': 180,
  'Club_29': 190, 'Diamond_29': 190,
  'Club_30': 200, 'Diamond_30': 200,
  'Club_31': 220, 'Diamond_31': 220,
  'Club_32': 240, 'Diamond_32': 240,
  'Club_33': 260, 'Diamond_33': 260,
  'Club_34': 280, 'Diamond_34': 280,
  'Club_35': 300, 'Diamond_35': 300,
  'Club_36': 300, 'Diamond_36': 300,
};

export const FREE_SPINS_TRIGGER_COUNT = 3;
export const BASE_FREE_SPINS_AWARDED = 10;
export const EXTRA_SPINS_PER_SCATTER = 2;

export const BET_AMOUNTS = [1, 5, 10, 25, 50, 100];
export const DEFAULT_BET_INDEX = 2;

export const SPIN_DURATION_NORMAL = 1100;
export const SPIN_DURATION_TURBO = 200;

// เพิ่ม Image Configuration
export const SYMBOL_SIZE = 60; // ขนาดรูปภาพ symbol
export const MULTIPLIER_OFFSET = { x: 10, y: 15 }; // ตำแหน่ง multiplier

// ตัวอย่างการใช้งาน
// const symbolLabel = SYMBOLS.S3.label; // จะได้ 'Blue' แทนการใช้ '💧'
// const payoutKey = `${symbolLabel}_5`; // จะได้ 'Blue_5'
// const payout = PAYTABLE[payoutKey];