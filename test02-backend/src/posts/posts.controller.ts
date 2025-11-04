import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, CreateReplyDto } from './dto/posts.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import type { Request } from 'express';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  createPost(@Req() req: Request, @Body() createPostDto: CreatePostDto) {
    return this.postsService.createRootPost(
      createPostDto,
      (req.user as { id: string; username: string }).id,
    );
  }
  @Post('reply')
  @UseGuards(JwtAuthGuard)
  createReply(@Req() req: Request, @Body() createReplyDto: CreateReplyDto) {
    return this.postsService.createReply(
      createReplyDto,
      (req.user as { id: string; username: string }).id,
    );
  }

  @Get('')
  getAllPosts() {
    return this.postsService.getAllPosts();
  }
}
