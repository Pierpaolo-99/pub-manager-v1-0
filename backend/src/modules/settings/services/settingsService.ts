import { PrismaClient, SettingScope, Role } from '../../../generated/prisma/client';

const prisma = new PrismaClient();

export class SettingsService {
  // Ottieni impostazioni filtrate
  static async getSettings({ category, publicOnly, userId, role, scope }: {
    category?: string;
    publicOnly?: boolean;
    userId?: number;
    role?: Role;
    scope?: SettingScope;
  }) {
    const where: any = {};
    if (category) where.category = category;
    if (publicOnly) where.isPublic = true;
    if (userId) {
      where.userId = userId;
      where.scope = 'USER';
    }
    if (role) {
      where.role = role;
      where.scope = 'ROLE';
    }
    if (scope) where.scope = scope;
    const settings = await prisma.setting.findMany({ where });
    return settings;
  }

  // Aggiorna o crea impostazioni (batch)
  static async updateSettings(settings: Array<{ key: string; value: any; category?: string; description?: string; scope?: SettingScope; userId?: number; role?: Role; isPublic?: boolean; }>) {
    const results = [];
    for (const s of settings) {
      const updated = await prisma.setting.upsert({
        where: { key: s.key },
        update: {
          value: s.value,
          category: s.category ?? null,
          description: s.description ?? null,
          scope: s.scope || 'GLOBAL',
          userId: s.userId ?? null,
          role: s.role ?? null,
          isPublic: s.isPublic ?? false,
        },
        create: {
          key: s.key,
          value: s.value,
          category: s.category ?? null,
          description: s.description ?? null,
          scope: s.scope || 'GLOBAL',
          userId: s.userId ?? null,
          role: s.role ?? null,
          isPublic: s.isPublic ?? false,
        },
      });
      results.push(updated);
    }
    return results;
  }
}

// Service PubProfile
export class PubProfileService {
  static async getPubProfile() {
    const profile = await prisma.pubProfile.findFirst({ orderBy: { id: 'desc' } });
    return profile;
  }
  static async updatePubProfile(data: any) {
    // upsert: se esiste aggiorna, altrimenti crea
    const last = await prisma.pubProfile.findFirst({ orderBy: { id: 'desc' } });
    if (last) {
      return prisma.pubProfile.update({ where: { id: last.id }, data });
    } else {
      return prisma.pubProfile.create({ data });
    }
  }
}

// Service BackupLog
export class BackupLogService {
  static async getBackupLogs(limit = 50) {
    return prisma.backupLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { createdBy: true },
    });
  }
  static async createBackupLog({ backupType, userId }: { backupType: string; userId?: number; }) {
    return prisma.backupLog.create({
      data: {
        backupType,
        status: 'pending',
        createdById: userId ?? null,
      },
    });
  }
  static async completeBackupLog(id: number, filePath: string, fileSize: number) {
    return prisma.backupLog.update({
      where: { id },
      data: {
        status: 'completed',
        filePath,
        fileSize,
      },
    });
  }
}

// Service NotificationSetting
export class NotificationSettingService {
  static async getNotificationSettings(userId: number) {
    return prisma.notificationSetting.findMany({
      where: { userId },
      orderBy: { notificationType: 'asc' },
    });
  }
  static async updateNotificationSettings(userId: number, settings: Array<{ notificationType: string; isEnabled: boolean; deliveryMethod?: string; settings?: any; }>) {
    const results = [];
    for (const s of settings) {
      const updated = await prisma.notificationSetting.upsert({
        where: { userId_notificationType: { userId, notificationType: s.notificationType } },
        update: {
          isEnabled: s.isEnabled,
          deliveryMethod: s.deliveryMethod ?? null,
          settings: s.settings ?? null,
        },
        create: {
          userId,
          notificationType: s.notificationType,
          isEnabled: s.isEnabled,
          deliveryMethod: s.deliveryMethod ?? null,
          settings: s.settings ?? null,
        },
      });
      results.push(updated);
    }
    return results;
  }
}
