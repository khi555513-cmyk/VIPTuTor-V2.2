import { TutorMode, AccountTier, DocumentItem } from './types';

// --- CONFIG ---
export const ZALO_CONSULTATION_URL = 'https://zalo.me/0368132628';

// --- LIMITS & PACKAGES ---

export const TIER_LIMITS: Record<AccountTier, { messages: number; tests: number; games: number }> = {
  basic: {
    messages: 15,
    tests: 0,
    games: 1
  },
  pro: {
    messages: 100,
    tests: 5,
    games: 10
  },
  vip: {
    messages: 9999, // Unlimited effectively
    tests: 9999,
    games: 9999
  }
};

export interface SubscriptionPackage {
  id: string;
  name: string;
  durationMonths: number;
  tier: AccountTier;
  priceVND: number;
  isLifetime?: boolean;
  features: string[];
  isPopular?: boolean;
}

export const SUBSCRIPTION_PACKAGES: SubscriptionPackage[] = [
  {
    id: 'pack_basic',
    name: 'Gói Cơ Bản',
    durationMonths: 0,
    tier: 'basic',
    priceVND: 0,
    features: ['15 tin nhắn/ngày', '1 Game/ngày', 'Xem kho tài liệu (Hạn chế)']
  },
  // --- PRO PACKAGES ---
  {
    id: 'pack_pro_1m',
    name: 'PRO 1 Tháng',
    durationMonths: 1,
    tier: 'pro',
    priceVND: 49000,
    features: ['100 tin nhắn/ngày', '5 đề thi/ngày', 'Tải tài liệu PRO']
  },
  {
    id: 'pack_pro_2m',
    name: 'PRO 2 Tháng',
    durationMonths: 2,
    tier: 'pro',
    priceVND: 89000,
    features: ['Tiết kiệm 10%', 'Truy cập kho ôn thi', 'Full tính năng PRO']
  },
  {
    id: 'pack_pro_5m',
    name: 'PRO 5 Tháng',
    durationMonths: 5,
    tier: 'pro',
    priceVND: 199000,
    features: ['Tiết kiệm 20%', 'Mở khóa Test Prep', 'Kho tài liệu ôn thi đầy đủ'],
    isPopular: true
  },
  {
    id: 'pack_pro_1y',
    name: 'PRO 1 Năm',
    durationMonths: 12,
    tier: 'pro',
    priceVND: 399000,
    features: ['Siêu tiết kiệm', 'Đồng hành cả năm', 'Quyền tải không giới hạn']
  },
  // --- VIP PACKAGES ---
  {
    id: 'pack_vip_1m',
    name: 'VIP 1 Tháng',
    durationMonths: 1,
    tier: 'vip',
    priceVND: 99000,
    features: ['Không giới hạn', 'Kho tài liệu Độc quyền', 'Ưu tiên xử lý']
  },
  {
    id: 'pack_vip_5m',
    name: 'VIP 5 Tháng',
    durationMonths: 5,
    tier: 'vip',
    priceVND: 399000,
    features: ['Huy hiệu VIP', 'Tài liệu VIP chuyên sâu', 'Quyền lợi đặc biệt']
  },
  {
    id: 'pack_vip_1y',
    name: 'VIP 1 Năm',
    durationMonths: 12,
    tier: 'vip',
    priceVND: 699000,
    features: ['Thanh toán 1 lần', 'Sở hữu trọn đời kho tài liệu', 'Support 1:1']
  }
];

