package app.lovable.e97eebde93004fb3983906c038272d00;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class BootReceiver extends BroadcastReceiver {
    private static final String TAG = "BootReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction()) ||
            Intent.ACTION_MY_PACKAGE_REPLACED.equals(intent.getAction()) ||
            Intent.ACTION_PACKAGE_REPLACED.equals(intent.getAction())) {
            
            Log.d(TAG, "Boot completed or package replaced - need to restore alarms");
            
            // The alarms will be automatically restored when the app is opened
            // because the useAlarms hook re-schedules all enabled alarms on initialization
        }
    }
}