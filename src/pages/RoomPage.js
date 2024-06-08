import React, { useEffect, useCallback, useState } from "react";
import { useSocket } from "../providers/SocketProvider";
import { usePeer } from "../providers/PeerProvider";
import ReactPlayer from "react-player";

const RoomPage = () => {
  const { socket } = useSocket();
  const {
    createOffer,
    createAnswer,
    setRemoteAnswer,
    sendStream,
    remoteStream,
  } = usePeer();
  const [myStream, setMyStream] = useState(null);
  const handleUserJoined = useCallback(
    async ({ email }) => {
      console.log("User joined wtih this email", email);
      const offer = await createOffer();
      socket.emit("call-user", { email, offer });
    },
    [socket, createOffer]
  );

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      console.log("Incomming call from ", from, offer);
      const answer = await createAnswer(offer);
      socket.emit("call-accepted", { email: from, answer });
    },
    [createAnswer, socket]
  );

  const handleCallAccepted = useCallback(
    async ({ answer }) => {
      console.log("Call got accepted", answer);
      await setRemoteAnswer(answer);
    },
    [setRemoteAnswer]
  );

  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    console.log("stream", stream);
    setMyStream(stream);
  }, []);
  useEffect(() => {
    socket.on("user-joined", handleUserJoined);
    socket.on("incomming-call", handleIncommingCall);
    socket.on("call-accepted", handleCallAccepted);

    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.off("incomming-call", handleIncommingCall);
      socket.off("call-accepted", handleCallAccepted);
    };
  }, [handleUserJoined, handleIncommingCall, socket, handleCallAccepted]);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);
  console.log("stream", myStream);

  return (
    <div>
      Room Hapge
      <button onClick={() => sendStream(myStream)}>Send Stream</button>
      {myStream && <ReactPlayer url={URL.createObjectURL(myStream)} playing />}
      {remoteStream && (
        <ReactPlayer url={URL.createObjectURL(remoteStream)} playing />
      )}
      {}
    </div>
  );
};

export default RoomPage;