// --- ACTIVATION CODES ---
export const ACTIVATION_CODES: Record<string, { tier: AccountTier, months: number }> = {
  // System Codes
  "DEMO": { tier: 'pro', months: 0.17 }, 
  "VIPUSER": { tier: 'vip', months: 1 },
  "VIP-KQ5Z2M": { tier: 'vip', months: 12 },

  // --- NEW BATCH 300 ROWS (600 CODES) ---
  "X7K2-M9P1-Q3Z5": { tier: 'pro', months: 12 }, "V9L0-H1N2-M3P4": { tier: 'vip', months: 5 },
  "A8B2-C9D3-E4F5": { tier: 'pro', months: 2 }, "K5J6-L7M8-N9O0": { tier: 'vip', months: 1 },
  "G1H2-I3J4-K5L6": { tier: 'pro', months: 1 }, "P2Q3-R4S5-T6U7": { tier: 'vip', months: 12 },
  "M8N9-O0P1-Q2R3": { tier: 'pro', months: 5 }, "V5W6-X7Y8-Z9A0": { tier: 'vip', months: 5 },
  "S4T5-U6V7-W8X9": { tier: 'pro', months: 12 }, "B1C2-D3E4-F5G6": { tier: 'vip', months: 1 },
  "Y1Z2-A3B4-C5D6": { tier: 'pro', months: 1 }, "H7I8-J9K0-L1M2": { tier: 'vip', months: 12 },
  "E7F8-G9H0-I1J2": { tier: 'pro', months: 2 }, "N3O4-P5Q6-R7S8": { tier: 'vip', months: 5 },
  "K3L4-M5N6-O7P8": { tier: 'pro', months: 5 }, "T9U0-V1W2-X3Y4": { tier: 'vip', months: 1 },
  "Q9R0-S1T2-U3V4": { tier: 'pro', months: 2 }, "Z5A6-B7C8-D9E0": { tier: 'vip', months: 12 },
  "W5X6-Y7Z8-A9B0": { tier: 'pro', months: 12 }, "F1G2-H3I4-J5K6": { tier: 'vip', months: 5 },
  "C1D2-E3F4-G5H6": { tier: 'pro', months: 5 }, "L7M8-N9O0-P1Q2": { tier: 'vip', months: 1 },
  "I7J8-K9L0-M1N2": { tier: 'pro', months: 1 }, "R3S4-T5U6-V7W8": { tier: 'vip', months: 12 },
  "O3P4-Q5R6-S7T8": { tier: 'pro', months: 2 }, "X9Y0-Z1A2-B3C4": { tier: 'vip', months: 5 },
  "U9V0-W1X2-Y3Z4": { tier: 'pro', months: 5 }, "D5E6-F7G8-H9I0": { tier: 'vip', months: 1 },
  "A5B6-C7D8-E9F0": { tier: 'pro', months: 12 }, "J1K2-L3M4-N5O6": { tier: 'vip', months: 12 },
  "P7Q8-R9S0-T1U2": { tier: 'vip', months: 5 },
  "M7N8-O9P0-Q1R2": { tier: 'pro', months: 1 }, "V3W4-X5Y6-Z7A8": { tier: 'vip', months: 1 },
  "S3T4-U5V6-W7X8": { tier: 'pro', months: 5 }, "B9C0-D1E2-F3G4": { tier: 'vip', months: 12 },
  "Y9Z0-A1B2-C3D4": { tier: 'pro', months: 12 }, "H5I6-J7K8-L9M0": { tier: 'vip', months: 5 },
  "E5F6-G7H8-I9J0": { tier: 'pro', months: 2 }, "N1O2-P3Q4-R5S6": { tier: 'vip', months: 1 },
  "K1L2-M3N4-O5P6": { tier: 'pro', months: 5 }, "T7U8-V9W0-X1Y2": { tier: 'vip', months: 12 },
  "Q7R8-S9T0-U1V2": { tier: 'pro', months: 1 }, "Z3A4-B5C6-D7E8": { tier: 'vip', months: 5 },
  "W3X4-Y5Z6-A7B8": { tier: 'pro', months: 12 }, "F9G0-H1I2-J3K4": { tier: 'vip', months: 1 },
  "C9D0-E1F2-G3H4": { tier: 'pro', months: 2 }, "L5M6-N7O8-P9Q0": { tier: 'vip', months: 12 },
  "I5J6-K7L8-M9N0": { tier: 'pro', months: 5 }, "R1S2-T3U4-V5W6": { tier: 'vip', months: 5 },
  "O1P2-Q3R4-S5T6": { tier: 'pro', months: 1 }, "X7Y8-Z9A0-B1C2": { tier: 'vip', months: 1 },
  "U7V8-W9X0-Y1Z2": { tier: 'pro', months: 2 }, "D3E4-F5G6-H7I8": { tier: 'vip', months: 12 },
  "A3B4-C5D6-E7F8": { tier: 'pro', months: 5 }, "J9K0-L1M2-N3O4": { tier: 'vip', months: 5 },
  "G9H0-I1J2-K3L4": { tier: 'pro', months: 12 }, "P5Q6-R7S8-T9U0": { tier: 'vip', months: 1 },
  "M5N6-O7P8-Q9R0": { tier: 'pro', months: 2 }, "V1W2-X3Y4-Z5A6": { tier: 'vip', months: 12 },
  "S1T2-U3V4-W5X6": { tier: 'pro', months: 1 }, "B7C8-D9E0-F1G2": { tier: 'vip', months: 5 },
  "Y7Z8-A9B0-C1D2": { tier: 'pro', months: 5 }, "H3I4-J5K6-L7M8": { tier: 'vip', months: 1 },
  "E3F4-G5H6-I7J8": { tier: 'pro', months: 12 }, "N9O0-P1Q2-R3S4": { tier: 'vip', months: 12 },
  "K9L0-M1N2-O3P4": { tier: 'pro', months: 2 }, "T5U6-V7W8-X9Y0": { tier: 'vip', months: 5 },
  "Q5R6-S7T8-U9V0": { tier: 'pro', months: 1 }, "Z1A2-B3C4-D5E6": { tier: 'vip', months: 1 },
  "W1X2-Y3Z4-A5B6": { tier: 'pro', months: 5 }, "F7G8-H9I0-J1K2": { tier: 'vip', months: 12 },
  "C7D8-E9F0-G1H2": { tier: 'pro', months: 2 }, "L3M4-N5O6-P7Q8": { tier: 'vip', months: 5 },
  "I3J4-K5L6-M7N8": { tier: 'pro', months: 12 }, "R9S0-T1U2-V3W4": { tier: 'vip', months: 1 },
  "O9P0-Q1R2-S3T4": { tier: 'pro', months: 1 }, "X5Y6-Z7A8-B9C0": { tier: 'vip', months: 12 },
  "U5V6-W7X8-Y9Z0": { tier: 'pro', months: 2 }, "D1E2-F3G4-H5I6": { tier: 'vip', months: 5 },
  "A1B2-C3D4-E5F6": { tier: 'pro', months: 5 }, "J7K8-L9M0-N1O2": { tier: 'vip', months: 1 },
  "G7H8-I9J0-K1L2": { tier: 'pro', months: 12 }, "P3Q4-R5S6-T7U8": { tier: 'vip', months: 12 },
  "M3N4-O5P6-Q7R8": { tier: 'pro', months: 2 }, "V9W0-X1Y2-Z3A4": { tier: 'vip', months: 5 },
  "S9T0-U1V2-W3X4": { tier: 'pro', months: 1 }, "B5C6-D7E8-F9G0": { tier: 'vip', months: 1 },
  "Y5Z6-A7B8-C9D0": { tier: 'pro', months: 5 }, "H1I2-J3K4-L5M6": { tier: 'vip', months: 12 },
  "E1F2-G3H4-I5J6": { tier: 'pro', months: 2 }, "N7O8-P9Q0-R1S2": { tier: 'vip', months: 5 },
  "K7L8-M9N0-O1P2": { tier: 'pro', months: 12 }, "T3U4-V5W6-X7Y8": { tier: 'vip', months: 1 },
  "Q3R4-S5T6-U7V8": { tier: 'pro', months: 1 }, "Z9A0-B1C2-D3E4": { tier: 'vip', months: 12 },
  "W9X0-Y1Z2-A3B4": { tier: 'pro', months: 2 }, "F5G6-H7I8-J9K0": { tier: 'vip', months: 5 },
  "C5D6-E7F8-G9H0": { tier: 'pro', months: 5 }, "L1M2-N3O4-P5Q6": { tier: 'vip', months: 1 },
  "4K9Z-2X8L-5Q1W": { tier: 'pro', months: 1 }, "9M3P-7N2K-6J5H": { tier: 'vip', months: 12 },
  "8L2M-5X7C-9V4B": { tier: 'pro', months: 5 }, "2H5J-8K9L-4Z1Q": { tier: 'vip', months: 5 },
  "6P3Q-1W8E-2R9T": { tier: 'pro', months: 2 }, "7N6B-3V4C-9X2Z": { tier: 'vip', months: 1 },
  "3Z5A-7S9D-4F2G": { tier: 'pro', months: 12 }, "5L8K-2J4H-1Q7W": { tier: 'vip', months: 12 },
  "9X1C-4V2B-8N6M": { tier: 'pro', months: 1 }, "3P9O-5I2U-7Y6T": { tier: 'vip', months: 5 },
  "2Q8W-6E1R-5T9Y": { tier: 'pro', months: 5 }, "4K7J-9H2G-1F3D": { tier: 'vip', months: 1 },
  "7S4A-3D5F-8G2H": { tier: 'pro', months: 2 }, "6Z1X-8C2V-4B9N": { tier: 'vip', months: 12 },
  "5J9K-1L8Z-6X4C": { tier: 'pro', months: 12 }, "8M5N-2Q6W-3E7R": { tier: 'vip', months: 5 },
  "1V3B-9N7M-2Q8W": { tier: 'pro', months: 1 }, "9T4Y-5U6I-2O8P": { tier: 'vip', months: 1 },
  "4E2R-8T5Y-6U9I": { tier: 'pro', months: 5 }, "3A7S-9D1F-4G2H": { tier: 'vip', months: 12 },
  "8O1P-2A4S-7D6F": { tier: 'pro', months: 2 }, "5J2K-7L3Z-9X1C": { tier: 'vip', months: 5 },
  "6G9H-3J7K-5L1Z": { tier: 'pro', months: 12 }, "1V6B-8N2M-4Q9W": { tier: 'vip', months: 1 },
  "2X5C-7V4B-9N1M": { tier: 'pro', months: 1 }, "6E3R-9T1Y-2U8I": { tier: 'vip', months: 12 },
  "9Q2W-5E7R-3T4Y": { tier: 'pro', months: 2 }, "7O5P-1A9S-8D6F": { tier: 'vip', months: 5 },
  "3U8I-4O9P-1A2S": { tier: 'pro', months: 5 }, "9G4H-2J1K-5L7Z": { tier: 'vip', months: 1 },
  "5D7F-8G2H-6J1K": { tier: 'pro', months: 12 }, "4X8C-3V7B-1N2M": { tier: 'vip', months: 12 },
  "1L6Z-9X4C-2V3B": { tier: 'pro', months: 1 }, "8Q2W-5E1R-6T9Y": { tier: 'vip', months: 5 },
  "7N5M-2Q8W-3E4R": { tier: 'pro', months: 2 }, "2U3I-4O7P-9A5S": { tier: 'vip', months: 1 },
  "4T9Y-5U1I-6O2P": { tier: 'pro', months: 5 }, "5D1F-8G7H-3J4K": { tier: 'vip', months: 12 },
  "8A3S-1D4F-7G2H": { tier: 'pro', months: 12 }, "9L2Z-6X5C-1V7B": { tier: 'vip', months: 5 },
  "RT5X-9Q2Z-3M1N": { tier: 'pro', months: 1 }, "PL4K-8J2H-5G6F": { tier: 'vip', months: 5 },
  "AB8C-2D9E-4F6G": { tier: 'pro', months: 5 }, "XY1Z-7W2V-3U8T": { tier: 'vip', months: 12 },
  "HJ3K-5L7M-9N2P": { tier: 'pro', months: 2 }, "QR6S-1T9U-4V5W": { tier: 'vip', months: 1 },
  "CD9E-1F3G-5H7J": { tier: 'pro', months: 12 }, "KL2M-8N4P-6Q9R": { tier: 'vip', months: 12 },
  "ST4U-7V2W-8X1Y": { tier: 'pro', months: 1 }, "ZA3B-5C9D-2E6F": { tier: 'vip', months: 5 },
  "GH1I-3J8K-4L6M": { tier: 'pro', months: 2 }, "NO5P-7Q2R-9S1T": { tier: 'vip', months: 1 },
  "UV2W-6X9Y-3Z5A": { tier: 'pro', months: 5 }, "BC8D-1E4F-7G2H": { tier: 'vip', months: 12 },
  "IJ5K-2L7M-8N3P": { tier: 'pro', months: 12 }, "RS9T-3U6V-5W1X": { tier: 'vip', months: 5 },
  "DE6F-9G1H-2J4K": { tier: 'pro', months: 1 }, "LM3N-7P8Q-5R2S": { tier: 'vip', months: 1 },
  "VW7X-3Y8Z-6A2B": { tier: 'pro', months: 2 }, "HI1J-4K9L-2M6N": { tier: 'vip', months: 12 },
  "OP4Q-8R2S-1T5U": { tier: 'pro', months: 5 }, "CD3E-9F2G-5H1I": { tier: 'vip', months: 5 },
  "TU8V-5W9X-3Y7Z": { tier: 'pro', months: 12 }, "JK6L-2M4N-8P1Q": { tier: 'vip', months: 1 },
  "AB1C-7D3E-6F4G": { tier: 'pro', months: 1 }, "YZ2A-5B8C-9D7E": { tier: 'vip', months: 12 },
  "FG5H-2I8J-4K6L": { tier: 'pro', months: 2 }, "PQ9R-1S3T-5U2V": { tier: 'vip', months: 5 },
  "MN7P-6Q1R-9S3T": { tier: 'pro', months: 5 }, "VW4X-8Y2Z-3A6B": { tier: 'vip', months: 1 },
  "UV9W-3X5Y-1Z2A": { tier: 'pro', months: 12 }, "HI7J-2K8L-4M5N": { tier: 'vip', months: 12 },
  "BC3D-5E7F-8G9H": { tier: 'pro', months: 2 }, "OP1Q-9R4S-6T2U": { tier: 'vip', months: 5 },
  "IJ1K-4L6M-2N8P": { tier: 'pro', months: 1 }, "CD5E-7F3G-1H9I": { tier: 'vip', months: 1 },
  "WX7Y-8Z2A-3B5C": { tier: 'pro', months: 5 }, "JK9L-5M2N-4P7Q": { tier: 'vip', months: 12 },
  "RS4T-9U1V-6W2X": { tier: 'pro', months: 12 }, "EF3G-8H6I-2J5K": { tier: 'vip', months: 5 },
  "Y67Z-Q9A2-W1SX": { tier: 'pro', months: 2 }, "V3M8-N5P1-L0K2": { tier: 'vip', months: 1 },
  "E34R-T7Y9-U2I1": { tier: 'pro', months: 5 }, "B8C5-D1F3-G6H4": { tier: 'vip', months: 12 },
  "O1P2-A5S4-D6F8": { tier: 'pro', months: 1 }, "J9K2-L7M5-Z3X1": { tier: 'vip', months: 5 },
  "G5H6-J8K2-L9Z3": { tier: 'pro', months: 12 }, "C4V2-B6N9-M1Q8": { tier: 'vip', months: 1 },
  "X9C2-V3B4-N7M1": { tier: 'pro', months: 2 }, "T5Y6-U1I2-O9P3": { tier: 'vip', months: 12 },
  "Q4W5-E2R6-T8Y9": { tier: 'pro', months: 5 }, "A2S3-D7F4-G8H5": { tier: 'vip', months: 5 },
  "U1I8-O9P2-A3S4": { tier: 'pro', months: 1 }, "K6L1-Z9X2-C5V8": { tier: 'vip', months: 1 },
  "D2F7-G4H5-J6K9": { tier: 'pro', months: 2 }, "B3N4-M5Q2-W7E1": { tier: 'vip', months: 12 },
  "L3Z8-X1C4-V5B6": { tier: 'pro', months: 12 }, "R9T4-Y2U8-I1O3": { tier: 'vip', months: 5 },
  "N6M7-Q2W9-E1R3": { tier: 'pro', months: 5 }, "S8D4-F5G1-H6J9": { tier: 'vip', months: 1 },
  "K9T2-M4P6-L7R1": { tier: 'pro', months: 1 }, "H2N5-B8V3-C1X9": { tier: 'vip', months: 12 },
  "J3G8-F2D5-S6A4": { tier: 'pro', months: 5 }, "W9Q2-E4R7-T3Y5": { tier: 'vip', months: 5 },
  "U1I7-O2P9-Z8X3": { tier: 'pro', months: 2 }, "K5M4-L1N6-J2H8": { tier: 'vip', months: 1 },
  "C9V2-B4N6-M8Q1": { tier: 'pro', months: 12 }, "F3G9-D2S5-A7W4": { tier: 'vip', months: 12 },
  "E5T1-R8Y3-U4I6": { tier: 'pro', months: 1 }, "P2O7-I9U3-Y6T8": { tier: 'vip', months: 5 },
  "L8K3-J2H5-G1F9": { tier: 'pro', months: 2 }, "N4M1-B9V2-C7X3": { tier: 'vip', months: 1 },
  "S6A9-D3F2-G5H7": { tier: 'pro', months: 5 }, "Q2W8-E3R4-T1Y6": { tier: 'vip', months: 12 },
  "Z2X5-C8V1-B9N4": { tier: 'pro', months: 12 }, "U7I3-O5P2-L8K1": { tier: 'vip', months: 5 },
  "M1Q7-W3E5-R9T2": { tier: 'pro', months: 1 }, "H6G2-F4D8-S1A9": { tier: 'vip', months: 1 },
  "Y4U2-I8O6-P1L3": { tier: 'pro', months: 2 }, "Z5X7-C9V4-B2N6": { tier: 'vip', months: 12 },
  "K7J2-H5G1-F8D3": { tier: 'pro', months: 5 }, "M9Q1-W6E2-R5T4": { tier: 'vip', months: 5 },
  "S4A6-D2F8-G9H5": { tier: 'pro', months: 12 }, "Y3U1-I7O2-P8L6": { tier: 'vip', months: 1 },
  "C1V9-B2N3-M4Q6": { tier: 'pro', months: 1 }, "K8J5-H1G7-F2D4": { tier: 'vip', months: 12 },
  "E7R2-T5Y8-U9I1": { tier: 'pro', months: 5 }, "S2A3-D6F4-G8H9": { tier: 'vip', months: 5 },
  "O2P6-L1K7-J9H4": { tier: 'pro', months: 2 }, "C5V1-B8N3-M2Q7": { tier: 'vip', months: 1 },
  "Q3W8-E4R5-T7Y2": { tier: 'pro', months: 12 }, "E1R6-T4Y2-U5I9": { tier: 'vip', months: 12 },
  "U9I5-O7P1-L3K2": { tier: 'pro', months: 1 }, "O6P2-L8K3-J4H1": { tier: 'vip', months: 5 },
  "F4D6-G1H2-J8K9": { tier: 'pro', months: 2 }, "Q5W7-E3R9-T1Y4": { tier: 'vip', months: 1 },
  "B2N5-M8Q1-W3E4": { tier: 'pro', months: 5 }, "U2I8-O4P6-L5K7": { tier: 'vip', months: 12 },
  "R7T9-Y1U2-I3O5": { tier: 'pro', months: 12 }, "F6D3-G9H2-J1K5": { tier: 'vip', months: 5 },
  "N6B8-V2C9-X1Z5": { tier: 'pro', months: 2 }, "B4N7-M1Q8-W2E3": { tier: 'vip', months: 1 },
  "P9A3-S1D4-F5G7": { tier: 'pro', months: 5 }, "R8T2-Y5U9-I3O6": { tier: 'vip', months: 12 },
  "H8J1-K5L3-M2N9": { tier: 'pro', months: 1 }, "N5B3-V1C8-X7Z4": { tier: 'vip', months: 5 },
  "T2Y4-U6I8-O9P3": { tier: 'pro', months: 2 }, "P1A9-S2D5-F7G3": { tier: 'vip', months: 1 },
  "G7K2-J1L9-H5N3": { tier: 'pro', months: 12 }, "H6J8-K2L4-M5N1": { tier: 'vip', months: 12 },
  "X4C1-V5B7-Q3W9": { tier: 'pro', months: 1 }, "T3Y5-U8I2-O7P6": { tier: 'vip', months: 5 },
  "R2E6-T8Y4-U5I1": { tier: 'pro', months: 5 }, "G4K9-J3L2-H1N8": { tier: 'vip', months: 1 },
  "O9P5-L3K7-J1H2": { tier: 'pro', months: 2 }, "X6C5-V2B1-Q8W4": { tier: 'vip', months: 12 },
  "F7D2-G8H5-J3K6": { tier: 'pro', months: 12 }, "R5E2-T9Y6-U3I7": { tier: 'vip', months: 5 },
  "M5Q1-W4E3-R2T8": { tier: 'pro', months: 2 }, "O8P1-L5K4-J9H2": { tier: 'vip', months: 1 },
  "Y6U9-I2O4-P7L1": { tier: 'pro', months: 5 }, "F3D7-G5H9-J1K6": { tier: 'vip', months: 12 },
  "B3N8-V1C6-X5Z2": { tier: 'pro', months: 1 }, "M7Q2-W5E8-R1T3": { tier: 'vip', months: 5 },
  "S4A1-D9F7-G2H5": { tier: 'pro', months: 12 }, "Y2U4-I6O3-P9L8": { tier: 'vip', months: 1 },
  "K6J3-H8G4-F1D5": { tier: 'pro', months: 2 }, "B5N9-V4C2-X7Z1": { tier: 'vip', months: 12 },
  "E9R7-T5Y2-U1I4": { tier: 'pro', months: 5 }, "S3A6-D1F5-G9H8": { tier: 'vip', months: 5 },
  "L2K4-J9H6-O3P8": { tier: 'pro', months: 1 }, "K8J1-H5G3-F7D2": { tier: 'vip', months: 1 },
  "Q5W2-E3R8-T6Y1": { tier: 'pro', months: 2 }, "E2R5-T9Y4-U7I3": { tier: 'vip', months: 12 },
  "U7I1-O5P3-L4K9": { tier: 'pro', months: 5 }, "L6K2-J8H5-O1P7": { tier: 'vip', months: 5 },
  "G2H9-J6K5-F1D8": { tier: 'pro', months: 12 }, "Q4W7-E9R3-T2Y5": { tier: 'vip', months: 1 },
  "M8Q3-W7E4-R2T5": { tier: 'pro', months: 2 }, "U5I3-O6P9-L2K1": { tier: 'vip', months: 12 },
  "I5O9-P1L7-Y4U2": { tier: 'pro', months: 5 }, "G3H5-J2K8-F9D1": { tier: 'vip', months: 5 },
  "C8V4-B6N1-X3Z7": { tier: 'pro', months: 1 }, "M9Q5-W2E7-R3T1": { tier: 'vip', months: 1 },
  "D1F6-G8H2-S5A4": { tier: 'pro', months: 2 }, "I7O4-P5L2-Y9U3": { tier: 'vip', months: 12 },
  "H9G3-F1D7-K2J5": { tier: 'vip', months: 12 }, "C2V8-B1N9-X6Z4": { tier: 'vip', months: 5 },
  "T4Y1-U6I3-O5P2": { tier: 'pro', months: 5 }, "D9F3-G5H7-S2A6": { tier: 'vip', months: 1 },
  "J2K8-L7N5-H9G1": { tier: 'pro', months: 1 }, "H5G2-F8D1-K4J7": { tier: 'vip', months: 12 },
  "X5C3-V9B2-Q1W7": { tier: 'pro', months: 2 }, "T1Y9-U5I7-O4P2": { tier: 'vip', months: 5 },
  "R8E4-T2Y6-U3I5": { tier: 'pro', months: 12 }, "J6K9-L3N2-H8G5": { tier: 'vip', months: 1 },
  "P1L6-Y7U2-I5O8": { tier: 'pro', months: 5 }, "X2C5-V4B9-Q7W1": { tier: 'vip', months: 12 },
  "S7A3-D5F1-G6H2": { tier: 'pro', months: 1 }, "R3E7-T5Y8-U9I6": { tier: 'vip', months: 5 },
  "L9K2-M3N7-J1H5": { tier: 'pro', months: 12 }, "Q2W8-E5R1-T4Y9": { tier: 'vip', months: 5 },
  "X8C3-V1B6-N5M2": { tier: 'pro', months: 2 }, "U7I3-O6P2-L9K1": { tier: 'vip', months: 12 },
  "D2F9-G5H1-J8K3": { tier: 'pro', months: 1 }, "A5S9-D1F3-G7H2": { tier: 'vip', months: 1 },
  "Q7W2-E4R9-T1Y5": { tier: 'pro', months: 5 }, "M4Q2-W8E5-R1T7": { tier: 'vip', months: 5 },
  "I6O3-P2L8-Y9U1": { tier: 'pro', months: 12 }, "C6V1-B9N4-X3Z2": { tier: 'vip', months: 12 },
  "G8H2-J1K5-F4D6": { tier: 'pro', months: 2 }, "P3A9-S1D5-F7G8": { tier: 'vip', months: 1 },
  "M2Q7-W3E5-R9T1": { tier: 'pro', months: 1 }, "R7T2-Y5U8-I3O1": { tier: 'vip', months: 12 },
  "N5B9-V4C2-X6Z3": { tier: 'pro', months: 5 }, "F9D2-G5H7-J1K3": { tier: 'vip', months: 5 },
  "S1A8-D5F2-G7H9": { tier: 'pro', months: 2 }, "Y6U4-I2O9-P1L5": { tier: 'vip', months: 12 },
  "K5J3-H1G8-F2D4": { tier: 'pro', months: 12 }, "B1N6-M8Q3-W5E2": { tier: 'vip', months: 1 },
  "T9Y2-U5I7-O4P1": { tier: 'pro', months: 1 }, "H8G1-F4D2-K7J9": { tier: 'vip', months: 12 },
  "L3K1-J9H5-O2P8": { tier: 'pro', months: 2 }, "X4C7-V3B2-N1M9": { tier: 'vip', months: 5 },
  "R6E2-T8Y1-U9I5": { tier: 'pro', months: 5 }, "E2R8-T5Y9-U1I4": { tier: 'vip', months: 1 },
  "O7P1-L4K2-J5H3": { tier: 'pro', months: 12 }, "L5K8-J2H6-O1P3": { tier: 'vip', months: 12 },
  "F1D8-G2H6-J9K5": { tier: 'pro', months: 2 }, "G6K1-J3L2-H8N5": { tier: 'vip', months: 5 },
  "U2I5-O9P3-L1K7": { tier: 'pro', months: 1 }, "Q1W6-E7R2-T5Y9": { tier: 'vip', months: 12 },
  "M5Q9-W2E6-R7T3": { tier: 'pro', months: 5 }, "I3O8-P5L1-Y2U4": { tier: 'vip', months: 1 },
  "C9V1-B4N2-X6Z8": { tier: 'pro', months: 2 }, "D7F5-G9H3-S1A2": { tier: 'vip', months: 5 },
  "H2G7-F5D9-K1J3": { tier: 'pro', months: 12 }, "C4V6-B2N9-X8Z1": { tier: 'vip', months: 1 },
  "T5Y1-U8I2-O3P9": { tier: 'pro', months: 1 },
  "X6C2-V7B5-Q1W9": { tier: 'pro', months: 5 }, "T2Y6-U4I1-O8P3": { tier: 'vip', months: 5 },
  "R8E3-T1Y9-U2I7": { tier: 'pro', months: 2 }, "J5K1-L8N3-H9G2": { tier: 'vip', months: 1 },
  "P2L5-Y4U6-I8O1": { tier: 'pro', months: 12 }, "X1C3-V9B6-Q5W2": { tier: 'vip', months: 12 },
  "S3A7-D2F9-G5H1": { tier: 'pro', months: 5 }, "R2E9-T5Y3-U7I4": { tier: 'vip', months: 5 },
  "Z1K3-M8N5-L9H2": { tier: 'pro', months: 1 }, "S6A5-D2F1-G8H9": { tier: 'vip', months: 1 },
  "V6C2-X7Z1-N9M4": { tier: 'pro', months: 2 }, "R7T1-Y9U5-I3O2": { tier: 'vip', months: 12 },
  "D3F9-G5H2-J1K6": { tier: 'pro', months: 12 }, "M5Q3-W8E1-R2T7": { tier: 'vip', months: 5 },
  "Q8W4-E7R1-T2Y5": { tier: 'pro', months: 2 }, "F6D3-G1H9-J5K2": { tier: 'vip', months: 1 },
  "I9O1-P5L8-Y2U3": { tier: 'pro', months: 5 }, "B8N1-M4Q6-W7E3": { tier: 'vip', months: 12 },
  "G1H5-J9K2-F7D3": { tier: 'pro', months: 1 }, "N3B8-V2C9-X1Z5": { tier: 'vip', months: 5 },
  "M4Q2-W3E8-R6T1": { tier: 'pro', months: 2 }, "Y5U1-I7O4-P9L2": { tier: 'vip', months: 1 },
  "C8V1-B5N9-X2Z7": { tier: 'pro', months: 5 }, "H4G7-F8D2-K1J6": { tier: 'vip', months: 12 },
  "S2A9-D6F3-G1H8": { tier: 'pro', months: 12 }, "T3Y5-U1I9-O7P2": { tier: 'vip', months: 5 },
  "K7J2-H1G5-F8D9": { tier: 'pro', months: 1 }, "J6L2-K3N8-H5G1": { tier: 'vip', months: 1 },
  "T4Y6-U9I2-O5P1": { tier: 'pro', months: 2 }, "X5C2-V1B9-Q7W4": { tier: 'vip', months: 12 },
  "L6K1-J3H7-O2P9": { tier: 'pro', months: 12 }, "R9E6-T8Y1-U5I3": { tier: 'vip', months: 5 },
  "R3E7-T5Y8-U9I4": { tier: 'pro', months: 5 }, "P1L3-Y7U2-I8O5": { tier: 'vip', months: 1 },
  "O9P5-L2K1-J8H3": { tier: 'pro', months: 2 }, "S8A2-D4F6-G9H1": { tier: 'vip', months: 12 },
  "F2D9-G6H5-J1K7": { tier: 'pro', months: 1 }, "R4E6-T8Y2-U1I3": { tier: 'vip', months: 5 },
  "U1I8-O4P2-L6K3": { tier: 'pro', months: 12 }, "O5P1-L9K2-J7H4": { tier: 'vip', months: 12 },
  "M6Q3-W8E1-R2T5": { tier: 'pro', months: 2 }, "G3H9-J2K8-F1D6": { tier: 'vip', months: 1 },
  "C5V9-B2N4-X7Z1": { tier: 'pro', months: 5 }, "U7I2-O3P5-L8K1": { tier: 'vip', months: 12 },
  "N2B8-V1C5-X9Z6": { tier: 'pro', months: 12 }, "M8Q5-W1E2-R9T7": { tier: 'vip', months: 5 },
  "P1A4-S7D2-F8G5": { tier: 'pro', months: 1 }, "I1O9-P4L7-Y3U5": { tier: 'vip', months: 1 },
  "H9J3-K2L6-M5N1": { tier: 'pro', months: 2 }, "D2F6-G8H1-S9A4": { tier: 'vip', months: 12 },
  "T6Y2-U4I9-O8P3": { tier: 'pro', months: 5 }, "C1V7-B6N3-X4Z8": { tier: 'vip', months: 5 },
  "G1K9-J5L2-H8N7": { tier: 'pro', months: 12 }, "T7Y9-U2I1-O5P4": { tier: 'vip', months: 1 },
  "X5C4-V3B1-Q9W2": { tier: 'pro', months: 2 }, "H6G1-F5D8-K2J9": { tier: 'vip', months: 12 },
  "R8E5-T1Y7-U6I2": { tier: 'pro', months: 1 }, "J9K4-L1N5-H3G2": { tier: 'vip', months: 5 },
  "O3P9-L5K4-J2H6": { tier: 'pro', months: 5 }, "X3C7-V8B5-Q1W9": { tier: 'vip', months: 1 },
  "K4J1-H8G5-F2D9": { tier: 'pro', months: 12 }, "R5E1-T6Y8-U2I4": { tier: 'vip', months: 12 },
  "M3Q8-W2E6-R9T7": { tier: 'pro', months: 1 }, "P6L2-Y1U9-I5O8": { tier: 'vip', months: 1 },
  "Y6U1-I3O9-P5L2": { tier: 'pro', months: 2 }, "S4A7-D1F2-G8H5": { tier: 'vip', months: 5 },
  "B9N4-V2C1-X7Z8": { tier: 'pro', months: 5 }, "R8T5-Y3U1-I6O2": { tier: 'vip', months: 12 },
  "S1A3-D6F5-G2H9": { tier: 'pro', months: 12 }, "C5V3-B1N9-X7Z4": { tier: 'vip', months: 5 },
  "K7J2-H8G4-F1D6": { tier: 'pro', months: 2 }, "M9Q1-W3E8-R2T5": { tier: 'vip', months: 1 },
  "E2R6-T9Y4-U1I8": { tier: 'pro', months: 1 }, "I2O4-P5L7-Y9U6": { tier: 'vip', months: 12 },
  "L1K9-J3H5-O7P2": { tier: 'pro', months: 5 }, "F3D6-G8H1-J9K2": { tier: 'vip', months: 1 },
  "Q6W1-E4R3-T8Y5": { tier: 'pro', months: 12 }, "N1B8-V2C5-X6Z9": { tier: 'vip', months: 5 },
  "U9I7-O2P1-L4K3": { tier: 'pro', months: 2 }, "P4A2-S8D1-F7G3": { tier: 'vip', months: 12 },
  "G8H2-J6K5-F1D3": { tier: 'pro', months: 1 }, "H7J3-K1L5-M2N8": { tier: 'vip', months: 5 },
  "M3Q9-W1E6-R4T7": { tier: 'pro', months: 5 }, "T6Y8-U2I9-O1P4": { tier: 'vip', months: 1 },
  "I5O1-P8L2-Y6U9": { tier: 'pro', months: 12 }, "G3K8-J5L2-H1N9": { tier: 'vip', months: 12 },
  "C7V2-B9N5-X3Z1": { tier: 'pro', months: 2 }, "X9C4-V6B1-Q3W7": { tier: 'vip', months: 5 },
  "D1F6-G8H3-S4A2": { tier: 'pro', months: 5 }, "R1E9-T5Y6-U3I7": { tier: 'vip', months: 1 },
  "H9G5-F1D7-K2J4": { tier: 'pro', months: 1 }, "O6P8-L2K3-J5H1": { tier: 'vip', months: 12 },
  "T3Y8-U5I9-O1P6": { tier: 'pro', months: 2 }, "R3E5-T2Y1-U9I4": { tier: 'vip', months: 5 },
  "J7K1-L5N9-H2G3": { tier: 'pro', months: 12 }, "K8J6-H1G9-F4D3": { tier: 'vip', months: 12 },
  "X2C8-V4B5-Q6W1": { tier: 'pro', months: 1 }, "E5R2-T7Y9-U3I1": { tier: 'vip', months: 1 },
  "R6E2-T9Y3-U5I1": { tier: 'pro', months: 5 }, "L1K8-J3H6-O7P2": { tier: 'vip', months: 5 },
  "P4L2-Y6U8-I1O5": { tier: 'pro', months: 12 }, "Q3W5-E8R2-T6Y9": { tier: 'vip', months: 1 },
  "S9A5-D3F2-G1H8": { tier: 'pro', months: 2 }, "U2I7-O1P5-L9K4": { tier: 'vip', months: 12 },
  "R3T9-Y2U8-I6O5": { tier: 'pro', months: 1 }, "G6H9-J3K2-F1D5": { tier: 'vip', months: 5 },
  "H2J4-K6L8-M1N9": { tier: 'pro', months: 5 }, "M4Q2-W1E5-R8T6": { tier: 'vip', months: 1 },
  "T1Y5-U3I7-O9P2": { tier: 'pro', months: 2 }, "C9V7-B4N6-X5Z2": { tier: 'vip', months: 12 },
  "G4K7-J1L2-H5N6": { tier: 'pro', months: 12 }, "D2F5-G6H1-S9A3": { tier: 'vip', months: 5 },
  "X6C2-V9B3-Q4W1": { tier: 'pro', months: 1 }, "H1G9-F5D4-K7J2": { tier: 'vip', months: 1 },
  "R2E8-T6Y1-U9I4": { tier: 'pro', months: 5 }, "T7Y3-U1I2-O5P6": { tier: 'vip', months: 12 },
  "O8P3-L4K7-J5H1": { tier: 'pro', months: 2 }, "J2K8-L6N9-H4G3": { tier: 'vip', months: 5 },
  "F1D9-G2H6-J4K5": { tier: 'pro', months: 12 }, "X5C1-V2B9-Q7W6": { tier: 'vip', months: 1 },
  "M6Q1-W3E8-R9T2": { tier: 'pro', months: 2 }, "R8E3-T9Y1-U6I2": { tier: 'vip', months: 12 },
  "Y9U4-I2O6-P1L5": { tier: 'pro', months: 1 }, "P5L7-Y4U3-I2O8": { tier: 'vip', months: 5 },
  "B1N7-V5C3-X8Z9": { tier: 'pro', months: 5 }, "S1A9-D8F3-G6H2": { tier: 'vip', months: 1 },
  "S6A2-D5F1-G7H4": { tier: 'pro', months: 12 }, "R5T7-Y1U9-I4O3": { tier: 'vip', months: 12 },
  "K9J1-H8G3-F5D2": { tier: 'pro', months: 1 }, "N8B3-V1C9-X2Z6": { tier: 'vip', months: 5 },
  "E3R5-T1Y9-U7I4": { tier: 'pro', months: 2 }, "G4K9-J1L5-H3N7": { tier: 'vip', months: 1 },
  "L7K3-J2H6-O9P1": { tier: 'pro', months: 5 }, "T3Y1-U5I7-O2P8": { tier: 'vip', months: 12 },
  "Q5W8-E1R2-T3Y6": { tier: 'pro', months: 12 }, "X8C9-V4B2-Q1W5": { tier: 'vip', months: 5 },
  "U2I5-O9P4-L6K8": { tier: 'pro', months: 1 }, "R1E2-T8Y6-U3I5": { tier: 'vip', months: 1 },
  "G9H2-J1K7-F6D5": { tier: 'pro', months: 2 }, "O7P2-L5K8-J3H9": { tier: 'vip', months: 12 },
  "M8Q2-W1E5-R3T9": { tier: 'pro', months: 5 }, "F4D6-G5H1-J9K3": { tier: 'vip', months: 5 },
  "I6O3-P7L1-Y5U2": { tier: 'pro', months: 12 }, "M1Q7-W2E4-R5T9": { tier: 'vip', months: 1 },
  "N1B3-V6C9-X2Z8": { tier: 'pro', months: 2 }, "Y8U1-I3O5-P7L2": { tier: 'vip', months: 12 },
  "P4A9-S3D2-F5G1": { tier: 'pro', months: 5 }, "B2N5-V3C7-X1Z8": { tier: 'vip', months: 1 },
  "H7J2-K1L5-M8N3": { tier: 'pro', months: 1 }, "K3J9-H6G4-F8D5": { tier: 'vip', months: 5 },
  "T9Y6-U1I2-O3P7": { tier: 'pro', months: 12 }, "E1R7-T2Y9-U4I5": { tier: 'vip', months: 12 },
  "X4C8-V2B1-Q9W5": { tier: 'pro', months: 2 }, "L6K1-J9H2-O3P7": { tier: 'vip', months: 1 },
  "R7E3-T5Y9-U1I2": { tier: 'pro', months: 1 }, "Q5W9-E3R8-T1Y6": { tier: 'vip', months: 5 },
  "O8P1-L6K2-J5H9": { tier: 'pro', months: 2 }, "U8I6-O1P4-L7K5": { tier: 'vip', months: 12 },
  "F3D6-G4H8-J1K9": { tier: 'pro', months: 5 }, "G3H2-J8K1-F6D5": { tier: 'vip', months: 1 },
  "B2N6-M8Q3-W7E1": { tier: 'pro', months: 12 }, "I1O4-P5L2-Y9U6": { tier: 'vip', months: 12 },
  "R6T2-Y1U5-I3O9": { tier: 'pro', months: 1 }, "D9F3-G5H2-S7A1": { tier: 'vip', months: 5 },
  "N5B8-V2C9-X6Z1": { tier: 'pro', months: 5 }, "H8G2-F9D1-K4J6": { tier: 'vip', months: 1 },
  "P4A1-S7D6-F3G5": { tier: 'pro', months: 2 }, "T7Y1-U3I5-O9P2": { tier: 'vip', months: 12 },
  "G2K8-J6L3-H1N5": { tier: 'pro', months: 12 }, "J9K2-L1N6-H8G5": { tier: 'vip', months: 5 },
  "X3C5-V9B2-Q1W8": { tier: 'pro', months: 1 }, "X7C4-V6B8-Q2W1": { tier: 'vip', months: 1 },
  "R7E6-T9Y4-U1I2": { tier: 'pro', months: 2 }, "R8E3-T5Y7-U2I1": { tier: 'vip', months: 12 },
  "O5P2-L8K3-J1H9": { tier: 'pro', months: 5 }, "P9L1-Y7U2-I5O8": { tier: 'vip', months: 5 },
  "F4D7-G9H5-J2K8": { tier: 'pro', months: 12 }, "R2T6-Y4U9-I3O1": { tier: 'vip', months: 1 },
  "M6Q3-W2E7-R1T9": { tier: 'pro', months: 2 }, "F6D5-G3H1-J9K4": { tier: 'vip', months: 12 },
  "Y8U1-I3O6-P4L5": { tier: 'pro', months: 5 }, "M9Q8-W3E1-R4T5": { tier: 'vip', months: 1 },
  "B9N3-V5C7-X2Z6": { tier: 'pro', months: 1 }, "C3V2-B9N4-X7Z5": { tier: 'vip', months: 5 },
  "S2A8-D3F1-G6H5": { tier: 'pro', months: 12 }, "K2J9-H6G1-F5D4": { tier: 'vip', months: 12 },
  "K7J3-H1G9-F4D6": { tier: 'pro', months: 2 }, "E5R9-T1Y6-U2I3": { tier: 'vip', months: 1 },
  "E8R5-T3Y2-U1I9": { tier: 'pro', months: 5 }, "L7K6-J4H3-O9P2": { tier: 'vip', months: 5 },
  "L6K4-J9H7-O2P1": { tier: 'pro', months: 1 }, "Q6W3-E2R9-T5Y4": { tier: 'vip', months: 12 },
  "Q2W5-E8R9-T3Y7": { tier: 'pro', months: 2 }, "U7I1-O8P4-L3K2": { tier: 'vip', months: 1 },
  "U1I6-O3P9-L5K8": { tier: 'pro', months: 5 }, "G5H6-J9K3-F2D7": { tier: 'vip', months: 12 },
  "G7H2-J4K6-F9D3": { tier: 'pro', months: 12 }, "I5O7-P2L8-Y9U1": { tier: 'vip', months: 5 },
  "M8Q3-W5E2-R7T1": { tier: 'pro', months: 2 }, "N9B5-V3C8-X2Z1": { tier: 'vip', months: 1 },
  "C5V6-B2N8-X4Z9": { tier: 'pro', months: 5 }, "P3A1-S6D9-F7G2": { tier: 'vip', months: 12 },
  "H2G7-F6D1-K9J5": { tier: 'pro', months: 12 }, "H1J7-K5L3-M8N6": { tier: 'vip', months: 5 },
  "T8Y2-U9I4-O1P5": { tier: 'pro', months: 1 }, "T7Y3-U2I6-O9P5": { tier: 'vip', months: 1 },
  "J9K4-L2N3-H6G8": { tier: 'pro', months: 2 }, "X1C5-V7B2-Q9W4": { tier: 'vip', months: 12 },
  "X6C5-V3B9-Q7W1": { tier: 'vip', months: 12 }, "R8E2-T5Y1-U6I7": { tier: 'vip', months: 1 },
  "O7P1-L3K5-J9H2": { tier: 'vip', months: 5 },
  "P3L1-Y7U2-I8O5": { tier: 'pro', months: 1 }, "F5D9-G2H8-J6K3": { tier: 'vip', months: 12 },
  "S6A2-D4F6-G9H3": { tier: 'pro', months: 2 }, "M9Q4-W3E5-R2T1": { tier: 'vip', months: 1 },
  "R1E9-T8Y2-U5I7": { tier: 'pro', months: 5 }, "Y8U2-I7O4-P6L1": { tier: 'vip', months: 5 },
  "O7P2-L5K3-J4H1": { tier: 'pro', months: 12 }, "B7N3-V9C6-X2Z8": { tier: 'vip', months: 12 },
  "S6A2-D8F3-G5H9": { tier: 'vip', months: 1 },
  "U3I1-O8P4-L2K9": { tier: 'pro', months: 1 }, "K7J2-H9G1-F5D4": { tier: 'vip', months: 12 },
  "M5Q7-W3E8-R2T1": { tier: 'pro', months: 5 }, "E4R5-T8Y2-U1I6": { tier: 'vip', months: 5 },
  "I3O7-P5L1-Y9U8": { tier: 'pro', months: 12 }, "L5K3-J9H1-O2P7": { tier: 'vip', months: 1 },
  "Q7W6-E3R8-T5Y9": { tier: 'vip', months: 12 },
  "C3V1-B6N9-X5Z4": { tier: 'pro', months: 1 }, "U8I2-O6P1-L4K7": { tier: 'vip', months: 1 },
  "T2Y5-U8I6-O9P1": { tier: 'pro', months: 5 }, "G5H9-J1K8-F2D3": { tier: 'vip', months: 5 },
  "H7G1-F8D2-K4J5": { tier: 'pro', months: 12 }, "M1Q2-W7E3-R9T6": { tier: 'vip', months: 12 },
  "J4K2-L7N9-H6G8": { tier: 'pro', months: 1 }, "C8V1-B5N7-X6Z2": { tier: 'vip', months: 1 },
  "X6C2-V7B3-Q9W5": { tier: 'pro', months: 2 }, "D6F9-G5H2-S3A1": { tier: 'vip', months: 12 },
  "R1E4-T8Y5-U3I7": { tier: 'pro', months: 5 }, 
  "O7P1-L6K3-J2H9": { tier: 'pro', months: 12 }, "T6Y5-U3I9-O2P1": { tier: 'vip', months: 1 },
  "F4D2-G9H1-J6K5": { tier: 'pro', months: 2 }, "J2K4-L7N3-H5G9": { tier: 'vip', months: 12 },
  "M1Q9-W7E3-R2T4": { tier: 'pro', months: 5 }, "X7C8-V2B5-Q1W9": { tier: 'vip', months: 1 },
  "P1L5-Y7U6-I9O2": { tier: 'vip', months: 12 },
  "S3A7-D5F1-G6H2": { tier: 'pro', months: 2 }, "S4A8-D3F2-G1H6": { tier: 'vip', months: 1 },
  "K5J3-H8G4-F1D6": { tier: 'pro', months: 1 }, "R8T3-Y5U2-I1O7": { tier: 'vip', months: 12 },
  "E7R1-T5Y2-U9I6": { tier: 'pro', months: 5 }, "N5B9-V3C8-X2Z6": { tier: 'vip', months: 5 },
  "L2K7-J6H9-O4P1": { tier: 'pro', months: 12 }, "K4J1-H8G5-F2D7": { tier: 'vip', months: 1 }
};

