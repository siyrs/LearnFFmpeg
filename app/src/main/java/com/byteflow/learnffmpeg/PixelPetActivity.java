package com.byteflow.learnffmpeg;

import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class PixelPetActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_pixel_pet);

        WebView webView = findViewById(R.id.webview);
        WebSettings webSettings = webView.getSettings();

        // Enable JavaScript for the HTML5 game
        webSettings.setJavaScriptEnabled(true);

        // Improve performance and look
        webSettings.setDomStorageEnabled(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);

        // Prevent opening links in external browser
        webView.setWebViewClient(new WebViewClient());

        // Load the local HTML file
        webView.loadUrl("file:///android_asset/pixel_pet_game/index.html");
    }
}
