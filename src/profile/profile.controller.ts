import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
} from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { AuthGuard } from "src/auth/auth.guard";

@Controller("api")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // Public endpoint - no auth required
  @Get("profile/:username")
  getPublicProfile(@Param("username") username: string) {
    return this.profileService.getPublicProfile(username);
  }

  // Get current user's profile settings
  @Get("user/profile")
  @UseGuards(AuthGuard)
  getMyProfile(@Req() req: any) {
    return this.profileService.getMyProfile(req.user.id);
  }

  // Update profile settings
  @Patch("user/profile")
  @UseGuards(AuthGuard)
  updateProfile(
    @Body()
    updateData: {
      bio?: string;
      isProfilePublic?: boolean;
      first_name?: string;
      last_name?: string;
    },
    @Req() req: any
  ) {
    return this.profileService.updateProfile(req.user.id, updateData);
  }
}
