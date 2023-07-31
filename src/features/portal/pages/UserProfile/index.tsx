import { AppBar, Avatar, Box, Button, Container, Grid, TextField, Toolbar, Typography } from "@mui/material";
import { useQuery } from "react-query";
import userProfileApi from "../../../../api/userProfileApi";
import Header from "../../components/Topbar";
import { useState } from "react";
import userApi from "../../../../api/userApi";


const UserProfile = (): JSX.Element => {

  const [openEdit, setOpenEdit] = useState(false);

  

  const { data: user } = useQuery("user", userApi.getUser);

  const {
    data: profile,
    
  } = useQuery(
    ["profile"],
    () => {
      // console.log(user.getId);
      console.log(user["id"]);
      return userProfileApi.getUserProfileById(user["id"]);
    }
  );

  // console.log(profile.Object);
// debugger;
  const [userNameInput, setUserNameInput] = useState(profile?.username);
  const [lastNameInput, setLastNameInput] = useState(profile?.lastName);
  const [firstNameInput, setFirstNameInput] = useState(profile?.firstName);
  
  const params = {
    username: userNameInput,
    firstName: firstNameInput,
    lastName: lastNameInput
  }
  
  const handleOpenEdit = (e: any) => {
    setOpenEdit(true)
  };

  const handleCloseEdit = (e: any) => {
    setOpenEdit(false)
  };

  const handleUserNameChange = (event: any) => {
    setUserNameInput(event.target.value)
  }

  const handleLastNameChange = (event: any) => {
    setLastNameInput(event.target.value)
  }

  const handleFirstNameChange = (event: any) => {
    setFirstNameInput(event.target.value)
  }

  const handleUpdate = async (event :any) =>  {
        const promise=await userProfileApi.updateUserProfileById(user["id"], params);
        setOpenEdit(false);
  }
  
    // const { userName, email, role, userAvatar, lastName, firstName } = profile;
    return (
      <>
        {/* <AppBar position="relative">
          <Container maxWidth="xl">
            <Toolbar disableGutters>

            </Toolbar>
          </Container>
        </AppBar> */}
        <Header setActive={() => {}} tabs={new Map()} active />
        <Box id="tab" style={{height : "60px", borderBottom: "ridge"}}>

        </Box>
        <Box style={{height : "30px"}}>

        </Box>
        <Box style={{display:"grid", height : "620px"}}>
        <Grid container spacing={2} columns={16}>
          <Grid item xs={6} >
            {/* <h1>xs=8</h1> */}
            <Box style={{ height : "150px",display :"flex", justifyContent:"center"}}>
            <Avatar alt="avatar" src={profile?.userAvatar ? "data:image/png;base64, " + profile?.userAvatar : ""} style={{ height : "150px", width : "150px"}}/>
            </Box>
            <Box style={{ height : "50px", paddingTop:"20px"}}>
              <Typography style={{fontSize: "20px",
                          fontStyle: "normal",
                          fontWeight: "300",
                          lineHeight:"24px",
                          color: "#57606a",
                          width:"100%",
                          display:"flex",
                          justifyContent:"center"
                          }}>
               {profile?.username}
              </Typography>
            </Box>
            <Box style={{ height : "50px",display:"flex",
                          justifyContent:"center"}}>{
                            !openEdit ?
                            (<div>
                              <Button onClick={handleOpenEdit} variant="outlined">Edit profile</Button>
                            </div>) :
                            (
                              <div>
                                <div style={{paddingTop: "20px"}}>
                                    
                                    <TextField id="outlined-basic" label="UserName" variant="outlined" onChange={handleUserNameChange}/>
                                </div>
                                <div style={{paddingTop: "20px"}}>
                                    
                                    <TextField id="outlined-basic" label="LastName" variant="outlined" onChange={handleLastNameChange}/>
                                </div>
                                <div style={{paddingTop: "20px"}}>
                                    
                                    <TextField id="outlined-basic" label="FirstName" variant="outlined" onChange={handleFirstNameChange}/>
                                </div>
                                
                                
                                <Grid container style={{paddingTop: "20px"}}>
                                    <Grid item xs={6}>
                                        <Button onClick={handleUpdate} variant="outlined">Save</Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button onClick={handleCloseEdit} variant="outlined">Cancel</Button>
                                    </Grid>
                                </Grid>
                                
                              </div>
                            )
                          }
              
            
            </Box>
          </Grid>
          <Grid item xs={10}>
          <Container style={{textAlign: "center"}}>
          <Box>
            <Grid container>

                <Grid item xs={3}>
                    <Typography style={{display:"flex", color:"#70757a"}}>FullName:</Typography>
                </Grid>
                <Grid item xs={9}>
                    <Typography style={{display:"flex"}}>{profile?.lastName + " " + profile?.firstName}</Typography>
                </Grid>

                <Grid item xs={3}>
                    <Typography style={{display:"flex", color:"#70757a"}}>Email:</Typography>
                </Grid>
                <Grid item xs={9}>
                    <Typography style={{display:"flex"}}>{profile?.email}</Typography>
                </Grid>

                <Grid item xs={3}>
                    <Typography style={{display:"flex", color:"#70757a"}}>Role:</Typography>
                </Grid>
                <Grid item xs={9}>
                    <Typography style={{display:"flex"}}>{profile?.role}</Typography>
                </Grid>
            </Grid>
            
          </Box>
        </Container>
          </Grid>
        </Grid>
        </Box>

        
      </>
    );
  
  
};

export default UserProfile;
