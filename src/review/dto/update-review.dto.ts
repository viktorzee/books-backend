import { IsNumber, IsOptional, IsString, Max, Min, MinLength } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateReviewDto {
  @ApiPropertyOptional({ description: "Updated rating from 1 to 5", minimum: 1, maximum: 5, example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ description: "Updated review title", example: "Even better on second read!" })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: "Updated review content (min 10 characters)", minLength: 10, example: "After reading it again, I found even more to appreciate." })
  @IsOptional()
  @IsString()
  @MinLength(10)
  content?: string;
}
