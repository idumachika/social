package com.tlikes;


 import android.graphics.Bitmap;
 import android.graphics.drawable.BitmapDrawable;
 import android.widget.LinearLayout;
 import android.graphics.Color;
 import android.graphics.drawable.Drawable;
 import android.widget.ImageView;
 import android.view.Gravity;
 import android.view.Window;
 import android.view.WindowManager;
 import android.os.Build;
 import android.os.Bundle;
 import android.support.annotation.Nullable;
 import android.content.Intent;

 import com.google.firebase.FirebaseApp;
 import com.reactnativenavigation.NavigationActivity;


 public class MainActivity extends NavigationActivity {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        FirebaseApp.initializeApp(this);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            Window window = getWindow();
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(Color.parseColor("#3c0e65"));
        }
        LinearLayout view = new LinearLayout(this);
        ImageView icon = new ImageView(this);
        view.setBackgroundColor(Color.parseColor("#FFFFFF"));
        view.setGravity(Gravity.CENTER);
        int iconResource = getResources().getIdentifier("@drawable/logo", null, getPackageName());
        Drawable res = getResources().getDrawable(iconResource);
        Bitmap bitmap = ((BitmapDrawable) res).getBitmap();
        Drawable d = new BitmapDrawable(getResources(), Bitmap.createScaledBitmap(bitmap, 200, 200, true));
        icon.setImageDrawable(d);
        view.addView(icon);
        setContentView(view);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }


 }
