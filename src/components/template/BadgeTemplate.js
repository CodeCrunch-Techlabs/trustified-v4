import React from 'react';
import { Box, CircularProgress, Divider, Paper, StepLabel } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { BadgeContext } from '../../context/BadgeContext';
import GetTitle from '../../badge/stepform/GetTitle';
import GetCsvFile from '../../badge/stepform/GetCsvFile';
import GetBadgeTemlate from '../../badge/stepform/GetBadgeTemlate';

const steps = [
    {
        label: 'Step 1',
        description: `Basic Badge Details`,
    },
    {
        label: 'Step 2',
        description:
            'Add Quantity of Badges you want to issue',
    },
    {
        label: 'Step 3',
        description: `Select template  `,
    },
];


const BadgeTemplate = () => {
    const formdatavalue = React.useContext(BadgeContext);
    const formdata = formdatavalue.labelInfo.formData;

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const btnDisbaled =
        formdata.title.length > 0 &&
        formdata.chain.length > 0 &&
        formdata.description.length > 0 &&
        formdata.quantity > 0;



    return (
        <Paper elevation={0} sx={{ borderRadius: '12px', p: 3 }} className="top-ba nner-cert" >
            <div className='text-center '>
                <h4 className=' text-dark'>Create Badge</h4>
                <p className=''>Please fill out the form with as much information as possible.</p>
            </div>

            {
                formdatavalue.loading &&
                <>
                    <div id="cover-spin"></div>
                    <p id="cover-spin-text">Please don't refresh!  Badges are being minted! 😎 </p>
                </>

            }
            <Box sx={{ marginTop: '30px' }}>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((step, index) => (
                        <Step key={step.label}>
                            <StepLabel
                                optional={<Typography variant="caption">{step.description}</Typography>}
                            >
                                {step.label}
                            </StepLabel>
                            <StepContent>
                                {activeStep === 0 && <GetTitle />}
                                {activeStep === 1 && <GetCsvFile />}
                                {activeStep === 2 && <GetBadgeTemlate />}
                                <Box sx={{ mb: 2, mt: 3 }}>
                                    <div>

                                        {index === steps.length - 1 ?
                                            <a onClick={formdatavalue.createBadge}
                                                className="thm-btn header__cta-btn"
                                                style={{ pointerEvents: !btnDisbaled && "none" }}
                                            >
                                                <span>Create NFT</span>
                                            </a>
                                            : <Button
                                                variant="contained"
                                                style={{ color: 'white' }}
                                                onClick={handleNext}
                                                sx={{ mt: 1, mr: 1 }}
                                            >Continue</Button>

                                        }
                                        <Button
                                            disabled={index === 0}
                                            onClick={handleBack}
                                            sx={{ mt: 1, mr: 1 }}
                                        >
                                            Back
                                        </Button>
                                    </div>
                                </Box>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>

            </Box>
        </Paper>
    );
};

export default BadgeTemplate;