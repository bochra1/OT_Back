import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UploadedFiles,
  UseInterceptors,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AttachmentsService } from './attachments.service';
import type { Response } from 'express';
import type { File as MulterFile } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly service: AttachmentsService) {}

  // 📎 Upload fichiers pour un OT
  @Post(':otId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/tmp',
        filename: (_, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  upload(
    @Param('otId') otId: string,
    @UploadedFiles() files: MulterFile[],
  ) {
    return this.service.uploadFiles(otId, files);
  }

  // 📄 Liste fichiers d’un OT
  @Get('ot/:otId')
  @UseGuards(JwtAuthGuard)
  getByOT(@Param('otId') otId: string) {
    return this.service.getAttachmentsByOT(otId);
  }

  // ⬇️ Télécharger
  @Get('download/:id')
  @UseGuards(JwtAuthGuard)
  async download(@Param('id') id: string, @Res() res: Response) {
    const file = await this.service.getAttachment(id);
    return res.download(file.filepath, file.filename);
  }

  // 🗑️ Supprimer
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    return this.service.deleteAttachment(id);
  }
}
