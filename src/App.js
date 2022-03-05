import Gdrive from "./components/Gdrive";
import Youtube from "./components/Youtube";
import Instagram from "./components/InstagramService/Instagram";
import InstagramLogin from "./components/InstagramService/InstagramLogin";

function App() {
  const authHandler = (err, data) => {
    console.log(err, data);
  };
  return (
    <>
      <Gdrive />
      <Youtube />
      <Instagram />
      <InstagramLogin
        authCallback={authHandler}
        clientId=""
        clientSecret=""
        redirectUri=""
      />
    </>
  );
}

export default App;
