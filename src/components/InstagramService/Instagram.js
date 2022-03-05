import React, { useState } from "react";
import instagram from "../../api/instagram";

const access_token =
  "IGQVJVeVdwUGluSjFGNmY4NFdpa1BlZAVh5WkV6NWlhSVo4NW41dGNjZAC1rbWY5ejRkQ2JRODQ1UjNKWFRQcnczNXJ6Sm1acWFCNkxFX1l3MmVnYXpMUExoODQzNFBZAQjZAvRVA1OHZAFSkxGMzlpM0xGOWJ1T3FGc21xZAzBJ";

function Instagram() {
  const [userPosts, setUserPosts] = useState([]);

  const fetchUserPosts = async () => {
    const response = await instagram.get("/me/media", {
      params: {
        fields: "id,caption",
        access_token,
      },
    });

    const data = response.data.data;
    const resposePromise = data.map((post) =>
      instagram.get(`/${post.id}`, {
        params: {
          fields: "id,media_type,media_url,username,timestamp",
          access_token,
        },
      })
    );
    let userPosts = await Promise.all(resposePromise);
    userPosts = userPosts.map((data) => data.data);
    setUserPosts(userPosts);
    console.log("response", userPosts);
  };
  return (
    <>
      <button onClick={fetchUserPosts}>Fetch Instagram Post</button>
      <div
        style={{
          display: "flex",
          gap: "10px",
          width: "100vw",
          flexWrap: "wrap",
          margin: "0 auto",
        }}
      >
        {userPosts.map((post) => (
          <div style={{ width: "20%", widthcursor: "pointer" }}>
            <img
              style={{ maxWidth: "200px", maxHeight: "250px" }}
              src={post.media_url}
              alt="post"
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default Instagram;
