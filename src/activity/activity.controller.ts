import { Controller, Get, Post, Body, Request, Query } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ApiResponse, ApiTags, ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ActivityType } from './entities/activity.entity';

@ApiTags('Activity')
@Controller('api/activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post('log')
  @ApiOperation({ summary: 'Log a user activity' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: Object.values(ActivityType),
          example: 'Create Book'
        },
        entityId: { type: 'string', example: 'uuid-here' },
        entityName: { type: 'string', example: 'My Book Title' },
      },
      required: ['type'],
    },
  })
  @ApiResponse({ status: 201, description: 'Activity logged successfully' })
  async logActivity(
    @Body() data: { type: ActivityType; entityId?: string; entityName?: string },
    @Request() req,
  ) {
    return this.activityService.logActivity(
      req.user.id,
      data.type,
      data.entityId,
      data.entityName,
    );
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get activity summary counts for current user' })
  @ApiResponse({ status: 200, description: 'Returns activity summary' })
  async getSummary(@Request() req) {
    return this.activityService.getActivitySummary(req.user.id);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent activity for current user' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of activities to return (default: 10)' })
  @ApiResponse({ status: 200, description: 'Returns recent activities' })
  async getRecent(@Request() req, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.activityService.getRecentActivity(req.user.id, limitNum);
  }
}
