export type OptionalCapability = 'shared_browser' | 'connected_blender' | 'generated_preview';

const settings: Record<OptionalCapability, string> = {
  shared_browser: 'COCREATE_SHARED_BROWSER',
  connected_blender: 'COCREATE_CONNECTED_BLENDER',
  generated_preview: 'COCREATE_GENERATED_PREVIEW',
};

export function capabilityEnabled(capability: OptionalCapability, env = process.env): boolean {
  const value = env[settings[capability]];
  return value === 'enabled' || (value === undefined && env.COCREATE_HOSTED !== 'true');
}

export function requireCapability(capability: OptionalCapability): void {
  if (!capabilityEnabled(capability)) throw Object.assign(new Error(`${capability} is disabled by the operator.`), {
    status: 503, code: 'capability_disabled',
  });
}

export function capabilityConfiguration() {
  return {
    shared_browser: capabilityEnabled('shared_browser'),
    connected_blender: capabilityEnabled('connected_blender'),
    interactive_blender: capabilityEnabled('connected_blender') && process.env.COCREATE_INTERACTIVE_BLENDER === 'linux-xvfb-v1',
    generated_preview: capabilityEnabled('generated_preview'),
  };
}
