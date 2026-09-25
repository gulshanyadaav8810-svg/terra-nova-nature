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
import android.widget.ImageView;
import android.widget.TextView;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;

import androidx.webkit.WebViewAssetLoader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.RandomAccessFile;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import android.media.MediaScannerConnection;

import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.LoadAdError;

public class MainActivity extends Activity {
    private static final String TAG = "NatureMomentsApp";
    public static final String ONLINE_URL = "https://nature-moments-app.vercel.app";
    public static final String OFFLINE_FALLBACK_URL = "https://appassets.androidplatform.net/assets/index.html";

    // Production AdMob Banner ID (Provided by user - will automatically show live banner ad once approved)
    public static final String ADMOB_BANNER_ID = "ca-app-pub-3199277482182252/9402582339";

    // Google Official Sample Test Banner ID (Automatic immediate fallback before Play Store review approval)
    public static final String TEST_BANNER_ID = "ca-app-pub-3940256099942544/6300978111";

    private FrameLayout rootContainer;
    private FrameLayout splashOverlay;
    private LinearLayout rootLayout;
    private WebView webView;
    private FrameLayout adContainer;
    private AdView adView;
    private boolean isBannerUsingTestId = false;
    private boolean isBannerLoaded = false;
    private boolean isBannerEnabledByJs = true;

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
            // Disabled: video interstitial ads removed per user request, only bottom banner ad active
        }

        @JavascriptInterface
        public void setBannerVisibility(boolean visible) {
            isBannerEnabledByJs = visible;
            runOnUiThread(() -> updateBannerVisibility());
        }

        @JavascriptInterface
        public void hideNativeSplash() {
            mActivity.runOnUiThread(() -> dismissNativeSplash());
        }

        @JavascriptInterface
        public void precacheVideoUrl(String videoUrl) {
            // Native Chromium C++ network stack handles media buffering automatically with zero bandwidth choking
        }
    }

    private boolean splashDismissed = false;

    public void dismissNativeSplash() {
        if (splashDismissed) return;
        splashDismissed = true;
        if (splashOverlay != null && splashOverlay.getVisibility() == View.VISIBLE) {
            splashOverlay.animate()
                .alpha(0f)
                .scaleX(1.05f)
                .scaleY(1.05f)
                .setDuration(400)
                .withEndAction(() -> {
                    splashOverlay.setVisibility(View.GONE);
                    if (rootContainer != null) {
                        rootContainer.removeView(splashOverlay);
                    }
                })
                .start();
        }
    }

    public static String getCacheFilenameForUrl(String videoUrl) {
        if (videoUrl == null || videoUrl.isEmpty()) return null;
        if (videoUrl.contains("/uploads/")) {
            String sub = videoUrl.substring(videoUrl.lastIndexOf('/') + 1);
            if (sub.contains("?")) sub = sub.substring(0, sub.indexOf('?'));
            return sub;
        } else if (videoUrl.contains("/api/stream") && videoUrl.contains("file=")) {
            Uri uri = Uri.parse(videoUrl);
            return uri.getQueryParameter("file");
        }
        return null;
    }

    public static WebResourceResponse createRangeResponse(File file, String mime, String rangeHeader) {
        try {
            long fileLength = file.length();
            if (fileLength == 0) return null;

            if (rangeHeader != null && rangeHeader.startsWith("bytes=")) {
                String rangeVal = rangeHeader.substring(6).trim();
                long start = 0;
                long end = fileLength - 1;

                int dashPos = rangeVal.indexOf('-');
                if (dashPos != -1) {
                    String startStr = rangeVal.substring(0, dashPos).trim();
                    String endStr = rangeVal.substring(dashPos + 1).trim();
                    if (!startStr.isEmpty()) {
                        start = Long.parseLong(startStr);
                    }
                    if (!endStr.isEmpty()) {
                        end = Long.parseLong(endStr);
                    }
                }

                if (start >= fileLength) {
                    Map<String, String> headers = new HashMap<>();
                    headers.put("Content-Range", "bytes */" + fileLength);
                    return new WebResourceResponse(mime, "UTF-8", 416, "Requested Range Not Satisfiable", headers, null);
                }

                end = Math.min(end, fileLength - 1);
                long contentLength = end - start + 1;

                FileInputStream fis = new FileInputStream(file);
                if (start > 0) {
                    long skipped = fis.skip(start);
                    while (skipped < start && fis.available() > 0) {
                        skipped += fis.skip(start - skipped);
                    }
                }

                InputStream is = new InputStream() {
                    private long remaining = contentLength;

                    @Override
                    public int read() throws IOException {
                        if (remaining <= 0) return -1;
                        int b = fis.read();
                        if (b == -1) {
                            remaining = 0;
                            return -1;
                        }
                        remaining--;
                        return b;
                    }

                    @Override
                    public int read(byte[] b, int off, int len) throws IOException {
                        if (remaining <= 0) return -1;
                        int toRead = (int) Math.min(len, remaining);
                        int read = fis.read(b, off, toRead);
                        if (read <= 0) {
                            remaining = 0;
                            return -1;
                        }
                        remaining -= read;
                        return read;
                    }

                    @Override
                    public void close() throws IOException {
                        fis.close();
                    }
                };

                Map<String, String> headers = new HashMap<>();
                headers.put("Access-Control-Allow-Origin", "*");
                headers.put("Accept-Ranges", "bytes");
                headers.put("Content-Range", "bytes " + start + "-" + end + "/" + fileLength);
                headers.put("Content-Length", String.valueOf(contentLength));
                headers.put("Cache-Control", "public, max-age=31536000, immutable");

                return new WebResourceResponse(mime, "UTF-8", 206, "Partial Content", headers, is);
            } else {
                FileInputStream fis = new FileInputStream(file);
                Map<String, String> headers = new HashMap<>();
                headers.put("Access-Control-Allow-Origin", "*");
                headers.put("Accept-Ranges", "bytes");
                headers.put("Content-Length", String.valueOf(fileLength));
                headers.put("Cache-Control", "public, max-age=31536000, immutable");
                return new WebResourceResponse(mime, "UTF-8", 200, "OK", headers, fis);
            }
        } catch (Exception e) {
            Log.w("NatureMomentsApp", "createRangeResponse error: " + e.getMessage());
            return null;
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Window setup - Keep system 3-button navigation bar (||| O <) & status bar visible at all times
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED, WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED);

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            Window window = getWindow();
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(android.graphics.Color.parseColor("#03081a"));
            window.setNavigationBarColor(android.graphics.Color.parseColor("#03081a"));
        }

        rootContainer = new FrameLayout(this);
        rootContainer.setLayoutParams(new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.MATCH_PARENT
        ));

        rootLayout = new LinearLayout(this);
        rootLayout.setOrientation(LinearLayout.VERTICAL);
        rootLayout.setLayoutParams(new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.MATCH_PARENT
        ));
        rootLayout.setBackgroundColor(Color.parseColor("#03081a"));

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
        adContainer.setBackgroundColor(Color.parseColor("#03081a"));
        adContainer.setVisibility(View.GONE);
        rootLayout.addView(adContainer);

        rootContainer.addView(rootLayout);

        // Instant Native Splash Overlay with Background, Logo AND Tagline:
        // Direct 0ms display of the signature splash - Zero double-screen flash!
        splashOverlay = new FrameLayout(this);
        splashOverlay.setLayoutParams(new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.MATCH_PARENT
        ));
        splashOverlay.setBackgroundColor(Color.parseColor("#03081a"));

        // 1. Starry Night Background
        ImageView splashBg = new ImageView(this);
        splashBg.setLayoutParams(new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.MATCH_PARENT
        ));
        splashBg.setScaleType(ImageView.ScaleType.CENTER_CROP);
        try {
            InputStream isBg = getAssets().open("assets/splash-bg.png");
            Bitmap bgBitmap = BitmapFactory.decodeStream(isBg);
            splashBg.setImageBitmap(bgBitmap);
            isBg.close();
        } catch (Exception e) {
            try {
                InputStream isBg2 = getAssets().open("splash-bg.png");
                Bitmap bgBitmap2 = BitmapFactory.decodeStream(isBg2);
                splashBg.setImageBitmap(bgBitmap2);
                isBg2.close();
            } catch (Exception ignored) {}
        }
        splashOverlay.addView(splashBg);

        // 2. Centered Container for Logo + Tagline
        LinearLayout centerContent = new LinearLayout(this);
        centerContent.setOrientation(LinearLayout.VERTICAL);
        centerContent.setGravity(Gravity.CENTER);
        FrameLayout.LayoutParams centerParams = new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.WRAP_CONTENT,
            FrameLayout.LayoutParams.WRAP_CONTENT
        );
        centerParams.gravity = Gravity.CENTER;
        centerContent.setLayoutParams(centerParams);

        // Logo (136dp)
        ImageView splashLogo = new ImageView(this);
        int logoSize = (int) (136 * getResources().getDisplayMetrics().density);
        LinearLayout.LayoutParams logoParams = new LinearLayout.LayoutParams(logoSize, logoSize);
        logoParams.gravity = Gravity.CENTER_HORIZONTAL;
        splashLogo.setLayoutParams(logoParams);
        try {
            InputStream isLogo = getAssets().open("assets/logo.png");
            Bitmap logoBitmap = BitmapFactory.decodeStream(isLogo);
            splashLogo.setImageBitmap(logoBitmap);
            isLogo.close();
        } catch (Exception e) {
            Log.e(TAG, "Failed to load splash logo from assets", e);
        }
        centerContent.addView(splashLogo);

        // Tagline ("Nature View Only For Nature")
        TextView splashTagline = new TextView(this);
        LinearLayout.LayoutParams taglineParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        taglineParams.gravity = Gravity.CENTER_HORIZONTAL;
        taglineParams.topMargin = (int) (22 * getResources().getDisplayMetrics().density);
        splashTagline.setLayoutParams(taglineParams);
        splashTagline.setText("Nature View Only For Nature");
        splashTagline.setTextColor(Color.WHITE);
        splashTagline.setTextSize(android.util.TypedValue.COMPLEX_UNIT_SP, 16);
        splashTagline.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        splashTagline.setLetterSpacing(0.08f);
        splashTagline.setGravity(Gravity.CENTER);
        splashTagline.setShadowLayer(14, 0, 2, Color.parseColor("#38BDF8"));
        centerContent.addView(splashTagline);

        splashOverlay.addView(centerContent);
        splashOverlay.setOnClickListener(v -> dismissNativeSplash());

        rootContainer.addView(splashOverlay);

        setContentView(rootContainer);

        // Branded, polished opening: smoothly reveal Home screen after 1600ms
        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            dismissNativeSplash();
        }, 1600);

        // Initialize Google Mobile Ads SDK for Banner Ad only
        MobileAds.initialize(this, initializationStatus -> {
            Log.d(TAG, "Google Mobile Ads SDK Initialized");
            runOnUiThread(() -> setupBannerAd());
        });

        // Clean up any stale partial video cache files to ensure pure clean direct playback
        try {
            File cacheDir = new File(getCacheDir(), "video_cache");
            if (cacheDir.exists()) {
                File[] files = cacheDir.listFiles();
                if (files != null) {
                    for (File f : files) {
                        f.delete();
                    }
                }
            }
        } catch (Exception ignored) {}

        // WebSettings configuration for 60/120 FPS high performance
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
        settings.setRenderPriority(WebSettings.RenderPriority.HIGH);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.setVerticalScrollBarEnabled(false);
        webView.setHorizontalScrollBarEnabled(false);

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
                if (request != null && request.getUrl() != null) {
                    Uri url = request.getUrl();
                    String host = url.getHost();
                    if (host != null && host.equals("appassets.androidplatform.net")) {
                        return assetLoader.shouldInterceptRequest(url);
                    }

                    // 100% 0ms Instant Playback & Persistent Disk Cache:
                    String filename = getCacheFilenameForUrl(url.toString());

                    if (filename != null && !filename.isEmpty()) {
                        // 1. Check bundled APK assets (0ms instant)
                        try {
                            InputStream is = getAssets().open("uploads/" + filename);
                            is.close();
                            Uri localAssetUri = Uri.parse("https://appassets.androidplatform.net/assets/uploads/" + filename);
                            return assetLoader.shouldInterceptRequest(localAssetUri);
                        } catch (Exception ignored) {}

                        // 2. Check local disk cache (100% instant local playback with seekable 206 Partial Content)
                        try {
                            File cacheDir = new File(getCacheDir(), "video_cache");
                            File cachedFile = new File(cacheDir, filename);
                            if (cachedFile.exists() && cachedFile.length() > 0) {
                                String mime = (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) ? "image/jpeg" : "video/mp4";
                                String rangeHeader = (request.getRequestHeaders() != null) ? request.getRequestHeaders().get("Range") : null;
                                return createRangeResponse(cachedFile, mime, rangeHeader);
                            }
                        } catch (Exception e) {
                            Log.w(TAG, "Disk cache read error: " + e.getMessage());
                        }
                    }
                }
                return null;
            }

            @Override
            @SuppressWarnings("deprecation")
            public WebResourceResponse shouldInterceptRequest(WebView view, String urlString) {
                if (urlString != null) {
                    Uri url = Uri.parse(urlString);
                    String host = url.getHost();
                    if (host != null && host.equals("appassets.androidplatform.net")) {
                        return assetLoader.shouldInterceptRequest(url);
                    }

                    String filename = getCacheFilenameForUrl(urlString);

                    if (filename != null && !filename.isEmpty()) {
                        try {
                            InputStream is = getAssets().open("uploads/" + filename);
                            is.close();
                            Uri localAssetUri = Uri.parse("https://appassets.androidplatform.net/assets/uploads/" + filename);
                            return assetLoader.shouldInterceptRequest(localAssetUri);
                        } catch (Exception ignored) {}

                        try {
                            File cacheDir = new File(getCacheDir(), "video_cache");
                            File cachedFile = new File(cacheDir, filename);
                            if (cachedFile.exists() && cachedFile.length() > 0) {
                                String mime = (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) ? "image/jpeg" : "video/mp4";
                                return createRangeResponse(cachedFile, mime, null);
                            }
                        } catch (Exception ignored) {}
                    }
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

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                Log.d(TAG, "WebView page finished loading: " + url);
            }
        });

        // WebChromeClient for capturing console logs & permanently eliminating default play icon
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage cm) {
                Log.d("NatureMomentsJS", cm.message() + " -- Line " + cm.lineNumber() + " of " + cm.sourceId());
                return true;
            }

            @Override
            public Bitmap getDefaultVideoPoster() {
                // Permanently suppress Android's default huge circle play button icon on HTML5 videos!
                return Bitmap.createBitmap(1, 1, Bitmap.Config.ARGB_8888);
            }
        });

        webView.addJavascriptInterface(new WebAppInterface(this), "AndroidBridge");
        webView.setBackgroundColor(android.graphics.Color.parseColor("#03081a"));

        // High-Performance 60/120 FPS loading: Always load local bundled assets directly for 0ms latency.
        // Remote reels & uploads are synced automatically in the background via IndexedDB/localStorage!
        Log.d(TAG, "Loading local APK assets for 60 FPS fluid performance: " + OFFLINE_FALLBACK_URL);
        webView.loadUrl(OFFLINE_FALLBACK_URL);
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
