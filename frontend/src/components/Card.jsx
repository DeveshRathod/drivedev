import React, { useState } from "react";
import { Link } from "react-router-dom";
import moreOptions from "../resources/more.png";
import unknownImage from "../resources/unknown-mail.png";
import pdf from "../resources/pdf.png";
import ppt from "../resources/ppt.png";
import text from "../resources/text.png";
import xls from "../resources/xls.png";
import doc from "../resources/doc.png";
import folder from "../resources/folder.png";
import axios from "axios";

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

const fileTypeImages = {
  pdf,
  ppt,
  text,
  xls,
  doc,
  folder,
};

const getImage = (type) => {
  const fileExtension = mimeTypeToExtension[type] || type;
  return fileTypeImages[fileExtension] || unknownImage;
};

const Card = ({ folders, files, refreshData }) => {
  const [contextMenu, setContextMenu] = useState(null);

  const groupItemsByType = (items) => {
    return items.reduce((acc, item) => {
      const type = item.type || "folder";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(item);
      return acc;
    }, {});
  };

  const handleMenuOpen = (event, item) => {
    event.stopPropagation();
    const button = event.currentTarget.getBoundingClientRect();
    const menuWidth = 128;
    const menuHeight = 50;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const x =
      button.right + menuWidth > viewportWidth
        ? button.left - menuWidth
        : button.left;
    const y =
      button.bottom + menuHeight > viewportHeight
        ? button.top - menuHeight
        : button.bottom;

    setContextMenu({
      id: item.id,
      type: item.type,
      folderId: item.folderId,
      parentFolderId: item.parentFolderId,
      x,
      y: y + window.scrollY,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const deleteItem = async (id, type, folderId, parentFolderId) => {
    const token = localStorage.getItem("token");
    try {
      if (type === "folder") {
        await axios.delete("/api/v1/data/deleteFolder", {
          headers: {
            Authorization: `${token}`,
          },
          data: {
            folderId: id,
            parentFolderId,
          },
        });
      } else {
        await axios.delete("/api/v1/data/removeFile", {
          headers: {
            Authorization: `${token}`,
          },
          data: {
            fileId: id,
            folderId,
          },
        });
      }
      setContextMenu(null);
      refreshData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const groupedItems = groupItemsByType([...folders, ...files]);

  return (
    <div className="p-6" onClick={closeContextMenu}>
      {Object.keys(groupedItems).map((type) => (
        <div key={type} className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {mimeTypeToExtension[type]} ({groupedItems[type].length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {groupedItems[type].map((item) => (
              <div
                key={item.id}
                className="w-full bg-white rounded-2xl overflow-hidden border relative"
              >
                <div className="flex flex-col items-center p-6 relative">
                  <img
                    src={getImage(item.type)}
                    alt={item.name}
                    className="w-20 h-20 object-cover mb-4"
                  />
                  {item.type === "folder" && (
                    <div className="absolute bottom-18 right-20 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {item.filesCount}
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-800 text-center">
                    {item.name}
                  </h3>
                </div>
                <div className="border-t flex justify-between items-center px-4 py-2 bg-gray-50">
                  {item.type === "folder" ? (
                    <Link
                      to={`/files/${item.id}`}
                      className="text-blue-500 font-medium hover:underline"
                    >
                      Open
                    </Link>
                  ) : (
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 font-medium hover:underline"
                    >
                      Open
                    </a>
                  )}
                  <button
                    onClick={(event) => handleMenuOpen(event, item)}
                    className="relative focus:outline-none"
                  >
                    <img
                      src={moreOptions}
                      alt="More options"
                      className="w-6 h-6"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {contextMenu && (
        <div
          className="absolute bg-white border rounded-lg shadow-lg w-32 p-2"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-100"
            onClick={() =>
              deleteItem(
                contextMenu.id,
                contextMenu.type,
                contextMenu.folderId,
                contextMenu.parentFolderId
              )
            }
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Card;
