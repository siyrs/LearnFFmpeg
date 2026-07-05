package com.byteflow.learnffmpeg;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.appcompat.app.AppCompatActivity;

public class PixelPetActivity extends AppCompatActivity {

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_pixel_pet);

        webView = findViewById(R.id.webview);

        // Enable Javascript
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);

        // Force links and redirects to open in the WebView instead of in a browser
        webView.setWebViewClient(new WebViewClient());

        // Load the local HTML file
        webView.loadUrl("file:///android_asset/pixel_pet_game/index.html");
    }
}