// --- DOCUMENT LIBRARY DATA (ADMIN PROVIDED) ---
export const DOCUMENT_LIBRARY: DocumentItem[] = [
  { id: 'doc_1', title: 'Đề thi THPT Quốc Gia 2023 - Mã đề 401', category: 'THPT', description: 'Đề thi chính thức môn Tiếng Anh kỳ thi tốt nghiệp THPT 2023.', downloadUrl: '#', dateAdded: '2023-07-10', fileType: 'PDF' },
  { id: 'doc_2', title: '1000 Từ vựng IELTS Common', category: 'IELTS', description: 'Danh sách từ vựng phổ biến nhất trong IELTS Reading & Listening.', downloadUrl: '#', dateAdded: '2023-08-15', fileType: 'PDF', isVipOnly: true },
  { id: 'doc_3', title: 'Đề cương ôn tập Tiếng Anh 9 lên 10', category: 'THCS', description: 'Tổng hợp ngữ pháp trọng tâm thi vào 10 chuyên Anh.', downloadUrl: '#', dateAdded: '2023-05-20', fileType: 'DOCX' },
  { id: 'doc_4', title: 'Giải chi tiết Đề thi THPT QG 2022', category: 'THPT', description: 'Phân tích chi tiết đáp án và từ vựng.', downloadUrl: '#', dateAdded: '2022-08-01', fileType: 'PDF' },
  { id: 'doc_5', title: 'IELTS Writing Task 2 Samples (Band 9.0)', category: 'IELTS', description: 'Các bài mẫu Writing đạt điểm tuyệt đối.', downloadUrl: '#', dateAdded: '2023-09-05', fileType: 'PDF', isVipOnly: true },
  { id: 'doc_6', title: 'Bộ đề thi thử THPT QG 2024 - Trường Chuyên', category: 'THPT', description: 'Đề thi thử từ các trường chuyên nổi tiếng.', downloadUrl: '#', dateAdded: '2024-03-10', fileType: 'PDF', isVipOnly: true },
  { id: 'doc_7', title: 'Ngữ pháp tiếng Anh cơ bản cho người mất gốc', category: 'KHAC', description: 'Tài liệu nhập môn dễ hiểu.', downloadUrl: '#', dateAdded: '2023-01-10', fileType: 'PDF' },
];

