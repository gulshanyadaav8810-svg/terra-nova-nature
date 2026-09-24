package com.naturemoments.app;

import android.app.Activity;
import android.app.DownloadManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.webkit.WebViewAssetLoader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import android.media.MediaScannerConnection;

import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.AdError;

public class MainActivity extends Activity {
    private static final String TAG = "NatureMomentsApp";
    public static final String ONLINE_URL = "https://nature-moments-app.vercel.app";
    public static final String OFFLINE_FALLBACK_URL = "https://appassets.androidplatform.net/assets/index.html";

    // Production AdMob IDs (Provided by user - will automatically show live ads once approved)
    public static final String ADMOB_BANNER_ID = "ca-app-pub-3199277482182252/9402582339";
    public static final String ADMOB_INTERSTITIAL_ID = "ca-app-pub-3199277482182252/6776418993";

    // Google Official Sample Test Unit IDs (Automatic immediate fallback before Play Store review approval)
    public static final String TEST_BANNER_ID = "ca-app-pub-3940256099942544/6300978111";
    public static final String TEST_INTERSTITIAL_ID = "ca-app-pub-3940256099942544/1033173712";

    private LinearLayout rootLayout;
    private WebView webView;
    private FrameLayout adContainer;
    private AdView adView;
    private InterstitialAd mInterstitialAd;
    private boolean isInterstitialLoading = false;
    private long lastInterstitialShownTime = 0;
    private static final long INTERSTITIAL_MIN_INTERVAL_MS = 15000; // 15 sec cooldown
    private boolean isBannerUsingTestId = false;
    private boolean isBannerLoaded = false;
    private boolean isBannerEnabledByJs = true;
    private String pendingInterstitialTrigger = null;

    public class WebAppInterface {
        Activity mActivity;

        WebAppInterface(Activity activity) {
            mActivity = activity;
        }

        @JavascriptInterface
        public void exitApp() {
            mActivity.runOnUiThread(() -> mActivity.finishAffinity());
        }

        @JavascriptInterface
        public void shareWhatsApp(String shareText) {
            mActivity.runOnUiThread(() -> {
                try {
                    Intent intent = new Intent(Intent.ACTION_SEND);
                    intent.setType("text/plain");
                    intent.setPackage("com.whatsapp");
                    intent.putExtra(Intent.EXTRA_TEXT, shareText);
                    mActivity.startActivity(intent);
                } catch (Exception e) {
                    try {
                        Intent fallbackIntent = new Intent(Intent.ACTION_SEND);
                        fallbackIntent.setType("text/plain");
                        fallbackIntent.putExtra(Intent.EXTRA_TEXT, shareText);
                        mActivity.startActivity(Intent.createChooser(fallbackIntent, "Share Nature Reel via"));
                    } catch (Exception ex) {
                        Toast.makeText(mActivity, "Unable to open share sheet", Toast.LENGTH_SHORT).show();
                    }
                }
            });
        }

        @JavascriptInterface
        public void shareApp(String shareText) {
            mActivity.runOnUiThread(() -> {
                try {
                    Intent intent = new Intent(Intent.ACTION_SEND);
                    intent.setType("text/plain");
                    intent.putExtra(Intent.EXTRA_TEXT, shareText);
                    mActivity.startActivity(Intent.createChooser(intent, "Share Nature Moments App"));
                } catch (Exception e) {
                    Toast.makeText(mActivity, "Unable to share", Toast.LENGTH_SHORT).show();
                }
            });
        }

