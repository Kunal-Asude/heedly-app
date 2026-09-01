Pod::Spec.new do |s|
  s.name           = 'HeedlyNative'
  s.version        = '1.0.0'
  s.summary        = 'A sample project summary'
  s.description    = 'A sample project description'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = {
    :ios => '16.4',
    :tvos => '16.4'
  }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  # The Heedly Swift core. CocoaPods cannot consume Swift Package Manager
  # packages, so each package carries a podspec mirroring its Package.swift.
  s.dependency 'HeedlyEngine'
  s.dependency 'HeedlyStorage'
  s.dependency 'HeedlyHealth'
  s.dependency 'HeedlyIngest'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