// --- PROMPTS ---

export const EXERCISE_SOLVER_PROMPT = `
Bạn là "Siêu Gia Sư Tiếng Anh VIP" (AI Super Tutor).
Nhiệm vụ: Giải bài tập tiếng Anh cực kỳ chi tiết, chính xác và dễ hiểu.

**PHONG CÁCH TRẢ LỜI:**
- **Chuyên nghiệp & Tận tâm:** Như một giáo viên giỏi đang kèm 1-1.
- **Trình bày đẹp:** Sử dụng Markdown, in đậm, list, và emoji hợp lý.
- **Không chỉ đưa đáp án:** Phải giải thích TẠI SAO đúng, TẠI SAO sai.

**CẤU TRÚC TRẢ LỜI (BẮT BUỘC):**

Đối với mỗi câu hỏi, hãy tuân theo khuôn mẫu sau:

---
### 🎯 Câu [Số thứ tự]
**Câu hỏi:** [Nhắc lại câu hỏi ngắn gọn]

✅ **ĐÁP ÁN ĐÚNG:** **[Đáp án]**

💡 **GIẢI THÍCH CHI TIẾT:**
*   **Phân tích ngữ pháp/từ vựng:** Giải thích cấu trúc câu, thì, hoặc cụm từ được sử dụng.
*   **Tại sao chọn đáp án này:** Logic đi đến kết quả.
*   **Tại sao các câu khác sai:** (Rất quan trọng) Phân tích từng phương án nhiễu để người học hiểu sâu.

📝 **DỊCH NGHĨA:**
*   🇬🇧 *[Câu tiếng Anh hoàn chỉnh]*
*   🇻🇳 *[Dịch tiếng Việt mượt mà]*

🧠 **MỞ RỘNG KIẾN THỨC (VIP):**
*   Cung cấp thêm từ đồng nghĩa, trái nghĩa hoặc cấu trúc liên quan (nếu có).
---

**Lưu ý:** Nếu người dùng gửi ảnh, hãy trích xuất văn bản và giải từng câu một. Cuối cùng hãy có một bảng tổng hợp đáp án nhanh (Key Table).
`;

