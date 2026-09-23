package com.raseed.finance;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintJob;
import android.print.PrintManager;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.ValueCallback;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.Toast;

import java.io.OutputStream;

public class MainActivity extends Activity {
    private static final int REQUEST_CREATE_FILE = 401;
    private static final int REQUEST_PICK_BACKUP = 402;
    private WebView webView;
    private WebView printWebView;
    private FrameLayout rootLayout;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private ValueCallback<Uri[]> uploadMessage;
    private String pendingFilename;
    private String pendingMimeType;
    private String pendingBase64;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(Color.rgb(17, 18, 22));
        getWindow().setNavigationBarColor(Color.rgb(17, 18, 22));

        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(17, 18, 22));
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        webView.setWebViewClient(new WebViewClient());
        webView.addJavascriptInterface(new RaseedBridge(), "RaseedAndroid");
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
                if (uploadMessage != null) uploadMessage.onReceiveValue(null);
                uploadMessage = filePathCallback;
                Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("application/json");
                try {
                    startActivityForResult(Intent.createChooser(intent, "اختر نسخة رصيد الاحتياطية"), REQUEST_PICK_BACKUP);
                } catch (Exception error) {
                    uploadMessage = null;
                    Toast.makeText(MainActivity.this, "تعذر فتح ملفات الجهاز", Toast.LENGTH_SHORT).show();
                    return false;
                }
                return true;
            }
        });
        rootLayout = new FrameLayout(this);
        rootLayout.addView(webView, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT));
        setContentView(rootLayout);
        webView.loadUrl("file:///android_asset/www/index.html");
    }

    private class RaseedBridge {
        @JavascriptInterface
        public void saveFile(String filename, String mimeType, String base64) {
            pendingFilename = filename == null ? "raseed-export" : filename.replaceAll("[\\\\/:*?\"<>|]", "_");
            pendingMimeType = mimeType == null ? "application/octet-stream" : mimeType;
            pendingBase64 = base64 == null ? "" : base64;
            runOnUiThread(() -> {
                Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType(pendingMimeType);
                intent.putExtra(Intent.EXTRA_TITLE, pendingFilename);
                startActivityForResult(intent, REQUEST_CREATE_FILE);
            });
        }

        @JavascriptInterface
        public void printHtml(String html, String filename) {
            String safeTitle = filename == null ? "raseed-statement" : filename.replaceAll("[\\\\/:*?\"<>|]", "_");
            if (safeTitle.endsWith(".pdf")) safeTitle = safeTitle.substring(0, safeTitle.length() - 4);
            final String printTitle = safeTitle;
            final String document = html == null ? "" : html;
            runOnUiThread(() -> startPrint(document, printTitle));
        }
    }

    private void startPrint(String html, String title) {
        if (html.isEmpty() || rootLayout == null) {
            Toast.makeText(this, "تعذر تجهيز الكشف للطباعة", Toast.LENGTH_LONG).show();
            return;
        }
        PrintManager printManager = (PrintManager) getSystemService(PRINT_SERVICE);
        if (printManager == null) {
            Toast.makeText(this, "خدمة الطباعة غير متاحة على هذا الجهاز", Toast.LENGTH_LONG).show();
            return;
        }

        WebView documentView = new WebView(this);
        printWebView = documentView;
        documentView.setBackgroundColor(Color.WHITE);
        documentView.getSettings().setJavaScriptEnabled(false);
        documentView.setAlpha(0f);
        documentView.setClickable(false);
        documentView.setFocusable(false);
        documentView.setImportantForAccessibility(View.IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS);
        rootLayout.addView(documentView, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT));
        documentView.setWebViewClient(new WebViewClient() {
            private boolean printStarted;

            @Override
            public void onPageFinished(WebView view, String url) {
                if (printStarted || isFinishing()) return;
                printStarted = true;
                try {
                    PrintDocumentAdapter adapter = view.createPrintDocumentAdapter(title);
                    PrintAttributes attributes = new PrintAttributes.Builder()
                            .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
                            .setResolution(new PrintAttributes.Resolution("raseed-300", "300 dpi", 300, 300))
                            .setColorMode(PrintAttributes.COLOR_MODE_COLOR)
                            .setMinMargins(PrintAttributes.Margins.NO_MARGINS)
                            .build();
                    PrintJob job = printManager.print(title, adapter, attributes);
                    watchPrintJob(job, view);
                } catch (Exception error) {
                    removePrintView(view);
                    Toast.makeText(MainActivity.this, "تعذر فتح معاينة PDF", Toast.LENGTH_LONG).show();
                }
            }
        });
        documentView.loadDataWithBaseURL("file:///android_asset/www/", html, "text/html", "UTF-8", null);
    }

    private void watchPrintJob(PrintJob job, WebView view) {
        mainHandler.postDelayed(() -> {
            if (job.isCompleted() || job.isCancelled() || job.isFailed() || isFinishing()) {
                removePrintView(view);
            } else {
                watchPrintJob(job, view);
            }
        }, 1500);
    }

    private void removePrintView(WebView view) {
        if (view == null) return;
        if (rootLayout != null) rootLayout.removeView(view);
        view.stopLoading();
        view.destroy();
        if (printWebView == view) printWebView = null;
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQUEST_PICK_BACKUP) {
            if (uploadMessage != null) {
                Uri[] result = resultCode == RESULT_OK && data != null && data.getData() != null
                        ? new Uri[]{data.getData()} : null;
                uploadMessage.onReceiveValue(result);
                uploadMessage = null;
            }
        } else if (requestCode == REQUEST_CREATE_FILE && resultCode == RESULT_OK && data != null && data.getData() != null) {
            try (OutputStream output = getContentResolver().openOutputStream(data.getData())) {
                if (output == null) throw new IllegalStateException("No output stream");
                output.write(Base64.decode(pendingBase64, Base64.DEFAULT));
                Toast.makeText(this, "تم حفظ الملف في الموقع المحدد", Toast.LENGTH_LONG).show();
            } catch (Exception error) {
                Toast.makeText(this, "تعذر حفظ الملف", Toast.LENGTH_LONG).show();
            } finally {
                pendingBase64 = null;
            }
        } else if (requestCode == REQUEST_CREATE_FILE) {
            pendingBase64 = null;
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
