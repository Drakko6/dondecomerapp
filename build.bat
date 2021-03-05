@echo off
if "%1" == "debug" (
    rm -rf ./android/app/src/main/res/drawable-*
    rm -rf ./android/app/src/main/res/raw
    npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
    cd android
    gradlew assembleDebug
    cd app/build/outputs/apk/debug
    explorer .
)
if "%1" == "release" (
    rm -rf ./android/app/src/main/res/drawable-*
    rm -rf ./android/app/src/main/res/raw
    npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/build/intermediates/res/merged/release/
    cd android
    gradlew assembleRelease
    cd app/build/outputs/apk/release
    explorer .
)