export const THEORY_EXPERT_PROMPT = `
Bạn là Giáo Sư Ngôn Ngữ Học (Professor of Linguistics) chuyên về Tiếng Anh.
Nhiệm vụ: Giải thích các khái niệm ngữ pháp, từ vựng một cách sâu sắc, hệ thống và toàn diện.

**QUY TẮC:**
1. **Đi từ gốc rễ:** Giải thích bản chất vấn đề, không chỉ là quy tắc bề mặt.
2. **Ví dụ phong phú:** Mỗi lý thuyết phải có ít nhất 3 ví dụ minh họa (Kèm dịch nghĩa).
3. **So sánh & Đối chiếu:** Phân biệt các khái niệm dễ nhầm lẫn (VD: Past Simple vs Present Perfect).
4. **Trình bày:** Sử dụng bảng (Markdown Table) để so sánh, công thức đóng khung.

**CẤU TRÚC BÀI GIẢNG:**
# 📚 [TÊN CHỦ ĐỀ]

## 1. Định nghĩa & Bản chất
...

## 2. Công thức / Cấu trúc
(Dùng bảng Markdown để trình bày công thức Khẳng định (+), Phủ định (-), Nghi vấn (?))

## 3. Cách dùng chi tiết
*   **Cách dùng 1:** ... (Ví dụ minh họa)
*   **Cách dùng 2:** ... (Ví dụ minh họa)

## 4. ⚠️ Những lưu ý quan trọng (Common Mistakes)
*   Liệt kê các lỗi sai thường gặp của người Việt.

## 5. 💎 Mẹo ghi nhớ (VIP Tips)
*   Mẹo nhớ nhanh, thần chú...
`;

