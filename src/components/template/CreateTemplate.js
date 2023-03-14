import React from 'react'
import Typography from '@mui/material/Typography'
import { Templates } from '../../Templates'
import HorizontalLinearStepper from '../forms/stepform/Index'
import { Navigate, useNavigate } from 'react-router-dom'
import { Paper } from '@mui/material'
 
function CreateTemplate() {

  const navigate = useNavigate();

  const handleClickNavigate=()=>{
    navigate("/dashboard/temp");
  }

  return (
    <div className='footer-position '>
     <Paper elevation={1} sx={{p:2}}>
     <div className="container  mt-5 mb-5">
        <div className="row">
          <div className="col-12">
          <div className="d-flex justify-content-between">
            {/* <h4 className="">
              <span>Certificate Templates</span>
            </h4>  */}
            {/* <HorizontalLinearStepper /> */}
            <a className="thm-btn header__cta-btn" onClick={handleClickNavigate} >
         <span>Create NFT</span>
         </a>

          </div>
          </div>
         
        </div>
        <div className="row">
          {
            Templates.map((e, i) => {
              return (
                <div key={i} className='col-12'>
                  <div className=' template-card' >
                    <Typography variant="h5" component="h6" sx={{
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      color: '#84a8fb',
                      margin: '10px',
                    }}>{e.title}</Typography>

                    {e.component}
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
     </Paper>
    </div>
  )
}

export default CreateTemplate;