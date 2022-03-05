import { useEffect, useState } from "react";
import useDrivePicker from "../Hooks/useDrivePicker";

function Gdrive() {
  const [openPicker, data, authResponse] = useDrivePicker();
  const [userData, setUserData] = useState([]);

  const handleOpenPicker = () => {
    openPicker({
      clientId:
        "147981042601-89266v9gdv68g8j9ae57j1bnng6g32bb.apps.googleusercontent.com",
      developerKey: "AIzaSyC2pjt46FJbwj0hPLr6iQfL0tvqV1Kf3ss",
      viewId: "DOCS",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
    });
  };

  useEffect(() => {
    if (data) {
      setUserData(data.docs);
    }
  }, [data]);

  return (
    <div>
      <button onClick={() => handleOpenPicker()}>Open Picker</button>
      <div
        style={{
          display: "flex",
          gap: "10px",
          width: "100vw",
          flexWrap: "wrap",
          margin: "0 auto",
        }}
      >
        {userData.map((post) => (
          <div style={{ width: "20%", widthcursor: "pointer" }}>
            {console.log(post)}
            <img
              style={{ maxWidth: "200px", maxHeight: "250px" }}
              src={`https://drive.google.com/uc?export=view&id=${post.id}`}
              alt="post"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gdrive;
