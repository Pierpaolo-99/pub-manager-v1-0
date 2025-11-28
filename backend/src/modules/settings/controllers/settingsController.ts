import { Request, Response } from 'express';
import { SettingsService, PubProfileService, BackupLogService, NotificationSettingService } from '../services/settingsService';

export class SettingsController {
  // GET tutte le impostazioni filtrate
  static async getSettings(req: Request, res: Response) {
    try {
      const { category, public_only, userId, role, scope } = req.query;
      const params: any = {};
      if (category) params.category = category as string;
      if (public_only) params.publicOnly = public_only === 'true';
      if (userId) params.userId = Number(userId);
      if (role) params.role = role as any;
      if (scope) params.scope = scope as any;
      const settings = await SettingsService.getSettings(params);
      res.json({ success: true, settings });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Errore nel caricamento impostazioni', details: err });
    }
  }

  // PUT aggiorna impostazioni (batch)
  static async updateSettings(req: Request, res: Response) {
    try {
      const { settings } = req.body;
      if (!Array.isArray(settings)) {
        return res.status(400).json({ success: false, error: 'Dati impostazioni non validi' });
      }
      const updated = await SettingsService.updateSettings(settings);
      res.json({ success: true, updated_count: updated.length, updated });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Errore nell\'aggiornamento impostazioni', details: err });
    }
  }
}

export class PubProfileController {
  static async getPubProfile(req: Request, res: Response) {
    try {
      const profile = await PubProfileService.getPubProfile();
      res.json({ success: true, profile });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Errore nel caricamento profilo pub', details: err });
    }
  }
  static async updatePubProfile(req: Request, res: Response) {
    try {
      const { profile } = req.body;
      if (!profile) {
        return res.status(400).json({ success: false, error: 'Dati profilo non validi' });
      }
      const updated = await PubProfileService.updatePubProfile(profile);
      res.json({ success: true, profile: updated });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Errore nell\'aggiornamento profilo', details: err });
    }
  }
}

export class BackupLogController {
  static async getBackupLogs(req: Request, res: Response) {
    try {
      const { limit } = req.query;
      const logs = await BackupLogService.getBackupLogs(limit ? Number(limit) : 50);
      res.json({ success: true, logs });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Errore nel caricamento log backup', details: err });
    }
  }
  static async createBackup(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { backup_type = 'manual' } = req.body;
      const log = await BackupLogService.createBackupLog({ backupType: backup_type, userId });
      // Simulazione completamento backup
      setTimeout(async () => {
        await BackupLogService.completeBackupLog(log.id, `./backups/backup_${new Date().toISOString().slice(0, 10)}_${log.id}.sql`, Math.floor(Math.random() * 1000000) + 500000);
      }, 2000);
      res.json({ success: true, backup_id: log.id, status: 'pending' });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Errore nella creazione backup', details: err });
    }
  }
}

export class NotificationSettingController {
  static async getNotificationSettings(req: Request, res: Response) {
    try {
      const userId = req.query.userId ? Number(req.query.userId) : undefined;
      if (!userId) {
        return res.status(400).json({ success: false, error: 'userId mancante nella query' });
      }
      const settings = await NotificationSettingService.getNotificationSettings(userId);
      res.json({ success: true, notification_settings: settings });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Errore nel caricamento impostazioni notifiche', details: err });
    }
  }
  static async updateNotificationSettings(req: Request, res: Response) {
    try {
      const userId = req.body.userId ? Number(req.body.userId) : undefined;
      const { notification_settings } = req.body;
      if (!userId) {
        return res.status(400).json({ success: false, error: 'userId mancante nel body' });
      }
      if (!Array.isArray(notification_settings)) {
        return res.status(400).json({ success: false, error: 'Dati notifiche non validi' });
      }
      const updated = await NotificationSettingService.updateNotificationSettings(userId, notification_settings);
      res.json({ success: true, updated_count: updated.length, updated });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Errore nell\'aggiornamento notifiche', details: err });
    }
  }
}
