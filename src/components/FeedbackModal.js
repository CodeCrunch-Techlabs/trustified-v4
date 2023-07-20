import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Web3Context } from '../context/Web3Context';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import emailjs from '@emailjs/browser';

const labels = {
    1: 'Useless+',
    2: 'Poor+',
    3: 'Ok+',
    4: 'Good+',
    5: 'Excellent+',
};

function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}


const FeedbackModal = () => {
    const web3conext = useContext(Web3Context);
    const { feedbackOpen, setFeedbackOpen, handleCloseFeedback } = web3conext;
    const [value, setValue] = React.useState(0);
    const [message, setMessage] = useState("");
    const [hover, setHover] = React.useState(-1);
    const [loading, setLoading] = useState(false);


    const handleSubmit = () => {
        if (message.length === 0) {
            toast.warning("Please fill up this field!");
        } else {
            setLoading(true);
            emailjs.send(
                'service_tdxktw6',
                'template_vitqwf7',
                {
                    to_name: 'Trustified',
                    to_email: 'Trustified Feedback',
                    rating: value,
                    message: message
                },
                'BtcVA-aVLy1Ad3XMB'
            ).then(() => {
                setLoading(false);
                toast.success('Thank you for your feedback!');
                setValue(0);
                setMessage("");
                handleCloseFeedback();

            }, (error) => {
                console.log(error);
                setLoading(false);
                toast.error("Something went wrong!");
            })
        } 
    }




    return (
        <div>
            <Dialog open={feedbackOpen} onClose={handleCloseFeedback}>
                <DialogTitle>Feedback</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        We'll never share your email with anyone else.
                    </DialogContentText>

                    <Box
                        sx={{
                            width: 200,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Rating
                            name="rating"
                            value={value}
                            precision={0.5}
                            getLabelText={getLabelText}
                            onChange={(event, newValue) => {
                                setValue(newValue);
                            }}
                            onChangeActive={(event, newHover) => {
                                setHover(newHover);
                            }}
                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                        />
                        {value !== null && (
                            <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
                        )}
                    </Box>

                    <div className="mb-3">
                        <label for="exampleFormControlTextarea1" className="form-label">Feedback: </label>
                        <TextField
                            id="outlined-multiline-static"
                            label="Feedback Message"
                            multiline
                            name='message'
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            fullWidth
                        />
                    </div>

                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color='error' onClick={handleCloseFeedback}>Cancel</Button>
                    <Button variant="contained" color='success' onClick={handleSubmit}> {loading ? 'Sending..!' : "Send"}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default FeedbackModal;