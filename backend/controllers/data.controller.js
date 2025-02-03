import Folder from "../models/folders.model.js";
import File from "../models/files.model.js";
import { Op } from "sequelize";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

dotenv.config();

export const createFolder = async (req, res) => {
  const { name, parentFolderId } = req.body;
  const userId = req.userid;

  try {
    if (parentFolderId) {
      const parentFolder = await Folder.findOne({
        where: { id: parentFolderId, userId },
      });

      if (!parentFolder) {
        return res
          .status(404)
          .json({ message: "Parent folder not found or unauthorized access" });
      }

      const folder = await Folder.findOne({
        where: {
          id: parentFolderId,
          userId: userId,
        },
      });

      await folder.update({
        filesCount: folder.filesCount + 1,
      });
    }

    const newFolder = await Folder.create({
      name,
      userId,
      parentFolderId: parentFolderId || null,
    });

    return res.status(201).json({
      message: "Folder created successfully",
      folder: newFolder,
    });
  } catch (error) {
    console.error("Error creating folder:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getHome = async (req, res) => {
  const userId = req.userid;

  try {
    const folders = await Folder.findAll({
      where: { userId, parentFolderId: null },
      attributes: [
        "id",
        "name",
        "filesCount",
        "type",
        "createdAt",
        "updatedAt",
      ],
      order: [["createdAt", "ASC"]],
    });

    const files = await File.findAll({
      where: { userId, folderId: null },
      attributes: ["id", "name", "type", "path", "createdAt", "updatedAt"],
      order: [["createdAt", "ASC"]],
    });

    return res.status(200).json({
      message: "Home content fetched successfully.",
      data: {
        folders,
        files,
      },
    });
  } catch (error) {
    console.error("Error fetching home content:", error);
    return res.status(500).json({
      message: "Server error. Could not fetch home content.",
    });
  }
};

export const getContent = async (req, res) => {
  const { folderId } = req.body;
  const userId = req.userid;

  try {
    const folders = await Folder.findAll({
      where: {
        userId,
        parentFolderId: folderId,
      },
      attributes: [
        "id",
        "name",
        "filesCount",
        "parentFolderId",
        "type",
        "createdAt",
        "updatedAt",
      ],
      order: [["createdAt", "ASC"]],
    });

    const files = await File.findAll({
      where: {
        userId,
        folderId,
      },
      attributes: [
        "id",
        "name",
        "type",
        "folderId",
        "path",
        "createdAt",
        "updatedAt",
      ],
      order: [["createdAt", "ASC"]],
    });

    return res.status(200).json({
      message: "Folder content fetched successfully.",
      data: {
        folders,
        files,
      },
    });
  } catch (error) {
    console.error("Error fetching folder content:", error);
    return res.status(500).json({
      message: "Server error. Could not fetch folder content.",
    });
  }
};

export const search = async (req, res) => {
  const { searchQuery } = req.body;
  const userId = req.userid;

  if (!searchQuery) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const folders = await Folder.findAll({
      where: {
        userId,
        name: {
          [Op.like]: `%${searchQuery}%`,
        },
      },
      attributes: [
        "id",
        "name",
        "filesCount",
        "type",
        "createdAt",
        "updatedAt",
      ],
      order: [["createdAt", "ASC"]],
    });

    const files = await File.findAll({
      where: {
        userId,
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${searchQuery}%`,
            },
          },
          {
            type: {
              [Op.like]: `%${searchQuery}%`,
            },
          },
        ],
      },
      attributes: ["id", "name", "type", "path", "createdAt", "updatedAt"],
      order: [["createdAt", "ASC"]],
    });

    return res.status(200).json({
      message: "Search results fetched successfully.",
      data: {
        folders,
        files,
      },
    });
  } catch (error) {
    console.error("Error during search:", error);
    return res.status(500).json({
      message: "Server error. Could not perform the search.",
    });
  }
};

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const mimeTypeToExtension = {
  "application/pdf": "pdf",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "ppt",
  "text/plain": "text",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xls",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "doc",
};

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now()}_${file.originalname}`);
    },
    acl: "public-read",
    contentDisposition: "inline",
  }),
}).single("file");

