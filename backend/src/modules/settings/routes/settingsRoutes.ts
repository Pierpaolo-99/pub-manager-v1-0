import { Router } from 'express';
import { SettingsController, PubProfileController, BackupLogController, NotificationSettingController } from '../controllers/settingsController';
import { validateBody, updateSettingsBatchSchema, updatePubProfileSchema, updateNotificationSettingsSchema } from '../validators/settingsValidator';

const router = Router();

// Settings
router.get('/settings', SettingsController.getSettings);
router.put('/settings', validateBody(updateSettingsBatchSchema), SettingsController.updateSettings);

// Pub Profile
router.get('/pub-profile', PubProfileController.getPubProfile);
router.put('/pub-profile', validateBody(updatePubProfileSchema), PubProfileController.updatePubProfile);

// Backup Logs
router.get('/backup-logs', BackupLogController.getBackupLogs);
router.post('/backup', BackupLogController.createBackup);

// Notification Settings
 router.get('/notification-settings', NotificationSettingController.getNotificationSettings);
 router.put('/notification-settings', validateBody(updateNotificationSettingsSchema), NotificationSettingController.updateNotificationSettings);

export default router;
