/* eslint-disable react/prop-types */
import React from "react";

export default function MatureAcceptScreen(props) {


function onSubmit(){
    localStorage.setItem("matureAccept","true");
    props.history.push("/");
}
    return (
        <div className ="form">
            <div className ="row center">
            <h1>The website is intended for people aged 18+ </h1>
        </div>
        <div >
        <button className="primary" type="submit" onClick ={onSubmit} >I am more than 18 years old</button>
        </div></div>
        )
}

