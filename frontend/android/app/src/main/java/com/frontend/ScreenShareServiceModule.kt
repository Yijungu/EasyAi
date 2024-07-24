package com.frontend

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ScreenShareServiceModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "ScreenShareService"
    }

    @ReactMethod
    fun start() {
        val intent = Intent(reactApplicationContext, ScreenShareService::class.java)
        reactApplicationContext.startService(intent)
    }

    @ReactMethod
    fun stop() {
        val intent = Intent(reactApplicationContext, ScreenShareService::class.java)
        reactApplicationContext.stopService(intent)
    }
}
