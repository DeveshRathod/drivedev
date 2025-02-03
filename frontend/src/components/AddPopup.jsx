import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";

const AddPopup = ({ open, onClose, refreshData, folderId = "" }) => {
  const [type, setType] = useState("folder");
  const [folderName, setFolderName] = useState("");
  const [fileType, setFileType] = useState("pdf");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSave = async () => {
    if (uploading) return;

    const token = localStorage.getItem("token");
    setUploading(true);

    try {
      if (type === "folder") {
        if (!folderName.trim()) {
          alert("Folder name cannot be empty.");
          setUploading(false);
          return;
        }

        await axios.post(
          "/api/v1/data/createFolder",
          { name: folderName, parentFolderId: folderId || null },
          { headers: { authorization: `${token}` } }
        );
      } else {
        if (!selectedFile) {
          alert("Please select a file.");
          setUploading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("fileType", fileType);
        if (folderId) formData.append("folderId", folderId);

        await axios.post("/api/v1/data/addFile", formData, {
          headers: {
            authorization: `${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      refreshData();
      onClose();
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="text-lg font-semibold text-gray-800">
        Add New
      </DialogTitle>
      <DialogContent className="space-y-4 p-6">
        <Select
          fullWidth
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <MenuItem value="folder">Folder</MenuItem>
          <MenuItem value="file">File</MenuItem>
        </Select>

        {type === "folder" ? (
          <TextField
            fullWidth
            margin="dense"
            label="Folder Name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <>
            <Select
              fullWidth
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="ppt">PPT</MenuItem>
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="xls">XLS</MenuItem>
              <MenuItem value="doc">DOC</MenuItem>
            </Select>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer p-2"
            />
          </>
        )}
      </DialogContent>

      <DialogActions className="flex justify-end space-x-2 p-4">
        <Button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={
            uploading || (type === "folder" ? !folderName : !selectedFile)
          }
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
        >
          {uploading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPopup;
