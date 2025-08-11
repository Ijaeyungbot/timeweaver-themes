import { LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';
import { Alarm } from '@/components/AlarmApp';

export class AlarmService {
  private static instance: AlarmService;
  
  static getInstance(): AlarmService {
    if (!AlarmService.instance) {
      AlarmService.instance = new AlarmService();
    }
    return AlarmService.instance;
  }

  async initializeService(): Promise<void> {
    try {
      // Request notification permissions
      const permissionResult = await LocalNotifications.requestPermissions();
      
      if (permissionResult.display === 'granted') {
        console.log('Notification permissions granted');
      } else {
        console.warn('Notification permissions denied');
      }

      // Listen for notification actions
      LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
        console.log('Notification action performed:', notification);
        
        if (notification.actionId === 'snooze') {
          this.snoozeAlarm(notification.notification.id.toString());
        } else if (notification.actionId === 'dismiss') {
          this.dismissAlarm(notification.notification.id.toString());
        }
      });

    } catch (error) {
      console.error('Error initializing alarm service:', error);
    }
  }

  async scheduleAlarm(alarm: Alarm): Promise<void> {
    try {
      // Cancel existing alarm if it exists
      await this.cancelAlarm(alarm.id);

      if (!alarm.enabled) {
        return;
      }

      const notifications = this.createNotificationsForAlarm(alarm);
      
      if (notifications.length > 0) {
        await LocalNotifications.schedule({
          notifications: notifications
        });
      }

      console.log(`Scheduled alarm: ${alarm.title} for ${alarm.time}`);
    } catch (error) {
      console.error('Error scheduling alarm:', error);
    }
  }

  async cancelAlarm(alarmId: string): Promise<void> {
    try {
      // Get all pending notifications
      const pending = await LocalNotifications.getPending();
      
      // Find notifications for this alarm
      const alarmNotifications = pending.notifications.filter(
        notification => notification.extra?.alarmId === alarmId
      );

      if (alarmNotifications.length > 0) {
        const ids = alarmNotifications.map(n => n.id);
        await LocalNotifications.cancel({ notifications: ids.map(id => ({ id })) });
        console.log(`Cancelled alarm notifications for alarm: ${alarmId}`);
      }
    } catch (error) {
      console.error('Error cancelling alarm:', error);
    }
  }

  async cancelAllAlarms(): Promise<void> {
    try {
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        const ids = pending.notifications.map(n => ({ id: n.id }));
        await LocalNotifications.cancel({ notifications: ids });
      }
      console.log('All alarms cancelled');
    } catch (error) {
      console.error('Error cancelling all alarms:', error);
    }
  }

  private createNotificationsForAlarm(alarm: Alarm): LocalNotificationSchema[] {
    const notifications: LocalNotificationSchema[] = [];
    const [hours, minutes] = alarm.time.split(':').map(Number);

    if (alarm.days.length === 0) {
      // One-time alarm
      const alarmDate = new Date();
      alarmDate.setHours(hours, minutes, 0, 0);
      
      // If the time has passed today, schedule for tomorrow
      if (alarmDate.getTime() <= Date.now()) {
        alarmDate.setDate(alarmDate.getDate() + 1);
      }

      notifications.push(this.createNotification(alarm, alarmDate));
    } else {
      // Recurring alarm
      const today = new Date();
      const dayMap = {
        'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3,
        'Thu': 4, 'Fri': 5, 'Sat': 6
      };

      for (const day of alarm.days) {
        const targetDay = dayMap[day as keyof typeof dayMap];
        const alarmDate = new Date();
        
        // Calculate days until the target day
        const currentDay = today.getDay();
        let daysUntilTarget = targetDay - currentDay;
        
        if (daysUntilTarget < 0) {
          daysUntilTarget += 7; // Next week
        } else if (daysUntilTarget === 0) {
          // Today - check if time has passed
          const todayAlarmTime = new Date();
          todayAlarmTime.setHours(hours, minutes, 0, 0);
          
          if (todayAlarmTime.getTime() <= Date.now()) {
            daysUntilTarget = 7; // Next week
          }
        }

        alarmDate.setDate(today.getDate() + daysUntilTarget);
        alarmDate.setHours(hours, minutes, 0, 0);

        notifications.push(this.createNotification(alarm, alarmDate, true));
      }
    }

    return notifications;
  }

  private createNotification(alarm: Alarm, date: Date, recurring = false): LocalNotificationSchema {
    const notificationId = parseInt(alarm.id) + (recurring ? date.getDay() * 1000000 : 0);

    return {
      id: notificationId,
      title: alarm.title,
      body: `زمان زنگ: ${alarm.time}`,
      schedule: {
        at: date,
        repeats: recurring,
        every: recurring ? 'week' : undefined
      },
      sound: this.getSoundFile(alarm.ringtone),
      attachments: undefined,
      actionTypeId: 'ALARM_ACTIONS',
      extra: {
        alarmId: alarm.id,
        volume: alarm.volume,
        vibration: alarm.vibration,
        snooze: alarm.snooze
      }
    };
  }

  private getSoundFile(ringtone: string): string | undefined {
    const soundMap: { [key: string]: string } = {
      'default': 'beep.wav',
      'gentle': 'gentle.wav',
      'energetic': 'energetic.wav',
      'classic': 'classic.wav'
    };
    
    return soundMap[ringtone];
  }

  private async snoozeAlarm(alarmId: string): Promise<void> {
    try {
      // Get alarm details from localStorage
      const stored = localStorage.getItem('alarms');
      if (!stored) return;

      const alarms: Alarm[] = JSON.parse(stored);
      const alarm = alarms.find(a => a.id === alarmId);
      
      if (!alarm) return;

      // Schedule snooze notification
      const snoozeDate = new Date();
      snoozeDate.setMinutes(snoozeDate.getMinutes() + alarm.snooze);

      const snoozeNotification: LocalNotificationSchema = {
        id: parseInt(alarmId) + 999999, // Unique ID for snooze
        title: `${alarm.title} (تعویق)`,
        body: `زنگ بعد از ${alarm.snooze} دقیقه`,
        schedule: { at: snoozeDate },
        sound: this.getSoundFile(alarm.ringtone),
        actionTypeId: 'ALARM_ACTIONS',
        extra: {
          alarmId: alarm.id,
          volume: alarm.volume,
          vibration: alarm.vibration,
          snooze: alarm.snooze
        }
      };

      await LocalNotifications.schedule({
        notifications: [snoozeNotification]
      });

      console.log(`Snoozed alarm ${alarmId} for ${alarm.snooze} minutes`);
    } catch (error) {
      console.error('Error snoozing alarm:', error);
    }
  }

  private async dismissAlarm(alarmId: string): Promise<void> {
    try {
      console.log(`Dismissed alarm: ${alarmId}`);
      // Just log the dismissal - the notification is already gone
    } catch (error) {
      console.error('Error dismissing alarm:', error);
    }
  }

  async registerNotificationActions(): Promise<void> {
    try {
      await LocalNotifications.registerActionTypes({
        types: [
          {
            id: 'ALARM_ACTIONS',
            actions: [
              {
                id: 'snooze',
                title: 'تعویق',
                requiresAuthentication: false,
                foreground: false,
                destructive: false
              },
              {
                id: 'dismiss',
                title: 'خاموش',
                requiresAuthentication: false,
                foreground: false,
                destructive: true
              }
            ]
          }
        ]
      });
    } catch (error) {
      console.error('Error registering notification actions:', error);
    }
  }
}

export const alarmService = AlarmService.getInstance();