        @JavascriptInterface
        public void downloadVideo(String videoUrl, String fileName) {
            new Thread(() -> {
                try {
                    final String cleanName = (fileName == null || fileName.trim().isEmpty())
                        ? "Nature_Reel_" + System.currentTimeMillis() + ".mp4"
                        : fileName.replaceAll("[^a-zA-Z0-9._-]", "_");

                    if (videoUrl != null && (videoUrl.startsWith("http://") || videoUrl.startsWith("https://"))) {
                        // Remote HTTP download via DownloadManager
                        mActivity.runOnUiThread(() -> {
                            try {
                                DownloadManager.Request request = new DownloadManager.Request(Uri.parse(videoUrl));
                                request.setTitle("Nature Moments Reel");
                                request.setDescription("Downloading " + cleanName);
                                request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                                request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, cleanName);
                                request.setAllowedOverMetered(true);
                                request.setAllowedOverRoaming(true);

                                DownloadManager manager = (DownloadManager) mActivity.getSystemService(Context.DOWNLOAD_SERVICE);
                                if (manager != null) {
                                    manager.enqueue(request);
                                    Toast.makeText(mActivity, "Downloading: " + cleanName, Toast.LENGTH_SHORT).show();
                                }
                            } catch (Exception ex) {
                                Log.e(TAG, "DownloadManager error", ex);
                            }
                        });
                    } else {
                        String assetPath = videoUrl;
                        if (assetPath == null || assetPath.isEmpty()) {
                            return;
                        }
                        if (assetPath.startsWith("/")) {
                            assetPath = assetPath.substring(1);
                        }

                        InputStream in = null;
                        try {
                            in = mActivity.getAssets().open(assetPath);
                        } catch (Exception e1) {
                            try {
                                if (assetPath.startsWith("assets/")) {
                                    in = mActivity.getAssets().open(assetPath.substring("assets/".length()));
                                }
                            } catch (Exception e2) {
                                Log.e(TAG, "Cannot open asset: " + assetPath, e2);
                            }
                        }

                        if (in != null) {
                            File downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
                            if (!downloadsDir.exists()) {
                                downloadsDir.mkdirs();
                            }
                            File destFile = new File(downloadsDir, cleanName);
                            FileOutputStream out = new FileOutputStream(destFile);
                            byte[] buffer = new byte[8192];
                            int read;
                            while ((read = in.read(buffer)) != -1) {
                                out.write(buffer, 0, read);
                            }
                            out.flush();
                            out.close();
                            in.close();

                            // Trigger MediaScanner so video appears in Gallery/Photos app
                            MediaScannerConnection.scanFile(
                                mActivity,
                                new String[]{destFile.getAbsolutePath()},
                                new String[]{"video/mp4"},
                                null
                            );

                            mActivity.runOnUiThread(() -> {
                                Toast.makeText(mActivity, "Saved to Downloads & Gallery: " + cleanName, Toast.LENGTH_LONG).show();
                            });
                        }
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Error saving video to device", e);
                    mActivity.runOnUiThread(() -> {
                        Toast.makeText(mActivity, "Reel saved in-app", Toast.LENGTH_SHORT).show();
                    });
                }
            }).start();
        }

        @JavascriptInterface
        public void showInterstitialAd(String triggerReason) {
            triggerInterstitialAd(triggerReason);
        }

        @JavascriptInterface
        public void setBannerVisibility(boolean visible) {
            isBannerEnabledByJs = visible;
            runOnUiThread(() -> updateBannerVisibility());
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Window setup - Keep system 3-button navigation bar (||| O <) & status bar visible at all times
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            Window window = getWindow();
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(android.graphics.Color.parseColor("#03081a"));
            window.setNavigationBarColor(android.graphics.Color.parseColor("#03081a"));
        }

        rootLayout = new LinearLayout(this);
        rootLayout.setOrientation(LinearLayout.VERTICAL);
        rootLayout.setLayoutParams(new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.MATCH_PARENT
        ));
        rootLayout.setBackgroundColor(android.graphics.Color.parseColor("#03081a"));

