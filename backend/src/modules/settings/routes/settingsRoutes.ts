import { Router } from 'express';
import { SettingsController, PubProfileController, BackupLogController, NotificationSettingController } from '../controllers/settingsController';
import { validateBody, updateSettingsBatchSchema, updatePubProfileSchema, updateNotificationSettingsSchema } from '../validators/settingsValidator';
import { authorizeRoles } from '../../../middlewares/authorizeRoles';
import { Role } from '../../../generated/prisma/enums';

const router = Router();

// Settings
router.get('/settings', SettingsController.getSettings);
router.put(
	'/settings',
	authorizeRoles(Role.ADMIN, Role.MANAGER),
	validateBody(updateSettingsBatchSchema),
	SettingsController.updateSettings
);

// Pub Profile
router.get('/pub-profile', PubProfileController.getPubProfile);
router.put(
	'/pub-profile',
	authorizeRoles(Role.ADMIN, Role.MANAGER),
	validateBody(updatePubProfileSchema),
	PubProfileController.updatePubProfile
);

// Backup Logs
router.get('/backup-logs', BackupLogController.getBackupLogs);
router.post(
	'/backup',
	authorizeRoles(Role.ADMIN, Role.MANAGER),
	BackupLogController.createBackup
);

// Notification Settings
 router.get('/notification-settings', NotificationSettingController.getNotificationSettings);
 router.put('/notification-settings', validateBody(updateNotificationSettingsSchema), NotificationSettingController.updateNotificationSettings);

export default router;
