package com.byteflow.learnffmpeg;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

public class PixelPetActivity extends AppCompatActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_pixel_pet);

        WebView webView = findViewById(R.id.webview);
        WebSettings webSettings = webView.getSettings();

        // Enable JavaScript for the game
        webSettings.setJavaScriptEnabled(true);

        // Prevent opening links in external browser
        webView.setWebViewClient(new WebViewClient());

        // Load the HTML5 game from assets
        webView.loadUrl("file:///android_asset/pixel_pet_game/index.html");
    }
}
