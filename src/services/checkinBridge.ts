/**
 * Translates the app's check-in shape into the native contract.
 *
 * Kept apart from CheckInContext so the conversions are plain functions that
 * can be exercised without mounting React or booting a simulator. Everything
 * here is pure — no storage, no bridge calls.
 *
 * The two shapes disagree in ways that are easy to get silently wrong:
 *
 *  - The UI stores levels as a **0-based index**; the contract stores a
 *    **1-based level**. The schema enforces `CHECK (energy_level BETWEEN 1
 *    AND 5)`, so index 0 would be rejected outright while indexes 1–4 would
 *    store successfully as the wrong level. Only one of the five values fails
 *    loudly, which is why this conversion lives in one named place.
 *
 *  - A skipped answer is `null` and must stay `null`. It is not a low answer,
 *    and it is not a middling one: §10 counts mornings actually answered.
 */

import type { CheckIn, Verdict, VerdictValue } from '@heedly/native';

import {
    MOCK_BODY_LEVELS,
    MOCK_FIRST_TIME_ENERGY_LEVELS,
    MOCK_RECURRING_ENERGY_LEVELS,
} from '@/data/mock/mockCheckIn';
import type { CheckInEntry } from '@/types/checkin';

/** Prefix marking a tag as cycle data rather than something the person picked. */
const PERIOD_TAG_PREFIX = 'period:';

/**
 * Converts a 0-based UI index to the contract's 1-based level.
 *
 * `null`/`undefined` pass through untouched — a skipped answer stays skipped.
 */
export function toLevel(index: number | null | undefined): number | null {
    return index === null || index === undefined ? null : index + 1;
}

/**
 * Encodes `periodInfo` as tag ids.
 *
 * `period.tsx` composes one of three forms from fixed lists — `"Day 2 · Medium
 * flow"`, `"Day 2"`, or a quick option — so this is a controlled vocabulary,
 * which is what `tagIds` is for. Storage does not validate tag ids and does not
 * know what they mean, so no Swift change is required to carry this.
 *
 * The `period:` prefix keeps cycle data separable from tags the person chose,
 * so it can be migrated to dedicated columns later without ambiguity.
 */
export function periodInfoToTagIds(periodInfo: string | null | undefined): string[] {
    if (!periodInfo) return [];

    const quick: Record<string, string> = {
        'Period just started': `${PERIOD_TAG_PREFIX}started`,
        Spotting: `${PERIOD_TAG_PREFIX}spotting`,
        'Not bleeding today': `${PERIOD_TAG_PREFIX}none`,
    };
    if (periodInfo in quick) return [quick[periodInfo]];

    const [dayPart, flowPart] = periodInfo.split(' · ');
    const tags: string[] = [];

    // "Day 7+" is the open-ended bucket; the rest are plain numbers.
    const day = dayPart?.replace(/^Day\s+/, '').trim();
    if (day) {
        tags.push(`${PERIOD_TAG_PREFIX}day-${day === '7+' ? '7-plus' : day}`);
    }

    const flow = flowPart?.replace(/\s*flow$/, '').trim().toLowerCase();
    if (flow) {
        tags.push(`${PERIOD_TAG_PREFIX}flow-${flow}`);
    }

    return tags;
}

/**
 * Builds the record the native bridge stores.
 *
 * Fields with no destination in the contract are dropped deliberately:
 * `energyLabel`/`bodyLabel`/`yesterdayLabel` are display text for a value that
 * is already carried, and `isFirstTime`/`completedAt`/`updatedAt` are app
 * bookkeeping. The verdict travels separately, through `saveVerdict`.
 */
export function toNativeCheckIn(entry: CheckInEntry): CheckIn {
    return {
        date: entry.date,
        energyLevel: toLevel(entry.energyIndex),
        bodyLevel: toLevel(entry.bodyIndex),
        tagIds: [...(entry.tags ?? []), ...periodInfoToTagIds(entry.periodInfo)],
        crashFlag: entry.isCrash ?? false,
        // No free-text field exists in the check-in UI. Notes are stored and
        // displayed but never analysed, so nothing here should be invented.
        note: null,
        // Ignored on the way in — only storage can see whether an answer moved.
        editedAt: null,
    };
}

/**
 * The verdict value, or `null` when the person has not rated the day.
 *
 * `yesterdayId` already carries the contract's vocabulary, so this is a
 * narrowing rather than a translation — the rename from `"same"` to `"usual"`
 * happened at the type, which is what makes that safe.
 */
export function toVerdictValue(
    yesterdayId: CheckInEntry['yesterdayId'],
): VerdictValue | null {
    return yesterdayId ?? null;
}

