const { withEntitlementsPlist } = require('expo/config-plugins');

/**
 * Drops the `aps-environment` entitlement `expo-notifications` adds. Heedly
 * only schedules local notifications, which need none, and the distribution
 * profile does not grant it — so signing fails with it present.
 *
 * Survives prebuild because `getConfig` applies this before
 * `withVersionedExpoSDKPlugins` applies theirs, and mods run last-registered
 * first: theirs adds, this removes, the file is written after.
 */
module.exports = function withoutPushEntitlement(config) {
  return withEntitlementsPlist(config, (config) => {
    delete config.modResults['aps-environment'];
    return config;
  });
};
