import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, CreateReplyDto } from './dto/posts.dto';
import { CommentNode, OperationType } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  /**
   * This is the parent node.
   */
  async createRootPost(
    createPostDto: CreatePostDto,
    authorId: string,
  ): Promise<CommentNode> {
    const { startingNumber } = createPostDto;

    const newPost = await this.prisma.PrismaClient.commentNode.create({
      data: {
        resultValue: startingNumber,
        authorId: authorId,
      },
      include: {
        author: {
          select: { username: true },
        },
      },
    });
    return newPost;
  }

  /**
   * Creates a new reply (an "Operation") on an existing post.
   */
  async createReply(
    createReplyDto: CreateReplyDto,
    authorId: string,
  ): Promise<CommentNode> {
    const { operationType, rightHandNumber, parentId } = createReplyDto;

    const parentNode = await this.prisma.PrismaClient.commentNode.findUnique({
      where: { id: parentId },
    });

    if (!parentNode) {
      throw new NotFoundException(
        'The post you are replying to does not exist.',
      );
    }

    const parentValue = parentNode.resultValue;
    let newResult: number;

    switch (operationType) {
      case OperationType.ADD:
        newResult = parentValue + rightHandNumber;
        break;
      case OperationType.SUBTRACT:
        newResult = parentValue - rightHandNumber;
        break;
      case OperationType.MULTIPLY:
        newResult = parentValue * rightHandNumber;
        break;
      case OperationType.DIVIDE:
        newResult = parentValue / rightHandNumber;
        break;
      default:
        throw new BadRequestException('Invalid operation type.');
    }

    const newReply = await this.prisma.PrismaClient.commentNode.create({
      data: {
        authorId: authorId,
        parentId: parentId,
        operationType: operationType,
        rightHandNumber: rightHandNumber,
        resultValue: newResult,
      },
      include: {
        author: {
          select: { username: true },
        },
      },
    });
    return newReply;
  }

  /**
   * Fetches ALL posts and replies in a flat list.
   */
  async getAllPosts(): Promise<CommentNode[]> {
    return this.prisma.PrismaClient.commentNode.findMany({
      include: {
        author: {
          select: { username: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
