import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.e97eebde93004fb3983906c038272d00',
  appName: 'timeweaver-themes',
  webDir: 'dist',
  server: {
    url: "https://e97eebde-9300-4fb3-9839-06c038272d00.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav"
    }
  }
};

export default config;