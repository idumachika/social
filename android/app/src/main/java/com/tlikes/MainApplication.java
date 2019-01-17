package com.tlikes;

import com.github.yamill.orientation.OrientationPackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.beefe.picker.PickerViewPackage;
import com.rnfs.RNFSPackage;
import com.dooboolab.RNIap.RNIapPackage;
// fb sdk
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;

import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.imagepicker.ImagePickerPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.mybigday.rnmediameta.RNMediaMetaPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;

import com.zmxv.RNSound.RNSoundPackage;

import java.util.Arrays;
import java.util.List;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;
public class MainApplication extends NavigationApplication {

    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
      }

  @Override
  protected ReactGateway createReactGateway() {
        ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(),createAdditionalReactPackages()) {
            @Override
            protected String getJSMainModuleName() {
                return "index.android";
            }
        };
        return new ReactGateway(this, isDebug(), host);
    }

    @Override
    public boolean isDebug() {
      return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
        new RNSoundPackage(),
        new VectorIconsPackage(),
        new ReactVideoPackage(),
        new LinearGradientPackage(),
        new FastImageViewPackage(),
        new RNFSPackage(),
        new ImageResizerPackage(),
        new ImagePickerPackage(),
        new RNFetchBlobPackage(),
        new ReactNativeConfigPackage(),
        new KCKeepAwakePackage(),
        new OrientationPackage(),
        new GoogleAnalyticsBridgePackage(),
        new ReactNativePushNotificationPackage(),
        new PickerViewPackage(),
        new ReactNativeDocumentPicker(),
        new RNMediaMetaPackage(),
        new RNGoogleSigninPackage(),
        new FBSDKPackage(mCallbackManager),
        new RNIapPackage()
      );
    }



    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }
}
