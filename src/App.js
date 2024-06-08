import "./App.css";
import HomePage from "./pages/HomePage";
import RoomPage from "./pages/RoomPage";
import { PeerProvider } from "./providers/PeerProvider";
import { SocketProvider } from "./providers/SocketProvider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <SocketProvider>
        <PeerProvider>
          <Router>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path={"/room/:roomId"} element={<RoomPage />} />
            </Routes>
          </Router>
        </PeerProvider>
      </SocketProvider>
    </>
  );
}

export default App;