export const addFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error uploading file to S3:", err);
      return res.status(500).json({ message: "File upload failed." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const { originalname, mimetype } = req.file;
    const filePath = req.file.location || req.file.key;
    const userId = req.userid;
    const { folderId } = req.body;

    try {
      let newFile;

      if (folderId) {
        const folder = await Folder.findOne({
          where: { id: folderId, userId },
        });

        if (!folder) {
          return res
            .status(404)
            .json({ message: "Folder not found or unauthorized access." });
        }

        newFile = await File.create({
          name: originalname,
          type: mimetype,
          path: filePath,
          folderId,
          userId,
        });

        await folder.update({ filesCount: folder.filesCount + 1 });
      } else {
        newFile = await File.create({
          name: originalname,
          type: mimetype,
          path: filePath,
          userId,
        });
      }

      const fileUrl = await getSignedUrl(
        s3,
        new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: req.file.key,
          ResponseContentDisposition: "inline",
          ResponseContentType: mimetype,
        }),
        { expiresIn: 0 }
      );

      return res.status(201).json({
        message: "File uploaded successfully.",
        fileUrl,
      });
    } catch (error) {
      console.error("Error adding file:", error);
      return res
        .status(500)
        .json({ message: "Server error. Could not add the file." });
    }
  });
};

export const deleteFile = async (req, res) => {
  const { folderId, fileId } = req.body;
  const userId = req.userid;

  try {
    const file = await File.findOne({
      where: {
        id: fileId,
        userId: userId,
      },
    });

    if (!file) {
      return res
        .status(404)
        .json({ message: "File not found or unauthorized access." });
    }

    const key = file.path.split("uploads/")[1];

    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${key}`,
    };

    try {
      await s3.send(new DeleteObjectCommand(deleteParams));
    } catch (s3Error) {
      console.error("Error deleting file from S3:", s3Error);
      return res
        .status(500)
        .json({ message: "Failed to delete file from S3." });
    }

    await File.destroy({
      where: {
        id: fileId,
      },
    });

    if (folderId) {
      const folder = await Folder.findOne({ where: { id: folderId, userId } });

      if (folder) {
        await folder.update({
          filesCount: folder.filesCount > 0 ? folder.filesCount - 1 : 0,
        });
      }
    }

    return res.status(200).json({ message: "File deleted successfully." });
  } catch (error) {
    console.error("Error deleting file:", error);
    return res
      .status(500)
      .json({ message: "Server error. Could not delete the file." });
  }
};

export const deleteFolder = async (req, res) => {
  const { folderId, parentFolderId } = req.body;
  const userId = req.userid;

  try {
    const folder = await Folder.findOne({ where: { id: folderId, userId } });

    if (!folder) {
      return res
        .status(404)
        .json({ message: "Folder not found or unauthorized access." });
    }

    const deleteRecursive = async (id) => {
      const childFolders = await Folder.findAll({
        where: { parentFolderId: id },
      });
      await Promise.all(childFolders.map((child) => deleteRecursive(child.id)));

      const files = await File.findAll({ where: { folderId: id } });
      await Promise.all(
        files.map(async (file) => {
          try {
            const key = file.path.replace(/^.*\/uploads\//, "uploads/");
            const deleteParams = {
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: key,
            };
            await s3.send(new DeleteObjectCommand(deleteParams));
          } catch (s3Error) {
            console.error("Error deleting file from S3:", s3Error);
          }
          await File.destroy({ where: { id: file.id } });
        })
      );

      await Folder.destroy({ where: { id } });
    };

    await deleteRecursive(folderId);

    if (parentFolderId) {
      const parentFolder = await Folder.findOne({
        where: { id: parentFolderId, userId },
      });
      if (parentFolder) {
        await parentFolder.update({
          filesCount: Math.max((parentFolder.filesCount || 0) - 1, 0),
        });
      }
    }

    return res
      .status(200)
      .json({ message: "Folder and all its contents deleted successfully." });
  } catch (error) {
    console.error("Error deleting folder:", error);
    return res
      .status(500)
      .json({ message: "Server error. Could not delete the folder." });
  }
};
