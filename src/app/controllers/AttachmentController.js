import Attachment from "../models/Attachment";

class AttachmentController {
  async store(request, response) {
    const { originalname: name, filename: file } = request.file;

    const attachment = await Attachment.create({
      name,
      file,
    });
    return response.json(attachment);
  }
}

export default new AttachmentController();
