import React from 'react';

const ImageFrame = ({image}) => {
    return (
        <div style={{
            width:"7%",
            padding:"2%",
            borderRadius: "100%",
            backgroundColor:"yellow",
            border:"2px solid green",
            display:"flex",
            justifyContent:"center",
            alignItems:"center"
        }}>
            <img src={image} alt="" style={{
                marginLeft:"1%"
            }}/>
        </div>
    )
}

export default ImageFrame;
