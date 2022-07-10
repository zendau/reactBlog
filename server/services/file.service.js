const fileModel = require("../models/file.model")
const ObjectId = require('mongodb').ObjectID

const ApiError = require("../exceprions/api.error");

const FileDto = require("../dtos/file.dto");

const fs = require('fs')

class FileService {

  async create(file) {

    if (file === undefined || file.length === 0) {
      throw ApiError.HttpException("Wrong file type. Allowed types: png, jpg, jpeg")
    }

    const fileInsered = await fileModel.create({
      fileName: file.filename,
      size: file.size,
      mimetype: file.mimetype
    })

    const fileDTO = new FileDto(fileInsered)
    return fileDTO

  }

  async getById(fileId) {

    if (!ObjectId.isValid(fileId.toString())) {
      throw ApiError.HttpException(`Wrong id fileId ${fileId} is not objectId`)
    }

    const file = await fileModel.findById(fileId)

    if (file === null) {
      throw ApiError.HttpException(`Wrong file id. File id ${fileId} is not found`)
    }

    const fileDTO = new FileDto(file)
    return fileDTO

  }

  async getList() {
    const files = await fileModel.find();

    const filesDTO = files.map(file => new FileDto(file))
    return filesDTO;
  }

  async update(fileId, newFile) {

    if (!ObjectId.isValid(fileId.toString())) {
      throw ApiError.HttpException(`Wrong id fileId ${fileId} is not objectId`)
    }

    const file = await fileModel.findById(fileId)

    if (file === null) {
      throw ApiError.HttpException(`Wrong file id File id ${fileId} is not found`)
    }

    const oldFileName = file.fileName

    file.fileName = newFile.filename
    file.mimetype = newFile.mimetype
    file.size = newFile.size

    const updatedData = await file.save()
    const fileDTO = new FileDto(updatedData)

    this.removeFromStorage(oldFileName)

    return fileDTO
  }

  removeFromStorage(filename) {
    fs.unlink(`files/${filename}`, (err) => {
      if (err && err.code == 'ENOENT') {
        console.log("File doesn't exist, won't remove it")
      } else if (err) {
        console.log('Error occurred while trying to remove file')
      }
    })
  }

  async delete(fileId) {

    if (!ObjectId.isValid(fileId.toString())) {
      throw ApiError.HttpException(`Wrong id fileId ${fileId} is not objectId`)
    }

    const DeleteStatus = await fileModel.findByIdAndDelete(fileId)  
    if (DeleteStatus === null) {
      throw ApiError.HttpException(`Wrong file id File id ${fileId} is not found`)
    }

    this.removeFromStorage(DeleteStatus.fileName)

    return true
  }

}

module.exports = new FileService()