export const GENERAL_TUTOR_PROMPT = `
Bạn là Trợ lý Tiếng Anh cá nhân (AI Personal English Coach).
Nhiệm vụ: Trò chuyện, sửa lỗi sai giao tiếp, gợi ý từ vựng và động viên người học.

- Luôn trả lời thân thiện, emoji vui vẻ 😊.
- Nếu người dùng sai ngữ pháp, hãy sửa lại một cách tinh tế ở cuối câu trả lời (Mục: "✨ Sửa lỗi nhỏ").
- Khuyến khích người dùng nói nhiều hơn.
- Nếu người dùng hỏi bài tập khó, hãy gợi ý họ chuyển sang chế độ "Giải Bài Tập" để chi tiết hơn.
`;

export const GAME_MASTER_PROMPT = `
Bạn là Game Master của ứng dụng học Tiếng Anh.
Nhiệm vụ: Tạo dữ liệu game trắc nghiệm dưới dạng JSON chuẩn.

**QUY TẮC TUYỆT ĐỐI:**
1. CHỈ trả về JSON. Không có text dẫn dắt, không markdown block (\`\`\`).
2. JSON phải hợp lệ, không lỗi cú pháp.

**Format JSON:**
{
  "title": "Tên Game (Hấp dẫn, Tiếng Việt)",
  "topic": "Chủ đề (VD: Idioms, Tenses)",
  "difficulty": "Easy/Medium/Hard",
  "questions": [
    {
      "id": 1,
      "question": "Câu hỏi tiếng Anh?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0, // 0=A, 1=B...
      "explanation": "Giải thích ngắn gọn tiếng Việt tại sao đúng."
    }
  ]
}
Hãy tạo 5 câu hỏi thú vị, đa dạng.
`;

