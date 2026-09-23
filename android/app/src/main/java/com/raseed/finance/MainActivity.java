package com.raseed.finance;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.ValueCallback;
import android.widget.Toast;

import java.io.OutputStream;

public class MainActivity extends Activity {
    private static final int REQUEST_CREATE_FILE = 401;
    private static final int REQUEST_PICK_BACKUP = 402;
    private WebView webView;
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
        setContentView(webView);
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
