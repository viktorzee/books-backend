import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Activity, ActivityType } from './entities/activity.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  async logActivity(
    userId: string,
    type: ActivityType,
    entityId?: string,
    entityName?: string,
  ): Promise<Activity> {
    const activity = this.activityRepository.create({
      user: { id: userId },
      type,
      entityId,
      entityName,
    });
    return this.activityRepository.save(activity);
  }

  async getActivitySummary(userId: string) {
    const counts = await this.activityRepository
      .createQueryBuilder('activity')
      .select('activity.type', 'label')
      .addSelect('COUNT(*)', 'value')
      .where('activity.userId = :userId', { userId })
      .groupBy('activity.type')
      .getRawMany();

    // Map to include all activity types with 0 counts for missing ones
    const allTypes = Object.values(ActivityType);
    const summary = allTypes.map((type) => {
      const found = counts.find((c) => c.label === type);
      return {
        label: type,
        value: found ? parseInt(found.value, 10) : 0,
      };
    });

    return summary;
  }

  async getRecentActivity(userId: string, limit: number = 10) {
    return this.activityRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getActivityByDateRange(userId: string, startDate: Date, endDate: Date) {
    return this.activityRepository.find({
      where: {
        user: { id: userId },
        createdAt: Between(startDate, endDate),
      },
      order: { createdAt: 'DESC' },
    });
  }
}