        webView = new WebView(this);
        LinearLayout.LayoutParams webViewParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            0,
            1.0f
        );
        webView.setLayoutParams(webViewParams);
        rootLayout.addView(webView);

        adContainer = new FrameLayout(this);
        LinearLayout.LayoutParams adContainerParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        adContainer.setLayoutParams(adContainerParams);
        adContainer.setBackgroundColor(android.graphics.Color.parseColor("#03081a"));
        adContainer.setVisibility(View.GONE);
        rootLayout.addView(adContainer);

        setContentView(rootLayout);

        // Initialize Google Mobile Ads SDK
        MobileAds.initialize(this, initializationStatus -> {
            Log.d(TAG, "Google Mobile Ads SDK Initialized");
            runOnUiThread(() -> {
                setupBannerAd();
                loadInterstitialAd(false);
            });
        });

        // Trigger welcome interstitial test ad after 5 seconds on launch
        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            if (!isFinishing() && !isDestroyed()) {
                triggerInterstitialAd("welcome_launch");
            }
        }, 5000);

        // WebSettings configuration
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

        // Initialize Android Jetpack WebViewAssetLoader for offline fallback
        final WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
            .build();

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                if (request != null && request.getUrl() != null) {
                    Uri uri = request.getUrl();
                    String scheme = uri.getScheme();
                    if (scheme != null && (scheme.equalsIgnoreCase("whatsapp") ||
                                           scheme.equalsIgnoreCase("intent") ||
                                           scheme.equalsIgnoreCase("tel") ||
                                           scheme.equalsIgnoreCase("mailto"))) {
                        try {
                            Intent intent = Intent.parseUri(uri.toString(), Intent.URI_INTENT_SCHEME);
                            startActivity(intent);
                            return true;
                        } catch (Exception e) {
                            Log.w(TAG, "Cannot handle external scheme: " + scheme, e);
                            return true;
                        }
                    }
                }
                return false;
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri url = request.getUrl();
                if (url != null && url.getHost() != null && url.getHost().equals("appassets.androidplatform.net")) {
                    String path = url.getPath();
                    if (path != null && path.toLowerCase().endsWith(".mp4")) {
                        WebResourceResponse rangeResp = handleAssetVideoRange(request, url);
                        if (rangeResp != null) return rangeResp;
                    }
                    return assetLoader.shouldInterceptRequest(url);
                }
                return null;
            }

            @Override
            @SuppressWarnings("deprecation")
            public WebResourceResponse shouldInterceptRequest(WebView view, String urlString) {
                Uri url = Uri.parse(urlString);
                if (url != null && url.getHost() != null && url.getHost().equals("appassets.androidplatform.net")) {
                    return assetLoader.shouldInterceptRequest(url);
                }
                return null;
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                if (request != null && request.isForMainFrame()) {
                    Log.w(TAG, "Online load failed, falling back to local assets: " + OFFLINE_FALLBACK_URL);
                    view.loadUrl(OFFLINE_FALLBACK_URL);
                }
            }

            @Override
            @SuppressWarnings("deprecation")
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                if (failingUrl != null && failingUrl.startsWith(ONLINE_URL)) {
                    Log.w(TAG, "Online load failed (legacy), falling back to local assets: " + OFFLINE_FALLBACK_URL);
                    view.loadUrl(OFFLINE_FALLBACK_URL);
                }
            }
        });

        // WebChromeClient for capturing console logs
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage cm) {
                Log.d("NatureMomentsJS", cm.message() + " -- Line " + cm.lineNumber() + " of " + cm.sourceId());
                return true;
            }
        });

        webView.addJavascriptInterface(new WebAppInterface(this), "AndroidBridge");
        webView.setBackgroundColor(android.graphics.Color.parseColor("#03081a"));

        // Network-aware smart loading: If online, load live website so all uploaded reels appear instantly!
        // If offline or on error, automatically use bundled local assets.
        if (isNetworkAvailable()) {
            Log.d(TAG, "Network is active, loading live Vercel web app: " + ONLINE_URL);
            webView.loadUrl(ONLINE_URL);
        } else {
            Log.d(TAG, "Network unavailable, loading instant bundled assets: " + OFFLINE_FALLBACK_URL);
            webView.loadUrl(OFFLINE_FALLBACK_URL);
        }
    }

    private boolean isNetworkAvailable() {
        try {
            ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
            if (cm != null) {
                NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
                return activeNetwork != null && activeNetwork.isConnected();
            }
        } catch (Exception e) {
            Log.w(TAG, "Error checking network connectivity", e);
        }
        return false;
    }

    private WebResourceResponse handleAssetVideoRange(WebResourceRequest request, Uri url) {
        try {
            String path = url.getPath();
            if (path == null) return null;
            String assetPath = path;
            if (assetPath.startsWith("/assets/")) {
                assetPath = assetPath.substring("/assets/".length());
            }

            android.content.res.AssetFileDescriptor afd = null;
            try {
                afd = getAssets().openFd(assetPath);
            } catch (Exception e1) {
                if (!assetPath.startsWith("assets/")) {
                    try {
                        afd = getAssets().openFd("assets/" + assetPath);
                    } catch (Exception e2) {
                        return null;
                    }
                } else {
                    return null;
                }
            }

            if (afd == null) return null;

            long fileLength = afd.getLength();
            java.io.FileInputStream fis = afd.createInputStream();

            Map<String, String> requestHeaders = request.getRequestHeaders();
            String rangeHeader = requestHeaders != null ? requestHeaders.get("Range") : null;
            if (rangeHeader == null && requestHeaders != null) {
                rangeHeader = requestHeaders.get("range");
            }

            if (rangeHeader != null && rangeHeader.startsWith("bytes=")) {
                String rangeValue = rangeHeader.substring(6);
                String[] parts = rangeValue.split("-");
                long start = Long.parseLong(parts[0]);
                long end = (parts.length > 1 && !parts[1].trim().isEmpty()) ? Long.parseLong(parts[1].trim()) : fileLength - 1;
                if (end >= fileLength) end = fileLength - 1;
                long rangeLength = end - start + 1;

                if (start > 0) {
                    fis.skip(start);
                }

                Map<String, String> responseHeaders = new HashMap<>();
                responseHeaders.put("Content-Type", "video/mp4");
                responseHeaders.put("Content-Range", "bytes " + start + "-" + end + "/" + fileLength);
                responseHeaders.put("Content-Length", String.valueOf(rangeLength));
                responseHeaders.put("Accept-Ranges", "bytes");
                responseHeaders.put("Access-Control-Allow-Origin", "*");

                return new WebResourceResponse("video/mp4", "UTF-8", 206, "Partial Content", responseHeaders, fis);
            } else {
                Map<String, String> responseHeaders = new HashMap<>();
                responseHeaders.put("Content-Type", "video/mp4");
                responseHeaders.put("Content-Length", String.valueOf(fileLength));
                responseHeaders.put("Accept-Ranges", "bytes");
                responseHeaders.put("Access-Control-Allow-Origin", "*");

                return new WebResourceResponse("video/mp4", "UTF-8", 200, "OK", responseHeaders, fis);
            }
        } catch (Exception e) {
            Log.w(TAG, "Error handling asset video range: " + url, e);
            return null;
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            if (webView != null) {
                webView.onResume();
                webView.resumeTimers();
            }
        } else {
            if (webView != null) {
                webView.evaluateJavascript("if (typeof window.pauseAllMedia === 'function') { window.pauseAllMedia(); }", null);
                webView.onPause();
                webView.pauseTimers();
            }
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null) {
            webView.evaluateJavascript(
                "(function() { " +
                "  if (typeof window.handleAndroidBack === 'function') { " +
                "    return window.handleAndroidBack(); " +
                "  } " +
                "  if (typeof window.showExitConfirm === 'function') { " +
                "    return window.showExitConfirm(); " +
                "  } " +
                "  return false; " +
                "})();",
                value -> {
                    if ("false".equals(value) || "\"false\"".equals(value) || "null".equals(value)) {
                        if (webView.canGoBack()) {
                            webView.goBack();
                        } else {
                            finishAffinity();
                        }
                    }
                }
            );
        } else {
            super.onBackPressed();
        }
    }

    // =========================================================================
    // GOOGLE ADMOB INTEGRATION (Automatic Production + Immediate Test Fallback)
    // =========================================================================

    private void setupBannerAd() {
        runOnUiThread(() -> {
            try {
                if (adContainer == null) return;
                adContainer.removeAllViews();
                if (adView != null) {
                    adView.destroy();
                    adView = null;
                }

                adView = new AdView(this);
                adView.setId(View.generateViewId());
                adView.setAdSize(AdSize.BANNER);
                final String unitId = isBannerUsingTestId ? TEST_BANNER_ID : ADMOB_BANNER_ID;
                adView.setAdUnitId(unitId);

                FrameLayout.LayoutParams adParams = new FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.WRAP_CONTENT,
                    FrameLayout.LayoutParams.WRAP_CONTENT,
                    Gravity.CENTER
                );
                adView.setLayoutParams(adParams);
                adContainer.addView(adView);

                adView.setAdListener(new AdListener() {
                    @Override
                    public void onAdLoaded() {
                        Log.d(TAG, "AdMob Banner loaded successfully! Unit: " + unitId);
                        isBannerLoaded = true;
                        runOnUiThread(() -> updateBannerVisibility());
                    }

                    @Override
                    public void onAdFailedToLoad(LoadAdError error) {
                        Log.w(TAG, "Banner Ad failed with ID " + unitId + " (Code: " + error.getCode() + ", Msg: " + error.getMessage() + ")");
                        isBannerLoaded = false;
                        runOnUiThread(() -> updateBannerVisibility());

                        // If real ID fails (account not approved or in review), automatically fallback to official Google Test Banner
                        if (!isBannerUsingTestId) {
                            isBannerUsingTestId = true;
                            Log.d(TAG, "Real banner unit not serving yet. Switching automatically to Google Test Banner: " + TEST_BANNER_ID);
                            setupBannerAd();
                        }
                    }
                });

                AdRequest request = new AdRequest.Builder().build();
                adView.loadAd(request);
            } catch (Exception e) {
                Log.e(TAG, "Error in setupBannerAd", e);
            }
        });
    }

    private void updateBannerVisibility() {
        if (adContainer != null) {
            boolean shouldShow = isBannerLoaded && isBannerEnabledByJs;
            adContainer.setVisibility(shouldShow ? View.VISIBLE : View.GONE);
        }
    }

    private void loadInterstitialAd(boolean useFallbackTest) {
        if (isInterstitialLoading) return;
        isInterstitialLoading = true;

        final String unitId = useFallbackTest ? TEST_INTERSTITIAL_ID : ADMOB_INTERSTITIAL_ID;
        AdRequest adRequest = new AdRequest.Builder().build();

        InterstitialAd.load(this, unitId, adRequest, new InterstitialAdLoadCallback() {
            @Override
            public void onAdLoaded(InterstitialAd interstitialAd) {
                mInterstitialAd = interstitialAd;
                isInterstitialLoading = false;
                Log.d(TAG, "AdMob Interstitial Ad loaded successfully (" + unitId + ")");

                mInterstitialAd.setFullScreenContentCallback(new FullScreenContentCallback() {
                    @Override
                    public void onAdDismissedFullScreenContent() {
                        mInterstitialAd = null;
                        lastInterstitialShownTime = System.currentTimeMillis();
                        if (webView != null) {
                            webView.evaluateJavascript("if (window.natureAppInstance && window.natureAppInstance.reelsFeed) { window.natureAppInstance.reelsFeed.resumeActive(); }", null);
                        }
                        loadInterstitialAd(false); // Preload next ad
                    }

                    @Override
                    public void onAdFailedToShowFullScreenContent(AdError adError) {
                        mInterstitialAd = null;
                        loadInterstitialAd(false);
                    }

                    @Override
                    public void onAdShowedFullScreenContent() {
                        if (webView != null) {
                            webView.evaluateJavascript("if (typeof window.pauseAllMedia === 'function') { window.pauseAllMedia(); }", null);
                        }
                    }
                });

                // If user tapped a card or triggered an ad while loading, show immediately
                if (pendingInterstitialTrigger != null) {
                    String reason = pendingInterstitialTrigger;
                    pendingInterstitialTrigger = null;
                    triggerInterstitialAd(reason);
                }
            }

            @Override
            public void onAdFailedToLoad(LoadAdError loadAdError) {
                isInterstitialLoading = false;
                Log.w(TAG, "Interstitial failed to load (" + unitId + "): " + loadAdError.getMessage());
                // If real ID fails during testing/review, retry with official Google Test Interstitial
                if (!useFallbackTest) {
                    Log.d(TAG, "Real interstitial not serving yet. Retrying with official Google Test Interstitial unit...");
                    runOnUiThread(() -> loadInterstitialAd(true));
                }
            }
        });
    }

    public void triggerInterstitialAd(String triggerReason) {
        runOnUiThread(() -> {
            long now = System.currentTimeMillis();
            if (now - lastInterstitialShownTime < INTERSTITIAL_MIN_INTERVAL_MS) {
                Log.d(TAG, "Interstitial skipped: cooldown active (" + triggerReason + ")");
                return;
            }

            if (mInterstitialAd != null) {
                Log.d(TAG, "Showing Interstitial Ad: " + triggerReason);
                mInterstitialAd.show(MainActivity.this);
            } else {
                Log.d(TAG, "Interstitial not ready yet, queuing trigger and preloading: " + triggerReason);
                pendingInterstitialTrigger = triggerReason;
                if (!isInterstitialLoading) {
                    loadInterstitialAd(false);
                }
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (adView != null) adView.resume();
        if (webView != null) {
            webView.onResume();
            webView.resumeTimers();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (adView != null) adView.pause();
        if (webView != null) {
            webView.evaluateJavascript("if (typeof window.pauseAllMedia === 'function') { window.pauseAllMedia(); }", null);
            webView.onPause();
            webView.pauseTimers();
        }
    }

    @Override
    protected void onStop() {
        super.onStop();
        if (webView != null) {
            webView.evaluateJavascript("if (typeof window.pauseAllMedia === 'function') { window.pauseAllMedia(); }", null);
            webView.onPause();
            webView.pauseTimers();
        }
    }

    @Override
    protected void onDestroy() {
        if (adView != null) {
            adView.destroy();
        }
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }
}
