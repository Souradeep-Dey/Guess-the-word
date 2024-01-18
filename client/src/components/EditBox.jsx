import React from 'react'

export default function EditBox(props) {
  let sliderStyle = {
    border: "solid 1px #82CFD0",
    borderRadius: "8px",
  }
  return (
    <>
      <div className="dropdown">
        <a className="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          Edit Style
        </a>

        <ul className="dropdown-menu container">
          <li className="row ms-1">
            <label htmlFor="ColorInput" className="form-label fs-6  col-lg-5">Select colour </label>
            <input type="color" className="form-control form-control-color col-lg-1" id="ColorInput" value={props.color} title="Choose your color" onChange={(event) => { props.setColor(event.target.value) }}></input></li>
          <li className="row ms-1">
            <label htmlFor="thicknessSlider" className="form-label fs-6 col-lg-5">Choose Thickness</label>
            <span className='col-lg-7'>
              <input type="range" className="form-range mt-2" id="thicknessSlider " min="1" max="14" step="1" style={sliderStyle} value={props.thickness} onChange={(event) => { props.setThickness(event.target.value) }}></input>
            </span>
          </li>
        </ul>

      </div >

    </>
  )
}
