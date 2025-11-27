import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateReviewDto {
  @ApiProperty({ description: "ID of the book being reviewed", example: "uuid-here" })
  @IsNotEmpty()
  @IsString()
  bookId: string;

  @ApiProperty({ description: "Rating from 1 to 5", minimum: 1, maximum: 5, example: 4 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ description: "Optional review title", example: "Great read!" })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: "Review content (min 10 characters)", minLength: 10, example: "This book was fantastic and I highly recommend it." })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  content: string;
}
