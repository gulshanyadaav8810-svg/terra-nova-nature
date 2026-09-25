# Nature Moments Proguard rules
-keepattributes *Annotation*
-keepattributes JavascriptInterface

-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

-keep class com.naturemoments.app.** { *; }

# Google Mobile Ads (AdMob)
-keep public class com.google.android.gms.ads.** {
   public *;
}
-keep public class com.google.ads.** {
   public *;
}

# AndroidX Webkit
-keep class androidx.webkit.** { *; }
