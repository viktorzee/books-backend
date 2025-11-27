import { IsNumber, IsOptional, IsString, Max, Min, MinLength } from "class-validator";

export class UpdateReviewDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  content?: string;
}