// ─── Reading back ─────────────────────────────────────────────────────────────

/** Inverse of `toLevel`. 1–5 becomes 0–4; `null` stays `null`. */
export function toIndex(level: number | null | undefined): number | null {
    return level === null || level === undefined ? null : level - 1;
}

/**
 * Rebuilds `periodInfo` from the tag ids `periodInfoToTagIds` wrote.
 *
 * The exact strings matter: `period.tsx` parses them back with
 * `startsWith('Day ')`, `split(' · ')` and `replace(' flow','')`, so the format
 * produced here has to match what that screen expects to re-select the day and
 * flow it shows. This is the decoder side of a one-way encoding — the two must
 * be changed together.
 */
export function tagIdsToPeriodInfo(tagIds: string[]): string | null {
    const quick: Record<string, string> = {
        [`${PERIOD_TAG_PREFIX}started`]: 'Period just started',
        [`${PERIOD_TAG_PREFIX}spotting`]: 'Spotting',
        [`${PERIOD_TAG_PREFIX}none`]: 'Not bleeding today',
    };
    const quickHit = tagIds.find((id) => id in quick);
    if (quickHit) return quick[quickHit];

    const dayTag = tagIds.find((id) => id.startsWith(`${PERIOD_TAG_PREFIX}day-`));
    if (!dayTag) return null;

    const rawDay = dayTag.slice(`${PERIOD_TAG_PREFIX}day-`.length);
    const day = `Day ${rawDay === '7-plus' ? '7+' : rawDay}`;

    const flowTag = tagIds.find((id) => id.startsWith(`${PERIOD_TAG_PREFIX}flow-`));
    if (!flowTag) return day;

    const flow = flowTag.slice(`${PERIOD_TAG_PREFIX}flow-`.length);
    return `${day} · ${flow.charAt(0).toUpperCase()}${flow.slice(1)} flow`;
}

/** Tags the person actually picked — cycle data is carried separately. */
export function userTagIds(tagIds: string[]): string[] {
    return tagIds.filter((id) => !id.startsWith(PERIOD_TAG_PREFIX));
}

/**
 * Rebuilds a `CheckInEntry` from what the store holds.
 *
 * Three UI-only fields have no column, by design — the store keeps what the
 * person answered, not how the app presented it — so they are derived here
 * rather than added to the Swift contract:
 *
 *  - `isFirstTime`: a first check-in skips the yesterday question entirely, so
 *    it is the one with no verdict. (A recurring check-in where the person
 *    skipped that question also has none, and would render as first-time on
 *    review. Cosmetic, and rarer than the bug it replaces.)
 *  - `energyLabel`/`bodyLabel`: display text for the level, so they come from
 *    the same tables the screens use. A skipped level has no label.
 *  - `completedAt`/`updatedAt`: read by nothing in the app; left undefined.
 */
export function fromNativeCheckIn(
    checkIn: CheckIn,
    verdict: Verdict | null,
): CheckInEntry {
    const isFirstTime = verdict === null;
    const energyIndex = toIndex(checkIn.energyLevel);
    const bodyIndex = toIndex(checkIn.bodyLevel);
    const energyLevels = isFirstTime
        ? MOCK_FIRST_TIME_ENERGY_LEVELS
        : MOCK_RECURRING_ENERGY_LEVELS;

    return {
        date: checkIn.date,
        yesterdayId: verdict?.value ?? null,
        yesterdayLabel: verdict ? verdictLabel(verdict.value) : null,
        yesterdayIndex: verdict ? verdictIndex(verdict.value) : null,
        energyIndex,
        energyLabel: energyIndex === null ? null : energyLevels[energyIndex]?.label ?? null,
        bodyIndex,
        bodyLabel: bodyIndex === null ? null : MOCK_BODY_LEVELS[bodyIndex]?.label ?? null,
        tags: userTagIds(checkIn.tagIds),
        periodInfo: tagIdsToPeriodInfo(checkIn.tagIds),
        isCrash: checkIn.crashFlag,
        isFirstTime,
    };
}

/** The wording the yesterday screen shows for a stored verdict. */
function verdictLabel(value: VerdictValue): string {
    return value === 'lighter'
        ? 'Lighter than usual'
        : value === 'usual'
          ? 'About the same'
          : 'Heavier than usual';
}

/** The 3/2/1 ordering the existing screens use for the same three values. */
function verdictIndex(value: VerdictValue): number {
    return value === 'lighter' ? 3 : value === 'usual' ? 2 : 1;
}