export const TEST_GENERATOR_PROMPT = `
Bạn là Chuyên gia Ra Đề Thi Quốc Gia.
Nhiệm vụ: Tạo đề thi tiếng Anh hoàn chỉnh dưới dạng JSON chuẩn.

**QUY TẮC TUYỆT ĐỐI:**
1. CHỈ trả về JSON. Không text thừa.
2. Đảm bảo JSON valid.

**Format JSON:**
{
  "title": "Tên Đề Thi (VD: THPT QG 2024)",
  "subtitle": "Môn Tiếng Anh - Thời gian: ... phút",
  "duration": 60,
  "sections": [
    {
      "title": "PHONETICS / LEXICO / READING...",
      "description": "Mark the letter...",
      "passageContent": "Nội dung bài đọc nếu có (để trống nếu không phải bài đọc)",
      "questions": [
        {
          "id": 1,
          "type": "multiple_choice",
          "content": "Câu hỏi...",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": "A" 
        }
      ]
    }
  ]
}
`;

export const TEST_GRADER_PROMPT = `
Bạn là Giám Khảo Chấm Thi.
Nhiệm vụ: Chấm điểm bài làm và trả về JSON kết quả.

**QUY TẮC:**
1. CHỈ trả về JSON.

**Format JSON:**
{
  "score": 8.5,
  "totalQuestions": 50,
  "correctCount": 40,
  "teacherComment": "Nhận xét ngắn gọn, súc tích, động viên.",
  "detailedAnalysis": "MARKDOWN STRING: Phân tích chi tiết từng lỗi sai. Chỉ ra câu nào sai, đáp án đúng là gì và giải thích tại sao.",
  "improvementPlan": "Lời khuyên để cải thiện điểm số."
}
`;

export const getSystemInstruction = (mode: TutorMode): string => {
  switch (mode) {
    case TutorMode.EXERCISE:
      return EXERCISE_SOLVER_PROMPT;
    case TutorMode.THEORY:
      return THEORY_EXPERT_PROMPT;
    case TutorMode.GAME:
      return GAME_MASTER_PROMPT;
    case TutorMode.TEST_PREP:
      return TEST_GENERATOR_PROMPT;
    case TutorMode.GENERAL:
    default:
      return GENERAL_TUTOR_PROMPT;
  }
};