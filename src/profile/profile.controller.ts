import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from "@nestjs/swagger";
import { ProfileService } from "./profile.service";
import { AuthGuard } from "src/auth/auth.guard";

@ApiTags("Profile")
@Controller("api")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get("profile/:username")
  @ApiOperation({ summary: "Get public profile by username" })
  @ApiParam({ name: "username", description: "Username to look up" })
  @ApiResponse({ status: 200, description: "Returns public profile data" })
  @ApiResponse({ status: 404, description: "User not found or profile is private" })
  getPublicProfile(@Param("username") username: string) {
    return this.profileService.getPublicProfile(username);
  }

  @Get("user/profile")
  @UseGuards(AuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({ status: 200, description: "Returns user profile" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  getMyProfile(@Req() req: any) {
    return this.profileService.getMyProfile(req.user.id);
  }

  @Patch("user/profile")
  @UseGuards(AuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Update user profile" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        bio: { type: "string", description: "User bio" },
        isProfilePublic: { type: "boolean", description: "Profile visibility" },
        first_name: { type: "string", description: "First name" },
        last_name: { type: "string", description: "Last name" },
      },
    },
  })
  @ApiResponse({ status: 200, description: "Profile updated successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
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
