import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, MinLength } from "class-validator";

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  bookId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  content: string;
}
