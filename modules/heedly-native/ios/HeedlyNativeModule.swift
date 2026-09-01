import ExpoModulesCore
import HeedlyEngine

/// The Swift half of the bridge described in `specs/bridge.ts`.
///
/// The rule that shapes this file: **raw health values never cross into
/// JavaScript.** Qualitative bands, confidence, reason keys and user-entered
/// check-in values may cross; measured biometrics, z-scores and the internal
/// reserve may not. The sharp test from the contract is that JavaScript never
/// receives a number it could do arithmetic on.
public class HeedlyNativeModule: Module {
    public func definition() -> ModuleDefinition {
        Name("HeedlyNative")

        /// Startup handshake (`bridge.ts`). Native and JavaScript ship together
        /// but are edited independently, so a mismatch must fail loudly rather
        /// than silently render wrong data.
        ///
        /// Hard-coded rather than derived: this is the version *this* build
        /// implements, and it must only change when the contract does.
        Function("getContractVersion") { () -> Int in
            1
        }

        /// ⚠️ **Temporary.** Delete once a real method calls into the engine.
        ///
        /// Exists to make the compiler prove that `HeedlyEngine` links. An
        /// `import` alone is weaker evidence — this forces a real call through
        /// the package boundary, so a podspec that has drifted from its
        /// `Package.swift` fails here rather than somewhere less obvious.
        Function("engineSmokeTest") { () -> String? in
            CalendarDay(iso: "2026-08-25")?.iso
        }
    }
}
