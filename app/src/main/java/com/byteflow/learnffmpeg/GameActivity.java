package com.byteflow.learnffmpeg;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import androidx.appcompat.app.AppCompatActivity;

public class GameActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 创建一个 WebView 实例并设置为内容视图
        WebView webView = new WebView(this);
        setContentView(webView);

        // 配置 WebView 的一些必要设置，启用 JS 并支持文件读取
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowFileAccessFromFileURLs(true);
        webSettings.setAllowUniversalAccessFromFileURLs(true);

        // 加载 assets 目录下的 index.html
        webView.loadUrl("file:///android_asset/pixel_game/index.html");
    }
}