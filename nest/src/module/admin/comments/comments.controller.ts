import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common'
import { CommentsService } from './comments.service'
import { Auth } from '@/common'
import { Role } from '@/common/enum/role.enum'

@Auth(Role.Admin)
@Controller('admin/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Get()
  getComments(@Query('page') page: number, @Query('rate') rate: number) {
    return this.commentsService.getComments(page, +rate)
  }

  @Get(':comment')
  commentDetail(@Param('comment') id: number) {
    return this.commentsService.commentDetail(+id)
  }

  @Patch(':comment/reply')
  reply(@Param('comment') id: number, @Body('reply') reply: string) {
    return this.commentsService.reply(id, reply)
  }

  @Delete('/:comment/delete')
  delComment(@Param('comment') id: number) {
    return this.commentsService.delComment(+id)
  }
}
