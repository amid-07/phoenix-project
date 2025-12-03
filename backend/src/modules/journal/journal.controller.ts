import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { JournalService } from './journal.service';

@Controller('journal')
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Post()
  async create(@Body() body: any) {
    return this.journalService.createEntry(body.userId, body.content, body.mood);
  }

  @Get(':userId')
  async getHistory(@Param('userId') userId: string) {
    return this.journalService.getUserJournal(userId);
  }
}