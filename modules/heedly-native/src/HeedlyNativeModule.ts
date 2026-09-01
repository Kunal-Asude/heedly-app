import { NativeModule, requireNativeModule } from 'expo';

declare class HeedlyNativeModule extends NativeModule<{}> {
  /**
   * Startup handshake. Native and JavaScript ship together but are edited
   * independently — a mismatch must fail loudly rather than silently render
   * wrong data. Compare against CONTRACT_VERSION in specs/bridge.ts.
   */
  getContractVersion(): number;

  /**
   * Temporary. Proves HeedlyEngine is linked and callable from Swift.
   * Delete once a real method calls into the engine.
   */
  engineSmokeTest(): string | null;
}

export default requireNativeModule<HeedlyNativeModule>('HeedlyNative');
