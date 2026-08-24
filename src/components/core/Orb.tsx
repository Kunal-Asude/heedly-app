import { EnergyOrb } from './EnergyOrb';
import type { EnergyOrbProps, EnergyOrbState } from './EnergyOrb';

export interface OrbProps extends EnergyOrbProps {
  /**
   * 'logo' = full luminous logo orb for Onboarding & Paywall screens (empty water state)
   * 'today' = tank gauge orb for Today screen (steady/caution/rest state)
   */
  variant?: 'logo' | 'today';
}

/**
 * Aubade — the shared signature orb (the brand's "default tank" glass sphere).
 * Matches design system spec from orb.jsx:
 * Welcome, Today, and Paywall ALL render this one component so the orb can't drift.
 *   • Omit `water` / 'logo'  → the full, luminous default orb (Welcome + Paywall logo orb).
 *   • Pass `water` / 'today' → the same sphere with Today's per-state tank fill layered in.
 * Size is controlled by the wrapper CSS (.ob-orb / .orb-wrap / .pw-orb), never here.
 */
export function Orb({ variant, state, size, ...rest }: OrbProps) {
  const effectiveState: EnergyOrbState =
    state ?? (variant === 'today' ? 'steady' : 'empty');

  return <EnergyOrb state={effectiveState} size={size} {...rest} />;
}
