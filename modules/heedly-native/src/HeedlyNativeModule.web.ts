import { registerWebModule, NativeModule } from 'expo';

class HeedlyNativeModule extends NativeModule<{}> {}

export default registerWebModule(HeedlyNativeModule, 'HeedlyNativeModule');
