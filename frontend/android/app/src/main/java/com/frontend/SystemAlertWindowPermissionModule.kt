package com.frontend

import android.app.Activity
import android.provider.Settings
import android.content.Context
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class SystemAlertWindowPermissionModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "SystemAlertWindowPermission"
    }

    @ReactMethod
    fun check(promise: Promise) {
        val activity: Activity? = currentActivity
        if (activity == null) {
            promise.reject("ACTIVITY_NULL", "Activity is null")
            return
        }

        val context: Context = activity.applicationContext
        val isGranted: Boolean = Settings.canDrawOverlays(context)
        promise.resolve(isGranted)
    }
}
