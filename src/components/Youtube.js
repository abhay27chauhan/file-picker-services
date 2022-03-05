import React, { useState } from "react";
import youtube from "../api/youtube";

function Youtube() {
  const [videos, setVideos] = useState([]);
  const [searchText, setSearchText] = useState("");
  const handleSubmit = async () => {
    const response = await youtube.get("/search", {
      params: {
        q: searchText,
      },
    });
    setVideos(response.data.items);
  };
  return (
    <>
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search here..."
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button disabled={!searchText.trim()} onClick={handleSubmit}>
          Search
        </button>
      </div>
      <div style={{ display: "flex", gap: "10px", width: "100vw", flexWrap:"wrap", margin: "0 auto" }}>
        {videos.map((video) => (
          <div
            style={{ width: "20%", widthcursor: "pointer" }}
          >
            <img
              style={{ maxWidth: "200px", maxHeight: "250px" }}
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.description}
            />
            <div>
              <div>{video.snippet.title}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Youtube;
