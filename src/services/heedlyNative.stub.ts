import type HeedlyNativeModule from '@heedly/native';
import type { CheckIn, Verdict, VerdictValue } from '@heedly/native';

/**
 * Web and Android stand-in for the Swift engine, so screens can be built and clicked
 * through off iOS. It holds no real data: reads report "nothing recorded"
 * and check-ins live in memory until the page reloads.
 *
 * Never mistake what this renders for a real empty state — on device the
 * answers come from the store.
 */
// ponytail: in-memory only, lost on reload. Persist to localStorage if web testing needs it.
const checkIns = new Map<string, CheckIn>();
const verdicts = new Map<string, Verdict>();

const HeedlyNativeWeb = {
  getContractVersion: () => 0,
  engineSmokeTest: () => null,
  getTankState: async () => ({
    dataState: 'no_data' as const,
    band: null,
    direction: null,
    updatedAt: new Date().toISOString().slice(0, 10),
  }),
  getPatterns: async () => ({
    dataState: 'no_data' as const,
    patterns: [],
    learningSince: null,
    n: 0,
  }),
  getForecast: async () => [],
  getConnectionState: async () => ({
    connected: false,
    activeSources: [],
    backfill: { status: 'not_started' as const, progress: 0 },
  }),
  getTagCatalogue: async () => [],
  getVerdict: async (date: string) => verdicts.get(date) ?? null,
  saveVerdict: async (date: string, value: VerdictValue) => {
    verdicts.set(date, { date, value, editedAt: null });
  },
  getUnratedDay: async () => null,
  getFirstCheckInDay: async () => [...checkIns.keys()].sort()[0] ?? null,
  getCheckIn: async (date: string) => checkIns.get(date) ?? null,
  saveCheckIn: async (input: CheckIn) => {
    checkIns.set(input.date, input);
  },
  connectHealthKit: async () => 0,
  syncHealthKit: async () => 0,
  deleteAllData: async () => {
    checkIns.clear();
    verdicts.clear();
  },
  addListener: () => ({ remove: () => {} }),
};

export default HeedlyNativeWeb as unknown as typeof HeedlyNativeModule;
