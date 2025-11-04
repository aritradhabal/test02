import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from '@nestjs/class-validator';
import { Type } from '@nestjs/class-transformer';
import { OperationType } from '@prisma/client';

export class CreatePostDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  startingNumber: number;
}

export class CreateReplyDto {
  @IsString()
  @IsNotEmpty()
  parentId: string;

  @IsEnum(OperationType)
  @IsNotEmpty()
  operationType: OperationType;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  rightHandNumber: number;
}
