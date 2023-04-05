import React, { useEffect, useState } from "react";
import { PhotoCamera } from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Button,
  CardActions,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  Input,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import { Web3Context } from "../../context/Web3Context";
import MyCollection from "../myCollection";
import Chip from "@mui/material/Chip";
import { firebaseDataContext } from "../../context/FirebaseDataContext";

import { Card, Container, Row, Col } from "react-bootstrap";
import web3 from "web3";

function User() {
  const web3Context = React.useContext(Web3Context);
  const { shortAddress, setUpdate, update } = web3Context;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const storage = getStorage();
  const [profileData, setProfileData] = useState({
    avatar: "",
    name: "",
    userName: "",
    bio: "",
    purpose: "",
    address: "",
  });

  const firebaseContext = React.useContext(firebaseDataContext);
  const { getMyCollection } = firebaseContext;

  useEffect(() => {
    let add = localStorage.getItem("address");
    getMyCollection(web3.utils.toChecksumAddress(add));
  }, []);

  useEffect(() => {
    const init = async () => {
      const add = window.localStorage.getItem("address");
      const q = query(
        collection(db, "UserProfile"),
        where("Address", "==", add)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((fire) => {
        let obj = {
          avatar: fire.data().Photo,
          name: fire.data().Name,
          userName: fire.data().UserName,
          bio: fire.data().Bio,
          purpose: fire.data().purpose,
          address: fire.data().Address,
        };
        setProfileData(obj);
      });
    };
    init();
  }, [update]);

  const handleEditProfile = () => {
    setOpen(!open);
  };

  // console.log(profileData, "profileData");

  async function onChangeAvatar(e) {
    setLoading(true);
    const file = e.target.files[0];
    const storageRef = ref(storage, `Photo/${file.name}`);
    uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setProfileData({ ...profileData, avatar: url });
      });
    });
    setLoading(false);
  }

  const updateProfile = async () => {
    const add = window.localStorage.getItem("address");
    const data = {
      Name: profileData.name,
      UserName: profileData.userName,
      Bio: profileData.bio,
      Photo: profileData.avatar,
      Address: add,
      verified: 0,
      CreatedAt: new Date(),
      purpose: profileData.purpose,
    };
    const q = query(collection(db, "UserProfile"), where("Address", "==", add));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      addDoc(collection(db, "UserProfile"), data);
      setUpdate(!update);
      toast.success("Profile successfully Added!!");
    } else {
      querySnapshot.forEach((fire) => {
        const data = {
          Name: profileData.name !== "" ? profileData.name : fire.data().Name,
          UserName:
            profileData.userName !== ""
              ? profileData.userName
              : fire.data().UserName,
          Bio: profileData.bio !== "" ? profileData.bio : fire.data().Bio,
          Photo:
            profileData.avatar !== "" ? profileData.avatar : fire.data().Photo,
          Address: add,
          UpdatedAt: new Date(),
          purpose:
            profileData.purpose !== ""
              ? profileData.purpose
              : fire.data().purpose,
        };
        const dataref = doc(db, "UserProfile", fire.id);
        updateDoc(dataref, data);
        setUpdate(!update);
        toast.success("Profile successfully updated!!");
      });
    }
  };
  return (
    <>
      <Container fluid>
        <Row>
          <Col md="7">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Edit Profile</Card.Title>
              </Card.Header>
              <Card.Body style={{ padding: "20px" }}>
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={3}
                    style={{ justifyContent: "center", display: "flex" }}
                  >
                    <Badge
                      overlap="circular"
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      badgeContent={
                        <label htmlFor="icon-button-file">
                          <Input
                            onChange={(e) => onChangeAvatar(e)}
                            className="d-none"
                            accept="image/*"
                            id="icon-button-file"
                            type="file"
                          />
                          <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="span"
                          >
                            <PhotoCamera />
                          </IconButton>
                        </label>
                      }
                    >
                      <Avatar
                        sx={{ width: 100, height: 100 }}
                        src={
                          loading ? (
                            <CircularProgress />
                          ) : profileData.avatar ? (
                            profileData.avatar
                          ) : (
                            "/images/log.png"
                          )
                        }
                      />
                    </Badge>
                  </Stack>

                  <Typography
                    color="textSecondary"
                    variant="body"
                    style={{
                      border: "1px solid #eee",
                      padding: "3px 15px",
                      borderRadius: "20px",
                      fontWeight: "bolder",
                      color: "black",
                      width: "fit-content",
                      marginTop: "20px",
                    }}
                  >
                    {profileData
                      ? shortAddress(profileData.address)
                      : shortAddress(window.localStorage.getItem("address"))}
                  </Typography>
                  <TextField
                    sx={{ m: 2 }}
                    id="outlined-multiline-flexible"
                    label="Name"
                    name="name"
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    fullWidth
                  />

                  <TextField
                    sx={{ m: 2 }}
                    id="outlined-multiline-flexible"
                    label="Username"
                    name="userName"
                    type="text"
                    value={profileData.userName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        userName: e.target.value,
                      })
                    }
                    fullWidth
                  />
                  <TextField
                    sx={{ m: 2 }}
                    id="outlined-multiline-flexible"
                    label="Bio"
                    name="bio"
                    type="text"
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    value={profileData.bio}
                    fullWidth
                    multiline
                    maxRows={4}
                    minRows={3}
                  />

                  <TextField
                    sx={{ m: 2 }}
                    id="outlined-multiline-flexible"
                    label="Purpose of Issue"
                    name="purpose"
                    type="text"
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        purpose: e.target.value,
                      })
                    }
                    value={profileData.purpose}
                    fullWidth
                    multiline
                    maxRows={4}
                    minRows={3}
                  />
                </Box>
              </Card.Body>
              <Card.Footer>
                <a className="thm-btn header__cta-btn" onClick={updateProfile}>
                  <span> Save Profile</span>
                </a>
              </Card.Footer>
            </Card>
          </Col>
          <Col md="5">
            <Card sx={{ border: "1px solid #eee" }}>
              <CardContent>
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Avatar
                    src={profileData.avatar}
                    sx={{
                      height: 100,
                      mb: 2,
                      width: 100,
                    }}
                  />
                  <Typography
                    color="textSecondary"
                    variant="body"
                    style={{
                      border: "1px solid #eee",
                      padding: "3px 15px",
                      borderRadius: "20px",
                      fontWeight: "bolder",
                      color: "black",
                      width: "fit-content",
                      marginTop: "20px",
                    }}
                  >
                    {profileData.address !== ""
                      ? shortAddress(profileData.address)
                      : shortAddress(window.localStorage.getItem("address"))}
                  </Typography>
                  <div
                    style={{
                      margin: "10px",
                      textAlign: "center",
                    }}
                  >
                    <h3>
                      <a href="#none">
                        
                        {profileData.userName !== ""
                          ? profileData.userName
                          : "@UserName"}
                      </a>
                    </h3>
                    <p>{profileData.bio !== "" ? profileData.bio : "Bio"}</p>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <MyCollection show={true}></MyCollection>
        </Row>
      </Container>
    </>
  );
}

export default User;
